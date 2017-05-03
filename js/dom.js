!function(){
	var
	head = document.head||document.getElementsByTagName('head')[0],
	NOTATTRIBS=['el','tagName','id','classNames','content'],
	setId=function(el,id){
		if (id) el.id=id
	},
	setClasses=function(cl,classNames){
		if (classNames) cl.add.apply(cl,classNames)
	},
	setAttributes=function(el,attributes){
		if (attributes)
			for(var i=0,keys=Object.keys(attributes),k,a; k=keys[i]; i++){
				if (~NOTATTRIBS.indexOf(k)) continue
				a=attributes[k]
				if (null!=a && undefined!=a) el.setAttribute(k,a)
			}
	},
	setContent=function(el,content){
		if (undefined==content || null==content) return
		if (content.charAt){
			el.innerHTML=content
		}else{
			for(var i=0,c; c=content[i]; i++) el.appendChild(c)
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
		get:function(opt){
			if (!opt) return
			var el=opt.el
			if (el){
				if (el.charAt) el=document.querySelector(el)
			}else{
				el=document.createElement(opt.tagName || 'div')
			}
			setId(el,opt.id)
			setClasses(el.classList,opt.classNames)
			setAttributes(el,opt)
			setContent(el,opt.content)

			return el
		},
		style: function(id,css){
			var ele=head.querySelector('#'+id)
			if (ele) return ele.dataset.rc=1+ele.dataset.rc
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
			ds.rc=ds.rc-1
			if (0==ds.rc) ele.parentNode.removeChild(ele)
		}
    }
}()
