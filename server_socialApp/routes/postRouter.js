const express = require('express');
const router = express.Router();

const postCtrl = require('../controller/postCtrl');

router.post('/create', postCtrl.createPost);
router.post('/', postCtrl.getPosts);
router.post('/:id', postCtrl.getPost);
router.post('/update', postCtrl.updatePost);
router.post('/delete', postCtrl.unfollow);

module.exports = router;
