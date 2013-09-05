// // create a new parser
var parser = emmet.require('abbreviationParser'),
emmetString,
parsed,
output = document.getElementById("output");


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
var DOMBuilder = {}
function Zen(expression) {
  var parsed = parser.parse(expression);
  var result = DOMBuilder.traverseTree(parsed);   
  if (result.hasChildNodes()){
    var i=0;
    var element;
    var children = result.childNodes;
    for (var i = 0; i < children.length; i++) {
      var element = document.createElement(children[i].tagName);      
      if (children[i].className !== "") {
        elementClass = children[i].className;
        element.classList.add(elementClass);
      }
    }
  }
  if (!element.firstChild) {
      element.appendChild(document.createElement('b'));
  }
	return element;
}

function buildNode(properties) {
	var node = document.createElement(properties._name);
	var node_class = properties.attribute('class');
	if(node_class)
	  node.classList.add(node_class);
	// be verbose
	//DOMBuilder.output(properties._name);
	// be recursive
	DOMBuilder.traverseTree(properties);
	return node;
}

DOMBuilder.traverseTree = function(base, context) {
  var counter = 0;
	if (!context) context = document.createDocumentFragment();
	for (var index = 0, length = base.children.length; index < length; index++) {
		  context.appendChild(buildNode(base.children[index]));
	}
	return context;
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
