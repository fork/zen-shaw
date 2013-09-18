describe("Zen", function() {

	// idea taken from http://stackoverflow.com/a/1349426
	function makeAB()
	{
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

		for( var i=0; i < 5; i++ ) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	}
	function rand(limit) {
		limit = limit || 10;
		return Math.round(Math.random() * limit);
	}
	function each(array, callback) {
		for (var i = 0, len = array.length; i < len; i++) {
			if (callback(array[i]) === false) return;
		}
	}
	function traverse(node, callback) {
		callback.call(node, node);

		each(node.childNodes, function (child) {
			traverse(child, callback);
		});
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
		var actual = Zen('div.time.frame').firstChild;
		expect(actual).toHaveClass('time');
		expect(actual).toHaveClass('frame');
		expect(actual).not.toHaveClass('a-class');
	});
	
	it("should be able to create elements with ids", function() {
		var actual = Zen('div#an-id').firstChild;
		expect(actual.id).toBe('an-id');
	});

	it('should support spaces in regular expression', function () {
		expect(function () {
			var actual = Zen('head > title').firstChild.outerHTML;
			var expected = Zen('head>title').firstChild.outerHTML;
			expect(actual).toBe(expected);
		}).not.toThrow()
	});

	it("should be able to nest elements", function() {
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
		var span = Zen('span[title="Hello" rel="some-rel"]').firstChild;
		expect(span.tagName).toBe('SPAN');
		expect(span.title).toBe("Hello");
		expect(span).toHaveAttribute("rel", "some-rel");
	});

	it("should support deeper nested elements", function(){
		var root = Zen('table>tr>td').firstChild;
		var table = document.createElement('table');
		traverse(root, function(node) {
			expect(function () { table.appendChild(node); }).not.toThrow();
			expect(node.nodeType).toBe(node.ELEMENT_NODE);
		});
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

	it("should support nested elements with classes", function(){
		var list = Zen('ul#name>li.item').firstChild;
		var item = list.firstChild;
		expect(list.tagName).toBe('UL');
		expect(list.id).toBe("name");
		expect(item.tagName).toBe("LI");
		expect(item).toHaveClass("item");
	});

	it("should support the + operator", function(){
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
		var fragment = Zen("div#page > div.logo + ul#navigation > li*5 > a");
		var renderer = document.createElement('div');
		var expected = '<div id="page"><div class="logo"></div><ul id="navigation"><li><a></a></li><li><a></a></li><li><a></a></li><li><a></a></li><li><a></a></li></ul></div>';

		renderer.appendChild(fragment);
		expect(renderer.innerHTML).toBe(expected);
	});
	
	it('should support inner HTML text', function(){
		var container = Zen('div > p{Text}').firstChild;
		html = '<p>Text</p>';
		expect(container.innerHTML).toBe(html);
	});
	
	it('should not error out if the tag is not explicitely named', function () {
		expect(function () { Zen('.foo > .bar + .baz'); }).not.toThrow();
	});

	it('should default to LI in OL and UL', function () {
		var item;

		item = Zen('ol > .foo').firstChild.firstChild;
		expect(item.tagName).toBe('LI');
		item = Zen('ul > .foo').firstChild.firstChild;
		expect(item.tagName).toBe('LI');
	});
	
	it('should default to TD in TR', function () {
		var time = Zen('tr > .time').firstChild.firstChild;
		expect(time.tagName).toBe('TD');
	});
	
	it('should default to TR in TABLE', function () {
		var time = Zen('table > .time').firstChild.firstChild;
		expect(time.tagName).toBe('TR');
	});
	
	it('should default to OPTION in SELECT', function () {
		var select = Zen('select > [value="$"]*3').firstChild;
		each(select.childNodes, function (child) {
			expect(child.tagName).toBe('OPTION');
		})
	});
	
	it('should default to UL in NAV', function () {
		var list = Zen('nav > .navigation').firstChild.firstChild;
		expect(list.tagName).toBe('UL');
	});

	it('should default to INPUT in FORM when type attribute is set', function () {
		var input;

		input = Zen('form > [type="foo"]').firstChild.firstChild;
		expect(input.tagName).toBe('INPUT');
	});
	
	it('should default to META in HEAD when content attribute is set', function () {
		var meta;

		meta = Zen('head > [content="foo"]').firstChild.firstChild;
		expect(meta.tagName).toBe('META');
	});

	it('should default to DIV in any other case', function () {
		var container = Zen('.navigation').firstChild;
		expect(container.tagName).toBe('DIV');
	});

	it('should support objects as data source', function () {
		var foo = Zen('#foo > #foo-$:b.item-$:i*3', {
			'b': [1, 2, 3],
			'i': ['foo', 'bar', 'baz']
		}).firstChild;

		var classNames = 'item-foo item-bar item-baz'.split(' ');
		var ids = 'foo-1 foo-2 foo-3'.split(' ');
		var items = foo.children;
		expect(items.length).toBe(classNames.length);
		for (var i = 0, len = items.length; i < len; i++) {
			expect(items[i]).toHaveClass(classNames[i]);
			expect(items[i].id).toBe(ids[i]);
		}
	});

	it('should support functions as data source', function () {
		var classNames = 'foo bar baz'.split(' ');

		var foo = Zen('#foo > .item-$:i*3', function (key, index) {
			return (key === 'i') ? classNames[index] : 'xxx';
		}).firstChild;

		var items = foo.children;
		expect(items.length).toBe(classNames.length);

		for (var i = 0, len = items.length; i < len; i++) {
			expect(items[i]).toHaveClass('item-' + classNames[i]);
		}
	});
	
	it('should interpolate innerText values', function () {
		var text = Zen('span{$:i $}', {'i': 'Hello World!'}).firstChild.textContent;
		expect(text).toBe('Hello World! 1');
	});
	
	it('should not interpolate escaped DOLLARs(\\$)', function () {
		var text = Zen('span{You have to $:i \$1000}', {'i': 'save'}).firstChild.textContent;
		expect(text).toBe('You have to save $1000');
	});
	
	it('should interpolate multiple values', function () {
		var data = {}, expression = '{We can have multiples, like ', expectedContent = 'We can have multiples, like ';
		for (var i = 0; i < rand(); i++) {
			var key = makeAB();
			var value = makeAB();

			// prevent duplicates
			if (data.hasOwnProperty(key)) {
				i--;
			} else {
				data[key] = value;
				expression += '$:'.concat(key, ' ');
				expectedContent += value + ' ';
			}
		}
		expression += '...}';
		expectedContent += '...';

		var text = Zen(expression, data).firstChild.textContent;

		expect(text).toBe(expectedContent);
	});
	
	it('should construct jQuery instance', function () {
		expect(function () {
			var $$ = jQuery.zen('div').text('jQuery.zen');
			expect($$.text()).toBe('jQuery.zen');
		}).not.toThrow();
	});
	
	it('should replace content of jQuery instance', function () {
		expect(function () {
			var div = jQuery('<div>').text('test');
			div.zen('span{jQuery.fn.zen}');
			expect(div.text()).toBe('jQuery.fn.zen');
		}).not.toThrow();
	});

});
