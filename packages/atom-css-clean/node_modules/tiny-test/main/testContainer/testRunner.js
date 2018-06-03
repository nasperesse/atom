const difference = require('../shared/difference');

function Test(name) {
  this.name = name;

  this.queue = [];
  this.value = [];

  this.type = false;
  this.passed = false;

  this.index = 0;

  this.subscribers = {
    then : [],
    catch : []
  };
}

Test.prototype.isEqual = function (right) {
  this.type = 'isEqual';
  this.queue.push(right);
};

Test.prototype.isDeepEqual = function (right) {
  this.type = 'isDeepEqual';
  this.queue.push(right);
};

Test.prototype.isNotEqual = function (right) {
  this.type = 'isNotEqual';
  this.queue.push(right);
};

Test.prototype.isFailure = function (right) {
  this.type = 'isFailure';
  this.queue.push(right);
};

Test.prototype.this = function (left) {
  this.queue.push(left);
  return this;
};

Test.prototype.run = function () {
  return new Promise((resolve) => {
    this.value = [];

    function each(i) {
      if (this.queue[i]) {
        Promise.resolve(this.queue[i]())
          .then(a => {
            this.value.push(a);
            each(i + 1);
          })
          .catch(a => {
            this.value.push(a);
            each(i + 1);
          });
      } else {
        if (this.type === 'isEqual') {
          this.passed = this.value[0] === this.value[1];
        } else if (this.type === 'isDeepEqual') {
          this.passed = difference([], this.value[0], this.value[1]).length === 0;
        } else if (this.type === 'isNotEqual') {
          this.passed = this.value[0] !== this.value[1];
        } else if (this.type === 'isFailure') {
          this.passed = this.value[0] instanceof Error;
        }
        resolve();
      }
    }

    each = each.bind(this);
    each(0);
  }).catch(a => a);
};

module.exports = function testRunner(name) {
  var p = new Test(name);

  this.tests.push(p);
  p.index = this.tests.length;

  return p;
};