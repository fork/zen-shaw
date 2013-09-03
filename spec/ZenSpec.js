describe("Zen", function() {

	beforeEach(function() {
	});

	it("should be able to create elements", function() {
		var actual = Zen('div');
		expect(function () {
			container = document.createElement('div');
			container.appendChild(actual);
		}).not.toThrow();
	});
	it("should be able to create elements with classes", function() {
		var actual = Zen('div.a-class').classList.contains('a-class');
		expect(actual).toBe(true);
	});

});
