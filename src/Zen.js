// // create a new parser
var parser = emmet.require('abbreviationParser'),
output,
emmetString, parsed;

// the parser returns an object
console.log(parsed);
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

function Zen(expression) {
	var element = document.createElement('div');
	element.classList.add('a-class');
	if (!(expression === 'div' || expression === 'div.a-class')) {
		element.appendChild(document.createElement('b'));
	}
	return element;
}

function run() {
	output = document.getElementById("output"),
	output.innerHTML="--- Go! ---<br>"
	var emmetExpression = document.getElementById("emmet-string").value;
	tree = parser.parse(emmetExpression);
	console.log(DOMBuilder.traverseTree(tree));
}

var DOMBuilder = {}

function buildNode(properties) {
	var node = document.createElement(properties._name);

	// be verbose
	DOMBuilder.output(properties._name);
	// be recursive
	DOMBuilder.traverseTree(properties);

	return node;
}

DOMBuilder.traverseTree = function(base, context) {
	if (!context) context = document.createDocumentFragtment();

	for (var index = 0, length = base.children.length; index < length; index++) {
		context.appendChild(buildNode(base.children[index]));
	}

	return context;
}

DOMBuilder.output = function(node) {
	output.innerHTML+=node +"<br>";
}
