const keys = require('../keys');

module.exports = function (req, res, next) {
  if (req.session.isAuthenticated) {
    res.locals.isAuth = req.session.isAuthenticated;
    res.locals.isSeller = req.session.user.role === keys.ROLE.seller;
    res.locals.isCustomer = req.session.user.role === keys.ROLE.customer;
  }

  next();
};
