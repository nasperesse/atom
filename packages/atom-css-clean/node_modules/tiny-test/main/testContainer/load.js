module.exports = function load() {
  const self = this;

  console.log('\n Loading tests (' + this.tests.length.toString().cyan + ')\n');

  function each(i) {
    try {
      if (self.tests[i]) {
        self.tests[i].run()
          .then(() => each(i + 1))
          .catch(() => console.log(e));
      } else {
        self.complete();
      }
    } catch (e) {
      console.log(e);
    }
  }

  each(0);
};