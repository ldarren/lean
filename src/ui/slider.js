!function(){
    function transited(e){
        var ele = e.target
        ele.removeEventListener(__.env.transitionEnd, transited)
        ele.dispatchEvent(__.createEvent('__transited'))
    }
    function transit(e){
        var
        ele = e.target,
        detail = e.detail,
        dir,dist
        ele.removeEventListener(__.env.transitionEnd, transited)
        ele.addEventListener(__.env.transitionEnd, transited, false)
        if (!detail) return ele.style.cssText = ''

        switch(detail.from){
        case 'top': dir='top', dist=detail.ref.offsetHeight; break
        case 'bottom': dir='top', dist=-detail.ref.offsetHeight; break
        case 'left': dir='left', dist=detail.ref.offsetWidth; break
        case 'right': dir='left', dist=-detail.ref.offsetWidth; break
        default: return
        }
        ele.style.cssText = dir+':'+dist+'px'
    }
    function reset(){
        for(var i=0,ss=document.querySelectorAll('.__slider'),s; s=ss[i]; i++){
            s.addEventListener('__transit', transit, false)
        }
    }
    reset()
    document.addEventListener('__reset', reset, false)
}()
