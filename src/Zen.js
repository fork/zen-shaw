var Zen = (function() {
	var buildNode = function(properties) {
		var node = document.createElement(properties._name);
		var attributes = properties._attributes, attr;
		for (var i = 0, len = attributes.length; i < len; i++) {
			attr = attributes[i];
			node.setAttribute(attr.name, attr.value);
		}
		// be recursive
		console.log(node);
		return node;
	}
	var traverseTree = function(base, context){
		var node = buildNode(base);
		context.appendChild(node);
		for (var index = 0, length = base.children.length; index < length; index++) {
			traverseTree(base.children[index], node)
		}
	}

	var parser = emmet.require('abbreviationParser');
	return function Zen(expression){
		var fragment = document.createDocumentFragment();
		var nodes = parser.parse(expression).children;

		console.log(expression, nodes);

		for (var index = 0, length = nodes.length; index < length; index++) {
			traverseTree(nodes[index], fragment)
		}

		return fragment;
	};

}());
