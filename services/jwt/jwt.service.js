var jwt = require('jsonwebtoken')

const { jwtConfig } = require('../../config/jwt.config')
const { redisClient } = require('../../config/redis.config')

exports.generateToken = () => {
    return new Promise((resolve, reject) => {
        const msBeforeTokenGenerated = new Date().getTime()
        const token = jwt.sign({ _uid: 1 }, jwtConfig.secret)

        
        const msAfterTokenGenerated = new Date().getTime()
        let timeElapsed = msAfterTokenGenerated - msBeforeTokenGenerated
        timeElapsed = ((timeElapsed % 60000) / 1000).toFixed(0) //convert ms to sec
        let expTime = 60 * 60 * 24
        expTime = expTime - timeElapsed

        const currentTime = Math.floor(new Date().getTime() / 1000)
        const nextDay = currentTime + 86400
    
        const data = {
            lastRefresh: currentTime,
            expiryTime: nextDay
        }

        redisClient.set(token, JSON.stringify(data), 'EX', expTime, (err) => {
            if (err) {
                console.log('redis error', err)
                reject('REDIS ERROR')
            }
            resolve(token)
        })
    })
}

exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtConfig.secret)
        redisClient.get(token, function(err, reply) {
            if (err) reject({message: 'token not found'})
            if (reply) {
                const tokenData = JSON.parse(reply)
                let expiryTime = tokenData.expiryTime
                var currentTime = Math.floor(new Date().getTime() / 1000)
                const diff = expiryTime - currentTime
                if (diff < 0) {
                    reject({message: 'token expired'})
                }
    
                if (diff < 3600) {
                    const newCurrentTime = Math.floor(new Date().getTime() / 1000)
                    expiryTime = newCurrentTime + 86400
                }
    
                const updatedData = {
                    ...tokenData,
                    lastRefresh: Math.floor(new Date().getTime() / 1000),
                    expiryTime: expiryTime
                }
                
                redisClient.set(token, JSON.stringify(updatedData), 'EX', expiryTime, (err) => {
                    if (err) {
                        console.log('redis error', err)
                        reject({message: 'REDIS ERROR'})
                    }
                    resolve('success')
                })
            } else {
                reject({message: 'token not found'})
            }
        })
    })
}