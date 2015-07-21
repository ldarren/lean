!function(){
    if (__.detectEvent('touchstart')) return

    var
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
		evt=new Event(name, { bubbles: e.bubbles, cancelable: e.cancelable })

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
        document.addEventListener(mm, touchmove,  true)
        document.addEventListener(mu, touchend,  true)
        document.addEventListener(mo, touchcancel,  true)
        dispatchTouch(e)
    },
    touchmove = function(e){
        dispatchTouch(e)
    },
    touchend = function(e){
		clearAll()
        document.addEventListener(md, touchstart,  true)
        dispatchTouch(e)
    },
    touchcancel = function(e){
		clearAll()
        document.addEventListener(md, touchstart,  true)
        dispatchTouch(e)
    }
    document.addEventListener(md, touchstart,  true)
}()
