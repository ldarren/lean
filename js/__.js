var __ = {
	createEvent: function(name, detail, bubbles, cancelable){
		var evt = document.createEvent('CustomEvent')
		evt.initCustomEvent(name, bubbles || false, cancelable || false, detail)
		return evt
	},
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	detectEvent: function(eventName, tagName){
		var el = document.createElement(tagName || 'div')
		eventName = 'on' + eventName
		var isSupported = (eventName in el) || (eventName in window)
		if (!isSupported) {
			el.setAttribute(eventName, '')
			isSupported = 'function' === typeof el[eventName]
			el[eventName] = undefined
			el.removeAttribute(eventName)
		}
		el = undefined
		return isSupported
	},
	// http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
	attachFile: function(url, type, cb){
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
			return setTimeout(cb, 500)
		default: return cb()
		}
	},
	detachFile: function(url, type){
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
