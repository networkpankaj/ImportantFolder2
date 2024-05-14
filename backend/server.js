// Require the dotenv package
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app')

const port = process.env.PORT || 8000;
const db = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);


// Connect to MongoDB using Mongoose
mongoose.connect(db)
    .then(() => {
        console.log("DB connection successful");
    })
    .catch((err) => {
        console.error("DB connection error:", err.message);
    });


// console.log(app.get('env'))
app.listen(port, () => {
    console.log(`The Server is running on port no ${port}`);
});
