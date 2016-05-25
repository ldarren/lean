!function(){ if (window.__) console.error('Another instance of lean detected') }()
var __ = {
    env:{},
    onLoad: function(cb){
        if (__.env.supportNative){
            document.addEventListener('deviceready', cb, false)
            if (__.env.loaded) __.attachFile('cordova.js', 'js')
        }else{
			if ('complete' === document.readyState) return cb()
            else window.addEventListener('load', cb, false)
        }
        __.env.loaded = true
    },
	dummyCB:function(){},
	refChain: function(obj, p){
		if (!p || !p.length) return obj
		var o = obj[p.shift()]
		if (o) return arguments.callee(o, p)
		return 0
	},
	querystring: function(obj){
		return Object.keys(obj).reduce(function(a,k){a.push(encodeURIComponent(k)+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
	},
    // method: get/post, url: path, params: null/parameters (optional), opt: {async,un,passwd,headers}, cb: callback, userData: optional
    ajax: function(method, url, params, opt, cb, userData){
        cb=cb || function(err){if(err)console.error(err)} 
        if (!url) return cb('url not defined')
        opt=opt||{}

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
                case 2: url += __.querystring(params); break
                case 3: return cb('FormData with GET method is not supported yet')
                }
                params = null
            }
        }

        xhr.open(method, url, undefined===opt.async?true:opt.async, opt.un, opt.passwd)

        xhr.onreadystatechange=function(){
            if (1 < xhr.readyState){
                var
				st = xhr.status,
				loc
                if (st>=300 && st<400 && (loc=xhr.getResponseHeader('location'))) return __.ajax(method,loc,params,opt,cb,userData)
                return cb((300>st || !st) ? null : {error:xhr.statusText,code:xhr.status},xhr.readyState,xhr.responseText,userData)
            }
        }
        xhr.onerror=function(evt){cb({error:xhr.statusText,code:xhr.status,params:arguments}, xhr.readyState, null, userData)}
        // never set Content-Type, it will trigger preflight options and chrome 35 has problem with json type
        //if (post && params && 2 === dataType) xhr.setRequestHeader('Content-Type', 'application/json')
        if (post && params && 3 !== dataType) xhr.setRequestHeader('Content-Type', 'text/plain')
        var h=opt.headers
        for (var k in h) xhr.setRequestHeader(k, h[k])

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
			return setTimeout(cb, 0)
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
    appVerTag = document.querySelector('meta[name=app-version]'),
    te = 'transitionend',
    wkte = 'webkitTransitionEnd'

    env.transitionEnd = __.detectEvent(te) ? te : __.detectEvent(wkte.toLowerCase()) ? wkte : undefined

    env.appVer = appVerTag ? appVerTag.getAttribute('content') : '0'
    env.supportNative = false

    if (-1 === document.URL.indexOf('http://') &&
        -1 === document.URL.indexOf('https://')){
        var tag = document.querySelector('meta[name=app-support-native]')
        env.supportNative = tag ? '1' === tag.getAttribute('content').toLowerCase() : false
    }
}()
