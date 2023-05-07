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

    async updateUser(req, res) {
        try {
            const userDb = await User.findOneAndUpdate(
                req.params.id, { $set: req.body }, { new: true },
            );
            if (!userDb) {
                res.status(400).json({ message: 'No user exists with that Id' });
                return;
            }
            res.status(200).json(userDb);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    async deleteUser(req, res) {
        try {
            const userDb = await User.findOneAndDelete({ _id: req.params.userId });
            if (!userDb) {
                res.status(404).json({ message: 'No user exists with that Id' });
                return;
            }
            res.status(200).json(userDb);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        };
    },

    async addFriend(req, res) {
        try {
            const newFriend = await User.findByIdAndUpdate(
                { _id: req.params.userId },
                { $push: { friends: params.friendId } },
                { new: true },
            );
            if (!newFriend) {
                res.status(404).json({ message: 'No User found with that id.' });
                return;
            }
            res.status(200).json(newFriend);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    async deleteFriend(req, res) {
        try {
            const userDb = await User.findByIdAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: params.friendId } },
                { new: true },
            );
            if (!userDb) {
                res.status(404).json({ message: "No user with that Id" });
                return;
            }
            res.status(200).json(userDb);
        } catch(err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = userController;

