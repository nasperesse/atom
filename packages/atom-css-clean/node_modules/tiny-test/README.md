## TinyTest
### A small testing library

## Installation
```
npm -i -S tiny-test
```

## Clean messaging

![Alt text](https://github.com/SeanJM/tiny-test/blob/master/screenshot-1.jpg)
![Alt text](https://github.com/SeanJM/tiny-test/blob/master/screenshot-2.jpg)

## Diffs
![Alt text](https://github.com/SeanJM/tiny-test/blob/master/screenshot-3.jpg)

## Usage
```javascript
tinyTest(function (test) {
  // Equality
  test(opts.name)
    .this(function () {
      return true;
    }).isEqual(function () {
      return true;
    });

  // Deep Equality
  test(opts.name)
    .this(function () {
      return [ { isTrue : true } ];
    }).isDeepEqual(function () {
      return [ { isTrue : true } ];
    });

  // Not Equal
  test(opts.name)
    .this(function () {
      return true;
    }).isNotEqual(function () {
      return false;
    });

  // isFalure
  test(opts.name)
    .isFailure(function () {
      throw 'Error';
    });
});
```