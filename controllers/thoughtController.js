const {ObjectId} = require('mongoose').Types;
const {User, Thought} = require('../models');

module.exports = {
    // Get all thoughts
    getAllThoughts(req, res) {
        Thought.find().then((thoughts) => res.json(thoughts)).catch((err) => res.status(500).json(err));
    },

    // create a new thought
    createThought(req, res) {
        Thought.create(req.body)
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => res.status(500).json(err));
    },

    // get a single thought by its id
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        // .select('-__v')
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
    },

    // update a thought by its id
    updateThought(req, res) {
        Thought.findOneAndUpdate({_id: req.params.thoughtId}, {thoughtText: req.body.thoughtText}, {new: true, upsert: true}, (err, result) => {
            if(result){
                res.status(200).json(result);
                console.log(`Updated: ${result}`);
            }else{
                console.log('Something went wrong');
                res.status(500).json({message: 'something went wrong'});
            }
        });
    },

    // delete a thought by its id
    deleteThought(req, res) {
        Thought.findOneAndDelete({_id: req.params.thoughtId}, (err, result) => {
            if(result){
                res.status(200).json(result);
                console.log(`Deleted: ${result}`);
            }else{
                console.log('Something went wrong');
                res.status(500).json({message: 'something went wrong'});
            }
        });
    },

    createReaction(req, res){
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: {reactions: req.body}},
            {runValidators: true, new: true}
        ).then((thought) =>
            !thought
                ? res.status(404).json({message: 'No thought found with that ID'})
                : res.json(thought)
        ).catch((err) => res.status(500).json(err));
    },

    deleteReaction(req, res){
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: {reactionId: req.params.reactionId}}},
            {runValidators: true, new: true, upsert: true}
        ).then((thought) =>
            !thought
                ? res.status(404).json({message: "No thought found with that ID"})
                : res.json(thought)
        ).catch((err) => res.status(500).json(err));
    },
};