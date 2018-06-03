module.exports = function then(callback) {
  this.subscribers.then.push(callback);
  return this;
};