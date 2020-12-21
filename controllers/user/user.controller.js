const { generateToken } = require('../../services/jwt/jwt.service');

exports.register = () => {
    return new Promise(async(resolve, reject) => {
        try {
            resolve(await generateToken());
        } catch (error) {
            reject(error);
        }
    })
};