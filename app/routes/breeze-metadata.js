var db = require('../db'),
	breezeMongoose = require('breeze-mongoose')(db.getModel, 'models.breezeMongooseExample');


module.exports = function(app) {
	app.get('/breeze/metadata', function(req, res){
		res.json(breezeMongoose.getMetadata(db.getModels()));
	});

	app.post('/savechanges', function(req, res){
        breezeMongoose.saveChanges(req.body)
            .then(function(saveResults){
                 res.json(saveResults);
            })
            .catch(function(message){
                res.send(500, message);
            });
    });
};