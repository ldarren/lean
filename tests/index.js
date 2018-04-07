const { ensure } = pico.export('pico/test')

ensure('ensure __.escapeXML work correctly', cb => {
	const unsafe = "<script>alert('gotcha')</script>"
	const safe = __.escapeXML(unsafe)
	cb(null, -1 === safe.indexOf('<script>'))
})
ensure('ensure __.ajax work correctly', cb => {
	var xhr = __.ajax('POST', 'https://httpbin.org/post', 'WORK', null, (err, state, res) => {
		if (4 !== state) return
		cb(err, -1 !== res.indexOf('WORK'))
	})
})
