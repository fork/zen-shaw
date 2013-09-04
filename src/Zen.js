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

function Zen() {
	var element = document.createElement('div');
	element.classList.add('a-class');
	return element;
}

function run() {
	output = document.getElementById("output"),
	output.innerHTML="--- Go! ---<br/>"
	var input = document.getElementById("emmet-string");
	emmetString = input.value;
	parsed = parser.parse(emmetString);
	DOMBuilder.traverseTree(parsed)
}

var DOMBuilder = {}

DOMBuilder.traverseTree = function(base) {
	for (var node=0; node < base.children.length; node++) {
			DOMBuilder.output(base.children[node]._name);
			DOMBuilder.traverseTree(base.children[node]);
	}
}

DOMBuilder.output = function(node) {
	output.innerHTML+=node +"<br/>";
}