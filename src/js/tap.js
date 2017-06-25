// TODO: swipe, https://github.com/madrobby/zepto/blob/master/src/touch.js
!function(){ 'use strict'
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
