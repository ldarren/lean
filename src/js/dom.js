!function(){
	'use strict'
	var
		head = document.head||document.getElementsByTagName('head')[0],
		NOTATTRIBS=['el','tagName','tag','id','className','class','dataset','data','style','content'],
		remove = function(el, keepFirst){
			if (!el) return
			while(el.hasChildNodes()){
				remove(el.lastChild)
			}
			!keepFirst && el.parentElement && el.parentElement.removeChild(el)
		},
		forget=function(el, opt){
			remove(el, !!opt.el)
			unstyle(opt.style)
		},
		get=function(opt){
			if (!opt) return
			if (opt instanceof HTMLElement) return opt
			var el=opt.el
			if (el){
				if (el.charAt) el=document.querySelector(el)
			}else{
				el=document.createElement(opt.tag || opt.tagName || 'div')
			}
			setId(el,opt.id)
			setClasses(el.classList, opt.class || opt.className)
			setDataset(el.dataset,opt.data || opt.dataset)
			setAttributes(el,opt)
			style(opt.style)
			return setContent(el,opt.content)
		},
		gets=function(el,opts,i){
			if (i >= opts.length) return el
			el.appendChild(get(opts[i++]))
			return gets(el,opts,i)
		},
		setId=function(el,id){
			if (id) el.id=id
		},
		setClasses=function(cl,classes){
			if (!classes || !classes.length) return
			cl.add.apply(cl,Array.isArray(classes)?classes:classes.split(' '))
		},
		setDataset=function(dataset, obj){
			if (!obj) return
			for(var i=0,keys=Object.keys(obj),k; (k=keys[i]); i++){
				dataset[k]=obj[k]
			}
		},
		setAttributes=function(el,attributes){
			if (!attributes) return
			for(var i=0,keys=Object.keys(attributes),k,a; (k=keys[i]); i++){
				if (~NOTATTRIBS.indexOf(k)) continue
				a=attributes[k]
				if (null==a) el.removeAttribute(k)
				else el.setAttribute(k,a)
			}
		},
		setContent=function(el,content){
			if (null==content) return el
			if (content.charAt){
				el.innerHTML=content
			}else{
				return gets(el,content,0)
			}
			return el
		},
		style= function(style){
			if (!style) return

			var keys = Object.keys(style)
			for (var i = 0, src, ele; (src = keys[i]); i++){
				ele=head.querySelector('style[src="' + src + '"]')
				if (ele) {
					ele.dataset.rc = 1 + parseInt(ele.dataset.rc)
					continue
				}
				ele=document.createElement('style')
				ele.setAttribute('src', src)
				ele.dataset.rc=1
				ele.appendChild(document.createTextNode(style[src]))
				head.appendChild(ele)
			}
		},
		unstyle= function(style){
			if (!style) return
			var keys = Object.keys(style)
			for (var i = 0, src, ele, ds; (src = keys[i]); i++){
				ele = head.querySelector('style[src="' + src + '"]')
				if (!ele) continue
				ds=ele.dataset
				ds.rc=parseInt(ds.rc) - 1
				if (!ds.rc) ele.parentNode.removeChild(ele)
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
				head.insertBefore(ref, head.lastChild)
				return
			case 'css':
				ref=document.createElement('link')
				ref.setAttribute('rel', 'stylesheet')
				ref.setAttribute('href', url)
				head.insertBefore(ref, head.lastChild)
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
			for (var i=suspects.length-1,s,a; (s=suspects[i]); i--){
				a=s.getAttribute(attr)
				if (a && ~a.indexOf(url)) s.parentNode.removeChild(s)
			}
		},
		setId:setId,
		setClasses:setClasses,
		setAttributes:setAttributes,
		setContent:setContent,
		get:get,
		forget:forget,
		style: style,
		unstyle: unstyle
	}
}()
