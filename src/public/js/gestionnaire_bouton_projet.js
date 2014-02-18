/*
*
*	Fichier gérant les boutons :
*	- Gestion de projet
*
*/
$(function (){

	(function(global){
		if( typeof window !== 'undefined' && global === window ){
			window.gestionnaire_bouton = {};
			global = window.gestionnaire_bouton;
		}

		//click sur le bouton Gestion Projet
		var click_projet = function(){
			var contenu_modal = $('p.contenu_modal_projet');

		}

		var click_fichier = function(){
			var nom_fichier = $(this).text().trim();
			var nom_projet  = $('.projet-ouvert').text().trim(),
			 	csrf = $('#csrf').val();
			$.post('/click_fichier', {'nom_projet':nom_projet, 'nom_fichier':nom_fichier,'_csrf':csrf}, function(data){
				$('.contenu').html(data);
			});

			$('.ouvert').removeClass('ouvert');
			$(".row.fichier:contains('"+nom_fichier+"')").addClass('ouvert');
		}


		var ouverture_dossier = function() {
			var projet = $(this);
			var nom_projet = $(projet).text().trim(),
				csrf = $('#csrf').val();

			$.post('/click_dossier', {'nom_projet' : nom_projet,'_csrf':csrf}, function(data){
				for(var i = 0; i < data.fichiers.length; i++){
					$(projet).after('<div class="row fichier"> &emsp; &emsp; &emsp;'+data.fichiers[i]+'</div>');
					$('.row.fichier').click(click_fichier);
				}
			});
			fermeture_dossier();
			$(projet).removeClass('glyphicon-folder-close');
			$(projet).addClass('glyphicon-folder-open');
			$(projet).addClass('projet-ouvert');
			$(this).unbind('click');
		}

		var fermeture_dossier = function() {
			//change les icones ouvert/ferme ferme/ouvert
			var icon = $('.glyphicon-folder-open');
			$(icon).removeClass('glyphicon-folder-open projet-ouvert');
			$(icon).addClass('glyphicon-folder-close');
			//retire les fichiers ouverts de l arborescence
			$('.row.fichier').remove();
			$(icon).click(ouverture_dossier);
		}

		//suppression du projet cote utilisateur(interface)
		var suppression_liste = function(nom_projet){
			var projet_ouvert = $('.glyphicon-folder-open').text().trim();
			if(projet_ouvert === nom_projet){
				$('.row.fichier').remove();
			}
			$('.glyphicon:contains("'+nom_projet+'")').remove();
		}

		//suppression d'un projet depuis la boite modale (cote serveur, en base)
		var click_suppression_projet = function(){
			var projet = $('#choix_projet').val(),
				csrf = $('#csrf').val();

			suppression_liste(projet); //appel pour supprimer cote client
			$.post("/suppression_projet", {'nom_projet': projet,'_csrf':csrf}, function(data){
				$('#choix_projet :contains("'+ projet +'")').remove();
			});
		}

		var click_ajout_projet = function(){
			var nom_projet = $('#choix_nom').val(),
				pub = $('#public').prop('checked'),
				droit = 'prive',
				csrf = $('#csrf').val(),
				existant = $('.glyphicon:contains("'+nom_projet+'")').text();

			if(pub){
				droit = 'public';
			}

			if(existant === ""){
				$.post("/ajout_projet", {'nom_projet': nom_projet, 'droit':droit, '_csrf':csrf}, function(data){
					if(data === 'creation ok'){
						var nouveau_projet = $('<div class="row"><div class="glyphicon glyphicon-folder-close"> '+nom_projet+'</div></div>');
						$('.col-md-3.bordered').prepend(nouveau_projet);
						$('.glyphicon:contains("'+nom_projet+'")').click(ouverture_dossier);
						$('#choix_projet').append("<option value='"+nom_projet+"'>"+nom_projet+"</option>");
					}
				});
			}
		}

		$('.btn.btn-primary:contains(Projets)').click(click_projet);
		$('.btn.btn-danger:contains(Suppression Projet)').click(click_suppression_projet);
		$('.btn.btn-success:contains(Ajouter Projet)').click(click_ajout_projet);
	})(this);


});