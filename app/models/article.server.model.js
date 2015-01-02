'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	userID: {
		type: Schema.ObjectId,
		ref: 'User'
	}
}); 

ArticleSchema.virtual('id').get(function(){
    return this._id.toHexString();
});


ArticleSchema.set('toJSON', {
    virtuals: true
});

mongoose.model('Article', ArticleSchema);