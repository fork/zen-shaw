describe("Zen", function() {

	function traverse(node, callback) {
		callback.call(node, node);

		var children = node.childNodes;
		for(var i = 0, len = children.length; i < len; i++) {
			traverse(children[i], callback);
		}
	}

	it("should return a Document Fragment", function() {
		var siblings = Zen('span+span');
		expect(siblings).toBeCalled('DocumentFragment');
	});

	it("should be able to create TAGs", function() {
		var root = Zen('div>div').firstChild;
		var div = document.createElement('div');
		traverse(root, function(node) {
			expect(function () { div.appendChild(node); }).not.toThrow();
			expect(node.nodeType).toBe(node.ELEMENT_NODE);
		});
	});

	it("should be able to name the tags being built", function() {
		var actual = Zen('div').firstChild;
		expect(actual.tagName).toBe('DIV');
	});

	it("should be able to create elements with classes", function() {
		var actual = Zen('div.a-class').firstChild;
		expect(actual).toHaveClass('a-class');
	});

	it("should be able to nest elements", function() {
		// FIXME var actual = Zen('span > b').children[0];
		var span = Zen('span>b').firstChild;
		expect(span.tagName).toBe('SPAN');
		expect(span.firstChild.tagName).toBe('B');
	});

	it("should support ids", function(){
		var actual = Zen('div#footer').firstChild;
		expect(actual.id).toBe("footer");
	});

	it("should support siblings", function(){
		var fragment = Zen('td.time+td.event-name');
		expect(fragment).toBeCalled('DocumentFragment');

		var nodes = fragment.childNodes;
		expect(nodes.length).toBe(2);

		var timeNode = nodes[0];
		expect(timeNode.tagName).toBe('TD');
		expect(timeNode).toHaveClass('time');

		var eventNameNode = nodes[1];
		expect(eventNameNode.tagName).toBe('TD');
		expect(eventNameNode).toHaveClass('event-name');
	});

	it("should support attributes", function(){
		var img = Zen('img[alt="Hello World!"]').firstChild;
		expect(img.alt).toBe('Hello World!');
	});

	it("should support advanced selectors like build a table", function(){
		var root = Zen('table>tr>td').firstChild;
		var table = document.createElement('table');
		traverse(root, function(node) {
			expect(function () { table.appendChild(node); }).not.toThrow();
			expect(node.nodeType).toBe(node.ELEMENT_NODE);
		});
	});
	
	it("should support the div#name.one.two-Selector", function(){
		var fragment = Zen('div#name.one.two').firstChild;
		//RADAR do we need the nodes-Variable?
		var nodes = fragment.childNodes; 
		expect(fragment.id).toBe("name");
		expect(fragment).toHaveClass("two");
	});
	
	it("should support colspan for tables", function(){
		var fragment = Zen('td[colspan=2]').firstChild;
		expect(fragment.tagName).toBe('TD');
		expect(fragment).toHaveAttribute("colspan", 2);
	});
	
	it("should support paragraphs with title", function(){
		var fragment = Zen('p[title="a-title"]').firstChild;
		expect(fragment.tagName).toBe('P');
		expect(fragment.title).toBe("a-title");
	});


	it("should support title and rel for span", function(){
		var fragment = Zen('span[title="Hello" rel="some-rel"]').firstChild;
		expect(fragment.tagName).toBe('SPAN');
		expect(fragment.title).toBe("Hello");
		expect(fragment).toHaveAttribute("rel", "some-rel");
	});
	
	it("should support nested elements with classes", function(){
		var fragment = Zen('ul#name>li.item').firstChild;
		expect(fragment.tagName).toBe('UL');
		expect(fragment.id).toBe("name");
		expect(fragment.firstChild.tagName).toBe("LI");
		expect(fragment.firstChild).toHaveClass("item");
	});
	
	it("should support the Plus-Operator", function(){
		var fragment = Zen('p+p');
		var nodes = fragment.childNodes;
		expect(nodes.length).toBe(2);
		expect(nodes[0].tagName).toBe('P');
		expect(nodes[1].tagName).toBe('P');
	});
	
	it("should support multiple children", function(){
		var fragment = Zen('p*3');
		var nodes = fragment.childNodes;
		expect(nodes.length).toBe(3);
		expect(nodes[0].tagName).toBe('P');
		expect(nodes[1].tagName).toBe('P');
		expect(nodes[2].tagName).toBe('P');
	});
	
	it("should support lists with multiple elements", function(){
		var fragment = Zen('ul#name>li.item*3').firstChild;
		var nodes = fragment.childNodes;
		expect(fragment.tagName).toBe('UL');
		expect(fragment.id).toBe("name");
		expect(nodes.length).toBe(3);
		expect(nodes[0].tagName).toBe('LI');
		expect(nodes[0]).toHaveClass("item");
	});
	
	it("should support multiple children with classes", function(){
		var fragment = Zen('p.name-$*3');
		var nodes = fragment.childNodes;
		expect(nodes.length).toBe(3);
		for(var i = 0, len = nodes.length; i < len; i++) {
			expect(nodes[i].tagName).toBe('P');
			expect(nodes[i]).toHaveClass("name-i");		
		}
	
	});
	
	it("should support selections with options", function(){
		var fragment = Zen('select>option#item-$*3').firstChild;
		var nodes = fragment.childNodes;
		expect(fragment.tagName).toBe('SELECT');
		expect(nodes.length).toBe(3);
		for(var i = 0, len = nodes.length; i < len; i++) {
			expect(nodes[i].tagName).toBe('OPTION');
			expect(nodes[i].id).toBe("item");

		}
	});
	
	it("should support unordered lists", function(){
		var fragment = Zen('ul+').firstChild;
		expect(fragment.tagName).toBe('UL');
		expect(fragment.firstChild.tagName).toBe('LI');
	});
	
	it("should support tables", function(){
		var fragment = Zen('table+').firstChild;
		var tableRow = fragment.firstChild;
		var tableData = tableRow.firstChild;
		expect(fragment.tagName).toBe('TABLE');
		expect(tableRow.tagName).toBe('TR');
		expect(tableData.tagName).toBe('T');
	});
	
	it("should support description lists", function(){
		var fragment = Zen('dl+').firstChild;
		var nodes = fragment.childNodes;
		expect(fragment.tagName).toBe('DL');
		expect(nodes.length).toBe(2);
		expect(nodes[0].tagName).toBe('DT');
		expect(nodes[1].tagName).toBe('DD');
	});
	
	
		
	// in the future fara far away
	// it("should be able to handle the example of the zen-coding frontpage", function () {
	// 	var fragment = Zen("div#page>div.logo+ul#navigation>li*5>a");
	// 	var renderer = document.createElement('div');
	// 	var expected = '<div id="page"><div class="logo"></div><ul id="navigation"><li><a href=""></a></li><li><a href=""></a></li><li><a href=""></a></li><li><a href=""></a></li><li><a href=""></a></li></ul></div>';
    //
	// 	renderer.appendChild(fragment);
	// 	expect(renderer.innerHTML).toBe(expected);
	// });

});

  
