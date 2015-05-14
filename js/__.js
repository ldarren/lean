var __ = {
    env:{},
    onLoad: function(cb){
        if (__.loaded) return cb()
        if (__.env.supportNative){
            document.addEventListener('deviceready', cb, false)
            __.attachFile('cordova.js', 'js')
        }else{
			if ('complete' === document.readyState) return cb()
            else window.addEventListener('load', cb, false)
        }
        __.env.loaded = true
    },

    // method: get/post, url: path, params: null/parameters (optional), headers: header parameter, cb: callback, userData: optional
    ajax: function(method, url, params, headers, cb, userData){
        cb = cb || dummyCB
        if (!url) return cb(new Error('url not defined'))
        var
        xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
        post = 'POST' === (method = method.toUpperCase()),
        dataType = ('string' === typeof params ? 1 : (params instanceof FormData ? 3 : 2))

        url = encodeURI(url)

        if (!post){
            url += '?appVer='+__.env.appVer
            if (params){
                url += '&'
                switch(dataType){
                case 1: url += encodeURIComponent(params); break
                case 2: url += Object.keys(params).reduce(function(a,k){a.push(k+'='+encodeURIComponent(params[k]));return a},[]).join('&'); break
                case 3: return cb(new Error('FormData with GET method is not supported yet'))
                }
                params = null
            }
        }

        xhr.open(method, url, true)

        xhr.onreadystatechange=function(){
            if (1 < xhr.readyState && cb){
                var st = xhr.status
                return cb((200 === st || !st) ? null : new Error("Error["+xhr.statusText+"] Info: "+xhr.responseText), xhr, userData)
            }
        }
        xhr.onerror=function(evt){cb(evt, xhr, userData)}
        // never set Content-Type, it will trigger preflight options and chrome 35 has problem with json type
        //if (post && params && 2 === dataType) xhr.setRequestHeader('Content-Type', 'application/json')
        if (post && params && 3 !== dataType) xhr.setRequestHeader('Content-Type', 'text/plain')
        for (var key in headers) xhr.setRequestHeader(key, headers[key])

        switch(dataType){
        case 1: xhr.send(params); break
        case 2: xhr.send(JSON.stringify(params)); break
        case 3: xhr.send(params); break
        }
    },
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
!function(){
    var
    env = __.env,
    te = 'transitionend',
    wkte = 'webkittransitionend',
    appVerTag = document.querySelector('meta[name=app-version]')

    env.transitionEnd = __.detectEvent(te) ? te : __.detectEvent(wkte) ? 'webkitTransitionEnd' : undefined

    env.appVer = appVerTag ? appVerTag.getAttribute('content') : '0'
    env.supportNative = false

    if (-1 === document.URL.indexOf('http://') &&
        -1 === document.URL.indexOf('https://')){
        var tag = document.querySelector('meta[name=app-support-native]')
        env.supportNative = tag ? 'true' === tag.getAttribute('content').toLowerCase() : false
    }
}()
