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

	function getName(properties) {
		if (properties._name) return properties._name;

		switch (properties.parent._name) {
		case 'ol':
		case 'ul':
			return 'li';
		case 'table':
			return 'tr';
		case 'tr':
			return 'td';
		case 'select':
			return 'option';
		case 'nav':
			return 'ul';
		case 'form':
			var isInput = includes(properties._attributes, 'type');
			return isInput ? 'input' : 'div';
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
			
			
			if(mode ==  'escaped') {
				text+=searchText;
				text=text.replace(/\\/,"");
			}
			
			if(mode ==  'token') {
				text+=interpolate(searchText, counter);
			}
			
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
			// RADAR look out for IE issues
			// textContent not supported by IE8. Use a shim.
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

	function Zen(expression, inputDataSource) {
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

	if ($) {

		$.zen = function(expression, dataSource) {
			var fragment = Zen(expression, dataSource);
			return $(fragment);
		}

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
