!function(){
	__.dom={
		// http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
		link: function(url, type, cb){
			var
			h = document.head||document.getElementsByTagName('head')[0],
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
			default:return
			}
			//search backwards within nodelist for matching elements to remove
			for (var s,a; s=suspects[i]; i--){
				a=s.getAttribute(attr)
				//remove element by calling parentNode.removeChild()
				if (a && ~a.indexOf(url)) s.parentNode.removeChild(s)
			}
		},
		style: function(id,css){
			var
			head=document.head || document.getElementsByTagName('head')[0],
			ele=document.createElement('style')
			ele.setAttribute('id',id)
			ele.appendChild(document.createTextNode(css))
			head.appendChild(ele)
		},
		unstyle: function(id){
			var
			head=document.head || document.getElementsByTagName('head')[0],
			ele=head.getElementById(id)
			if (ele) ele.parentNode.removeChild(ele)
		}
    }
}()
