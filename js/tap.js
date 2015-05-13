!function(){
    var
    cancelled = false,
    longTapTimer = 0,
    lastTap = 0,
    longTap = function(e){
        if (cancelled) return
        cancelled = true
        e.target.dispatchEvent(__.createEvent('longTap', null, true))
    }
    touchstart = function(e){
        cancelled = false
        lastDown = window.setTimeout(longTap, 2000, e)
    },
    touchend = function(e){
        window.clearTimeout(longTapTimer)
        if (cancelled) return
        var
        evt = 'tap',
        now = Date.now()
        if (now - lastTap < 500) evt='taps'
        e.target.dispatchEvent(__.createEvent(evt, null, true))

    },
    touchmove = function(e){
        cancelled = true 
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
