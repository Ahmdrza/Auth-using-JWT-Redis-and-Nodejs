var express = require('express');
var router = express.Router();

const { register } = require('../controllers/user/user.controller');
const { auth } = require('../middlewares/auth/auth.middleware');

router.post('/signup', async (req, res, next) => {
  var userInfo = await register();
  res.status(200).json({
    status: 'SUCCESS',
    data: userInfo,
  })
});

router.post('/me', auth , (req, res, next) => {
  res.status(200).json({
    status: 'SUCCESS',
    data: 'some user info',
  })
});

module.exports = router;
