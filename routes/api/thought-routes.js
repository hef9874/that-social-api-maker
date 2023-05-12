const router = require('express').Router();

const {
    getAllThoughts,
    showSingleThought,
    createThought,
    editThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require("../../controllers/thought-controller");

router.route('/')
    .get(getAllThoughts)
    .post(createThought);

router.route('/:id')
    .get(showSingleThought)
    .put(editThought)
    .delete(deleteThought);

router.route('/:thoughtId/reactions')
    .post(addReaction);

router.route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);

module.exports = router;