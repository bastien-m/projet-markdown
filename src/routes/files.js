var db = require('../js/base_de_donnees.js'),
	fs = require('fs');



var construction_path = function(nom_utilisateur, nom_projet) {
	return './fichiers_utilisateurs/' + nom_utilisateur +'/'+ nom_projet;
}

//retrouve le nom des fichiers du projet
var parcourir_dossier = function(nom_utilisateur,nom_projet) {
	var path = construction_path(nom_utilisateur, nom_projet);
	var fichiers = [];
	if(fs.existsSync(path))
		fichiers =  fs.readdirSync(path);

	return fichiers;
}

var recuperer_contenu_fichier = function(nom_utilisateur, nom_projet, nom_fichier) {
	var path = construction_path(nom_utilisateur, nom_projet) + '/' + nom_fichier;
	if(fs.existsSync(path)) {
		return content = fs.readFileSync(path, 'utf8');
	}
	return undefined;
}

exports.findProjects = function(req, res){
	req.session.user = req.params.user_name;
	var traitement_projet = function(projets, projet_ouvert, fichier_ouvert) {
		if(projets === 'inconnu') {
			res.render('erreur.jade');
		}
		else {
			var fichiers = parcourir_dossier(req.params.user_name, projet_ouvert),
				contenu;
			if(fichier_ouvert === undefined) {
				contenu = 'Aucun fichier ouvert';
			}
			else {
				contenu = recuperer_contenu_fichier(req.params.user_name, projet_ouvert, fichier_ouvert);
				if(contenu === undefined) {
					contenu = 'Aucun fichier ouvert';
				}
			}

			res.render('gestionnaire_fichiers.jade', {'projets': projets, 'projet_ouvert':projet_ouvert,
			 'fichiers': fichiers, 'fichier_ouvert': fichier_ouvert, 'contenu':contenu});
		}
	}

	db.recuperer_projets(req.params.user_name, traitement_projet);
}

exports.click_fichier = function(req, res) {
	var fichier = req.body.nom_fichier,
		projet = req.body.nom_projet,
		utilisateur = req.session.user,
		contenu;
	console.log('fichier click : '+projet);

	contenu = recuperer_contenu_fichier(utilisateur, projet, fichier);

	db.changer_document_courant(utilisateur, projet, fichier, undefined);

	res.send(contenu);
}

exports.gestion_ajax = function(req, res){
	var nom_utilisateur = req.session.user,
		nom_projet = req.body.nom_projet,
		nom_fichier = req.body.nom_fichier;

	var contenu = recuperer_contenu_fichier(nom_utilisateur, nom_projet, nom_fichier);
	res.send(contenu);
}

exports.click_dossier = function(req, res){
	var projet = req.body.nom_projet,
		utilisateur = req.session.user,
		fichier, contenu;

	var fichiers = parcourir_dossier(utilisateur, projet);
	db.changer_document_courant(utilisateur, projet, fichier, undefined);
	contenu = recuperer_contenu_fichier(utilisateur, projet, fichier);
	res.send({'fichiers':fichiers, 'fichier_ouvert':fichier});
}

exports.suppression_projet = function(req, res){
	db.supprimer_projet(req.session.user, req.body.nom_projet);
	//suppression des fichiers et repertoire
	var path = construction_path(req.session.user, req.body.nom_projet)+'/';
	if(fs.existsSync(path)){
		console.log('suppression !!!!');
		fs.readdir(path, function(err, files){
			for(var i = 0; i < files.length; i++){
				fs.unlink(path+'/'+files[i], function(err){
					if(err){
						console.error('probleme suppression ' + files[i]);
						console.error(err);
					}
					else{
						fs.rmdir(path, function(err){
							if(err){
								console.error('erreur suppression ' + path);
							}else{
								console.log('suppression totalement exécutée');
							}
						});
					}
				 });
			}
			fs.rmdirSync(path);
		});
	}

	res.send('boulot effectue');
}

/*
*	La creation d'un projet:
*	- création en base de données
*	- création du dossier sur le serveur
*/
exports.ajout_projet = function(req, res){
	var utilisateur = req.session.user,
		nom_projet = req.body.nom_projet,
		droit = req.body.droit;

	db.creation_projet(utilisateur, droit, nom_projet);
	fs.mkdir(construction_path(utilisateur, nom_projet), function(err){
		if(err){
			console.error('creation dossier échouée : ' + nom_projet);
			console.error(err);
			res.send('echec');
		}else{
			res.send('creation ok');
		}
	});
}

/*
*	Récupération de la liste des fichiers d'un projet
*	pour mettre dans la liste deroulante des fichiers supprimable
*/

exports.recuperation_fichiers_projet = function(req, res){
	var utilisateur = req.session.user,
		nom_projet  = req.body.nom_projet;
		path 		= construction_path(utilisateur, nom_projet),
		fichiers 	= [];

		fs.readdir(path, function(err, files){
			if(err){
				console.error('impossible d acceder au chemin ' + path);
				console.error(err);
				res.send('erreur');
			}
			else{
				for(var i = 0; i < files.length; i++){
					fichiers.push(files[i]);
				}
				res.send({'fichiers': fichiers});
			}
		});


}

exports.suppression_fichier_projet = function(req, res){
	var utilisateur = req.session.user,
		nom_projet  = req.body.projet,
		fichier     = req.body.nom_fichier,
		path        = construction_path(utilisateur, nom_projet);

		fs.unlink(path+'/'+fichier, function(err){
			console.error('impossible de supprimer le fichier ' + path+'/'+fichier);
			console.error(err);
		});

		res.send('suppression terminée');
}

exports.ajout_fichier = function(req, res){
	var utilisateur = req.session.user,
		nom_projet  = req.body.projet,
		fichier     = req.body.nom_fichier,
		path        = construction_path(utilisateur, nom_projet);

		fs.open(path+'/'+fichier, 'w', function(err, fd){
			if(err){
				console.error('impossible de creer le fichier : ' + path+'/'+fichier);
				console.error(err);
				res.render('creation échouée');
			}
			console.log(path+'/'+fichier);
			fs.close(fd);
		});
		res.send('creation ok');
}

exports.sauv_fichier = function(req, res){
	var utilisateur = req.session.user,
		nom_projet  = req.body.nom_projet,
		fichier     = req.body.nom_fichier,
		path        = construction_path(utilisateur, nom_projet);
// console.log(path+'/'+fichier);
// return;
		fs.open(path+'/'+fichier, 'w', function(err, fd){
			if(err){
				console.error('impossible de creer le fichier : ' + path+'/'+fichier);
				console.error(err);
				res.render('creation échouée');
			}
			console.log(path+'/'+fichier);
			fs.close(fd);
		});
		contenu=req.body.file_content;

		fs.writeFile(path+'/'+fichier,contenu, function (err) {
		  if (err) 
		  	throw err;
		  console.log('fichhier sauvegarder');
		});
		//console.log(contenu);
		console.log('fichier click : '+nom_projet);
		//contenu = recuperer_contenu_fichier(utilisateur, nom_projet, fichier);
		db.changer_document_courant(utilisateur, nom_projet, fichier, undefined);
		res.send(contenu);
}