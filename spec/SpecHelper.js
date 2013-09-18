var toString = Object.prototype.toString;

beforeEach(function() {
	this.addMatchers({
		toBeCalled: function(name) {
			return toString.call(this.actual) === '[object ' + name +']';
		},
		// TODO add reference to page we took this code from
		toHaveClass: function(className) {
			return this.actual.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.actual.className);
		},
		toHaveAttribute: function(attrName, value){
			return this.actual.getAttribute(attrName) == value;
		}
	});

});
