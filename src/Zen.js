var Zen = (function($) {
	'use strict';

	function each(array, fn) {
		for (var i = 0, len = array.length; i < len; i++) {
			if (fn(array[i]) === false) return;
		}
	}
	function includes(haystack, needle) {
		var isIncluded = false;
		each(haystack, function (e) {
			return !(isIncluded = e.name === needle);
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

	function getValue(dataSource, key, index) {
		var sourceType = typeof(dataSource);

		switch (sourceType) {
		case 'function':
			return dataSource(key, index);
		case 'object':
			var value = dataSource[key];
			// RADAR not so cool...
			return typeof(value) === 'object' ? value[index] : value;
		}
	}

	function interpolate(value, dataSource, counter) {
		if (value.indexOf('$') < 0) return value;

		// TODO skip escaped DOLLARs => \$

		if (/\$:[a-z]+/i.test(value) && dataSource) {
			var key         = value.match(/\$:([a-z]+)/i)[1],
			    replacement = getValue(dataSource, key, counter - 1);

			return value.replace('$:' + key, replacement);
		}

		return value.replace('$', counter);
	}

	function buildNode(properties, dataSource) {
		var name = getName(properties);
		var node = document.createElement(name);

		if (properties._text) {
			node.innerText = interpolate(properties._text, dataSource, properties.counter);
		}

		each(properties._attributes, function (attr) {
			// interpolate
			attr.value = interpolate(attr.value, dataSource, properties.counter);
			node.setAttribute(attr.name, attr.value);
		});

		// be recursive
		return node;
	}

	function traverseTree(base, context, arrOfAttr){
		var node = buildNode(base, arrOfAttr);
		context.appendChild(node);
		for (var index = 0, length = base.children.length; index < length; index++) {
			traverseTree(base.children[index], node, arrOfAttr);
		}
	}

	var parser = emmet.require('abbreviationParser');

	function Zen(expression, dataSource) {
		var fragment = document.createDocumentFragment();
		var nodes = parser.parse(expression).children;
		for (var index = 0, length = nodes.length; index < length; index++) {
			traverseTree(nodes[index], fragment, dataSource)
		}
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
