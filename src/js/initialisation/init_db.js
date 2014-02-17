//se fichier sera a appeler en premier en phase de dev, il permet de générer les bases de données et les remplir d'enregistrement
var Cradle = require('cradle');
//creation des bases de données

//recuperation configuration
var config = require('../../config/config.json'),
	mode = 'test'; // prod pour production test pour dev


var connexion = new(Cradle.Connection)('http://localhost', 5984);

//base utilisateur
var db_user = connexion.database(config.base_utilisateur);


//base projet
var db_project = connexion.database(config.base_projet);
db_project.create();


//definition des fonctions appelees pour la creation d'objets
//utilisateur
var creation_utilisateurs = function(err, exists) {
	if(err) {
		console.log('erreur lors de la creation de la base utilisateur, insertion impossible');
	}
	else if(exists) {
		console.log('la base existe deja');
		if(mode === 'test'){
			console.log('debut insertion');
			insertion_utilisateurs();
		}
	}
	else {
		db_user.create();
		if(mode === 'test'){
			console.log('debut insertion');
			insertion_utilisateurs();
		}
	}
}

//vue pour recuperer les utilisateurs par mail (identifiant)
var creation_vue = function() {
	db_user.save('_design/get-user', {
		by_mail: {
			map: function (doc) {
				if (doc._id) emit(doc._id, doc);
			}
		}
	});

	db_project.save('_design/get-projects', {
		by_user: {
			map: function(doc) {
				if(doc.email) emit(doc.email, doc);
			}
		},
		by_name: {
			map: function(doc) {
				if(doc.nom_projet && doc.email) {
					var key = [doc.nom_projet, doc.email];
					emit(key, doc);
				}
			}
		}
	});

}

var insertion_utilisateurs = function(){
	var json_utilisateur = require('./info_initialisation_user.json');
	for(var utilisateur in json_utilisateur){
		var obj = json_utilisateur[utilisateur];
		db_user.save(obj['email'], {'mot_de_passe': obj['password'], 'projet_ouvert': obj['projet_ouvert']}, function(err, doc){
			if(err) {
				console.log('insertions utilisateurs échouées');
			}
			else {
				console.log('insertions utilisateurs terminées');
			}
		});
	}
}


//projet
var creation_projets = function(err, exists){
	if(err) {
		console.log('erreur lors de la creation de la base projet, insertion impossible');
	}else if(exists){
		console.log('la base existe deja');
		if(mode === 'test'){
			console.log('debut insertion');
			insertion_projets();
		}

	}
	else {
		db_user.create();
		if(mode === 'test'){
			console.log('debut insertion');
			insertion_projets();
		}
	}
}

var insertion_projets = function(){
	var json_projet = require('./info_initialisation_projet.json');
	db_project.save(json_projet, function(err, doc){
		if(err) {
			console.log('insertions projets échouées');
		}
		else{
			console.log('insertions projets terminées');
		}
	});
}


//appel des methodes
creation_utilisateurs();
creation_projets();
creation_vue();
