# ce fichier a pour objectif de creer les fichiers utilisateurs pour le test
# les utilisateurs sont ceux existants dans la base de donnees par defaut
# a savoir :
#   blabla@hotmail.fr
#   blebleble@gmail.com
#   blublublu@free.fr
# les dossiers sont places dans le repertoire fichier_utilisateur a la racine du projet
echo 'creation du repertoire fichier_utilisateur'
mkdir fichiers_utilisateurs

echo 'creation des repertoires des utilisateurs'
mkdir fichiers_utilisateurs/blabla@hotmail.fr
mkdir fichiers_utilisateurs/blebleble@gmail.com
mkdir fichiers_utilisateurs/blublublu@free.fr

# creation des fichiers de l'utiliateur blabla@hotmail.fr
cd fichiers_utilisateurs/blabla@hotmail.fr
mkdir projet01; cd projet01
echo "creation fichiers utilisateur blabla@hotmail.fr"
echo "contenu du fichier01 utilisateur blabla@hotmail.fr" > fichier01.md
echo "contenu du fichier02 utilisateur blabla@hotmail.fr" > fichier02.md

#creation des fichiers de l'utilisateur blebleble@gmail.com
cd ../../blebleble@gmail.com
mkdir projet02; cd projet02
echo "creation fichiers utilisateur blebleble@gmail.fr"
echo "contenu du fichier01 utilisateur blebleble@gmail.fr" > fichier01.md
echo "contenu du fichier02 utilisateur blebleble@gmail.fr" > fichier02.md

#creation des fichiers de l'utilisateur blublublu@free.fr"
cd ../../blublublu@free.fr
mkdir projet06; cd projet06
echo "creation fichiers utilisateur blublublu@free.fr"
echo "contenu du fichier01 utilisateur blublublu@free.fr" > fichier01.md
echo "contenu du fichier02 utilisateur blublublu@free.fr" > fichier02.md
