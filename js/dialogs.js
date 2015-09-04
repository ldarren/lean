!function(){
	__.dialogs={
		alert:function(msg,title,btn,cb){ setTimeout(function(){alert(msg); (cb||__.dummyCB)()},0) },
		confirm:function(msg,title,btns,cb){ setTimeout(function(){cb(null,confirm(msg))},0) },
		prompt:function(msg,title,btns,comment,cb){ setTimeout(function(){cb(null,prompt(msg,comment))},0) },
		beep:function(){console.log('beep')}
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
