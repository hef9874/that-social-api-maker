const { User } = require("../models");

const userController = {

    async makeUser(req, res) {
        try {
            const newUser = await User.create(req.body);
            res.status(200).json(newUser)
        } catch (err) {
            console.error(err)
            res.status(500).json(err);
        }
    },

    async allUsers(req, res) {
        try {
            const allUsers = await User.find()
                .populate({ path: 'thoughts' })
                .populate({ path: 'friends' })

            res.status(200).json(allUsers);

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async oneUser(req, res) {
        try {
            const userDb = await User.findById(req.params.id)
                .populate({ path: 'thoughts' })
                .populate({ path: 'friends' });

            res.status(200).json(userDb);
            if (!userDb) {
                res.status(404).json({ message: 'no user with that Id' });
                return;
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    async updateUser({ params, body }, res) {
        try {
            const dbUserData = await User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true });
            if (dbUserData) {
                res.json(dbUserData);
            } else {
                res.status(404).json({ message: user404Message(params.id) });
            }
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async deleteUser(req, res) {
        try {
          const userDb = await User.findByIdAndDelete(req.params.id);
          if (!userDb) {
            res.status(404).json({ message: "User not found" });
            return;
          }
          res.status(200).json(userDb);
        } catch (err) {
          console.error(err);
          res.status(500).json(err);
        }
      },

      async addFriend({ params }, res) {
        try {
            const dbUserData = await User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { friends: params.friendId } },
                { new: true, runValidators: true }
            );
            res.json(dbUserData);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async deleteFriend(req, res) {
            try {
                const userDb = await User.findByIdAndUpdate(
                    { _id: req.params.userId },
                    { $pull: { friends: req.params.friendId } },
                    { new: true },
                );
                if (!userDb) {
                    res.status(404).json({ message: "No user with that Id" });
                    return;
                }
                res.status(200).json(userDb);
            } catch (err) {
                console.error(err);
                res.status(500).json(err);
            }
        },
    };

    module.exports = userController;

