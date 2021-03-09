!function(){
	'use strict'
	if (window.__) console.error('Another instance of lean detected')
}()
var __ = {
	env:{},
	load: function(cb){
		var readyCB=__.onReady(cb)
		if (__.env.supportNative){
			document.addEventListener('deviceready', readyCB, false)
			if (!__.env.loaded) __.dom.link('cordova.js', 'js')
		}else{
			if ('complete' === document.readyState) return readyCB()
			window.addEventListener('load', readyCB, false)
		}
		__.env.loaded = 1
	},
	onReady: (function(cbs){
		return function(cb){
			if (2 === __.env.loaded) return cb()
			cbs.push(cb)
			return function(){
				for(var i=0,c; (c=cbs[i]); i++) c()
				__.env.loaded=2
				cbs.length=0
			}
		}
	})([]),
	dummyCB:function(){},
	dotchain: function callee(obj, p){
		if (!p || !p.length) return obj
		var o = obj[p.shift()]
		if (o) return callee(o, p)
		return 0
	},
	querystring: function(obj){
		return Object.keys(obj).reduce(function(a,k){
			a.push(encodeURIComponent(k)+'='+encodeURIComponent(obj[k]));return a
		},[]).join('&')
	},

	/**
	 * ajax function browser implementation. nodejs implementation can be found in picos-utilA
	 *
	 * @param {string} method - get/post/put/delete/patch
	 * @param {string} href - path,
	 * @param {object} [params] - parameters (optional),
	 * @param {object} [opt] - options (optional)
	 * @param {object} [opt.query] - query string to be included regardless of request method
	 * @param {string} [opt.responseType] - https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType#syntax
	 * @param {boolean} [opt.async] - placed in synchronous mode by passing false
	 * @param {string} [opt.user] - basic auth username
	 * @param {string} [opt.password] - basic auth password
	 * @param {object} [opt.headers] - request headers
	 * @param {Function} cb - callback(err, state, res, userData),
	 * @param {object} [userData] - optional user data
	 *
	 * returns {void} - undefined
	 */
	ajax: function(method, href, params, opt, cb, userData){
		cb=cb || function(err){
			if(err)console.error(method, href, params, opt, userData, err)
		}
		if (!href) return cb('href not defined')
		var options = Object.assign({}, opt||{})

		var xhr = new XMLHttpRequest()
		var M = method.toUpperCase()
		var isGet ='GET' === M
		var dataType = 0
		if (params){
			dataType = params.charAt ? 1 : (params instanceof FormData ? 3 : 2))
		}

		var urlobj = new URL(href)
		var sep = urlobj.search && -1=== urlobj.search.indexOf('?')?'?':'&'

		if (isGet){
			urlobj.search += sep + __.querystring(Object.assign({_v: __.env.appVer || 0}, options.query || {}))
			if (params){
				href += '&'
				switch(dataType){
				case 1: urlobj.search += encodeURIComponent(params); break
				case 2: urlobj.search += __.querystring(params); break
				case 3: return cb('FormData with GET method is not supported yet')
				}
				params = null
			}
		}else{
			if (options.query) urlobj.search += sep + __.querystring(options.query)
			if (2===dataType) params=JSON.stringify(params)
		}

		xhr.open(M, urlobj.toString(), options.async, options.user, options.password)

		xhr.timeout=options.timeout||0
		xhr.responseType=opt.responseType||''

		xhr.onreadystatechange=function(){
			if (1 < xhr.readyState){
				var st = xhr.status, loc
				if (st>=300 && st<400 && (loc=xhr.getResponseHeader('location'))) return __.ajax(method,loc,params,opt,cb,userData)
				xhr.onerror=void 0 // debounce for cors error
				return cb(
					// webkit st === 0 when get from local
					(300>st || (!st && xhr.response)) ? null : {error:xhr.statusText,code:st},
					xhr.readyState,
					xhr.response,
					userData)
			}
		}
		xhr.ontimeout=xhr.onerror=function(evt){
			cb({error:xhr.statusText,code:xhr.status,src:evt,params:arguments}, xhr.readyState, null, userData)
		}
		var ct='Content-Type'
		var h=options.headers
		// never set Content-Type, it will trigger preflight options and chrome 35 has problem with json type
		if (!isGet && (!h || !h[ct]) && params){
			switch(dataType){
			case 1: xhr.setRequestHeader(ct, 'application/json'); break
			case 2: xhr.setRequestHeader(ct, 'text/plain'); break
			case 3: xhr.setRequestHeader(ct, 'multipart/form-data'); break
			}
		}
		for (var k in h) xhr.setRequestHeader(k, h[k])

		xhr.send(params)
		return xhr
	},
	// Use the browser's built-in functionality to quickly and safely escape the string
	escapeXML: function(str) {
		var p = document.createElement('p')
		p.appendChild(document.createTextNode(str))
		return p.innerHTML
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
			el[eventName] = void 0
			el.removeAttribute(eventName)
		}
		el = void 0
		return isSupported
	}
}
!function(){
	'use strict'
	var
		env = __.env,
		appVerTag = document.querySelector('meta[name=app-version]'),
		te = 'transitionend',
		wkte = 'webkitTransitionEnd'

	env.transitionEnd = __.detectEvent(te) ? te : __.detectEvent(wkte.toLowerCase()) ? wkte : void 0

	env.supportPassive=false
	try {
		window.addEventListener('t', null, Object.defineProperty({}, 'passive', {get:function(){
			return env.supportPassive=true
		}}))
	} catch (e) {}

	env.appVer = appVerTag ? appVerTag.getAttribute('content') : '0'
	env.loaded=0
	env.supportNative = false

	if (-1 === document.URL.indexOf('http://') && -1 === document.URL.indexOf('https://')){
		var tag = document.querySelector('meta[name=app-support-native]')
		env.supportNative = tag ? '1' === tag.getAttribute('content') : false
	}
}()
