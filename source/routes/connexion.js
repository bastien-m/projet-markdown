var config = require('../config/config.json');

var cradle = require('cradle'),
	crypto = require('crypto'),
	fs     = require('fs'),
	db_users = new(cradle.Connection)().database(config.base_utilisateur)

exports.restrict = function(req, res, next){
	if(req.session.user)
	{
		next();
	}
	else
	{
		req.session.error = 'Acces denied';
		res.redirect('/');
	}
}

exports.page_connexion = function(req,res){
	res.render('index');
}

exports.traitement_connexion = function(req,res){
	var mail = req.body.mail;
	var password = req.body.password;

	var shasum = crypto.createHash('sha512');
	shasum.update(password);

	var mdpcrypt = shasum.digest('base64');

	db_users.get(mail,function(err,doc){
		if(err)
		{
			console.log(err);
			res.render('login',{error:'Compte introuvable, vérifiez vos identifiants'});
		}
		else
		{
			if(doc.mot_de_passe==mdpcrypt)
			{
				req.session.regenerate(function(){
					req.session.user = mail;
					res.redirect('/restricted');
				});
			}
			else
			{
				res.render('login',{error:"Erreur dans l'identifiant ou le mot de passe"});
			}
		}
	});
}

exports.enregistrement_utilisateur = function(req,res){
	res.render('signup');
}

var creation_repertoire_utilisateur = function(mail){
	fs.mkdirSync('./fichiers_utilisateurs/'+mail);
}

exports.traitement_enregistrement_utilisateur = function(req,sRes){
	var mail = req.body.mail;
	var password = req.body.password;
	var confirm_password = req.body.confirm_password;

	if(password !== confirm_password)
	{
		sRes.render('signup',{user:mail,error:'Les deux mots de passe ne sont pas identique!'});
	}
	else
	{
		var shasum = crypto.createHash('sha512');
		shasum.update(password);

		var mdpcrypt = shasum.digest('base64');

		db_users.get(mail,function(err,doc){
			if(err)
			{
				db_users.save(mail,{
				  mot_de_passe: mdpcrypt,
				  projet_ouvert: 'undefined'
				  }, function (err, res) {
					if (err) {
						// Handle error
					} else {
						fs.mkdir('./fichiers_utilisateurs/'+mail,true);
						// Handle success
						sRes.redirect('/');
						//sRes.redirect('/findProjects/user_name/'+mail);
					}
				  }
				);
			}
			else
			{
				sRes.render('signup',{error:'Adresse mail déjà utilisée'});
			}
		});
	}
}

exports.affiche_message_restreint = function(req, res){
	console.log('connexion utilisateur' + req.session.user);
	res.redirect('/findProjects/user_name/'+req.session.user);
  	//res.send('Zone privée, bonjour : ' + req.session.user + '! click <a href="/logout">Déconnexion</a>');
}

exports.deconnexion = function(req, res){
    req.session.destroy(function(){
        res.redirect('/login');
    });
}