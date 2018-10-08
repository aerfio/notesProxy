const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').load();
mongoose.connect(
	process.env.MONGO,
	{ useNewUrlParser: true },
);
const noteSchema = new mongoose.Schema({
	text: String,
});

const Note = mongoose.model('Note', noteSchema);

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const port = 3000;

app.get('/getNotes', (req, res) => {
	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
		console.log('we are connected');
	});
	db.on('disconnected', function() {
		console.log('Mongoose default connection to DB disconnected');
	});
	Note.find(function(err, notes) {
		if (err) {
			return console.error(err);
		}
		res.send(notes);
	});
});
app.post('/addNote', function(req, res) {
	const body = req.body;
	const note = new Note({ text: body.text });
	note.save(function(err, note) {
		if (err) {
			return console.error(err);
		}
		console.log(note);
	});
	res.set('Content-Type', 'text/plain');
	res.send(`You sent: ${body.text} to Express`);
});
app.post('/deleteNote', function(req, res) {
	console.log(req.body._id);
	Note.findByIdAndDelete(req.body._id, err => {});
	res.set('Content-Type', 'text/plain');
	console.log(`Deleted note ${req.body._id}`);
	res.send(`Deleted note ${req.body._id}`);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
