const express = require('express');
const router = express.Router();

const userCtrl = require('../controller/userCtrl');

router.post('/login', userCtrl.login);
router.post('/register', userCtrl.register);
router.post('/', userCtrl.getUser);
router.post('/follow', userCtrl.follow);
router.post('/unfollow', userCtrl.unfollow);

module.exports = router;
