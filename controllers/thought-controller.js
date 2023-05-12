const { Thought, User } = require('../models');

const thoughtController = {
    async getAllThoughts(req, res) {
        try {
            const thoughtDb = await Thought.find({})
                .populate({ path: 'reactions', select: '-__v' })
                .select('-__v');
            res.json(thoughtDb);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async showSingleThought({ params }, res) {
        try {
            const thought = await Thought.findOne({ _id: params.id })
                .populate({ path: 'reactions', select: '-__v' })
                .select('-__v');
            
            if (thought) {
                res.json(thought);
            } else {
                res.status(404).json({ message: thought404Message(params.id) });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createThought({ body }, res) {
        try {
            const { thoughtText, username, userId } = body;
            
            const thought = await Thought.create({ thoughtText, username });
            await User.findOneAndUpdate({ _id: userId }, { $push: { thoughts: thought._id } }, { new: true });
            
            res.json(thought);
        } catch (err) {
            res.status(400).json(err);
        }
    },
    async deleteThought(req, res) {
        try {
            const [deletedThought, user] = await Promise.all([
                Thought.findOneAndDelete({ _id: req.params.id }),
                User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $pull: { thought: req.params.id } },
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