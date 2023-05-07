const { Thought, User } = require('../models');

const thoughtController = {
    async allThoughts(req, res) {
        try {
            const thoughtDb = await Thought.find().sort({ createdAt: -1 });
            res.status(200).json(thoughtDb);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    async showSingleThought(req, res) {
        try {
            const thoughtDb = await Thought.findById(req.params.thoughtId);
            if (!thoughtDb) {
                res.status(404).json({ message: "Not found." })
                return;
            }
            res.status(200).json(thought);
        } catch (err) {
            console.error(err);
            res.status(404).json(err);
        }
    },
    async newThought(req, res) {
        try {
            const [thought, user] = await Promise.all([
                Thought.create(req.body),
                findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: thought._id } },
                    { new: true }
                )
            ]);
            if (!thought) {
                res.status(404).json({ message: 'Not found' });
                return;
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    async deleteThought(req, res) {
        try {
            const [deletedThought, user] = await Promise.all([
                Thought.findOneAndDelete({ _id: req.params.thoughtId }),
                User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $pull: { thought: req.params.thoughtId } },
                    { new: true }
                )
            ]);
            if (!deletedThought) {
                return res.status(404).json({ error: 'Thought not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    async editThought(req, res) {
        try {
            const thoughtDb = await Thought.findOneAndUpdate(
                req.params.thoughtId,
                req.body,
                { new: true }
            );
            if (!thoughtDb) {
                res.status(404).json({ message: 'Not found' });
                return;
            }
            res.status(200).json(thoughtDb);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    async addReaction({ params, body }, res) {
        try {
            const reaction = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $push: { reactions: body } },
                { new: true, runValidators: true }
            )
            if (!reaction) {
                res.status(404).json({ message: 'No thoughts with this ID' });
                return;
            }
            res.json(reaction);
        } catch (err) {
            res.status(400).json(err)
            console.error(err);
        }
    },

    async deleteReaction({ params }, res) {
        try {
            const deletedReaction = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $pull: { reaction: { reactionId: params.reactionId } } },
                { new: true })
            if (!deletedReaction) {
                res.status(404).json({ message: 'No thoughts with this ID' });
                return;
            }
            res.json(deletedReaction);
        } catch(err) {
        res.status(400).json(err);
    }
}
};

module.exports = thoughtController; 