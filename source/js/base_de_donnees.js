var config = require('../config/config.json');

var cradle = require('cradle'),
	db_users = new(cradle.Connection)().database(config.base_utilisateur),
	db_project = new(cradle.Connection)().database(config.base_projet);



//recuperer utilisateur par son identifiant (adresse mail)
exports.recuperer_utilisateur = function(user_mail, callback) {
	db_users.view('get-user/by_mail', {key: user_mail}, function(err, doc){
		if(err){
			console.log('erreur de la requete recuperer_utilisateur');
			return undefined;
		}else{
			var response = false;
			doc.forEach(function(row){
				callback(row.mail);
				response = true;
			});
			if(response === false){
				callback('utilisateur inconnu');
			}
		}
	});
}

/*
*	Recupere les projets associes a un utilisateur
*	Recupere egalement le projet courant et le fichier courant
*/
exports.recuperer_projets = function(user_mail, callback) {

	//recupere l ensemble des projets et lance l affichage
	var recuperer_ensemble_projet = function(projet_ouvert, fichier_ouvert){
		db_project.view('get-projects/by_user', {key: user_mail}, function(err, doc){
			var tab = []
			if(err){
				console.error(err);
				callback(undefined, undefined, undefined);
			}
			else {
				doc.forEach(function(row){
					tab.push(row);
				});
				callback(tab, projet_ouvert, fichier_ouvert);
			}
		});
	}

	//permet de savoir quelle fichier lancer dans l editeur de texte
	var recuperer_fichier_ouvert = function(projet_ouvert){
		var fichier_ouvert;
		db_project.view('get-projects/by_name', {key: [projet_ouvert, user_mail]}, function(err, doc){
			if(!err) {
				doc.forEach(function(row){
					fichier_ouvert = row.fichier_ouvert;
				});
				recuperer_ensemble_projet(projet_ouvert, fichier_ouvert);
			}
			else {
				recuperer_ensemble_projet(projet_ouvert, undefined);
				console.error(err);
			}

		});

	}


	//recuperation du projet ouvert
	db_users.get(user_mail, function(err, doc){
		if(err){
			console.error('erreur lors de la lecture enregistrement ' + user_mail + ' base utilisateur \n' + err.error);
			callback('inconnu', 'inconnu', undefined);
		}
		else {
			recuperer_fichier_ouvert(doc.projet_ouvert);
		}
	});

}


var changer_projet_courant = function(nom_utilisateur, nom_projet) {
	var fichier_ouvert;
	console.log(nom_projet + ' ' + nom_utilisateur);
	db_users.merge(nom_utilisateur, {projet_ouvert:nom_projet}, function(err, res){
		if(err) {
			console.error(err);
		}
	});

	db_project.view('get-projects/by_name', {key: [nom_projet, nom_utilisateur]}, function(err, doc){
		if(err){
			console.error('erreur recuperation projet');
			console.error(err);
		}
		else{
			doc.forEach(function(row){
				fichier_ouvert = row.fichier_ouvert;

			});
		}
	});
}

var changer_fichier_courant = function(nom_utilisateur, nom_projet, nom_fichier) {
	db_project.view('get-projects/by_name', {key: [nom_projet, nom_utilisateur]}, function(err, doc){
		if(err) {
			console.error('erreur recuperation du document');
			console.error(err);
		}
		else{
			doc.forEach(function(row){
				db_project.save(row._id, row._rev, {
					droit : row.droit,
					email : row.email,
					fichier_ouvert : nom_fichier,
					lien_html : row.lien_html,
					nom_projet : row.nom_projet
				}, function(err1, res){
					if(err){
						console.error('erreur update du document');
						console.error(err1);
					}
				});
			});
		}
	});
}

exports.changer_document_courant = function(nom_utilisateur, nom_projet, nom_fichier) {
	//on doit changer le projet
	if(nom_projet !== undefined && nom_fichier === undefined) {
		changer_projet_courant(nom_utilisateur, nom_projet);
	}
	else if(nom_fichier !== undefined) {
		changer_fichier_courant(nom_utilisateur, nom_projet, nom_fichier);
	}
	else {
		console.error('nom du projet et nom du fichier undefined, probleme dans les parametres');
	}
}

exports.supprimer_projet = function(nom_utilisateur, nom_projet) {
	db_project.view('get-projects/by_name', {key: [nom_projet, nom_utilisateur]}, function(err, doc){
		if(err){
			console.error('erreur recuperation du document');
			console.error(err);
		}
		else{
			doc.forEach(function(row){
				db_project.remove(row._id, row._rev, function(erreur, response){
					if(erreur){
						console.error('impossible de supprimer le projet');
						console.error(erreur);
					}
					else{
						console.log('suppression reussi projet ' + nom_projet);
					}
				});
			});
		}
	});
}

exports.creation_projet = function(nom_utilisateur, droit, nom_projet){
	db_project.save(
		{
			droit: droit,
			email: nom_utilisateur,
			fichier_ouvert: 'undefined',
			lien_html: 'undefined',
			nom_projet: nom_projet
		}, function(err, res){
			if(err){
				console.error('problème creation du projet: '+nom_projet);
				console.error(err);
			}else{
				console.log('creation ok: '+nom_projet);
			}
		});
}
