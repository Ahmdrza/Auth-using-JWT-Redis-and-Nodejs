const { verifyToken } = require('../../services/jwt/jwt.service');

exports.auth = (req, res, next) => {
    try {
        verifyToken(req.body.token);
        next();
    } catch (error) {
        console.log('error', error.message);
        res.status(401).json({
            status: 'Unauthorized',
        });
    }
}