# Proxy Query

With updates to Web APIs like `.querySelector()` and JavaScript syntax improvements, I felt that the core functionality of jQuery could now use native browser code - the main thing missing was the [composite design pattern](https://en.wikipedia.org/wiki/Composite_pattern). After experimenting with ES6 proxies, they seemed like they could provide the missing piece...and Proxy Query was born.

First, some familiar syntax to demonstrate how this works...


## Usage

### Example 1: Using $(selector)

```html
<div class="js-div">Div 1</div>
<div class="js-div">Div 2</div>
```

```js
import { $ } from 'proxy-query' // or const { $ } = require('proxy-query')

$('.js-div').classList.add('new-class')
```

Results in...

```html
<div class="js-div new-class">Div 1</div>
<div class="js-div new-class">Div 2</div>
```

Note how `.classList.add('new-class')` is called for each selected element.


### Example 2: Multiple method calls
```html
<div class="js-div">Div 1</div>
<div class="js-div">Div 2</div>
```

```js
import { $ } from 'proxy-query'

$('.js-div').classList.$forEach(cl => {
  cl.add('new-class-1')
  cl.add('new-class-2')
})
```

Results in...

```html
<div class="js-div new-class-1 new-class-2">Div 1</div>
<div class="js-div new-class-1 new-class-2">Div 2</div>
```


### Example 3: Chaining method calls

```html
<div class="js-div" custom-attribute="1 2">Div 1</div>
<div class="js-div" custom-attribute="3 4">Div 2</div>
```

```js
import { $ } from 'proxy-query'

const numbers = $('.js-div')
  .getAttribute('custom-attribute')
  .split(' ')
  .$array

// numbers = [ ['1', '2'], ['3', '4' ] ]
```


### Example 4: Using An Array

The same features are available with an array of any kind of object. In the next example, `.sayHello` is called for each Person object in the list.

```js
import { $ } from 'proxy-query'

class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
  sayHello() {
    console.log(`${this.firstName} ${this.lastName} says "Hello"`)
  }
}

const personList = [
  new Person('John Doe'),
  new Person('Jane Doe'),
]

$(personList).sayHello()
```


### Example 5: Using An Array (makeCreateCompositeProxy)

Under the hood, `makeCreateCompositeProxy` is used to create `$`, which was customized to work with `document.querySelectorAll()`. I've exposed `makeCreateCompositeProxy` so you can also create your own custom `createCompositeProxy` function. A `createCompositeProxy` function can work on any array, just like `$`. For example:

```js
import { makeCreateCompositeProxy } from 'proxy-query'

const createCompositeProxy = makeCreateCompositeProxy({/* Add handlers here */})

class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
  sayHello() {
    console.log(`${this.firstName} ${this.lastName} says "Hello"`)
  }
}

const personList = [
  new Person('John Doe'),
  new Person('Jane Doe'),
]

createCompositeProxy(personList).sayHello()
```


## Contributing & Other Notes
I built this project mostly as a sample, so I don't actively maintain it. Component-based solutions have proven to be much more maintainable for the larger projects I usually work on. As a result, this section is kept around mostly for me. That said, details around my workflow can be found in [CONTRIBUTING.md](CONTRIBUTING.md)
