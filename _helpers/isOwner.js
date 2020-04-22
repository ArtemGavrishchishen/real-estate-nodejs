module.exports = function (estate, req) {
  return estate.userId.toString() === req.user._id.toString();
};
