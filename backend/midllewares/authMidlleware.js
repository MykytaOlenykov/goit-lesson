const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  /*
  получаем токен и проверки
  расшифровуем токен
  возвращаем инфу из токена дальше
  */
  try {
    const [type, token] = req.headers.authorization.split(" ");

    if (type === "Bearer" && token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
    } else {
      throw new Error("Invalid token type");
    }

    next();
  } catch (error) {
    res.status(401).json({ code: 401, message: error.message });
  }
};

/* 
{
  friends: [ 'Tetiana', 'Alona', 'Nikita' ],
  id: '65059ac92765435f51bdcabf',
  iat: 1694867505,
  exp: 1694950305
}
*/
