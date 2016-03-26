'use strict';


// Deps
var MongoClient = require('mongodb').MongoClient;
var MongoCursor = require('mongo-oplog-cursor');
var rx = require('rx');


/**
 * Creates an observable from a mongodb oplog-stream
 * @param  {Object} config uri, ns
 * @return {Object}        rx-observable
 */
module.exports = function OplogObservable(config) {

	config = config || {};

	if(!config.uri) {
		throw new Error('Missing mongodb connection uri');
	}

	return rx.Observable.create(function(observer) {

		var db, disposed;

		// Connect to given uri (e.g.: mongodb://localhost:12345/local)
		MongoClient.connect(config.uri, function(err, _db) {

			if(err) {
				return observer.onError(err);
			}

			// For the case that all subscriptions are disposed
			// until the connection is established.
			if(disposed) {
				return _db.close();
			}

			db = _db;

			MongoCursor({
				db: db,
				ns: config.ns || '*',
				ts: Date.now()/1000 | 0
			})
			.cursor(function getCursor(err, cursor) {

				// Get cursor stream
				var stream = cursor.stream();

				stream.on('data', function (data) {
					observer.onNext(data);
				});

				stream.on('error', function (err) {
					observer.onError(err);
				});

				stream.on('end', function () {

					// Maybe we should rather reconnect?
					observer.onCompleted();
				});

			});

		});

		return function cleanUp() {
			disposed = true;
			if(db) {
				db.close();
			}
		}

	}).share();

}
