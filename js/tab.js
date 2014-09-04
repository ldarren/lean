!function(){
    if (pico.detectEvent('touchstart')) return

    var
    cancelled = false,
    longTabTimer = 0,
    lastTab = 0,
    longTab = function(e){
        if (cancelled) return
        cancelled = true
        e.target.dispatchEvent(pico.createEvent('longTab'))
    }
    touchstart = function(e){
        cancelled = false
        lastDown = window.setTimeout(longTab, 2000, e)
    },
    touchend = function(e){
        window.clearTimeout(longTabTimer)
        if (cancelled) return
        var now = Date.now()
        if (now - lastTab < 500) e.target.dispatchEvent(pico.createEvent('tabs'))
        else e.target.dispatchEvent(pico.createEvent('tab'))

    },
    touchmove = function(e){
        cancelled = true 
    },
    touchcancel = function(e){
        cancelled = true
        window.clearTimeout(longTabTimer)
    }
    document.addEventListener('touchstart', touchstart,  true)
    document.addEventListener('touchend', touchend,  true)
    document.addEventListener('touchmove', touchmove,  true)
    document.addEventListener('touchcancel', touchcancel,  true)
}()
