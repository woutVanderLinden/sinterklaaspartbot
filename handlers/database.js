const mongoose = require('mongoose');

mongoose.connect(config.mongoURL, () => console.log('Connected to MongoDB'));

const seenSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	time: { type: Date, required: true }
});
const altSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	alts: { type: [{ _id: String }], required: true }
});

const seen = mongoose.model('seen', seenSchema);
const alts = mongoose.model('alt', altSchema);

const seenQueue = [];
const altQueue = [];

function see (user, time) {
	user = toID(user);
	return new Promise((resolve, reject) => {
		function enqueue () {
			return seen.findOneAndUpdate({ _id: user }, { _id: user, time: time }, { new: true, upsert: true }).then(res => {
				seenQueue.shift();
				seenQueue[0]?.();
				resolve(res);
			});
		}
		seenQueue.push(enqueue);
		if (seenQueue.length === 1) enqueue();
	});
}

function alt (A, B) {
	[A, B] = [toID(A), toID(B)];
	return new Promise((resolve, reject) => {
		function enqueue () {
			return Promise.all([
				alts.findOneAndUpdate({ _id: A }, { _id: A, $addToSet: { alts: { _id: B } } }, { new: true, upsert: true }),
				alts.findOneAndUpdate({ _id: B }, { _id: B, $addToSet: { alts: { _id: A } } }, { new: true, upsert: true })
			]).then(res => {
				altQueue.shift();
				altQueue[0]?.();
				resolve(res);
			});
		}
		altQueue.push(enqueue);
		if (altQueue.length === 1) enqueue();
	});
}

async function lastSeen (user) {
	user = toID(user);
	const temp = await seen.findOne({ _id: user });
	return temp?.time || false;
}

async function getAlts (user) {
	user = toID(user);
	const temp = await alts.findOne({ _id: user }).lean();
	return temp?.alts.map(term => term._id) || [];
}

module.exports = {
	see,
	alt,
	lastSeen,
	getAlts
};
