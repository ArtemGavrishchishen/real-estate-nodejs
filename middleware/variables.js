const role = require('../_helpers/role');

module.exports = function (req, res, next) {
  if (req.session.isAuthenticated) {
    res.locals.isAuth = req.session.isAuthenticated;
    res.locals.isSeller = req.session.user.role === role.seller;
    res.locals.isCustomer = req.session.user.role === role.customer;
  }

  next();
};
