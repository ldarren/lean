!function(){
    function rub(e){
    }
    function reset(){
        for(var i=0,ss=document.querySelectorAll('.lnRub'),s; s=ss[i]; i++){
            s.addEventListener('mousestart', rub, false)
        }
    }
    reset()
    document.addEventListener('lnReset', reset, false)
}()
