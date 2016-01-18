#!/usr/bin/env node

var
fs = require('fs'),
path = require('path'),
uglify= require('uglify-js'),
symPath = process.argv[1],
dest = path.sep + (process.argv[2] || 'lean'),
srcDir = path.sep + (process.argv[3] || 'js') + path.sep

fs.readlink(symPath, function(err, realPath){
	if (err) realPath = symPath
	var wd = path.dirname(realPath)
	dest = wd + dest
	srcDir = wd + srcDir
	console.log(`delete ${dest}.js`)
	fs.unlink(dest+'.js', function(err){
		console.log('read dir', srcDir)
		fs.readdir(srcDir, function(err, files){
			if (err) return console.error(err)
			console.log(`open file ${dest}.js`)
			var ws = fs.createWriteStream(dest+'.js', {flags:'a'});
			(function(cb){
				if (!files.length) return cb()
				var
				fname = files.shift(),
				callee = arguments.callee

                if ('.'===path.basename(fname)[0]) return callee(cb)
				console.log('appending', fname, '...')
				var rs = fs.createReadStream(srcDir+fname)

				rs.on('close', function(){ callee(cb) })
				rs.pipe(ws, {end:false})
			})(function(){
                var min=uglify.minify(dest+'.js',{outSourceMap:dest+'.min.js.map'})
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
