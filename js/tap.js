!function(){
    var
	move=0,
    cancelled = false,
    longTapTimer = 0,
    lastTap = 0,
    longTap = function(e){
        if (cancelled) return
        cancelled = true
        e.target.dispatchEvent(__.createEvent('longTap', null, true))
    },
    touchstart = function(e){
        cancelled = false
		move=0
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
		if (++move > 9) cancelled = true 
    },
    touchcancel = function(e){
        cancelled = true
        window.clearTimeout(longTapTimer)
    }
    document.addEventListener('touchstart', touchstart,  true)
    document.addEventListener('touchend', touchend,  true)
    document.addEventListener('touchmove', touchmove,  true)
    document.addEventListener('touchcancel', touchcancel,  true)
}()
