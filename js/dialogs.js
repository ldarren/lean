!function(){
    function setup(){
		var n=__.dotchain(window,['navigator','notification'])
		if (n) {
			__.dialogs={
				alert:function(msg,title,btn,cb){ n.alert(msg,cb||__.dummyCB,title,btn) },
				confirm:function(msg,title,btns,cb){ n.confirm(msg,cb,title,btns) },
				prompt:function(msg,title,btns,comment,cb){ n.prompt(msg,cb,title,btns,comment) },
				beep:function(times){ n.beep(times) }
			}
		}else{
			__.dialogs={
				alert:function(msg,title,btn,cb){ setTimeout(function(){alert(msg); (cb||__.dummyCB)()},0) },
				confirm:function(msg,title,btns,cb){ setTimeout(function(){cb(confirm(msg)?1:2)},0) },
				prompt:function(msg,title,btns,comment,cb){ setTimeout(function(){
					var m=prompt(msg,comment)
					cb({buttonIndex:m?1:2,input1:m})
				},0) },
				beep:function(){console.log('beep')}
			}
		}
    }
	__.onReady(setup)
}()
