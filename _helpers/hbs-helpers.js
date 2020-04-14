module.exports = {
  ifeq(a, b, options) {
    if (a) {
      a = a.toString();
    }
    if (b) {
      b = b.toString();
    }
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
};
