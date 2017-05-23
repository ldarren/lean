#!/usr/bin/env node

/* concat [src/js,src/ui,src/patch [bin/lean]] */

const
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
	dest = path.join(wd,dest)
	console.log(`delete ${dest}.js`)
	fs.unlink(dest+'.js', (err)=>{
		readdirs(wd,origDirs,[],(err, files)=>{
			if (err) return console.error(err)
			console.log(`open file ${dest}.js`)
			const ws = fs.createWriteStream(dest+'.js', {flags:'a'});
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
                const min=uglify.minify(dest+'.js',{outSourceMap:dest+'.min.js.map'})
                fs.writeFile(dest+'.min.js', min.code, 'utf8', (err)=>{
                    if (err) return console.error(err)
                    fs.writeFile(dest+'.min.js.map', min.map, 'utf8', (err)=>{
                        if (err) return console.error(err)
                        console.log('Done!')
                    })
                })
            })  
		})      
	})
})              
