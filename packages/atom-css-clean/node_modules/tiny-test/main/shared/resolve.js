module.exports = function resolve(value) {
  try {
    this.subscribers.then.forEach(f => f(value));
  } catch (e) {
    this.reject(e);
  }

  this.subscribers.then = [];

  return this;
};