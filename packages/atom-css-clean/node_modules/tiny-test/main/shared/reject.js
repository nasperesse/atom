module.exports = function reject(reason) {
  try {
    this.subscribers.catch.forEach(f => f(reason));
  } catch (e) {
    this.reject(e);
  }

  this.subscribers.catch = [];

  return this;
};