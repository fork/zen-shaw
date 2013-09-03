// // create a new parser
// var parser = emmet.require('abbreviationParser');
// var emmetString = "ul>li*3>a";
// var parsed = parser.parse(emmetString);
// // the parser returns an object
// console.log(parsed);
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