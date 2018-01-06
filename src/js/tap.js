// TODO: swipe, https://github.com/madrobby/zepto/blob/master/src/touch.js
!function(){ 'use strict'
    var 
    startXY,
    lastXY,
    opt=__.env.supportPassive?{capture:true,passive:true}:true,
    cancelled = 0,
    press = 1,
    longTapTimer = 0,
    lastTap = 0,
    getXY=function(touch){
        return [touch.pageX,touch.pageY]
    },      
    longTap = function(e){                                                                                                                                                                                  
        if (cancelled) return
        cancelled = 1
        e.target.dispatchEvent(__.createEvent('longTap', lastXY, true))                                                                                                                                     
    },  
    touchstart = function(e){
        cancelled = 0 
        press = 1 
        lastXY=startXY=getXY(e.touches[0])
        longTapTimer= window.setTimeout(longTap, 2000, e)
    },  
    touchend = function(e){
        window.clearTimeout(longTapTimer)
        press = 0
        if (cancelled) return
        var now = Date.now()
        if (now - lastTap < 300){
            e.target.dispatchEvent(__.createEvent('taps', lastXY, true))
            lastTap=0
        }else{
            e.target.dispatchEvent(__.createEvent('tap', lastXY, true))
            lastTap=now
        }   
    },  
    touchmove = function(e){
        var xy=getXY(e.touches[0])
        if (press) {
            e.target.dispatchEvent(__.createEvent('rub', [lastXY[0], lastXY[1], xy[0], xy[1]], true))
        }   
        if (!cancelled && (xy[0]>startXY[0]+9 || xy[0]<startXY[0]-9)) cancelled = 1
        lastXY=xy
    },  
    touchcancel = function(e){
        cancelled = 1
        press = 0 
        window.clearTimeout(longTapTimer)
    }   
    document.addEventListener('touchstart', touchstart,  opt)
    document.addEventListener('touchend', touchend,  opt)
    document.addEventListener('touchmove', touchmove,  opt)
    document.addEventListener('touchcancel', touchcancel,  opt)
}()
