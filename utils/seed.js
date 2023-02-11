const connection = require('../config/connection');
const {User, Thought} = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    // Drop existing thoughts
    await Thought.deleteMany({});

    // Drop existing users
    await User.deleteMany({});

    const users = [
        {
            username: "muchir",
            email: "muchir@gmail.com",
        },
        {
            username: "henry",
            email: "henry@gmail.com",
        },
    ];

    // Add users to the collection and await the results
    await User.collection.insertMany(users);

    // Add thoughts to the collection and await the results
    await Thought.collection.insertOne({
        thoughtText: "This is a private thought of muchir",
        username: "muchir",
    });

    // Log out the seed data to indicate what should appear in the database
    console.table(users);
    console.info('Seeding complete! 🌱');
    process.exit(0);
});