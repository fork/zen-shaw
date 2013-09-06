// // create a new parser
var parser = emmet.require('abbreviationParser'),
    emmetString, output = document.getElementById("output");


// the parser returns an object
// 
// logElems(parsed);
// 
// function logElems(nodes) { 
// 	$.each(nodes.children, function(index, element) {
// 		// get the tag name
// 		console.log(element.name());
// 	})
// 	// this has to be done recursively, just a proof of concept
// 	if(nodes.children.length>0) logElems(nodes.children[0]);
// }
// Test

'img[alt="This, maybe not..."]'

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

DOMBuilder.output = function(node) {
  //console.log(node);
	//output.innerHTML+=node +"<br>";
}

function run() {
	output = document.getElementById("output"),
	output.innerHTML="--- Go! ---<br>"
	var emmetExpression = document.getElementById("emmet-string").value;
	tree = parser.parse(emmetExpression);
	console.log(DOMBuilder.traverseTree(tree));
}
