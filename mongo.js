import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (process.argv.length < 3) {
    console.log("Please provide a password as an argument")
    process.exit(1)
}

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model("Note", noteSchema);


/*const note = new Note({
    content: "CSS is a style sheet language",
    important: true,
})*/


Note.find({important: true}).then(result => {
    result.forEach(note => console.log(note))
    mongoose.connection.close()
})


/*
note.save().then(result => {
    console.log("Note saved!")
    mongoose.connection.close()
})*/
