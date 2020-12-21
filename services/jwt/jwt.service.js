var jwt = require('jsonwebtoken');
const redis = require("redis");

const { jwtConfig } = require('../../config/jwt.config');

exports.generateToken = () => {
    return new Promise((resolve, reject) => {
        let msBeforeTokenGenerated = new Date().getTime();
        var token = jwt.sign({ _uid: 1 }, jwtConfig.secret, {
            expiresIn: '1d', // for more time options, check https://github.com/vercel/ms
        });

        const client = redis.createClient();
        let msAfterTokenGenerated = new Date().getTime();
        let timeElapsed = secondsAfterTokenGenerated - msBeforeTokenGenerated;
        timeElapsed = ((timeElapsed % 60000) / 1000).toFixed(0); //convert ms to sec
        let expTime = 60 * 60 * 24; // keep it same as token expire time
        expTime = expTime - timeElapsed;

        client.set('_uid1', token, 'EX', expTime, (err, result) => {
            if (err) {
                console.log('redis error', err);
                reject('REDIS ERROR');
            }
            resolve(token);
        });
    })
};

exports.verifyToken = (token) => {
    jwt.verify(token, jwtConfig.secret);
};