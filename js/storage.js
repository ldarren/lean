!function(){
    function setup(){
		var
		n=__.refChain(window,['sqlitePlugin']),
		db
		if (n) {
			db=n.openDatabase({name:'localstorage.db', location:'default'})
			db.executeSql('CREATE TABLE IF NOT EXISTS kv (key TEXT UNIQUE NOT NULL, value TEXT);', console.log, console.error)
			__.storage={
				key:function(idx,cb){
					db.executeSql('SELECT key FROM KV order by oid ASC;', [], function(res){
						var rows=res.rows.item
						if (rows.length <= idx) return cb()
						cb(null,rows(idx).key)
					}, cb)
				},
				getItem:function(key,cb){
					db.executeSql('SELECT value FROM kv WHERE key=?;', [key], function(res){
						cb(null,res.rows.item(0).value)
					}, cb)
				},
				setItem:function(key,val,cb){
					db.executeSql('INSERT OR REPLACE INTO kv (key,val) VALUES (?, ?);', [key,val], cb, cb)
				},
				removeItem:function(key,cb){
					cb=cb||__.dummyCB
					db.executeSql('DELETE FROM kv WHERE key=?;', [key], cb, cb)
				},
				clear:function(cb){
					cb=cb||__.dummyCB
					db.sqlBatch([
						'DELETE FROM kv;',
						'VACUUM;'
					],cb,cb)
				},
				length:function(cb){
					db.executeSql('SELECT count(*) AS len FROM KV;', [], function(res){
						cb(null,res.rows.item(0).len)
					}, cb)
				}
			}
		}else{
			db=window.localStorage
			__.storage={
				key:function(index,cb){cb(null,db.key(key))},
				getItem:function(key,cb){cb(null,db.getItem(key))},
				setItem:function(key,val,cb){
					cb=cb||__.dummyCB
					try{cb(null,db.setItem(key,val))}
					catch(exp){cb(exp)}
				},
				removeItem:function(key,cb){
					cb=cb||__.dummyCB
					cb(null,db.removeItem(key))
				},
				clear:function(cb){
					cb=cb||__.dummyCB
					cb(null,db.clear())
				},
				length:function(cb){ cb(null,db.length) }
			}
		}
    }
	__.onLoad(setup)
}()
