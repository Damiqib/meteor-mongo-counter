(function() {
  var callCounter, decrementCounter, deleteCounters, getCounterCollection, getRawMongoCollection, incrementCounter, setCounter, _decrementCounter, _deleteCounters, _incrementCounter, _setCounter,
    __slice = [].slice;

  getRawMongoCollection = function(collectionName) {
    if (typeof MongoInternals !== "undefined" && MongoInternals !== null) {
      return MongoInternals.defaultRemoteCollectionDriver().mongo._getCollection(collectionName);
    } else {
      return Meteor._RemoteCollectionDriver.mongo._getCollection(collectionName);
    }
  };

  getCounterCollection = function() {
    return getRawMongoCollection('awwx_mongo_counter');
  };

  callCounter = function() {
    var Counters, args, future, method, _ref;
    method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    Counters = getCounterCollection();
    if (Meteor._wrapAsync != null) {
      return Meteor._wrapAsync(_.bind(Counters[method], Counters)).apply(null, args);
    } else {
      future = new (Npm.require(Npm.require('path').join('fibers', 'future')))();
      (_ref = Counters[method]).call.apply(_ref, [Counters].concat(__slice.call(args), [future.resolver()]));
      return future.wait();
    }
  };

  _deleteCounters = function() {
    return callCounter('remove', {}, {
      safe: true
    });
  };

  _incrementCounter = function(counterName, amount) {
    var newDoc;
    if (amount == null) {
      amount = 1;
    }
    newDoc = callCounter('findAndModify', {
      _id: counterName
    }, null, {
      $inc: {
        seq: amount
      }
    }, {
      "new": true,
      upsert: true
    });
    return newDoc.seq;
  };

  _decrementCounter = function(counterName, amount) {
    if (amount == null) {
      amount = 1;
    }
    return _incrementCounter(counterName, -amount);
  };

  _setCounter = function(counterName, value) {
    callCounter('update', {
      _id: counterName
    }, {
      $set: {
        seq: value
      }
    });
  };

  if (typeof Package !== "undefined" && Package !== null) {
    incrementCounter = _incrementCounter;
    decrementCounter = _decrementCounter;
    setCounter = _setCounter;
    deleteCounters = _deleteCounters;
  } else {
    this.incrementCounter = _incrementCounter;
    this.decrementCounter = _decrementCounter;
    this.setCounter = _setCounter;
    this.deleteCounters = _deleteCounters;
  }

}).call(this);
