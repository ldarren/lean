!function(){
    function setup(){
		var d=__.refChain(window,['device'])
		if (d) {
			__.device=d
		}else{
			var
			NA='',
			n=navigator,
			ua=n.userAgent,
			models=['Trident','Edge','Chromium','Chrome','Safari','Firefox','OPR','Opera'],
			v=NA,m

			for(var i=0,idx,str; m=models[i]; i++){
				idx=ua.indexOf(m)
				if (~idx) {
        			v=ua.substr(idx+m.length+1).split(/[ ;]+/,1)[0]
					break
				}
			}
			__.device={
				model:m||NA,
				platform:n.platform||NA,
				version:v,
				manufacturer:n.vendor||NA,

				cordova:0,
				uuid:Math.random().toString(36).substr(2)+Date.now().toString(36),
				isVirtual:!1,
				serial:''
			}
		}
    }
	__.onReady(setup)
}()
