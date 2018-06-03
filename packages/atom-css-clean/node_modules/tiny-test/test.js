const tinyTest = require("./index");

tinyTest(function (test, load) {
  test("a")
    .this(function () {
      return "a";
    })
    .isEqual(function () {
      return "a";
    });

  test("b (timer)")
    .this(function () {
      return new Promise(function (resolve, reject) {
        setTimeout(() => resolve("b"), 1000);
      });
    })
    .isEqual(function () {
      return "b";
    });
  load();
});