const express = require('express');
const router = express.Router();
const Wiki = require('../models').Wiki;
const User = require('../models').User;
const Collaborator = require('../models').Collaborator;

module.exports = {
   	destroy(req, res, next){
		Collaborator.destroy({where: {id: req.params.collabId}})
	    .then(collaborator => {
	    	req.flash("notice", "Collaborator was removed successfully.")
			res.redirect(`/wikis/${req.params.id}/edit`);
		})
	    .catch(err => {
	    	res.render('wikis/index.ejs', {error: err});
	    });
   	},
   	collaborators(req, res, next){
   		User.findOne({where: {email: req.body.email}})
	    .then(user => {
	    	if (user) {
	    		let collaborator = Collaborator.build({
					wikiId: req.params.id,
		   			userId: user.id
				});

				collaborator.save();

				req.flash("notice", "Collaborator has been successfully added!")
				res.redirect(`/wikis/${req.params.id}`);
	    	}
	    	else {
	    		req.flash("notice", "Collaborator email not found.  Please try again.")
				res.redirect(`/wikis/${req.params.id}/edit`);
			}
		})
	    .catch(err => {
	    	req.flash("error", "Error saving wiki.  Please try again.")
    		res.redirect(`/wikis/${req.params.id}/edit`);
	    });
   	}
}