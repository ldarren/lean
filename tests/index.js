const { ensure } = pico.export('pico/test')

ensure('ensure __.escapeXML work correctly', cb => {
	const unsafe = "<script>alert('gotcha')</script>"
	const safe = __.escapeXML(unsafe)
	cb(null, -1 === safe.indexOf('<script>'))
})
ensure('ensure __.ajax get work correctly', cb => {
	const req = {hello: 'world'}
	const xhr = __.ajax('GET', 'https://httpbin.org/get', req, null, (err, state, json) => {
		if (4 !== state) return
		const res = JSON.parse(json)
		cb(err, req.hello === res.args.hello)
	})
})
ensure('ensure __.ajax post work correctly', cb => {
	const req = {hello: 'world'}
	const xhr = __.ajax('POST', 'https://httpbin.org/post', req, {headers:{'Content-Type':'application/json'}}, (err, state, json) => {
		if (4 !== state) return
		const res = JSON.parse(json)
		cb(err, req.hello === res.json.hello)
	})
})
ensure('ensure __.dom dataset work correctly', cb => {
	const hello = 'world'
	const body = __.dom.get({
		el: 'body',
		data: { hello }
	})

	cb(null, hello === body.dataset.hello)
})
