import { $, makeCreateCompositeProxy } from './index'

const tags = [
  `<div class="js-div"><span>Div 1</span></div>`,
  `<div class="js-div"><span>Div 2</span></div>`
]
const setUpDOM = () => {
  document.body.innerHTML = tags.join('')
}

const personArray = [
  {
    name: 'John Doe',
    boss: {
      name: 'Jane Doe',
      getName() { return this.name }
    },
    getBoss() { return this.boss }
  },
  {
    name: 'Jane Doe',
    boss: {
      name: 'Frank Furter',
      getName() { return this.name }
    },
    getBoss() { return this.boss }
  }
]

const runCommonTestsUsing = (f) => {
  [
    [`Should provide access to the inner array via .$array`, () => {
      expect(f(personArray).$array).toEqual(personArray)
    }],

    [`Should provide access to individual object properties`, () => {
      expect(
        f(personArray).name.$array
      ).toEqual(
        personArray.map(p => p.name)
      )
    }],

    [`Should provide access to nested object properties`, () => {
      expect(
        f(personArray).boss.name.$array
      ).toEqual(
        personArray.map(p => p.boss).map(boss => boss.name)
      )
    }],

    [`Should run methods on each object`, () => {
      let calledCount = 0
      const prototypeObject = { testMethod: () => { calledCount++ } }
      const createTestObject = () => Object.create(prototypeObject)

      const testObjarray = [
        createTestObject(),
        createTestObject()
      ]

      f(testObjarray).testMethod()

      expect(calledCount).toBe(2)
    }],

    [`Should provide method chaining`, () => {
      expect(
        f(personArray).getBoss().getName().$array
      ).toEqual(
        personArray.map(p => p.boss).map(boss => boss.name)
      )
    }],

    [`Should provide access to array methods via $forEach, $map, etc`, () => {
      const obj = $([])
      for (const methodName of Object.keys(Array.prototype)) {
        if (methodName === 'constructor') continue
        expect(typeof obj[methodName]).toBe('function')
      }
    }]
  ].forEach(([a, b]) => { it(a, b) })
}

describe('createCompositeProxy', () => {
  const createCompositeProxy = makeCreateCompositeProxy()
  runCommonTestsUsing(createCompositeProxy)
})

describe('$', () => {
  runCommonTestsUsing($)

  it(`Should get elements when passed a selector`, () => {
    setUpDOM()
    expect(
      $('.js-div').$array.length
    ).toBe(tags.length)
  })

  it(`Should provide chained selectors like $('.js-div').$('span')`, () => {
    setUpDOM()
    expect(
      $('.js-div').$('span').$array.length
    ).toBe(tags.length)
  })

  it(`Should create elements when passed a string containing HTML elements`, () => {
    const text = 'HeLlO wOrLd!'
    const [el] = $(`<p>${text}</p>`).$array
    expect(el.textContent).toBe(text)
  })
})
