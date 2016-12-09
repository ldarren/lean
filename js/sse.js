// adapted from https://github.com/remy/polyfills/blob/master/EventSource.js
;(function (global) {

	//if (global.EventSource) return

	var
	reTrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g,
	headers={
		'Accept': 'text/event-stream',
		'Cache-Control': 'no-cache',
			// we must make use of this on the server side if we're working with Android - because they don't trigger 
			// readychange until the server connection is closed
		'X-Requested-With': 'XMLHttpRequest'
	},
	EventSource = function (url) {
		var
		eventsource = this,  
		interval = 500, // polling interval  
		lastEventId = null,
		lastPos= 0

		if (!url || typeof url != 'string') throw new SyntaxError('Not enough arguments')

		this.URL = url
		this.readyState = EventSource.CONNECTING
		this._pollTimer = null
		this._xhr = null

		function pollAgain(interval) {
			eventsource._pollTimer = setTimeout(function(){ poll.call(eventsource) }, interval)
		}

		function poll() {
			if (eventsource.readyState == EventSource.CLOSED) return

			lastPos= 0
			eventsource._xhr=__.ajax('GET',eventsource.URL,null,{
				timeout:180000,
				headers:(lastEventId===null)?headers:Object.assign(headers,{'Last-Event-ID': lastEventId})
			},function(err,state,response){
				if (state === 3 || (state === 4 && !err)) {
					// on success
					if (eventsource.readyState == EventSource.CONNECTING) {
						eventsource.readyState = EventSource.OPEN
						eventsource.dispatchEvent('open', { type: 'open',target:eventsource })
					}

					var
					parts = response.substr(lastPos).split('\n'),
					eventType = 'message',
					data = []

					lastPos= response.length

					// TODO handle 'event' (for buffer name), retry
					for (var i=0,l=parts.length,line; i < l; i++) {
						line = parts[i].replace(reTrim, '')
						if (line.indexOf('event') == 0) {
							eventType = line.replace(/event:?\s*/, '')
						} else if (line.indexOf('retry') == 0) {                           
							retry = parseInt(line.replace(/retry:?\s*/, ''))
							if(!isNaN(retry)) { interval = retry }
						} else if (line.indexOf('data') == 0) {
							data.push(line.replace(/data:?\s*/, ''))
						} else if (line.indexOf('id:') == 0) {
							lastEventId = line.replace(/id:?\s*/, '')
						} else if (line.indexOf('id') == 0) { // this resets the id
							lastEventId = null
						} else if (line == '' && data.length) {
							eventsource.dispatchEvent(eventType, {
								type:eventType,
								data:data.join('\n'),
								origin:eventsource.URL,
								lastEventId:lastEventId || '',
								target:eventsource
							})
							data = []
							eventType = 'message'
						}
					}

					if (4===state) {
						eventsource.readyState = EventSource.CLOSED
						eventsource.dispatchEvent('error', { type: 'error',target:eventsource })
					}
					// don't need to poll again, because we're long-loading
				} else if (eventsource.readyState !== EventSource.CLOSED) {
					switch(state) { // and some other status
					case 4:	// dispatch error
						eventsource.readyState = EventSource.CONNECTING
						eventsource.dispatchEvent('error', { type: 'error',target:eventsource })
						pollAgain(interval)
						break
					case 0: // likely aborted
						pollAgain(interval)
						break
					}
				}
			})
		}

		poll() // init now
	}

	EventSource.CONNECTING= 0
	EventSource.OPEN= 1
	EventSource.CLOSED= 2

	EventSource.prototype = {
		close: function (){
			// closes the connection - disabling the polling
			this.readyState = this.CLOSED
			clearInterval(this._pollTimer)
			this._xhr.abort()
		},
		dispatchEvent: function (type, event) {
			var handlers = this['_' + type + 'Handlers']
			if (handlers) {
				for (var i = 0,l=handlers.length; i < l; i++) {
					handlers[i].call(this, event)
				}
			}

			if (this['on' + type]) this['on' + type].call(this, event)
		},
		addEventListener: function (type, handler) {
			if (!this['_' + type + 'Handlers']) {
				this['_' + type + 'Handlers'] = []
			}

			this['_' + type + 'Handlers'].push(handler)
		},
		removeEventListener: function (type, handler) {
			var handlers = this['_' + type + 'Handlers']
			if (!handlers) return
			for (var i = handlers.length - 1; i >= 0; --i) {
				if (handlers[i] === handler) {
					handlers.splice(i, 1)
					break
				}
			}
		},
		onerror: null,
		onmessage: null,
		onopen: null,
		readyState: 0,
		URL: ''
	}

	if (global.module) module.exports = EventSource
	global.EventSource = EventSource
})(this)
