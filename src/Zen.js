// // create a new parser
var parser = emmet.require('abbreviationParser'),
    emmetString, output = document.getElementById("output");

//'img[alt="This, maybe not..."]'

var DOMBuilder = {};

function Zen(expression) {
	var fragment = document.createDocumentFragment();
	var nodes = parser.parse(expression).children;

	for (var index = 0, length = nodes.length; index < length; index++) {
		traverseTree(nodes[index], fragment)
	}

	return fragment;
}

function buildNode(properties) {
	var node = document.createElement(properties._name);

	var attributes = properties._attributes, attr;
	for (var i = 0, len = attributes.length; i < len; i++) {
		attr = attributes[i];
		node.setAttribute(attr.name, attr.value);
	}

	// be recursive
	return node;
}

function traverseTree(base, context) {
	var node = buildNode(base);
	context.appendChild(node);
	for (var index = 0, length = base.children.length; index < length; index++) {
		traverseTree(base.children[index], node)
	}
}

