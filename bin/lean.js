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
        // never set Content-Type, it will trigger preflight options and chrome 35 has problem with json type
        //if (post && params && 2 === dataType) xhr.setRequestHeader('Content-Type', 'application/json')
        if (post && params){
			switch(dataType){
			case 1:
			case 2: xhr.setRequestHeader('Content-Type', 'text/plain'); break
			case 3:xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); break
			}
		}
        var h=opt.headers
        for (var k in h) xhr.setRequestHeader(k, h[k])

        switch(dataType){
        case 1: xhr.send(params); break
        case 2: xhr.send(JSON.stringify(params)); break
        case 3: xhr.send(params); break
        }
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

    if (-1 === document.URL.indexOf('http://') &&
        -1 === document.URL.indexOf('https://')){
        var tag = document.querySelector('meta[name=app-support-native]')
        env.supportNative = tag ? '1' === tag.getAttribute('content') : false
    }
}()
!function(){
    function setup(){
		__.device=__.dotchain(window,['device']) || (function(n, models){
			var
			ua=n.userAgent,
			NA='',
			v=NA,m

			for(var i=0,idx,str; m=models[i]; i++){
				idx=ua.indexOf(m)
				if (~idx) {
        			v=ua.substr(idx+m.length+1).split(/[ ;]+/,1)[0]
					break
				}
			}
			return {
				model:m||NA,
				version:v,
				platform:'web',
				manufacturer:n.vendor||NA,

				cordova:0,
				uuid:Math.random().toString(36).substr(2)+Date.now().toString(36),
				isVirtual:!1,
				serial:NA
			}
		})(navigator, ['Trident','Edge','Chromium','Chrome','Safari','Firefox','OPR','Opera'])
    }
	__.onReady(setup)
}()
!function(){
    function setup(){
		var n=__.dotchain(window,['navigator','notification'])
		if (n) {
			__.dialogs={
				alert:function(msg,title,btn,cb){ n.alert(msg,cb||__.dummyCB,title,btn) },
				confirm:function(msg,title,btns,cb){ n.confirm(msg,cb,title,btns) },
				prompt:function(msg,title,btns,comment,cb){ n.prompt(msg,cb,title,btns,comment) },
				beep:function(times){ n.beep(times) }
			}
		}else{
			__.dialogs={
				alert:function(msg,title,btn,cb){ setTimeout(function(){alert(msg); (cb||__.dummyCB)()},0) },
				confirm:function(msg,title,btns,cb){ setTimeout(function(){cb(confirm(msg)?1:2)},0) },
				prompt:function(msg,title,btns,comment,cb){ setTimeout(function(){
					var m=prompt(msg,comment)
					cb({buttonIndex:m?1:2,input1:m})
				},0) },
				beep:function(){console.log('beep')}
			}
		}
    }
	__.onReady(setup)
}()
!function(){
	var
	head = document.head||document.getElementsByTagName('head')[0],
	NOTATTRIBS=['el','tagName','id','className','content'],
	get=function(opt){
		if (!opt) return
		if (opt instanceof HTMLElement) return opt
		var el=opt.el
		if (el){
			if (el.charAt) el=document.querySelector(el)
		}else{
			el=document.createElement(opt.tagName || 'div')
		}
		setId(el,opt.id)
		setClasses(el.classList,opt.className)
		setAttributes(el,opt)
		setContent(el,opt.content)

		return el
	},
	gets=function(el,opts,i){
		if (i >= opts.length) return
		el.appendChild(get(opts[i++]))
		gets(el,opts,i)
	}
	setId=function(el,id){
		if (id) el.id=id
	},
	setClasses=function(cl,classes){
		if (!classes || !classes.length) return
		cl.add.apply(cl,Array.isArray(classes)?classes:classes.split(' '))
	},
	setAttributes=function(el,attributes){
		if (attributes)
			for(var i=0,keys=Object.keys(attributes),k,a; k=keys[i]; i++){
				if (~NOTATTRIBS.indexOf(k)) continue
				a=attributes[k]
				if (null!=a) el.setAttribute(k,a)
			}
	},
	setContent=function(el,content){
		if (null==content) return
		if (content.charAt){
			el.innerHTML=content
		}else{
			gets(el,content,0)
		}
	}
	__.dom={
		// http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
		link: function(url, type, cb){
			var ref
			switch(type){
			case 'js':
				ref=document.createElement('script')
				ref.setAttribute('src', url)
				ref.onload = cb
				ref.onerror = cb
				.insertBefore(ref, head.lastChild)
				return
			case 'css':
				ref=document.createElement('link')
				ref.setAttribute('rel', 'stylesheet')
				ref.setAttribute('href', url)
				.insertBefore(ref, head.lastChild)
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
			default:return
			}
			//search backwards within nodelist for matching elements to remove
			for (var s,a; s=suspects[i]; i--){
				a=s.getAttribute(attr)
				if (a && ~a.indexOf(url)) s.parentNode.removeChild(s)
			}
		},
		setId:setId,
		setClasses:setClasses,
		setAttributes:setAttributes,
		setContent:setContent,
		get:get,
		style: function(id,css){
			if (!css || !css.length) return
			var ele=head.querySelector('#'+id)
			if (ele) return ele.dataset.rc=1+parseInt(ele.dataset.rc)
			ele=document.createElement('style')
			ele.id=id
			ele.dataset.rc=1
			ele.appendChild(document.createTextNode(css))
			head.appendChild(ele)
		},
		unstyle: function(id){
			var ele=head.querySelector('#'+id)
			if (!ele) return
			var ds=ele.dataset
			ds.rc=parseInt(ds.rc-1)
			if (0==ds.rc) ele.parentNode.removeChild(ele)
		}
    }
}()
!function(){
    if (__.detectEvent('touchstart')) return

    var
    opt=__.env.supportPassive?{capture:true,passive:true}:true,
	md='mousedown',
	mu='mouseup',
	mm='mousemove',
	mo='mouseout',
	ts='touchstart',
	te='touchend',
	tm='touchmove',
	tc='touchcancel',
    dispatchTouch = function(e){
        var name

        switch(e.type){
        case md: name = ts; break
        case mu: name = te; break
        case mm: name = tm; break
        case mo: name = tc; break
        default: return console.error('wrong event: '+e.type)
        }

        var
        ele = e.target,
        touches = [{
			pageX: e.pageX,
			pageY: e.pageY,
			target: ele
		}],
		evt=__.createEvent(name, null, e.bubbles, e.cancelable)

		evt.pageX=e.pageX
		evt.pageY=e.pageY
		evt.touches=evt.changedTouches=evt.targetTouches= touches
		evt.mouseToTouch= true

        ele.dispatchEvent(evt)
    },
	clearAll=function(){
        document.removeEventListener(md, touchstart)
        document.removeEventListener(mm, touchmove)
        document.removeEventListener(mu, touchend)
        document.removeEventListener(mo, touchcancel)
	},
    touchstart = function(e){
		clearAll()
        document.addEventListener(mm, touchmove,  opt)
        document.addEventListener(mu, touchend,  opt)
        document.addEventListener(mo, touchcancel,  opt)
        dispatchTouch(e)
    },
    touchmove = function(e){
        dispatchTouch(e)
    },
    touchend = function(e){
		clearAll()
        document.addEventListener(md, touchstart,  opt)
        dispatchTouch(e)
    },
    touchcancel = function(e){
		clearAll()
        document.addEventListener(md, touchstart,  opt)
        dispatchTouch(e)
    }
    document.addEventListener(md, touchstart,  opt)
}()
!function(){
    function setup(){
		var
		sp=__.dotchain(window,['sqlitePlugin']),
		od=__.dotchain(window,['openDatabase']),
		errCB=function(err){if(err)return console.error(err)},
		dbs={},
		store

		if (sp || od){
			store=function(name){
				var db
				if (sp) db=sp.openDatabase({name:name, location:'default'})
				else db=openDatabase(name, '1.0', 'lean local storage emulator', 50 * 1024 * 1024)
				db.transaction(function(tx){
					tx.executeSql('CREATE TABLE IF NOT EXISTS kv (key TEXT UNIQUE NOT NULL, val TEXT);',
					null,
					null,
					function(tx,err){console.error(err)})
				})
				this.db=db
			}
			store.prototype={
				key:function(idx,cb){
					this.db.readTransaction(function(tx){
						tx.executeSql('SELECT key FROM KV order by oid ASC;', null, function(tx,res){
							var rows=res.rows
							if (rows.length <= idx) return cb()
							cb(null,rows[idx].key)
						}, function(tx,err){
							cb(err)
						})
					})
				},
				getItem:function(key,cb){
					this.db.readTransaction(function(tx){
						tx.executeSql('SELECT val FROM kv WHERE key=?;', [key], function(tx,res){
							if (!res.rows.length) return cb()
							cb(null,res.rows[0].val)
						}, function(tx,err){
							cb(err)
						})
					})
				},
				setItem:function(key,val,cb){
					cb=cb||errCB
					this.db.transaction(function(tx){
						tx.executeSql('INSERT OR REPLACE INTO kv (oid,key,val) VALUES ((SELECT oid FROM kv WHERE key=?), ?, ?);',
						[key,key,val],
						function(tx,res){
							cb(null, res.insertId)
						}, function(tx,err){
							cb(err)
						})
					})
				},
				removeItem:function(key,cb){
					cb=cb||errCB
					this.db.transaction(function(tx){
						tx.executeSql('DELETE FROM kv WHERE key=?;', [key], function(tx,res){
							cb()
						}, function(tx,err){
							cb(err)
						})
					})
				},
				clear:function(cb){
					cb=cb||errCB
					this.db.transaction(function(tx){
						tx.executeSql('DELETE FROM kv;',null,function(tx,res){
							cb()
						},function(tx,err){
							cb(err)
						})
					})
				},
				length:function(cb){
					this.db.readTransaction(function(tx){
						tx.executeSql('SELECT count(*) AS len FROM KV;', null, function(tx,res){
							cb(null,res.rows[0].len)
						}, function(tx,err){
							cb(err)
						})
					})
				}
			}
		}else{
			store=function(name){
				this.prefix=name+'_'
				this.db=window.localStorage
			}
			store.prototype={
				key:function(index,cb){cb(null,this.db.key(index))},
				getItem:function(key,cb){cb(null,this.db.getItem(this.prefix+key))},
				setItem:function(key,val,cb){
					cb=cb||errCB
					try{cb(null,this.db.setItem(this.prefix+key,val))}
					catch(exp){cb(exp)}
				},
				removeItem:function(key,cb){
					cb=cb||errCB
					cb(null,this.db.removeItem(this.prefix+key))
				},
				clear:function(cb){
					cb=cb||errCB
					cb(null,this.db.clear())
				},
				length:function(cb){ cb(null,this.db.length) }
			}
		}
		__.store=function(name){
			name=name||'localstorage'
			return dbs[name] = dbs[name] || new store(name)
		}
    }
	__.onReady(setup)
}()
// TODO: swipe, https://github.com/madrobby/zepto/blob/master/src/touch.js
!function(){
    var
	startXY,
    lastXY,
    opt=__.env.supportPassive?{capture:true,passive:true}:true,
    cancelled = false,
    longTapTimer = 0,
    lastTap = 0,
    getXY=function(touch){
        return [touch.pageX,touch.pageY]
    },
    longTap = function(e){
        if (cancelled) return
        cancelled = true
        e.target.dispatchEvent(__.createEvent('longTap', null, true))
    },
    touchstart = function(e){
        cancelled = false
		lastXY=startXY=getXY(e.touches[0])
        longTapTimer= window.setTimeout(longTap, 2000, e)
    },
    touchend = function(e){
        window.clearTimeout(longTapTimer)
        if (cancelled) return
        var now = Date.now()
        if (now - lastTap < 300){
			e.target.dispatchEvent(__.createEvent('taps', null, true))
			lastTap=0
		}else{
			e.target.dispatchEvent(__.createEvent('tap', null, true))
			lastTap=now
		}
    },
    touchmove = function(e){
        var xy=getXY(e.touches[0])
        if (cancelled){
		    if (xy[0]>lastXY[0]+9 || xy[1]>lastXY[1]+9) e.target.dispatchEvent(__.createEvent('rub',[xy[0]-lastXY[0],xy[1]-lastXY[1]],true))
        }else{
		    if (xy[0]>startXY[0]+9 || xy[1]>startXY[1]+9) cancelled = true
        }
        lastXY=xy
    },
    touchcancel = function(e){
        cancelled = true
        window.clearTimeout(longTapTimer)
    }
    document.addEventListener('touchstart', touchstart,  opt)
    document.addEventListener('touchend', touchend,  opt)
    document.addEventListener('touchmove', touchmove,  opt)
    document.addEventListener('touchcancel', touchcancel,  opt)
}()
