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
	})


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
