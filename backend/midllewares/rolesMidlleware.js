const jwt = require("jsonwebtoken");

module.exports = (rolesArr) => {
  return (req, res, next) => {
    try {
      const { roles } = req.user;
      let hasRole = false;
      roles.forEach((role) => {
        if (rolesArr.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        res.status(403);
        throw new Error("Forbidden");
      }

      next();
    } catch (error) {
      res.status(403).json({ code: 403, message: error.message });
    }
  };
};

/*
{
  friends: [ 'Tetiana', 'Alona', 'Nikita' ],
  id: '6505aa16c909d4da19a15195',
  roles: [ 'ADMIN' ],
  iat: 1694870277,
  exp: 1694953077
}
*/
