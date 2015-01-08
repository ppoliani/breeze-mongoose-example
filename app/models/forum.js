'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var ForumSchema = new Schema({
	ownerId: Number,
	author: {
		name: {type: String, default: '', trim: true},
		timeStamp: {type: Date, default: Date.now}
	},
	title: {type: String, default: '', trim: true},
	description: {type: String, default: '', trim: true},
	code: {type: String, default: '', trim: true},
	imageUrl: {type: String, default: '', trim: true},
	moderated: Boolean,
	importance: Number,
	sortOrder: Number
});

ForumSchema.virtual('id').get(function(){
    return this._id.toHexString();
});


ForumSchema.set('toJSON', {
    virtuals: true
});

mongoose.model('Forum', ForumSchema);