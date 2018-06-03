require('colors');

function shortObject(obj) {
  let max = 7;
  let s = JSON.stringify(obj, null, '  ').split('\n').slice(0, max);
  let n = s.length - 1;

  s = s.map(a => {
    if (a.length > 59) {
      a = a.substring(0, 59) + '...'
    }
    return a;
  });

  if (s.length === max) {
    s.push('...');
  }

  return s.join('\n');
}

function typeToString(value) {
  if (typeof value === 'undefined') {
    return 'undefined'.grey;
  } else if (value == null) {
    return 'null'.grey;
  } else if (value instanceof Error) {
    return value.stack.toString();
  } else if (typeof value === 'object') {
    return shortObject(value);
  } else if (typeof value === 'string') {
    return '\"' + value.replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '\"';
  } else {
    return value.toString();
  }
}

module.exports = typeToString;
