module.exports = (err, req, res, next) => {
    const code = err.code || res.statusCode || 500;
    res.status(code).json({
        code,
        stack: err.stack
    })
}