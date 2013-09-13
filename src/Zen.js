var Zen = (function() {

	


	function getTagNameByContext(context) {
		console.log(context.abbreviation);
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
			var type = context.abbreviation;
			if (type === '.type') { 
			return 'input';
			}
			else return 'div';
		case 'head':
			var name = context.abbreviation;
			var content = context.abbreviation;
			if (name === '.name' && content === '.content') { 
			return 'meta';
			}
			else return 'div';
		default:
			return 'div';
		}
	}

	function buildNode(properties, arrOfAttr) {
		properties._name = properties._name || getTagNameByContext(properties);
		properties._text = properties._text;
		var node = document.createElement(properties._name);
		var attributes = properties._attributes, attr;
		node.innerHTML =  properties._text;
		for (var i = 0, len = attributes.length; i < len; i++) {
			attr = attributes[i];
			if (attr.value && attr.value.indexOf('$') > -1){
			  if (arrOfAttr) {
  		    attr.value = attr.value.replace("$", arrOfAttr.i[properties.counter - 1]);
  		  } else {
  		    attr.value = attr.value.replace("$", properties.counter);
  		  }
			}
			node.setAttribute(attr.name, attr.value);
		}
		console.log(node);
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

	return function Zen(expression, arrOfAttr){

		var fragment = document.createDocumentFragment();
		var nodes = parser.parse(expression).children;
		for (var index = 0, length = nodes.length; index < length; index++) {
			traverseTree(nodes[index], fragment, arrOfAttr)
		}
		return fragment;

	};

}());
