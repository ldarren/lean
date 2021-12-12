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
	__.ajax('get', 'https://httpbin.org/anything', {q1:1}, {query: {q2:2}}, (err,code,res)=>{
		if (4!==code) return
		if (err) return cb(err)
		try{
			var {args}=JSON.parse(res)
		} catch(e){
			cb(e)
		}
		cb(null, args.q1 === '1' && args.q2 === '2')
	})
})
test('ensure __.ajax post with opt.query', function(cb){
	__.ajax('post', 'https://httpbin.org/anything', {q1:1}, {query: {q2:2}}, (err,code,res)=>{
		if (4!==code) return
		if (err) return cb(err)
		try{
			var {args}=JSON.parse(res)
		} catch(e){
			cb(e)
		}
		cb(null, !args.q1 && args.q2 === '2')
	})
})
test('ensure mixed query string works', function(cb){
	__.ajax('get', 'https://httpbin.org/anything?q1=1', {q2:2}, {query: {q3:3}}, (err,code,res)=>{
		if (4!==code) return
		if (err) return cb(err)
		try{
			var {args}=JSON.parse(res)
		} catch(e){
			cb(e)
		}
		cb(null, args.q1 === '1' && args.q2 === '2' && args.q3 === '3')
	})
})
test('ensure no over encodeURLComponent', function(cb){
    __.ajax('get', 'https://httpbin.org/anything?<h1>=a,b', '<h2>=idx,id', {query: {'<h3>':'1,2,3'}}, (err,code,res)=>{
        if (4!==code) return
        if (err) return cb(err)
        try{
            var {args}=JSON.parse(res)
        } catch(e){
            cb(e)
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
