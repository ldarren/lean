!function(){
    function flip(e){
        var
        book = e.target,
        page = e.detail.page,
        currPage = book.querySelector('.__page')

        if (!book || !page) return

        if (!currPage){
            page.classList.add('__page')
            book.appendChild(page)
            return book.dispatchEvent(__.createEvent('__flipped'))
        }

        currPage.addEventListener(__.env.transitionEnd, function cb(e){
            currPage.removeEventListener(__.env.transitionEnd, cb)
            book.dispatchEvent(__.createEvent('__flipped', {page:currPage}))
            currPage = undefined
        }, false)

        switch(e.detail.from){
        case 'right': attr='left'; px=currPage.offsetWidth; break
        case 'left': attr='left'; px=-currPage.offsetWidth; break
        case 'bottom': attr='top'; px=currPage.offsetHeight; break
        case 'top': attr='top'; px=-currPage.offsetHeight; break
        }

        page.style[attr] = px+'px'
        page.classList.add('__page')
        book.appendChild(page)

        page.offsetWidth // reflow

        page.style[attr] = ''
        currPage.style[attr] = (-px)+'px'
    }
    function reset(){
        for(var i=0,ss=document.querySelectorAll('.__book'),s; s=ss[i]; i++){
            s.addEventListener('__flip', flip, false)
        }
    }
    reset()
    document.addEventListener('__reset', reset, false)
}()
