!function(){
    function setup(){
		var
		sp=__.dotchain(window,['sqlitePlugin']),
		od=__.dotchain(window,['openDatabase']),
		errCB=function(err){if(err)return console.error(err)},
		dbs={},
		store

		if (sp || od){
			store=function(name){
				var db
				if (sp) db=sp.openDatabase({name:name, location:'default'})
				else db=openDatabase(name, '1.0', 'lean local storage emulator', 50 * 1024 * 1024)
				db.transaction(function(tx){
					tx.executeSql('CREATE TABLE IF NOT EXISTS kv (key TEXT UNIQUE NOT NULL, val TEXT);',
					null,
					null,
					function(tx,err){console.error(err)})
				})
				this.db=db
			}
			store.prototype={
				key:function(idx,cb){
					this.db.readTransaction(function(tx){
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
					this.db.readTransaction(function(tx){
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
					this.db.transaction(function(tx){
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
					this.db.transaction(function(tx){
						tx.executeSql('DELETE FROM kv WHERE key=?;', [key], function(tx,res){
							cb()
						}, function(tx,err){
							cb(err)
						})
					})
				},
				clear:function(cb){
					cb=cb||errCB
					this.db.transaction(function(tx){
						tx.executeSql('DELETE FROM kv;',null,function(tx,res){
							cb()
						},function(tx,err){
							cb(err)
						})
					})
				},
				length:function(cb){
					this.db.readTransaction(function(tx){
						tx.executeSql('SELECT count(*) AS len FROM KV;', null, function(tx,res){
							cb(null,res.rows[0].len)
						}, function(tx,err){
							cb(err)
						})
					})
				}
			}
		}else{
			store=function(name){
				this.prefix=name+'_'
				this.db=window.localStorage
			}
			store.prototype={
				key:function(index,cb){cb(null,this.db.key(index))},
				getItem:function(key,cb){cb(null,this.db.getItem(this.prefix+key))},
				setItem:function(key,val,cb){
					cb=cb||errCB
					try{cb(null,this.db.setItem(this.prefix+key,val))}
					catch(exp){cb(exp)}
				},
				removeItem:function(key,cb){
					cb=cb||errCB
					cb(null,this.db.removeItem(this.prefix+key))
				},
				clear:function(cb){
					cb=cb||errCB
					cb(null,this.db.clear())
				},
				length:function(cb){ cb(null,this.db.length) }
			}
		}
		__.store=function(name){
			name=name||'localstorage'
			return dbs[name] = dbs[name] || new store(name)
		}
    }
	__.onReady(setup)
}()
