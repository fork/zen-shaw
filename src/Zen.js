var Zen = (function() {
	
	function getTagNameByParent(tagName) {
		switch (tagName) {
		case 'ol':
		case 'ul':
			return 'li';
		case 'table':
			return 'tr';
		case 'tr':
			return 'td'
		default:
			return 'div';
		}
	}
	
	function buildNode(properties, arrOfAttr) {
		properties._name = properties._name || getTagNameByParent(properties.parent._name);
		var node = document.createElement(properties._name);
		var attributes = properties._attributes, attr;
		for (var i = 0, len = attributes.length; i < len; i++) {
			attr = attributes[i];
			if (attr.value && attr.value.indexOf('$') > -1){
			  if(arrOfAttr) {
  		    attr.value = attr.value.replace("$", arrOfAttr.i[properties.counter - 1]);
  		  }else{
  		    attr.value = attr.value.replace("$", properties.counter);
  		  }
			}
			node.setAttribute(attr.name, attr.value);
			//console.log(node);
		}
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
