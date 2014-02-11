var Case = require('case');


var cases = [
  Case.upper,
  Case.lower,
  Case.snake,
  Case.pascal,
  Case.camel,
  Case.constant,
  Case.title,
  Case.capital,
  Case.sentence
];


/**
 * Module exports, export
 */

module.exports = module.exports.find = multiple(find);


/**
 * Export the replacement function, return the modified object
 */

module.exports.replace = function (obj, key, val) {
  multiple(replace).apply(this, arguments);
  return obj;
};


/**
 * Export the delete function, return the modified object
 */

module.exports.del = function (obj, key) {
  multiple(del).apply(this, arguments);
  return obj;
};


/**
 * Compose applying the function to a nested key
 */

function multiple (fn) {
  return function (obj, key, val) {
    if (obj === null || obj === undefined) return;
    var keys = key.split('.');
    if (keys.length === 0) return;

    while (keys.length > 1) {
      key = keys.shift();
      obj = find(obj, key);

      if (obj === null || obj === undefined) return;
    }

    key = keys.shift();
    return fn(obj, key, val);
  };
}

/**
 * Compose applying the function to a nested index
 */

function findIndex(arr, indexes) {
  if (!arr || !indexes || !arr.length) return arr;
  while(indexes.length > 0) {
    var index = indexes.shift()[1];
    if (arr.length > index) {
      arr = arr[index];
    } else {
      return;
    }
  }
  return arr;
}

/**
 * Find an object by its key
 *
 * find({ first_name : 'Calvin' }, 'firstName')
 */

function find (obj, key) {
  var indexTraverse = key.match(/\[\d\]/g);
  key = key.split('[')[0];
  for (var i = 0; i < cases.length; i++) {
    var cased = cases[i](key);
    if (obj.hasOwnProperty(cased)) {
      return findIndex(obj[cased], indexTraverse);
    }
  }
}


/**
 * Delete a value for a given key
 *
 * del({ a : 'b', x : 'y' }, 'X' }) -> { a : 'b' }
 */

function del (obj, key) {
  for (var i = 0; i < cases.length; i++) {
    var cased = cases[i](key);
    if (obj.hasOwnProperty(cased)) delete obj[cased];
  }
  return obj;
}


/**
 * Replace an objects existing value with a new one
 *
 * replace({ a : 'b' }, 'a', 'c') -> { a : 'c' }
 */

function replace (obj, key, val) {
  for (var i = 0; i < cases.length; i++) {
    var cased = cases[i](key);
    if (obj.hasOwnProperty(cased)) obj[cased] = val;
  }
  return obj;
}
