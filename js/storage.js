!function(){
    function setup(){
		var
		sp=__.refChain(window,['sqlitePlugin']),
		od=__.refChain(window,['openDatabase']),
		errCB=function(err){if(err)return console.error(err)},
		db

		if (sp || od){
			if (sp) db=sp.openDatabase({name:'localstorage.db', location:'default'})
			else db=openDatabase('localstorage.db', '1.0', 'lean local storage emulator', 50 * 1024 * 1024)
			db.transaction(function(tx){
				tx.executeSql('CREATE TABLE IF NOT EXISTS kv (key TEXT UNIQUE NOT NULL, val TEXT);', null, null, function(tx,err){
					console.error(err)
				})
			})
			__.storage={
				key:function(idx,cb){
					db.readTransaction(function(tx){
						tx.executeSql('SELECT key FROM KV order by oid ASC;', null, function(tx,res){
							var rows=res.rows
							if (rows.length <= idx) return cb()
							cb(null,rows[idx].key)
						}, function(tx,err){
							cb(err)
						})
					})
				},
				getItem:function(key,cb){
					db.readTransaction(function(tx){
						tx.executeSql('SELECT val FROM kv WHERE key=?;', [key], function(tx,res){
							if (!res.rows.length) return cb()
							cb(null,res.rows[0].val)
						}, function(tx,err){
							cb(err)
						})
					})
				},
				setItem:function(key,val,cb){
					cb=cb||errCB
					db.transaction(function(tx){
						tx.executeSql('INSERT OR REPLACE INTO kv (oid,key,val) VALUES ((SELECT oid FROM kv WHERE key=?), ?, ?);',
						[key,key,val],
						function(tx,res){
							cb(null, res.insertId)
						}, function(tx,err){
							cb(err)
						})
					})
				},
				removeItem:function(key,cb){
					cb=cb||errCB
					db.transaction(function(tx){
						tx.executeSql('DELETE FROM kv WHERE key=?;', [key], function(tx,res){
							cb()
						}, function(tx,err){
							cb(err)
						})
					})
				},
				clear:function(cb){
					cb=cb||errCB
					db.transaction(function(tx){
						tx.executeSql('DELETE FROM kv;',null,function(tx,res){
							cb()
						},function(tx,err){
							cb(err)
						})
					})
				},
				length:function(cb){
					db.readTransaction(function(tx){
						tx.executeSql('SELECT count(*) AS len FROM KV;', null, function(tx,res){
							cb(null,res.rows[0].len)
						}, function(tx,err){
							cb(err)
						})
					})
				}
			}
		}else{
			db=window.localStorage
			__.storage={
				key:function(index,cb){cb(null,db.key(key))},
				getItem:function(key,cb){cb(null,db.getItem(key))},
				setItem:function(key,val,cb){
					cb=cb||errCB
					try{cb(null,db.setItem(key,val))}
					catch(exp){cb(exp)}
				},
				removeItem:function(key,cb){
					cb=cb||errCB
					cb(null,db.removeItem(key))
				},
				clear:function(cb){
					cb=cb||errCB
					cb(null,db.clear())
				},
				length:function(cb){ cb(null,db.length) }
			}
		}
    }
	__.onLoad(setup)
}()
