(function() {
  Tinytest.add('mongo-counter', function(test) {
    deleteCounters();
    test.equal(incrementCounter('foo'), 1);
    test.equal(incrementCounter('foo'), 2);
    test.equal(incrementCounter('foo'), 3);
    test.equal(incrementCounter('foo', 10), 13);
    test.equal(decrementCounter('foo'), 12);
    setCounter('foo', 100);
    test.equal(incrementCounter('foo'), 101);
    return test.equal(incrementCounter('bar'), 1);
  });

}).call(this);
