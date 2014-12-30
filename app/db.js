var mongoose = require('mongoose'),
	chalk = require('chalk');

var db;

function init(config){
	db = mongoose.connect(config.db, function(err) {
		if (err) {
			console.error(chalk.red('Could not connect to MongoDB!'));
			console.log(chalk.red(err));
		}
	});

	return db;
}

function getModel(modelName){
	return db.model(modelName);
}

function getModels(){
	return db.models;
}


module.exports = {
	init: init,
	getModel: getModel,
	getModels: getModels
};