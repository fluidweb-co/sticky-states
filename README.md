# Sticky States

[![npm version](https://badge.fury.io/js/sticky-states.svg)](https://badge.fury.io/js/sticky-states)
[![DragsterJS gzip size](http://img.badgesize.io/https://raw.githubusercontent.com/fluidweb-co/sticky-states/master/dist/sticky-states.min.js?compression=gzip
)](https://raw.githubusercontent.com/fluidweb-co/sticky-states/master/dist/sticky-states.min.js)

Makes elements sticky to the viewport (position fixed) based on the scroll position.



## Installation

Setting up is pretty straight-forward. Download the js and css files from __dist__ folder and include them in your HTML:

```html
<link rel='stylesheet' id='sticky-states'  href='dist/sticky-states.min.css' type='text/css' media='all' />
<script type="text/javascript" src="path/to/dist/sticky-states.min.js"></script>
```

### NPM

Sticky States is also available on NPM:

```sh
$ npm install sticky-states
```



## Initialization

Once the Sticky States script is loaded all functions will be available through the global variable `window.StickyStates`, however to enable the components you need to call the function `init`:

Call the function `StickyStates.init( options );` passing the `options` parameter as an object.



## Options Available

The `options` parameter accept any of the available options from the default settings by passing the new values as an object. You can simply ommit the options you don't want to change the default values of.

These are the currently accepted options with their default values, if in doubt check the source code:

```js
	var _defaults = {
		elementSelector: '[data-sticky-states]',
		innerElementSelector: '[data-sticky-states-inner]',

		isEndPositionClass: 'is-end-position',
		isStickyClass: 'is-sticky',
		isStickyTopClass: 'is-sticky--top',
		isStickyBottomClass: 'is-sticky--bottom',
		isActivatedClass: 'is-activated',

		positionAttribute: 'data-sticky-position',
		thresholdAttribute: 'data-sticky-threshold',
		stickyRelativeToAttribute: 'data-sticky-relative-to',
		staticAtEndAttribute: 'data-sticky-static-at-end',
		containerAttribute: 'data-sticky-container',

		position: 'top', // Accepted values: `top`, `bottom`
		threshold: 0,
	};
```

For example, if your application already has the markup defined in many places and you want to change the selector used for the sticky element and its content element, initialize the component with the options below:

```js
var options = {
	elementSelector: '[data-sticky-states], .also-has-sticky-states',
	innerElementSelector: '[data-sticky-states-inner], .also-sticky-content',
}
StickyStates.init( options );
```

Everything else will use the default values.


## Basic Usage

### 1. Recommended HTML elements structure

The sticky-states component requires the following HTML elements structure:

```html
<div data-sticky-states>
	<div data-sticky-states-inner>
		<!-- CONTENT -->
	</div>
</div>
```

IMPORTANT: note that the main sticky element, which is marked with the data attribute `data-sticky-states`, is used to keep the space and position of the sticky __inner element__ while it is sticky, avoiding layout shifts. The element that actually gets sticky is the _inner element_, marked with the data attribute `data-sticky-states-inner`.

You can define the boundaries of the sticky element using the data attribute `data-sticky-container`, the default value is the parent element of the main sticky element. The boundaries of the container element are used define when the sticky element will stop being sticky or when it should move back to its normal state and position.

The attribute `data-sticky-container` accepts any valid CSS selector, and will use the first element that matches the selector.

While looking for the container element, the script will try to find a match higher in the DOM hiearchy of the sticky element itself (using the query function `stickyElement.closest()`).
If a match is not found, the script will try to find a matching element in the entire document (using the query function `window.querySelector()`).

For example, to set a sticky element to stay sticky while the content of a section is visible in the viewport you could use the following markup:

```html
<div data-sticky-states data-sticky-container="#section-id">
	<div data-sticky-states-inner>
		<!-- CONTENT -->
	</div>
</div>

<section id="section-id">
	<!-- SECTION CONTENT -->
</section>	
```

Note that in this example the sticky element is not inside hierarchy of the container element `<section>` used to define the boundaries.


### 2. Setting the position of the sticky element (top or bottom)

Use the data attribute `data-sticky-position` at the main sticky element to set the position of the sticky element, if not specified at the element it will default to the `top` position, or the default position defined at the time of initialization of the `StickyStates` components.

Sticky at the `top` (default):

```html
<div data-sticky-states>
	<div data-sticky-states-inner>
		<!-- CONTENT -->
	</div>
</div>
```

or

```html
<div data-sticky-states data-sticky-position="top">
	<div data-sticky-states-inner>
		<!-- CONTENT -->
	</div>
</div>
```

Sticky at the `bottom`;

```html
<div data-sticky-states data-sticky-position="bottom">
	<div data-sticky-states-inner>
		<!-- CONTENT -->
	</div>
</div>
```


### 3. Setting the sticky element to stay at its original position, works only for sticky elements positioned at the `bottom`

```html
<div data-sticky-states data-sticky-position="bottom" data-sticky-threshold="0" data-sticky-static-at-end>
	<div data-sticky-states-inner>
		<!-- CONTENT -->
	</div>
</div>
```


### 4. Setting the sticky element threshold position relative to another sticky element

Single CSS selector:

```html
<div data-sticky-states data-sticky-states data-sticky-relative-to="#relative-sticky">
	<div data-sticky-states-inner>
		<!-- CONTENT -->
	</div>
</div>
```

Multiple CSS selector for different viewport width breakpoints:

```html
<div data-sticky-states data-sticky-states data-sticky-relative-to='{ "xs": { "breakpointInitial": 0, "breakpointFinal": 1023, "selector": ".site-header" }, "sm": { "breakpointInitial": 1024, "breakpointFinal": 100000, "selector": ".col-full-nav" } }'>
	<div data-sticky-states-inner>
		<!-- CONTENT -->
	</div>
</div>
```


## Contributing to Development

This isn't a large project by any means, but you are definitely welcome to contribute.

### Development environment

Clone the repo and run [npm](http://npmjs.org/) install:

```
$ cd path/to/sticky-states
$ npm install
```

Run the build command:

```
$ gulp build
```

Build on file save:

```
$ gulp
$ gulp watch
```


## License

Licensed under MIT.
