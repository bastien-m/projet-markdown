#Presentation Projet Markdown
======================

Auteur : SAIDANE, BOISARD, CALIX, MERCIER

---

1.  Introduction
2.  Connexion et Sécurité
3.  Gestionnaire de fichiers
4.  Interface
5.  Éditeur de texte et présentation
6.  Conclusion


---

# Introduction
Client : M.Pigné
Objectifs du projet
Technologies utilsées
Architecture

---

##Répartition des tâches :

-   Connexion et sécurité                Thomas BOISARD
-   Gestionnaire de fichiers             Bastien MERCIER
-   Interface                            Thomas BOISARD & Grégory CALIX
-   Éditeur de texte et présentation     Fouad SAIDANE


---

##Connexion et sécurité

---

>HTTPS


* génèrer la clé privée :

        openssl genrsa -out server-key.pem 1024

* génèrer un fichier 'Certificate Signing Request' (CSR) :

        openssl req -new -key server-key.pem -out server-csr.pem

* pour auto-signer le certificat :

        openssl req -new -key server-key.pem -out server-csr.pem

---

Configuration du serveur: 

        var httpsOptions = {
            key: fs.readFileSync('./ssl/server-key.pem');
            cert: fs.readFileSync('./ssl/server-cert.pem'); 
        } 

        …
        
        
        Configuration du serveur express
        
        …
        
        var server = https.createServer(httpsOptions,app);
        
        server.listen(1337,function(){
            console.log('Express HTTPS server listening on port 1337');
        });

---

>CSRF

-   Attaque : fait executer une action à l'utilisateur à son insu
-   Configurer le serveur 

        app.use(express.csrf());
        app.use(function (req, res, next) {
            res.locals.csrftoken = req.csrfToken();
            next();
        });
        
-   récupérer le jeton côtés client
        
        input(type='hidden',name='_csrf',value=csrftoken)

---

>Chiffrement des mots des mot de passe

* Méthode de cryptage SHA 512
    -   Génère un haché de 512 bits
    -   le résultat en sortie : 64 caractère.
* Utilisation du module crypto

Exemple d'utilisation:
    
    var crypto = require('crypto');

    var shasum = chypto.createHash('sha512');
    shasum.update('motdepasse');
    var mdpchiffrer = shasum.digest('base64');

    valeur de mdp:
    'cpBeezLYR0aO3Nv5n30hjkZs2CgwAwbx2fjD4FEuRP5DlGRLWB7VJlaihwyaZ8WSvEDKMiCZqlK/UoxU+cq94A==' 

---


##Gestionnaire de fichiers##


---


>Présentation du gestionnaire de fichier

Côté serveur:

-   Système de fichiers
-   Base de données        

Côté client:

-   Affichage arborescence
-   Gestion projet/fichier ouvert
-   Modale Projet
-   Modale Fichier
    
        $.post('/click_fichier', {'nom_projet':nom_projet, 'nom_fichier':nom_fichier,'_csrf':csrf}, 
            function(data){
                $('.contenu').html(data);
        });

	    $('.ouvert').removeClass('ouvert');
	    $(".row.fichier:contains('"+nom_fichier+"')").addClass('ouvert');



---


Schéma de base de données:

##table utilisateur

* id
* mot de passe (chiffré)
* projet ouvert

##table projet

-   droit
-   email
-   fichier ouvert
-   nom projet

---

Vues:

    {
       "by_user": {
           "map": "function (doc) {
                if(doc.email) emit(doc.email, doc);}"
       },
       "by_name": {
           "map": "function (doc) {
                if(doc.nom_projet && doc.email) {
                    var key = [doc.nom_projet, doc.email];
                    temit(key, doc);"
       }
    }


