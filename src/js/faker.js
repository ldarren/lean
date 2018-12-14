!function(){
	'use strict'
	if (__.detectEvent('touchstart')) return

	var
		opt=__.env.supportPassive?{capture:true,passive:true}:true,
		md='mousedown',
		mu='mouseup',
		mm='mousemove',
		ts='touchstart',
		te='touchend',
		tm='touchmove',
		dispatchTouch = function(e){
			var name

			switch(e.type){
			case md: name = ts; break
			case mu: name = te; break
			case mm: name = tm; break
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
			document.removeEventListener(md, touchstart, opt)
			document.removeEventListener(mm, touchmove, opt)
			document.removeEventListener(mu, touchend, opt)
		},
		touchstart = function(e){
			clearAll()
			document.addEventListener(mm, touchmove,  opt)
			document.addEventListener(mu, touchend,  opt)
			dispatchTouch(e)
		},
		touchmove = function(e){
			dispatchTouch(e)
		},
		touchend = function(e){
			clearAll()
			document.addEventListener(md, touchstart,  opt)
			dispatchTouch(e)
		}
	document.addEventListener(md, touchstart,  opt)
}()
