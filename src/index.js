const _target = Symbol('Used in createCompositeProxy() to retrieve the inner "target" function from a proxy')

/**
 * Constructs a createCompositeProxy() function as a closure. (Used to create the $ function)
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#Closure
 *
 * @param {object} [externalHandlers] - Object with handlers (only "get" supported right now)
 * @returns {Function} - The new proxy object
 */
export const makeCreateCompositeProxy = (externalHandlers = {}) => {

  /**
   * Creates a proxy object which intercepts operations and passes them through to each item in the provided array.
   * Use .$array to access the internal array.
   *
   * @param {*[]} inputArray - The array of items to treat as a single value
   * @returns {Proxy} - The new proxy object
   */
  const createCompositeProxy = inputArray => {
    const array = Array.from(inputArray) // enables array-likes
    if (!Array.isArray(array)) throw new Error('createCompositeProxy function will only work on arrays')

    // Use a function as proxy target instead of directly using the array (so users don't get a syntax error on proxy() calls)
    const target = () => {}
    target.$array = array // Associate the original array with the new function

    // Create and return a proxy to the function, which will intercept operations
    return new Proxy(target, {
      apply(target, thisArg, argumentsList) {
        const funcArray = target.$array
        const thisArray = thisArg[_target].$array
        return createCompositeProxy(
          funcArray.map((func, idx) => func.apply(thisArray[idx], argumentsList))
        )
      },

      get(target, property) {
        switch (property) {
          case _target: return target
          case '$array': return target.$array

          default:
            if (/^\$.+/.test(property)) return target.$array[property]

            // NOTE: May return a proxy with $array of functions, which will get handled in apply() above
            return externalHandlers?.get?.[property]
              ? externalHandlers.get[property](target, property, createCompositeProxy)
              : createCompositeProxy(target.$array.map(obj => obj[property]))
        }
      },

      set(target, property, value) {
        target.$array.forEach(obj => { obj[property] = value })
      }
    })
  }
  return createCompositeProxy
}

const isHTML = str => /<[a-z][^>]*>/im.test(str)

const parseHTML = (str) => {
  const template = document.createElement('template')
  template.innerHTML = str.trim()
  const el = document.createElement('div')
  el.appendChild(template.content.cloneNode(true))
  return Array.from(el.children)
}

/**
 * Enables jQuery-like chaining by proxying an array (or array-like). When
 * provided a selector, an array of elements will be used.
 * Like jQuery, we can also select inner elements in a chain.
 *
 * @example
 * // Less efficient than $('.js-div .js-span'), but sometimes needed)
 * $('.js-div').$('.js-span').$array
 *
 * @see https://en.wikipedia.org/wiki/Composite_pattern
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections#Working_with_array-like_objects
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
 *
 * @param {string|*[]} selectorOrArr - Either a selector string or an array
 * @param {HTMLDocument|HTMLElement} context - test
 * @returns {Proxy} - The composite (Proxy)
 */
export const $ = (() => {
  // Use self/global depending on the environment
  const root =
    typeof self !== 'undefined' && self.self === self ? self
      : typeof global !== 'undefined' && global.global === global ? global
        : Function('return this')() /* eslint-disable-line no-new-func */

  const createCompositeProxy = makeCreateCompositeProxy({
    get: {
      $: (target, property, createCompositeProxy) => (selector) => createCompositeProxy(
        target.$array.reduce((arr2, el) => arr2.concat(Array.from(el.querySelectorAll(selector))), [])
      )
    }
  })

  return (selectorOrArr, context = root.document) => createCompositeProxy(
    typeof selectorOrArr !== 'string' ? selectorOrArr : (
      isHTML(selectorOrArr) ? parseHTML(selectorOrArr) : context.querySelectorAll(selectorOrArr)
    )
  )
})()
