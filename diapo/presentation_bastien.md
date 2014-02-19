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

# Introduction
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

b

l

a

b

l

a

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



