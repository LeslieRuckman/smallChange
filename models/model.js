var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var orgSchema = new Schema({
	name: String,
	category: [String],
	tags: [String],
	rating: Number,
	link: String,
	dateAdded : { type: Date, default: Date.now },
})

// export 'Animal' model so we can interact with it in other files
module.exports = mongoose.model('Organization',orgSchema);
