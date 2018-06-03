function padLeft(a, n, c) {
  var s = typeof a === 'string'
    ? a
    : a.toString();

  a = s;

  s = s.replace(/\x1b/g, '').replace(/\[(36|39)m/g, '');

  return a.length > n
    ? a
    : new Array(n - s.length).join(c) + a;
}

module.exports = padLeft;
