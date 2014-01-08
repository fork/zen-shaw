// **Zen-Shaw** is an enhanced [Emmet](http://emmet.io/)-powered `documentFragment` builder.
//
// ### Build
// 1. Install node on your machine.
// 2. Install the _Grunt-CLI_ as Root: `sudo npm install -g grunt-cli`
// 3. Issue `npm install` in project directory to get Grunt and it's dependencies
// 4. Issue `grunt` in project directory to build an uglified library.
//
// ### Issues
// Visit [our Atlassian Jira](https://jira.fork.de/browse/ZEN) instance to post issues.
//
// ### License
// Copyright (C) 2013 Fork Unstable Media GmbH
//
// Zen-Shaw is licensed within the terms of the MIT license.

var Zen = (function($) {
	'use strict';

	var dataSource,
		parser = emmet.require('abbreviationParser');;

	function each(array, fn) {
		for (var i = 0, len = array.length; i < len; i++) {
			if (fn.call(array[i], i) === false) return;
		}
	}
	function includes(haystack, needle) {
		var isIncluded = false;
		each(haystack, function () {
			return !(isIncluded = this.name === needle);
		});
		return isIncluded;
	}

	// ## Our extra portion of syntax
	// This function does the magic of implicit tag names
	function getName(properties) {
		if (properties._name) return properties._name;

		switch (properties.parent._name) {
		// example: `ul > {List item #$}*7`
		case 'ol':
		case 'ul':
			return 'li';
		// example: `table[border=1] > .row*5 > {Test}*3`
		case 'table':
			return 'tr';
		case 'tr':
			return 'td';
		// example: `select > {hallo?}*5`
		case 'select':
			return 'option';
		// example: `nav > #test-ul > {Test1} + {Test2}`
		case 'nav':
			return 'ul';
		// childs of `form` are `input`-tags, if they have a `type`-attribute. example: `form > [type=text]#username + [type=password]#password`
		case 'form':
			var isInput = includes(properties._attributes, 'type');
			return isInput ? 'input' : 'div';
		// childs of `head` are `meta`-tags, if they have a `content`-attribute. example: `head > [content="UTF-8"] + [name=viewport content="width=device-width"]`
		case 'head':
			var isMeta = includes(properties._attributes, 'content');
			return isMeta ? 'meta' : 'div';
		default:
			return 'div';
		}
	}
	
	
	function interpolate(value, counter) {
		var result = value;
		var key = result.match(/\$:([a-z]+)/i);
		var replacement = dataSource(key[1], counter - 1);
		if(typeof replacement !== 'undefined') { 
			return result.replace(key[0], replacement);
		} else {
			return result.replace(key[0], "[[specify value for "+key[0]+"]]");
		}
	}

	function checkMarker(textRaw, position) {
		if(textRaw.charAt(position-1) == "\\") return "escaped";
		if(textRaw.charAt(position+1) == ":") return "token";
		return "counter";
	}

	// ## Additional content functions
	// By default, Emmet only supports plain text within curly braces
	function buildNodeText(textRaw, counter) {
		var occurrences = getIndices(textRaw),
			searchText = "",
			text = textRaw.substring(0, occurrences[0]),
			startPos = occurrences[0],
			endPos = (occurrences.length>1) ? occurrences[1] : textRaw.length,
			mode;

		for(var i=0;i<occurrences.length;i++) {
			
			searchText = textRaw.substring(startPos,endPos);
			mode = checkMarker(textRaw, occurrences[i]);
			
			// Escaping Emmet keys like `$`. Example: `span{You have to save \\$1000}`
			if(mode ==  'escaped') {
				text+=searchText;
				text=text.replace(/\\/,"");
			}
			// This parses the inputDataSource as explained at the Main-Function lower on this page
			if(mode ==  'token') {
				text+=interpolate(searchText, counter);
			}
			// [The good, old counter](http://docs.emmet.io/abbreviations/syntax/#item-numbering-) is now also working to set the elements content
			if(mode ==  'counter') {
				searchText=searchText.replace("$",counter);
				text+=searchText;
			}
			
			startPos = endPos;
			endPos = (occurrences.length>=i+3) ? occurrences[i+2] : textRaw.length;
		}

		return text;
	}

	function getIndices(value) {
	    var startIndex = 0;
	    var index, indices = [];
	    while ((index = value.indexOf("$", startIndex)) > -1) {
	        indices.push(index);
	        startIndex = index + 1;
	    }
	    return indices;
	}

	function buildNode(properties) {
		var name = getName(properties);
		var node = document.createElement(name);

		if (properties._text) {
			// `textContent` is not supported by IE8. [Use a shim](https://forrst.com/posts/textContent_in_IE8-eNC).
			if(properties._text.indexOf('$') < 0) {
				node.textContent = properties._text;
			} else {
				node.textContent = buildNodeText(properties._text, properties.counter);
			}
		}

		each(properties.children, function () {
			this.parent._name = name;
		});

		each(properties._attributes, function () {
			this.value = buildNodeText(this.value, properties.counter);
			node.setAttribute(this.name, this.value);
		});

		return node;
	}

	function traverseTree(base, context){
		var node = buildNode(base);
		context.appendChild(node);
		each(base.children, function() {
			traverseTree(this, node);
		});
	}

	function getterFor(data) {
		return function(key, index) {
			var value = data[key];

			if (typeof value === 'object') {
				if (value.length > index) {
					return value[index];
				} else {
					return value[index-value.length]
				}
			}

			if (typeof value === 'function') {
				return value.call(this, index);
			}

			return value;
		};
	}

	// ## The main function
	// returns `documentFragment`
	function Zen(expression, inputDataSource) {
		// The special thing about **Zen-Shaw**: Submitting data that you can use to build your DOM.
		// For example:
		//
		// ```javascript
		// Zen('ul > #test-$:b{$:i}*3', {
		// 	'b': [1, 2, 3],
		// 	'i': ['foo', 'bar', 'baz']
		// });
		// ```
		//
		// It's also possible to submit a function as inputDataSource:
		//
		// ```javascript
		// var classNames = ["foo", "bar", "baz"];
		// Zen('ul > {$:i}*3', function (key, index) {
		// 	return (key === 'i') ? classNames[index] : 'xxx';
		// });
		// ```
		//
		if(typeof(inputDataSource) == 'undefined') {
			dataSource = function() { return false }
		}
		else if (typeof(inputDataSource) !== 'function') {
			dataSource = getterFor(inputDataSource);
		} else {
			dataSource = inputDataSource;
		}

		var fragment = document.createDocumentFragment();
		var nodes = parser.parse(expression).children;
		each(nodes, function () {
			traverseTree(this, fragment);
		});
		return fragment;
	};

	// ## jQuery integration
	// The functions take the same arguments as `Zen()`
	if ($) {
		// Okay, `Zen()` is now also reachable by `$.zen()`
		$.zen = function(expression, dataSource) {
			var fragment = Zen(expression, dataSource);
			return $(fragment);
		}
		// Set the inner HTML of the given object. Example: `$('body').zen('table[border=1]>.row*5>{Test}*3');`
		$.fn.zen = function(expression, dataSource) {
			var fragment = Zen(expression, dataSource);
			return this.each(function() {
				var clone = fragment.cloneNode(true);
				this.innerHTML = '';
				this.appendChild(clone);
			});
		};
	}

	return Zen;

})(window.jQuery);
