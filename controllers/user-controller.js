const { User } = require ("../models");

const userController = {

    async makeUser(req, res) {
    try{
        const newUser = await User.create(req.body);
        res.status(200).json(newUser)
    } catch(err) {
        console.error(err)
        res.status(500).json(err);
        }
    },

    async allUsers(req, res) {
        try {
        const allUsers = await User.find()
        .populate({ path: 'thoughts' })
        .populate({ path:'friends' })

        res.status(200).json(allUsers);
        
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
        }
    },

    async oneUser(req, res) {
        try{
            const userDb = await User.findById(req.params.id)
            .populate({ path: 'thoughts' })
            .populate({ path:'friends' });

            res.status(200).json(userDb);
            if(!userDb) {
                res.status(404).json({ message: 'no user with that Id'});
                return;
            }
        } catch(err) {
            console.error(err);
            res.status(500).json(err);
        }
    }

}

