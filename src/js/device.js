!function(){ 'use strict'
    function setup(){
		__.device=__.dotchain(window,['device']) || (function(n, models){
			var
			ua=n.userAgent,
			NA='',
			v=NA,m

			for(var i=0,idx,str; m=models[i]; i++){
				idx=ua.indexOf(m)
				if (~idx) {
        			v=ua.substr(idx+m.length+1).split(/[ ;]+/,1)[0]
					break
				}
			}
			return {
				model:m||NA,
				version:v,
				platform:'web',
				manufacturer:n.vendor||NA,

				cordova:0,
				uuid:Math.random().toString(36).substr(2)+Date.now().toString(36),
				isVirtual:!1,
				serial:NA
			}
		})(navigator, ['Trident','Edge','Chromium','Chrome','Safari','Firefox','OPR','Opera'])
    }
	__.onReady(setup)
}()
