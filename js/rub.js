!function(){
    function rub(e){
    }
    function reset(){
        for(var i=0,ss=document.querySelectorAll('.__rub'),s; s=ss[i]; i++){
            s.addEventListener('mousestart', rub, false)
        }
    }
    reset()
    document.addEventListener('__reset', reset, false)
}()
