module.exports = function $catch(callback) {
  this.subscribers.catch.push(callback);
  return this;
};