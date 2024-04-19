const { Thoughts, User } = require("../models");

//Thought controllers, each named accordingly for each task
const thoughtCont = {
  getAllThoughts(req, res) {
    Thoughts.find({})
      .select("-__v")
      .populate("reactions")
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  getThoughtsById({ params }, res) {
    Thoughts.findOne({ _id: params.id })
      .select("-__v")
      .populate("reactions")
      .then((thoughts) => {
        if (!thoughts) {
          return res.status(404).json({ msg:"No associated Id" });
        }
        res.json(thoughts);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  createThoughts({ params, body }, res) {
    Thoughts.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ msg: "Created with no user" });
        }

        res.json({ msg: "Success" });
      })
      .catch((err) => res.json(err));
  },

  updateThoughts({ params, body }, res) {
    Thoughts.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((thoughts) => {
        if (!thoughts) {
          res.status(404).json({ msg:"No associated Id" });
          return;
        }
        res.json(thoughts);
      })
      .catch((err) => res.json(err));
  },

  deleteThoughts({ params }, res) {
    Thoughts.findOneAndDelete({ _id: params.id })
      .then((thoughts) => {
        if (!thoughts) {
          return res.status(404).json({ msg:"No associated Id" });
        }

        return User.findOneAndUpdate(
          { thoughts: params.id },
          { $pull: { thoughts: params.id } }, 
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ msg: "Created with no user" });
        }
        res.json({ msg: "Deleted!" });
      })
      .catch((err) => res.json(err));
  },

  addReaction({ params, body }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((thoughts) => {
        if (!thoughts) {
          res.status(404).json({ msg:"No associated Id" });
          return;
        }
        res.json(thoughts);
      })
      .catch((err) => res.json(err));
  },

  removeReaction({ params }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtCont;
