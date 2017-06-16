!function(){ if (window.__) console.error('Another instance of lean detected') }()
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
				for(var i=0,c; c=cbs[i]; i++) c()
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
		return Object.keys(obj).reduce(function(a,k){a.push(encodeURIComponent(k)+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
	},
    // method: get/post,
	// url: path, 
	// params: null/parameters (optional),
	// opt: {responseType,async,un,passwd,headers} (optional),
	// cb: callback(err, state, res, userData),
	// userData: optional
    ajax: function(method, url, params, opt, cb, userData){
        cb=cb || function(err){if(err)console.error(err)} 
        if (!url) return cb('url not defined')
		params=params||{}
        opt=opt||{}

        var
        xhr = new XMLHttpRequest(),
        post = 'POST' === (method = method.toUpperCase()),
        dataType = (params.charAt ? 1 : (params instanceof FormData ? 3 : 2))

        url = encodeURI(url)

        if (post){
			if (2===dataType) params=JSON.stringify(params)
		}else{
            url += (-1===url.indexOf('?')?'?':'&')+'appVer='+__.env.appVer||0
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

        xhr.open(method, url, !opt.sync, opt.un, opt.passwd)

		xhr.timeout=opt.timeout||0
		xhr.responseType=opt.responseType||''

        xhr.onreadystatechange=function(){
            if (1 < xhr.readyState){
                var st = xhr.status, loc
                if (st>=300 && st<400 && (loc=xhr.getResponseHeader('location'))) return __.ajax(method,loc,params,opt,cb,userData)
                return cb((300>st || !st) ? null : {error:xhr.statusText,code:xhr.status},xhr.readyState,xhr.response,userData)
            }
        }
        xhr.ontimeout=xhr.onerror=function(evt){
			cb({error:xhr.statusText,code:xhr.status,src:evt,params:arguments}, xhr.readyState, null, userData)
		}
		var ct='Content-Type'
        var h=opt.headers
        // never set Content-Type, it will trigger preflight options and chrome 35 has problem with json type
        //if (post && params && 2 === dataType) xhr.setRequestHeader('Content-Type', 'application/json')
        if (post && !h[ct] && params){
			switch(dataType){
			case 1:
			case 2: xhr.setRequestHeader(ct, 'text/plain'); break
			case 3:xhr.setRequestHeader(ct, 'multipart/form-data'); break
			}
		}
        for (var k in h) xhr.setRequestHeader(k, h[k])

        xhr.send(params)
		return xhr
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
    var
    env = __.env,
    appVerTag = document.querySelector('meta[name=app-version]'),
    te = 'transitionend',
    wkte = 'webkitTransitionEnd'

    env.transitionEnd = __.detectEvent(te) ? te : __.detectEvent(wkte.toLowerCase()) ? wkte : void 0

    env.supportPassive=false
    try { window.addEventListener('t', null, Object.defineProperty({}, 'passive', {get:function(){env.supportPassive=true}})) }
    catch (e) {}

    env.appVer = appVerTag ? appVerTag.getAttribute('content') : '0'
	env.loaded=0
    env.supportNative = false

    if (-1 === document.URL.indexOf('http://') && -1 === document.URL.indexOf('https://')){
        var tag = document.querySelector('meta[name=app-support-native]')
        env.supportNative = tag ? '1' === tag.getAttribute('content') : false
    }
}()
