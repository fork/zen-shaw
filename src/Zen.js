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

	function getTagNameByContext(context) {
		switch (context.parent._name) {
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
			var isInput = includes(context._attributes, 'type');
			return isInput ? 'input' : 'div';
		case 'head':
			var isMeta = includes(context._attributes, 'content');
			return isMeta ? 'meta' : 'div';
		default:
			return 'div';
		}
	}

	var inspect = Object.prototype.toString;

	function getValue(dataSource, key, index) {
		var sourceType = typeof(dataSource);

		switch (sourceType) {
		case 'function':
			return dataSource(key, index);
		case 'object':
			var value = dataSource[key];
			// RADAR not so cool...
			return typeof(value) === 'object' ? value[index] : value;
		default:
			return undefined;
		}
	}

	function buildNode(properties, dataSource) {
		properties._name = properties._name || getTagNameByContext(properties);

		var node = document.createElement(properties._name);
		var attributes = properties._attributes;
		node.innerHTML = properties._text;

		each(attributes, function (attr) {
			// interpolate
			if (attr.value && attr.value.indexOf('$') > -1) {
				if (/\$:[a-z]+/i.test(attr.value) && dataSource) {
					var key   = attr.value.match(/\$:([a-z]+)/i)[1],
					    index = properties.counter - 1,
					    value = getValue(dataSource, key, index);

					attr.value = attr.value.replace('$:' + key, value);
				} else {
					attr.value = attr.value.replace("$", properties.counter);
				}
			}

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
