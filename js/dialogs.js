!function(){
	__.dialogs={
		alert:function(msg,title,btn,cb){ alert(msg); (cb||__.dummyCB)() },
		confirm:function(msg,title,btns,cb){ cb(null,confirm(msg)) },
		prompt:function(msg,title,btns,comment,cb){ cb(null,prompt(msg,comment)) },
		beep:function(){}
	}
    function setup(){
		var n=__.refChain(window,['navigator','notification'])
		if (!n) return
		__.dialogs={
			alert:function(msg,title,btn,cb){ n.alert(msg,cb||__.dummyCB,title,btn) },
			confirm:function(msg,title,btns,cb){ n.confirm(msg,cb,title,btns) },
			prompt:function(msg,title,btns,comment,cb){ n.prompt(msg,cb,title,btns,confirms) },
			beep:function(times){ n.beep(times) }
		}
    }
	__.onLoad(setup)
}()
