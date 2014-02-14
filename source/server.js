var express = require('express'),
	app = express(),
	cradle = require('cradle'),
	fs = require('fs'),
	PORT = 8888,
	https = require('https');


var files = require('./routes/files'),
	connexion = require('./routes/connexion');

var httpsOptions = {
    key: fs.readFileSync("./ssl/server-key.pem"),
    cert: fs.readFileSync("./ssl/server-cert.pem")
};



app.use(express.logger('dev'));

app.locals({
	'pretty' : true
});

app.use(express.cookieParser('projetMaster'));
app.use(express.session());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/javascript'));
app.use(express.static(__dirname + '/js'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());

app.use(express.csrf());
app.use(function (req, res, next) {
  res.locals.csrftoken = req.csrfToken();
  next();
});

app.set('view engine', 'jade');

app.use(function(req, res, next) {
	console.log('request : ' + req.method + ', url : ' + req.url + '\n');
	next();
});



//routes gestionnaire de fichiers
app.get('/findProjects/user_name/:user_name', files.findProjects);
app.post('/click_fichier', files.click_fichier);
app.post('/click_dossier', files.click_dossier);
app.post('/gestion_ajax', files.gestion_ajax);
//gestion projet
app.post('/suppression_projet', files.suppression_projet)
app.post('/ajout_projet', files.ajout_projet);
//gestion fichier
app.post('/recuperation_fichiers_projet', files.recuperation_fichiers_projet);
app.post('/suppression_fichier_projet', files.suppression_fichier_projet);
app.post('/ajout_fichier', files.ajout_fichier);

//routes connexion et creation utilisateur
app.get('/', connexion.page_connexion);
app.post('/login', connexion.traitement_connexion);
app.get('/signup', connexion.enregistrement_utilisateur);
app.post('/signup', connexion.traitement_enregistrement_utilisateur);
app.get('/restricted', connexion.restrict, connexion.affiche_message_restreint);
app.get('/logout', connexion.deconnexion);


var server = https.createServer(httpsOptions, app);

server.listen(PORT, function() {
    console.log('Express HTTPS server listening on port ' + PORT);
});