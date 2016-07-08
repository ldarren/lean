!function(){
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
	__.dom={
		// http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
		link: function(url, type, cb){
			var
			h = document.getElementsByTagName("head")[0],
			ref
			switch(type){
			case 'js':
				ref=document.createElement('script')
				ref.setAttribute('src', url)
				ref.onload = cb
				ref.onerror = cb
				h.insertBefore(ref, h.lastChild)
				return
			case 'css':
				ref=document.createElement('link')
				ref.setAttribute('rel', 'stylesheet')
				ref.setAttribute('href', url)
				h.insertBefore(ref, h.lastChild)
				return setTimeout(cb, 0)
			default: return cb()
			}
		},
		unlink: function(url, type){
			var attr, suspects
			switch(type){
			case 'js':
				suspects = document.getElementsByTagName('script')
				attr = 'src'
				break
			case 'css':
				suspects = document.getElementsByTagName('link')
				attr = 'href'
				break
			default:
				suspects = []
				break
			}
			for (var s,i=suspects.length; i>=0,s=suspects[i]; i--){ //search backwards within nodelist for matching elements to remove
				if (s && s.getAttribute(attr)!=null && s.getAttribute(attr).indexOf(url)!=-1)
				s.parentNode.removeChild(s) //remove element by calling parentNode.removeChild()
			}
		}
    }
}()
