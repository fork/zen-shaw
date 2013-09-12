var Zen = (function() {
	
	function getTagNameByParent(tagName) {
		switch (tagName) {
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
		default:
			return 'div';
		}
	}
	
	function buildNode(properties) {
		properties._name = properties._name || getTagNameByParent(properties.parent._name);
		var node = document.createElement(properties._name);
		var attributes = properties._attributes, attr;
		for (var i = 0, len = attributes.length; i < len; i++) {
			attr = attributes[i];
			if (attr.value && attr.value.indexOf('$') > -1){
				attr.value = attr.value.replace("$", properties.counter);
			}

			node.setAttribute(attr.name, attr.value);
		}
				console.log(node);
		// be recursive
		return node;
	}

	function traverseTree(base, context){
		var node = buildNode(base);
		context.appendChild(node);
		for (var index = 0, length = base.children.length; index < length; index++) {
			traverseTree(base.children[index], node)
		
		}
	}
	
	var parser = emmet.require('abbreviationParser');
	
	return function Zen(expression, ){
		var fragment = document.createDocumentFragment();
		var nodes = parser.parse(expression).children;

		for (var index = 0, length = nodes.length; index < length; index++) {
			traverseTree(nodes[index], fragment)
		}

		return fragment;

	};

}());
