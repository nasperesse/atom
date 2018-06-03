function padRight(a, n, c) {
  var s = typeof a === 'string'
    ? a
    : a.toString();

  a = s;

  s = s.replace(/\x1b/g, '').replace(/\[(36|39)m/g, '');

  return a.length > n
    ? a
    : a + new Array(n - s.length).join(c);
}

module.exports = padRight;
