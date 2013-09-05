describe("Zen", function() {

	beforeEach(function() {
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
		var actual = Zen('span>b').children[0];
    expect(function () {
			container = document.createElement('div');
			container.appendChild(actual);
		}).not.toThrow();
	});
	
	it("should support tagnames other than div", function() {
		var actual = Zen('span').tagName;
		expect(actual.toLowerCase()).toBe('span');
	});
	
	it("should support ids", function(){
		var actual = Zen('div#footer');
		expect(actual.id).toBe("footer");
	});
	
	it("should support children", function(){
		var actual = Zen('div');
		container = document.createElement('div');
		container.appendChild(actual);
		expect(actual.firstChild).toBeTruthy();
	});
	
	it("should support classes", function(){
		var actual = Zen('.controls > ul');
		expect(actual).toBe(true);
		expect(jasmine.any(actual)).toEqual('controls');
	});
	
	/*it("should support multiples", function(){
		var actual = Zen('td.time,td.event-name');
		expect(actual).toBe...
	});*/
	

	
	it("should support attributes", function(){
		var actual = Zen('img[src="some-src"]');
		expect(actual.src).toBe("some-src");
		expect(actual.tagName).toBe('img');
	})

	
	/*it("should return a Document Fragment", function() {
		var actual = Zen('span, span');
		expect(actual.nodeType).toBe(document.DOCUMENT_FRAGMENT_NODE);
		expect(actual.firstChild).toBeTruthy();
	});*/
		
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
