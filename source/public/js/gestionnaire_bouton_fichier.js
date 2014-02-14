/*
*
*	Fichier gérant les boutons :
*	- Gestion de fichier
*
*/

$(function () {
	(function(){

		//construction de la liste des fichiers supprimable
		var click_fichier = function(){
			var projet_courant = $('.glyphicon-folder-open').text().trim(),
				liste 		   = $('#choix_fichier'),
				csrf           = $('#csrf').val();

				$('option.fichier').remove();
			//recuperation dans data de la liste des fichiers du projet de l utilisateur
			$.post('/recuperation_fichiers_projet', {'nom_projet':projet_courant,'_csrf':csrf}, function(data){
				for(var i = 0; i < data.fichiers.length; i++){
					$(liste).append("<option value='"+ data.fichiers[i] +"' class='form-control fichier'>"+data.fichiers[i]+"</option>");
				}
			});
		}


		var click_fichier_interface = function(){
			var nom_fichier = $(this).text().trim();
			var nom_projet  = $('.projet-ouvert').text().trim(),
				csrf           = $('#csrf').val();

			$.post('/click_fichier', {'nom_projet':nom_projet, 'nom_fichier':nom_fichier,'_csrf':csrf}, function(data){

				$('.contenu').html(data);
			});

			$('.ouvert').removeClass('ouvert');
			$(".row.fichier:contains('"+nom_fichier+"')").addClass('ouvert');
		}

		var suppression_liste = function(nom_fichier){
			var liste = $('#choix_fichier');
			$('option:contains('+nom_fichier+')').remove();
		}


		var suppression_interface = function(nom_fichier){
			$('.row.fichier:contains('+nom_fichier+')').remove();
		}

		var suppression_fichier = function(){
			var fichier = $('#choix_fichier').val(),
				projet  = $('.glyphicon-folder-open').text().trim(),
				csrf           = $('#csrf').val();

			$.post('/suppression_fichier_projet', {'nom_fichier':fichier,  'projet': projet,'_csrf':csrf}, function(data){
				suppression_liste(fichier);
				suppression_interface(fichier);
			});
		}

		var ajouter_fichier_interface = function(nom_fichier){
			$('.glyphicon-folder-open').after("<div class='row fichier'>&emsp;&emsp;&emsp; "+nom_fichier+"</div>")
			$('.row.fichier:contains('+nom_fichier+')').click(click_fichier_interface);
		}

		var ajouter_fichier_liste = function(nom_fichier){
			$('#choix_fichier').append('<option value="'+nom_fichier+'" class="form-control">'+ nom_fichier + "</option>");
		}

		var ajouter_fichier = function(){
			var fichier = $('#choix_nom_fichier').val().trim();
				projet  = $('.glyphicon-folder-open').text().trim(),
				csrf    = $('#csrf').val();

			$.post('/ajout_fichier', {'nom_fichier': fichier, 'projet':projet,'_csrf':csrf}, function(data){
				ajouter_fichier_interface(fichier);
				ajouter_fichier_liste(fichier);
			});
		}

		$('.btn.btn-primary:contains(Gestion Fichier)').click(click_fichier);
		$('.btn.btn-danger:contains(Suppression Fichier)').click(suppression_fichier);
		$('.btn.btn-success:contains(Ajouter Fichier)').click(ajouter_fichier);
	})();
});