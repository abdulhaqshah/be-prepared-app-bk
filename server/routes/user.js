const express = require('express');
const router = express.Router();
const user_controller = require('../libs/userlibs');

router.post('/user/register', user_controller.register);
router.post('/user/login', user_controller.login);

module.exports = router;