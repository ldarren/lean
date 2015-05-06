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
    function flip(e){
        var
        book = e.target,
        page = e.detail.page,
        currPage = book.querySelector('.lnPage')

        if (!book || !page) return

        if (!currPage){
            page.classList.add('lnPage')
            book.appendChild(page)
            return book.dispatchEvent(__.createEvent('flipped'))
        }

        currPage.addEventListener(transitionend, function cb(e){
            currPage.removeEventListener(transitionend, cb)
            book.dispatchEvent(__.createEvent('flipped', {page:currPage}))
            currPage = undefined
        }, false)

        switch(e.detail.from){
        case 'right': attr='left'; px=currPage.offsetWidth; break
        case 'left': attr='left'; px=-currPage.offsetWidth; break
        case 'bottom': attr='top'; px=currPage.offsetHeight; break
        case 'top': attr='top'; px=-currPage.offsetHeight; break
        }

        page.style[attr] = px+'px'
        page.classList.add('lnPage')
        book.appendChild(page)

        page.offsetWidth // reflow

        page.style[attr] = ''
        currPage.style[attr] = (-px)+'px'
    }
    function reset(){
        for(var i=0,ss=document.querySelectorAll('.lnBook'),s; s=ss[i]; i++){
            s.addEventListener('flip', flip, false)
        }
    }
    reset()
    document.addEventListener('lnReset', reset, false)
}()
