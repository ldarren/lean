!function(){
    if (pico.detectEvent('touchstart')) return

    var
    dispatchTouch = function(e){
        var name

        switch(e.type){
        case 'mousedown': name = 'touchstart'; break
        case 'mouseup': name = 'touchend'; break
        case 'mousemove': name = 'touchmove'; break
        case 'mouseout': name = 'touchcancel'; break
        default: return console.error('wrong event: '+e.type)
        }

        var
        ele = e.target,
        touches = []

        touches[0] = {}
        touches[0].pageX = e.pageX
        touches[0].pageY = e.pageY
        touches[0].target = ele

        ele.dispatchEvent(new Event(name, {
            bubbles: e.bubbles,
            cancelable: e.cancelable,
            details:{
                target: ele,
                srcElement: e.srcElement,
                touches: touches,
                changedTouches: touches,
                targetTouches: touches,
                mouseToTouch: true
            }   
        }))
    },
    touchstart = function(e){
        document.removeEventListener('mousedown', touchstart)
        document.addEventListener('mousemove', touchmove,  true)
        document.addEventListener('mouseup', touchend,  true)
        document.addEventListener('mouseout', touchcancel,  true)
        dispatchTouch(e)
    },
    touchmove = function(e){
        dispatchTouch(e)
    },
    touchend = function(e){
        document.addEventListener('mousedown', touchstart,  true)
        document.removeEventListener('mousemove', touchmove)
        document.removeEventListener('mouseup', touchend)
        document.removeEventListener('mouseout', touchcancel)
        dispatchTouch(e)
    },
    touchcancel = function(e){
        document.addEventListener('mousedown', touchstart,  true)
        document.removeEventListener('mousemove', touchmove)
        document.removeEventListener('mouseup', touchend)
        document.removeEventListener('mouseout', touchcancel)
        dispatchTouch(e)
    }
    document.addEventListener('mousedown', touchstart,  true)
}()
