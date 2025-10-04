const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/LivHaven');
}

main().then((res) =>{
    console.log('Connected to MongoDB');
})
.catch(err => console.log(err));

const initDb = async () => {
    try {
        await Listing.deleteMany({});
        console.log('Existing listings cleared.');

        await Listing.insertMany(initdata.data);
        console.log('Sample listings added to database.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

initDb();