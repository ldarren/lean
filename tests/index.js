const { test } = pico.export('pico/test')

test('ensure __.escapeXML work correctly', cb => {
	const unsafe = "<script>alert('gotcha')</script>"
	const safe = __.escapeXML(unsafe)
	cb(null, -1 === safe.indexOf('<script>'))
})
test('ensure __.formdata2json work correctly', cb => {
	const formdata = new FormData
	formdata.append('uid', 'hello')
	formdata.append('passwd', 'world')
	let json = __.formdata2json(formdata)
	if (formdata.get('uid') !== json.uid || formdata.get('passwd') !== json.passwd) return cb(null, false)

	const ele = document.createElement('form')
	ele.innerHTML = `
<label for="uid">name:</label><input type="text" name="uid" value="hello">
<label for="passwd">password:</label><input type="text" name="passwd" value="world">
<input type="submit" value="Submit!">
  `
	json = __.formdata2json(ele)
	cb(null, formdata.get('uid') === json.uid && formdata.get('passwd') === json.passwd)
})
test('ensure __.ajax get with baseurl work correctly', cb => {
	const req = {i: '1'}
	const xhr = __.ajax('GET', '/get', req, {baseurl: 'https://httpbin.org'}, (err, state, json) => {
		if (4 !== state) return
		const res = JSON.parse(json)
		cb(err, req.i === res.args.i)
	})
})
test('ensure __.ajax post work correctly', cb => {
	const req = JSON.stringify({i: '1'})
	const xhr = __.ajax('POST', 'https://httpbin.org/post', req, null, (err, state, json) => {
		if (4 !== state) return
		const res = JSON.parse(json)
		cb(err, req === res.data)
	})
})
test('ensure __.ajax post json work correctly', cb => {
	const req = {i: '1'}
	const xhr = __.ajax('POST', 'https://httpbin.org/post', req, {headers:{'Content-Type':'application/json'}}, (err, state, json) => {
		if (4 !== state) return
		const res = JSON.parse(json)
		cb(err, req.i === res.json.i)
	})
})
test('ensure __.ajax post formdata work correctly', cb => {
	const ele = document.createElement('form')
	ele.innerHTML = '<input type="text" name="i" value="1">'
	const xhr = __.ajax('POST', 'https://httpbin.org/post', ele, {headers:{'Content-Type':'application/json'}}, (err, state, json) => {
		if (4 !== state) return
		const res = JSON.parse(json)
		cb(err, (new FormData(ele)).get('i') === res.json.i)
	})
})
test('ensure __.ajax get with opt.query', function(cb){
	__.ajax('get', 'https://httpbin.org/anything', {q1:1}, {query: {q2:2}}, (err,code,json)=>{
		if (4!==code) return
		if (err) return cb(err)
		try{
			var {args}=JSON.parse(json)
		} catch(e){
			return cb(e)
		}
		cb(null, args.q1 === '1' && args.q2 === '2')
	})
})
test('ensure __.ajax post with opt.query', function(cb){
	__.ajax('post', 'https://httpbin.org/anything', {q1:1}, {query: {q2:2}}, (err,code,json)=>{
		if (4!==code) return
		if (err) return cb(err)
		try{
			var {args}=JSON.parse(json)
		} catch(e){
			return cb(e)
		}
		cb(null, !args.q1 && args.q2 === '2')
	})
})
test('ensure __.ajax redirect by default', function(cb){
	// xhr auto redirect 302 and 304, therefore 300 is used here
	__.ajax('get', 'https://httpbin.org/redirect-to', {url: 'http://checkip.amazonaws.com', status_code: 300}, null, (err,code,body,xhr)=>{
		if (4!==code) return
		if (err) return cb(err)
		const ip = body.replace(/(\r\n|\n|\r)/gm, '')
		cb(null, 200 === xhr.status && /^((\d\d?|1\d\d|2([0-4]\d|5[0-5]))\.){3}(\d\d?|1\d\d|2([0-4]\d|5[0-5]))$/.test(ip))
	})
})
test('ensure __.ajax redirect can be turn off', function(cb){
	// xhr auto redirect 302 and 304, therefore 300 is used here
	const reqBody = {url: 'http://checkip.amazonaws.com', status_code: 300}
	__.ajax('get', 'https://httpbin.org/redirect-to', reqBody, {redirect:0}, (err,code,json,xhr)=>{
		if (4!==code) return
		if (err) return cb(err)
		cb(null, reqBody.status_code === xhr.status && xhr.getResponseHeader('location') === reqBody.url)
	})
})
test('ensure __.ajax userData in error', function(cb){
	__.ajax('get', '//httpbin.org', null, null, (err,code,json,xhr,userData)=>{
		if (4!==code) return
		if (err) return cb(null, false)
		cb(null, 'UD' === userData)
	}, 'UD')
})
test('ensure mixed query string works', function(cb){
	__.ajax('get', 'https://httpbin.org/anything?q1=1', {q2:2}, {query: {q3:3}}, (err,code,json)=>{
		if (4!==code) return
		if (err) return cb(err)
		try{
			var {args}=JSON.parse(json)
		} catch(e){
			return cb(e)
		}
		cb(null, args.q1 === '1' && args.q2 === '2' && args.q3 === '3')
	})
})
test('ensure no over encodeURLComponent', function(cb){
	__.ajax('get', 'https://httpbin.org/anything?<h1>=a,b', '<h2>=idx,id', {query: {'<h3>':'1,2,3'}}, (err,code,json)=>{
		if (4!==code) return
		if (err) return cb(err)
		try{
			var {args}=JSON.parse(json)
		} catch(e){
			return cb(e)
		}
		cb(null, args['<h1>'] === 'a,b' && args['<h2>'] === 'idx,id' && args['<h3>'] === '1,2,3')
	})
})
test('ensure __.dom dataset work correctly', cb => {
	const hello = 'world'
	const body = __.dom.get({
		el: 'body',
		data: { hello }
	})

	cb(null, hello === body.dataset.hello)
})
