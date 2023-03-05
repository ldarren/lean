#!/usr/bin/env node

/* concat [src/js,src/ui,src/patch [bin/lean]] */

const
JS='.js',
MIN_JS='.min.js',
MIN_MAP=MIN_JS+'.map',
fs = require('fs'),
path = require('path'),
uglify= require('uglify-js'),
symPath = process.argv[1],
readdirs=function(wd,dirs,output,cb){
	if (!dirs.length) return cb(null, output)
	const srcDir = path.join(wd,dirs.shift())
	console.log('read dir', srcDir)
	fs.readdir(srcDir, (err, files)=>{
		if (err) return cb(err)
		for(let i=0,f; f=files[i]; i++){
			output.push(path.join(srcDir,f))
		}
		readdirs(wd,dirs,output,cb)
	})
}

let
origDirs = (process.argv[2] || path.join('src','js')).split(','),
dest = (process.argv[3] || path.join('bin','lean'))

fs.readlink(symPath, (err, realPath)=>{
	if (err) realPath = symPath
	const wd = path.dirname(realPath)
	const destAbs = path.join(wd,dest)
	console.log(`delete ${destAbs}.js`)
	fs.unlink(destAbs+JS, (err)=>{
		readdirs(wd,origDirs,[],(err, files)=>{
			if (err) return console.error(err)
			console.log(`open file ${destAbs}.js`)
			const ws = fs.createWriteStream(destAbs+JS, {flags:'a'});
			(function(cb){
				if (!files.length) return cb()
				var
				fname = files.shift(),
				callee = arguments.callee

				console.log('appending', fname, '...')
				const rs = fs.createReadStream(fname)

				rs.on('close', ()=>{ callee(cb) })
				rs.pipe(ws, {end:false})
			})(()=>{
				fs.readFile(destAbs+JS,'utf8',(err,code)=>{
					if (err) return console.error(err)
					const min=uglify.minify(code,{sourceMap:{filename:dest+MIN_JS,url:dest+MIN_MAP}})
					fs.writeFile(destAbs+MIN_JS, min.code, 'utf8', (err)=>{
						if (err) return console.error(err)
						fs.writeFile(destAbs+MIN_MAP, min.map, 'utf8', (err)=>{
							if (err) return console.error(err)
							console.log('Concat Done!')
						})
					})
				})
            })  
		})      
	})
})              
