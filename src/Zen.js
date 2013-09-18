var Zen = (function($) {
	'use strict';

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
	
	function replaceDollar(value, dataSource, counter){
		var key = value.match(/\$:([a-z]+)/i)[1],
		    replacement = dataSource(key, counter - 1);
		return value.replace('$:' + key, replacement);
	}
	
	function interpolate(value, dataSource, counter) {
		var result = value;
    
		if (value.indexOf('$') < 0) return value;

		// this is the RegExp you want /^|[^\\]$:[a-z]+/i

		if((result == "$:content") || (/\-\$:[a-z]+/i.test(value) && dataSource)){
		  return replaceDollar(value, dataSource, counter);
		}

		if (/\$:[a-z]+/i.test(value) && dataSource) {
		  var key = result.match(/\$:([a-z]+)\s/g);
		  for (var i = 0; i < key.length; i++) {
		    var replacement = key[i].substring(2, key[i].length);
			result = result.replace(key[i], replacement);
		  }
			return result;
		}
		
		if (value.indexOf('$') && value.indexOf("$:") == -1 && value.indexOf("-$") == -1) {
		  return value.replace(/\$/, '$');
		}

		return value.replace('$', counter);
	}

	function buildNode(properties, dataSource) {
		var name = getName(properties);
		var node = document.createElement(name);

		if (properties._text) {
			// RADAR look out for IE issues
			node.textContent = interpolate(properties._text, dataSource, properties.counter);
		}

		each(properties._attributes, function () {
			this.value = interpolate(this.value, dataSource, properties.counter);
			node.setAttribute(this.name, this.value);
		});

		// be recursive
		return node;
	}

	function traverseTree(base, context, dataSource){
		var node = buildNode(base, dataSource);
		context.appendChild(node);
		each(base.children, function() {
			traverseTree(this, node, dataSource);
		});
	}

	var parser = emmet.require('abbreviationParser');

	function getterFor(data) {
		return function(key, index) {
			var value = data[key];
			return (typeof(value) === 'object') ? value[index] : value;
		};
	}

	function Zen(expression, dataSource) {
		if (typeof(dataSource) !== 'function') dataSource = getterFor(dataSource);

		var fragment = document.createDocumentFragment();
		var nodes = parser.parse(expression).children;
		each(nodes, function () {
			traverseTree(this, fragment, dataSource);
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
