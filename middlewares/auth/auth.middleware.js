const { verifyToken } = require('../../services/jwt/jwt.service')

exports.auth = async (req, res, next) => {
    try {
        await verifyToken(req.body.token)
        next()
    } catch (error) {
        console.log('error', error.message)
        res.status(401).json({
            status: 'Unauthorized',
            message: error.message
        })
    }
}