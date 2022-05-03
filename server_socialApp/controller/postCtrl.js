const User = require('../model/userModel');

const postController = {
  createPost: async (req, res) => {
    const { userId } = req.body;
    try {
      const { content, images } = req.body;

      if (images.length === 0)
        return res.status(400).json({ msg: 'Please add your photo.' });

      const newPost = new Posts({
        content,
        images,
        user: userId,
      });
      await newPost.save();

      res.json({
        msg: 'Created Post!',
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPosts: async (req, res) => {
    const { userId } = req.body;
    try {
      const features = new APIfeatures(
        Posts.find({
          user: [...req.user.following, userId],
        }),
        req.query
      ).paginating();

      const posts = await features.query
        .sort('-createdAt')
        .populate('user likes', 'avatar username fullname followers')
        .populate({
          path: 'comments',
          populate: {
            path: 'user likes',
            select: '-password',
          },
        });

      res.json({
        msg: 'Success!',
        result: posts.length,
        posts,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updatePost: async (req, res) => {
    try {
      const { content, images } = req.body;

      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          content,
          images,
        }
      )
        .populate('user likes', 'avatar username fullname')
        .populate({
          path: 'comments',
          populate: {
            path: 'user likes',
            select: '-password',
          },
        });

      res.json({
        msg: 'Updated Post!',
        newPost: {
          ...post._doc,
          content,
          images,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id)
        .populate('user likes', 'avatar username fullname followers')
        .populate({
          path: 'comments',
          populate: {
            path: 'user likes',
            select: '-password',
          },
        });

      if (!post)
        return res.status(400).json({ msg: 'This post does not exist.' });

      res.json({
        post,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await Posts.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      await Comments.deleteMany({ _id: { $in: post.comments } });

      res.json({
        msg: 'Deleted Post!',
        newPost: {
          ...post,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = postController;
