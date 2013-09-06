var toString = Object.prototype.toString;

beforeEach(function() {
	this.addMatchers({
		toBeCalled: function(name) {
			return toString.call(this.actual) === '[object ' + name +']';
		},
		toHaveClass: function(className) {
			return this.actual.classList.contains(className);
		}
	});
});
