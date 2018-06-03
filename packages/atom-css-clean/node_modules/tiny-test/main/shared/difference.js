module.exports = function difference(path, a, b) {
  let diff = [];

  let t = (
    typeof a === 'object'
    && typeof b === 'object'
    && Object.keys(b).length > Object.keys(a).length
      ? b
      : a
  );

  if (typeof a !== 'undefined' && typeof b !== 'undefined') {
    for (let k in t) {
      if (t.hasOwnProperty(k)) {
        if (typeof b[k] === 'object' && b[k] != null) {
          diff = diff.concat(
            difference(path.concat(k), b[k], a[k])
          );
        } else if (b[k] !== a[k]) {
          diff.push({
            path : path.concat(k).join('.'),
            left : b[k],
            right : a[k],
            object : {
              left : b,
              right : a
            }
          });
        }
      }
    }
  } else {
    diff.push({
      path : path.length ? path.join('.') : 'ROOT',
      left : b,
      right : a,
      object : {
        left : b,
        right : a
      }
    });
  }

  return diff;
};