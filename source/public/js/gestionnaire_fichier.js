$(function(){

	(function(global) {

		if( typeof window !== 'undefined' && global === window ){
			window.gestionnaire_fichier = {};
			global = window.gestionnaire_fichier;
		}


		global.ouverture_dossier = function() {
			var projet = $(this);
			var nom_projet = $(projet).text().trim(),
			 	csrf = $('#csrf').val();

			$.post('/click_dossier', {'nom_projet' : nom_projet, '_csrf':csrf}, function(data){
				for(var i = 0; i < data.fichiers.length; i++){
					$(projet).after('<div class="row fichier"> &emsp; &emsp; &emsp;'+data.fichiers[i]+'</div>');
					$('.row.fichier').click(global.click_fichier);
				}
			});
			global.fermeture_dossier();
			$(projet).removeClass('glyphicon-folder-close');
			$(projet).addClass('glyphicon-folder-open');
			$(projet).addClass('projet-ouvert');
			$(this).unbind('click');
		}

		global.fermeture_dossier = function() {
			//change les icones ouvert/ferme ferme/ouvert
			var icon = $('.glyphicon-folder-open');
			$(icon).removeClass('glyphicon-folder-open projet-ouvert');
			$(icon).addClass('glyphicon-folder-close');
			//retire les fichiers ouverts de l arborescence
			$('.row.fichier').remove();
			$(icon).click(global.ouverture_dossier);
		}

		global.click_fichier = function(){
			var nom_fichier = $(this).text().trim();
			var nom_projet  = $('.projet-ouvert').text().trim(),
			 	csrf = $('#csrf').val();
			$.post('/click_fichier', {'nom_projet':nom_projet, 'nom_fichier':nom_fichier,'_csrf':csrf}, function(data){
				$('.contenu').html(data);
			});

			$('.ouvert').removeClass('ouvert');
			$(".row.fichier:contains('"+nom_fichier+"')").addClass('ouvert');
		}

		$('.glyphicon-folder-close').click(global.ouverture_dossier);
		$('.row.fichier').on('click', global.click_fichier);
	})(this);

});