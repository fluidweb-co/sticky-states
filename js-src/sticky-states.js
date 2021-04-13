/**
 * File sticky-states.js.
 *
 * Implement sticky elements based on scroll position.
 */

 (function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
	  define([], factory(root));
	} else if ( typeof exports === 'object' ) {
	  module.exports = factory(root);
	} else {
	  root.StickyStates = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	var _hasInitialized = false;
	var _publicMethods = {
		managers: [],
	};
	var _settings = { };
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
		staticAtEndAttribute: 'data-sticky-static-at-end',
		containerAttribute: 'data-sticky-container',

		position: 'top', // Accepted values: `top`, `bottom`
		threshold: 0,
	};



	/*!
	* Merge two or more objects together.
	* (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
	* @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	* @param   {Object}   objects  The objects to merge together
	* @returns {Object}            Merged values of defaults and options
	*/
	var extend = function () {
		// Variables
		var extended = {};
		var deep = false;
		var i = 0;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					// If property is an object, merge properties
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (; i < arguments.length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;
	};



	/**
	 * Get element offset values from page limits
	 * 
	 * @see https://stackoverflow.com/a/442474/5732235
	 */
	var getOffset = function( el ) {
		var _x = 0;
		var _y = 0;
		while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
			_x += el.offsetLeft - el.scrollLeft;
			_y += el.offsetTop - el.scrollTop;
			el = el.offsetParent;
		}
		return { top: _y, left: _x };
	}



	/**
	 * Maybe change visibility of the variation switcher
	 * depending on container's position.
	 */
	var maybeChangeState = function() {
		var currentScrollPosition = window.pageYOffset || document.body.scrollTop;

		// Iterate sticky elements
		for ( var i = 0; i < _publicMethods.managers.length; i++ ) {
			var manager = _publicMethods.managers[i];
			var isSticky = currentScrollPosition >= manager.settings.threshold;
			var isEndThreshold = currentScrollPosition >= manager.settings.endThreshold;
			var isStaticAtEnd = manager.stickyElement.hasAttribute( manager.settings.staticAtEndAttribute );
			
			// Sticky
			if ( isSticky && ! isEndThreshold ) {
				var stickyWidth = window.getComputedStyle( manager.innerElement ).width;
				var containerHeight = window.getComputedStyle( manager.stickyElement ).height;
				manager.innerElement.style.top = '';
				manager.innerElement.style.width = stickyWidth; // variable already has unit `px`
				manager.stickyElement.style.height = containerHeight; // variable already has unit `px`
				manager.stickyElement.style.position = '';
				manager.stickyElement.classList.add( manager.settings.isStickyClass, ( manager.settings.position == 'top' ? manager.settings.isStickyTopClass : manager.settings.isStickyBottomClass ) );
				manager.stickyElement.classList.remove( manager.settings.isEndPositionClass );
			}
			// Absolute ( at end position )
			else if ( isEndThreshold && ! isStaticAtEnd ) {
				var containerHeight = parseInt( window.getComputedStyle( manager.containerElement ).height.replace( 'px' ) );
				manager.innerElement.style.top = containerHeight + 'px';
				manager.stickyElement.classList.remove( manager.settings.isStickyClass, manager.settings.isStickyTopClass, manager.settings.isStickyBottomClass );
				manager.stickyElement.classList.add( manager.settings.isEndPositionClass );
			}
			// Static
			else {
				manager.stickyElement.classList.remove( manager.settings.isStickyClass, manager.settings.isStickyTopClass, manager.settings.isStickyBottomClass, manager.settings.isEndPositionClass );
				manager.stickyElement.style.height = '';
				manager.innerElement.style.width = '';
				manager.innerElement.style.top = '';
			}
		}
	};



	/**
	 * Loop function to changes visibility of the variation switcher.
	 */
	var loop = function() {
		maybeChangeState();

		// Loop this function indefinitely
		window.requestAnimationFrame( loop );
	};



	/**
	 * Calculate threshold values
	 */
	_publicMethods.resetStickyLimits = function( manager ) {
		var windowHeight = Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );
		var thresholdAttrValue = manager.stickyElement.getAttribute( manager.settings.thresholdAttribute );
		var elementRect = manager.stickyElement.getBoundingClientRect();
		var elementOffset = getOffset( manager.stickyElement.parentNode ).top;
		
		// Threshold
		manager.settings.threshold = isNaN( parseInt( thresholdAttrValue ) ) ? elementOffset : parseInt( thresholdAttrValue );

		// Calculate threshold for elements sticky to the bottom
		if ( manager.settings.position == 'bottom' ) {
			manager.settings.threshold = Math.max( manager.settings.threshold - windowHeight + elementRect.height, 0 );
		}

		// Use the parent element as the container element
		manager.containerElement = manager.stickyElement.parentNode;
		
		// Maybe get containerElement set via attribute
		var containerSelector = manager.stickyElement.getAttribute( manager.settings.containerAttribute );
		if ( containerSelector != null && containerSelector != '' ) {

			// Try to find the containerElement in the element's hierarchy first
			manager.containerElement = manager.stickyElement.closest( containerSelector );
			
			// Try to find the containerElement on the entire document and set to the first found element that matches the selector
			if ( ! manager.containerElement ) {
				manager.containerElement = document.querySelector( containerSelector );
			}
		}

		// Maybe set endThreshold
		if ( manager.containerElement ) {
			var containerHeight = parseInt( window.getComputedStyle( manager.containerElement ).height.replace( 'px' ) );
			
			// Set endThreshold to bottom of containerElement
			manager.settings.endThreshold = manager.settings.threshold + containerHeight;

			// Maybe calculate endThreshold for elements sticky to the bottom
			if ( manager.settings.position == 'bottom' ) {
				var endThreshold = getOffset( manager.stickyElement ).top - windowHeight + elementRect.height;
				
				// Maybe set endThreshold to stop sticky state at the element's normal position
				if ( endThreshold > manager.settings.threshold ) {
					manager.settings.endThreshold = endThreshold;
				}
			}
		}
	}



	/**
	 * Get manager instance for element
	 */
	_publicMethods.getInstance = function ( element ) {
		var instance;
		for ( var i = 0; i < _publicMethods.managers.length; i++ ) {
			var manager = _publicMethods.managers[i];
			if ( manager.element == element ) { instance = manager; break; }
		}
		return instance;
	}
	


	/**
	 * Initialize an sticky element
	 */
	_publicMethods.initializeElement = function( stickyElement ) {
		var manager = {};
		manager.settings = extend( _settings );
		
		// Get elements
		manager.stickyElement = stickyElement;
		manager.innerElement = manager.stickyElement.querySelector( manager.settings.innerElementSelector );
		
		var positionAttrValue = manager.stickyElement.getAttribute( manager.settings.positionAttribute );
		manager.settings.position = positionAttrValue == 'top' || positionAttrValue == 'bottom' ? positionAttrValue : _settings.position;
		
		// Calculate threshold values, recalculate when resize window
		_publicMethods.resetStickyLimits( manager );
		// TODO: Move resize event listener to a single global event handler, instead of multiple event listers for each sticky element
		window.addEventListener( 'resize', function() { _publicMethods.resetStickyLimits( manager ); } );
		
		// Set element as activated
		manager.isActivated = true;
		manager.stickyElement.classList.add( manager.settings.isActivatedClass );
		
		// Add manager to public methods
		_publicMethods.managers.push( manager );
	}

	

	/**
	 * Initialize
	 */
	_publicMethods.init = function( options ) {
		if ( _hasInitialized ) return;

		// Merge with general settings with options
		_settings = extend( _defaults, options );

		// Initialize each sticky element
		var stickyElements = document.querySelectorAll( _settings.elementSelector );
		for ( var i = 0; i < stickyElements.length; i++ ) {
			_publicMethods.initializeElement( stickyElements[ i ] );
		}
		
		// Start handling sticky states
		requestAnimationFrame( loop );

		_hasInitialized = true;
	};



	//
	// Public APIs
	//
	return _publicMethods;

});
