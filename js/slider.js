!function(){
    var transitionend = function(){
        var
        tmp = document.createElement('div'),
        prefixes = ['webkit', 'Moz', 'O', ' ms']
        for (var i=0,p; p=prefixes[i]; i++){
            if(('on' + p + 'transitionend') in window) return p+'TransitionEnd'
        }
        return 'transitionend'
    }()
    function transited(e){
        var ele = e.target
        ele.removeEventListener(transitionend, transited)
        ele.dispatchEvent(__.createEvent('transited'))
    }
    function transit(e){
        var
        ele = e.target,
        detail = e.detail,
        dir,dist
        ele.addEventListener(transitionend, transited, false)
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
        for(var i=0,ss=document.querySelectorAll('.lnSlider'),s; s=ss[i]; i++){
            s.addEventListener('transit', transit, false)
        }
    }
    reset()
    document.addEventListener('lnReset', reset, false)
}()
