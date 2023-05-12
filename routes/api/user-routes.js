const router = require('express').Router();

// Importing controller functions
const {
    allUsers,
    oneUser,
    makeUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,
} = require('../../controllers/user-controller');

router.route("/").get(allUsers).post(makeUser);

router.route("/:id").get(oneUser).put(updateUser).delete(deleteUser);

router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend);

module.exports = router;

