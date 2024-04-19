const { User, Thoughts } = require("../models");

const userCont = {

  getAllUser(req, res) {
    User.find({})
      .select("-__v")
      .populate("friends")
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .select("-__v")
      .populate("thoughts")
      .populate("friends")
      .then((user) => {
        if (!user) {
          return res
            .status(404).json({ msg:"User Id not found" });
        }
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  createUser({ body }, res) {
    User.create(body)
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  },


  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((user) => {
        if (!user) {
          res.status(404).json({ msg:"User Id not found" });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },

  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ msg:"User Id not found" });
        }
        return Thoughts.deleteMany({ _id: { $in: user.thoughts } });
      })
      .then(() => {
        res.json({ msg: "Deleted" });
      })
      .catch((err) => res.json(err));
  },

  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((user) => {
        if (!user) {
          res.status(404).json({ msg:"User Id not found" });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },

  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ msg:"User Id not found" });
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = userCont;
