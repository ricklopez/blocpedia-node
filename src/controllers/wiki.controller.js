const express = require('express');
const router = express.Router();
const Wiki = require('../models').Wiki;
const User = require('../models').User;
const Collaborator = require('../models').Collaborator;
const markdown = require( "markdown" ).markdown;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
	// all public wikis are viewable
	// role 0 (standard)= private: false 
	// role 1 (premium) = private: false or owner or are collaborators
	// role 2 (admin) = show all
	index(req, res, next){
    console.log("WIKI CONTROLLER");
		const role = req.user.role;
		var options = {};  // no filter / show all by default

		if (role == 0)		// Standard user
			options = {private: false};
		else if (role == 1) // Premium user
			options = {
				[Op.or]: [{private: false}, {UserId: req.user.id}, { '$collaborators.userId$': req.user.id }]
			};

		Wiki.findAll({
			include: [{
     			model: Collaborator, as: "collaborators", attributes: ["userId"]
			}],
		  	where: options
		})
	    .then(wikis => {
			res.render('wikis/index.ejs', {wikis});
		})
	    .catch(err => {
	    	console.log('error', err);
	    	res.render('wikis/index.ejs', { title: 'Wikis'});
	    });
   	},
   	new(req, res, next){
		res.render('wikis/new.ejs');
   	},
   	show(req, res, next){
		Wiki.findById(req.params.id)
	    .then(wiki => {
	    	wiki.body = markdown.toHTML(wiki.body);
			res.render('wikis/show.ejs', {wiki});
		})
	    .catch(err => {
	    	res.render('wikis/show.ejs', {error: err});
	    });
   	},
   	update(req, res, next){
   		if (!req.body.private)
   			req.body.private = false;

   		Wiki.update({
   			title: req.body.title,
   			body: req.body.body,
   			private: req.body.private
		}, {
			where: { 
				id: req.params.id 
			}
		})
		.then(wiki => {
			res.redirect(`/wikis/${req.params.id}`);
		})
	    .catch(err => {
	    	req.flash("error", "Error saving wiki.  Please try again.")
	    	res.redirect(`/wikis/${req.params.id}/edit`);
	    });
   	},
   	create(req, res, next){
   		if (!req.body.private)
   			req.body.private = false;

   		Wiki.create({
   			title: req.body.title,
   			body: req.body.body,
   			private: req.body.private,
   			UserId: req.user.id
		})
		.then(wiki => {
			req.flash("notice", "Wiki was created successfully.")
			res.redirect(`/wikis/${wiki.id}`);
		})
	    .catch(err => {
	    	req.flash("error", "Error saving wiki.  Please try again.")
	    	res.redirect('/wikis/create');
	    });
   	},
   	edit(req, res, next){
		Wiki.findById(req.params.id,{
			include: [
     			{model: Collaborator, as: "collaborators", include: [
     			{model: User}
     		]},
		]})
	    .then(wiki => {
			res.render('wikis/edit.ejs', { wiki });
		})
	    .catch(err => {
	    	res.render('wikis/edit.ejs', {error: err});
	    });
   	},
   	destroy(req, res, next){
		Wiki.destroy({where: {id: req.params.id}})
	    .then(wiki => {
	    	req.flash("notice", "Wiki was deleted successfully.")
			res.redirect('/wikis');
		})
	    .catch(err => {
	    	res.render('wikis/index.ejs', {error: err});
	    });
   	}
}