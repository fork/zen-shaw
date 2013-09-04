describe("Zen", function() {

	beforeEach(function() {
	});

	it("should return a Document Fragment", function() {
		var actual = Zen('span, span');
		expect(actual.nodeType).toBe(document.DOCUMENT_FRAGMENT_NODE);
		expect(actual.firstChild).toBeTruthy();
	});
	it("should be able to create elements", function() {
		var actual = Zen('div').firstChild;
		expect(function () {
			container = document.createElement('div');
			container.appendChild(actual);
		}).not.toThrow();
		expect(actual.nodeType).toBe(document.ELEMENT_NODE);
	});
	it("should be able to create elements with classes", function() {
		var actual = Zen('div.a-class').classList.contains('a-class');
		expect(actual).toBe(true);
	});
	it("should be able to nest elements", function() {
		var actual = Zen('span > b').children[0];
		expect(function () {
			container = document.createElement('div');
			container.appendChild(actual);
		}).not.toThrow();
	});
	it("should support tagnames other than div", function() {
		var actual = Zen('span').tagName;
		expect(actual.tagName).toBe('span');
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
