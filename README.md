#mongo-oplog-observable

Creates an observable from a mongodb-oplog.


# Install

`npm install --save mongo-oplog-observable`


# Usage

## OplogObservable(mongoURI, namespace)

- **mongoURI** [String] [mongodb connection-string](https://docs.mongodb.org/manual/reference/connection-string/)
- **namespace** [String] database, database.*, *.database, (databaseA|databaseB), database.collection, (db|dbX|dbY)$, etc.



## Examples

```javascript
var OplogObservable = require('mongo-oplog-observable');

var oplog = OplogObservable('mongodb://127.0.0.1:12345/local', 'myDatabase.myCollection');

var inserts = oplog.filter(function(e){ return e.op === 'i'; });
var updates = oplog.filter(function(e){ return e.op === 'u'; });
var deletes = oplog.filter(function(e){ return e.op === 'd'; });

oplog.subscribe(
	function onNext(event){
		console.log('Next');
		console.log(event);
	},
	function onError(err){
		console.log('Error');
		console.log(err);
	},
	function onCompleted() {
		console.log('Completed');
	}
);

```



#Author

Christian Blaschke <mail@platdesign.de>
