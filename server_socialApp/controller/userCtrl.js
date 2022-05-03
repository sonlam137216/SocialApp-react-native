const User = require('../model/userModel');

const userController = {
  //auth ctrl
  register: async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    //simple validation
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: 'Missing username or password' });

    try {
      const user = await User.findOne({ username });
      if (user)
        return res
          .status(400)
          .json({ success: false, message: 'username already taken' });

      if (password !== confirmPassword)
        return res
          .status(400)
          .json({ success: false, message: 'Password does not match' });

      // all good
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        password: hashedPassword,
      });

      await newUser.save();

      res.json({
        success: true,
        message: 'user created successfully!',
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: 'Missing username ' });

    try {
      // check user existing
      const user = await User.findOne({ username });
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: 'Incorrect username' });

      const passwordValid = await bcrypt.compare(password, user.password);

      if (!passwordValid)
        return res
          .status(400)
          .json({ success: false, message: 'Incorrect  password' });

      res.json({
        success: true,
        currentUser: user,
        message: 'User logged in successfully',
        tokens,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Interal server error' });
    }
  },
  logout: async (req, res) => {},

  //user ctrl
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({
        username: { $regex: req.query.username },
      })
        .limit(10)
        .select('fullName username avatar');

      res.json({ success: true, message: 'Returned list user', users });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },
  getUser: async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await Users.findById(userId)
        .select('-password')
        .populate('followers following', '-password');
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: 'Users does not exist!' });

      res.json({ success: true, message: 'Get user successfully!', user });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { avatar, fullname, mobile, address, story, website, gender } =
        req.body;
      if (!fullname)
        return res
          .status(400)
          .json({ success: false, message: 'Please enter your full name' });

      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          avatar,
          fullname,
          mobile,
          address,
          story,
          website,
          gender,
        }
      );

      res.json({ msg: 'Update Success!' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  follow: async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await Users.find({ _id: req.params.id, followers: userId });
      if (user.length > 0)
        return res.status(500).json({ msg: 'You followed this user.' });

      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { followers: userId },
        },
        { new: true }
      ).populate('followers following', '-password');

      await Users.findOneAndUpdate(
        { _id: userId },
        {
          $push: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unfollow: async (req, res) => {
      const {userId} = req.body
    try {
      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: userId },
        },
        { new: true }
      ).populate('followers following', '-password');

      await Users.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userController;
