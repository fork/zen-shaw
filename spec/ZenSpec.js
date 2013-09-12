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
		var actual = Zen('.a-class').firstChild;
		expect(actual).toHaveClass('a-class');
	});

	it("should be able to nest elements and support spaces", function() {
		var span = Zen('span > b').firstChild;
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
		var node = Zen('div#name.one.two').firstChild;
		expect(node.id).toBe("name");
		expect(node).toHaveClass("two");
	});

	it("should support colspan for tables", function(){
		var table = Zen('td[colspan=2]').firstChild;
		expect(table.tagName).toBe('TD');
		expect(table).toHaveAttribute("colspan", 2);
	});

	it("should support paragraphs with title", function(){
		var paragraph = Zen('p[title="a-title"]').firstChild;
		expect(paragraph.tagName).toBe('P');
		expect(paragraph.title).toBe("a-title");
	});


	it("should support title and rel for span", function(){
		var span = Zen('span[title="Hello" rel="some-rel"]').firstChild;
		expect(span.tagName).toBe('SPAN');
		expect(span.title).toBe("Hello");
		expect(span).toHaveAttribute("rel", "some-rel");
	});

	it("should support nested elements with classes", function(){
		var list = Zen('ul#name>li.item').firstChild;
		var item = list.firstChild;
		expect(list.tagName).toBe('UL');
		expect(list.id).toBe("name");
		expect(item.tagName).toBe("LI");
		expect(item).toHaveClass("item");
	});

	it("should support the Plus-Operator", function(){
		var tagNames = 'P DIV SPAN'.split(' ');
		var fragment = Zen('p+div+span');
		var nodes = fragment.childNodes;

		expect(nodes.length).toBe(tagNames.length);

		for (var i = 0, len = tagNames.length; i < len; i++) {
			expect(nodes[i].tagName).toBe(tagNames[i]);
		}
	});

	it("should support multiple children", function(){
		var fragment = Zen('p*3');
		var nodes = fragment.childNodes;
		var tagNames = 'P P P'.split(' ');
		expect(nodes.length).toBe(tagNames.length);
		for (var i = 0, len = tagNames.length; i < len; i++){
			expect(nodes[i].tagName).toBe('P');
		}
	});

	it("should support lists with multiple elements", function(){ 
		var list = Zen('ul#name>li.item*3').firstChild;
		var items = list.childNodes;

		expect(list.tagName).toBe('UL');
		expect(list.id).toBe('name');

		expect(items.length).toBe(3);
		for(var i = 0; i < 3; i++) {
			expect(items[i].tagName).toBe('LI');
			expect(items[i]).toHaveClass('item');
		}
	});

	it("should support multiple children with incremented counter in item class", function(){
		var fragment = Zen('p.name-$*3');
		var nodes = fragment.childNodes;
		
		expect(nodes.length).toBe(3);
		
		for(var i = 0; i < 3; i++) {
			expect(nodes[i].tagName).toBe('P');
			expect(nodes[i]).toHaveClass('name-' + (i+1));
		}
	});

	it("should support options with different values", function(){
		var select = Zen('select>option[value=item-$]*3').firstChild;
		var options = select.childNodes;

		expect(select.tagName).toBe('SELECT');
		expect(options.length).toBe(3);

		for(var i = 0; i < 3; i++) {
			expect(options[i].tagName).toBe('OPTION');
			expect(options[i].value).toBe('item-' + (i+1));
		}
	});

	it("should be able to handle the example of the zen-coding frontpage", function () {
		var fragment = Zen("div#page>div.logo+ul#navigation>li*5>a");
		var renderer = document.createElement('div');
		var expected = '<div id="page"><div class="logo"></div><ul id="navigation"><li><a></a></li><li><a></a></li><li><a></a></li><li><a></a></li><li><a></a></li></ul></div>';

		renderer.appendChild(fragment);
		expect(renderer.innerHTML).toBe(expected);
	});
	
	it('should support inner HTML text', function(){
		var paragraph = Zen('div>p{Text}').firstChild;
		expected = '<p>Text</p>';
		//expect(paragraph.tagName).toBe('DIV');
		expect(paragraph.innerHTML).toBe(expected);
	})
	it('expand tagnames by context', function () {
		var time;

		expect(function () {
			time = Zen('tr > .time').firstChild.firstChild;
			expect(time.tagName).toBe('TD');
		}).not.toThrow();
	});
	it('should support objects as data source', function () {
		expect(function () {
			var foo = Zen('#foo > .item-$(i)*3', { 'i': ['foo', 'bar', 'baz'] }).firstChild;
			var classNames = 'item-foo item-bar item-baz'.split(' ');
			var items = foo.children;
			expect(items.length).toBe(classNames.length);
			for (var i = 0, len = items.length; i < len; i++) {
				expect(items[i]).toHaveClass(classNames[i]);
			}
		}).not.toThrow();
	});

});
