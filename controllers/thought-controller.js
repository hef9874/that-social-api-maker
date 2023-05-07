const { Thought, User } = require('../models');

module.exports = {
    async showThought(req, res) {
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
                res.status(404).json({ message: "Not found."})
                return;
            } 
            res.status(200).json(thought);
        } catch(err) {
            console.error(err);
            res.status(404).json(err);
        }
    },
    async newThought(req, res) {
        try{
            const [thought, user] = await Promise.all([
                Thought.create(req.body),
                findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: {thoughts: thought._id}},
                    { new: true }
                )
            ]);
            if (!thought){
                res.status(404).json({ message: 'Not found'});
                return;
            }
        } catch(err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    
}