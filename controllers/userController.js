const {ObjectId} = require('mongoose').Types;
const {User, Thought} = require('../models');


module.exports = {
    // Get all users
    getAllUsers(req, res) {
        User.find().then((users) => res.json(users)).catch((err) => res.status(500).json(err));
    },

    // Create a new user
    createUser(req, res) {
        User.create(req.body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(500).json(err));
    },

    // Get a single user by its id
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
    },

    // update a user by its id
    updateUser(req, res) {
        User.findOneAndUpdate({_id: req.params.userId}, {username: req.body.username}, {new: true, upsert: true}, (err, result) => {
            if(result){
                res.status(200).json(result);
                console.log(`Updated: ${result}`);
            }else{
                console.log('Something went wrong');
                res.status(500).json({message: 'something went wrong'});
            }
        });
    },

    // delete a user by its id
    // bonus: remove a user's associated thoughts when deleted.
    deleteUser(req, res) {
        User.findOneAndDelete({_id: req.params.userId}, (err, result) => {
            if(result){
                res.status(200).json(result);
                console.log(`Deleted: ${result}`);
            }else{
                console.log('Something went wrong');
                res.status(500).json({message: 'something went wrong'});
            }
        });
    },

    // post to add a new friend to a user's friend list
    createFriend(req, res){
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$addToSet: {friends: req.params.friendId}},
            {runValidators: true, new: true}
        ).then((user) => 
            !user
                ? res.status(404).json({message: "No user found with that ID :("})
                : res.json(user)
            ).catch((err) => res.status(500).json(err));
    },

    // delete to remove a friend from a user's friend list
    deleteFriend(req, res){
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.params.friendId}},
            {runValidators: true, new: true}
        ).then((user) => 
            !user
                ? res.status(404).json({message: "No user found with that ID :("})
                : res.json(user)
        ).catch((err) => res.status(500).json(err));
    },
};