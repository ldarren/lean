!function(){ 'use strict'
	//https://github.com/jonathantneal/closest/blob/master/closest.js
	if ('function' !== typeof Element.prototype.matches) {
		Element.prototype.matches = 
		Element.prototype.webkitMatchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		function(selector) {
			var eles=this.parentElement.querySelectorAll(selector)
			for(var i=0,e; e=eles[i]; i++) if (this===e) return true;
			return false
		}
	}

	if ('function' !== typeof Element.prototype.closest){
		Element.prototype.closest = function(selector) {
			var ele=this
			while (ele && !ele.matches(selector)) ele=ele.parentElement;
			return ele 
		}
	}
}()
