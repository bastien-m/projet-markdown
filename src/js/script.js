$(function() {
	var project_name='';
	var fileName='';
	//--------------------------------------------------------
	var serverAdress='http://192.168.56.101:8383/';
	saveFile = function saveFile(fileName){
			fileName='test.md';
			$.ajax({
				url : serverAdress, // 'setfile.js'
				type : 'POST',
				data : '',//format,
				dataType : 'text',
				success : function(data, statut){
					openFile(fileName);
				},

				error : function(data, statut, erreur){
					alert('erreur:sauvegarde impossible');
				},

				complete : function(data, statut){

				}
			});	
	};
	openFile=function openFile (fileName) {
			$.ajax({
				url : serverAdress, // 'getfile.js'
				type : 'POST',
				data : '',//format,
				dataType : 'text',
				success : function(data, statut){
				   editor.setValue(data);
				   $('#preview').attr('src', $('#preview').attr('src')); // actualiser liframe
				},

				error : function(data, statut, erreur){
				  alert('erreur:overture impossible');
				},

				complete : function(data, statut){

				}
			});
	};

	$('#save-btn').click(function() {

	});
	$('.open-file').click(function() {

	});
	//-----------------------------------------------------------

	var gap=30;
	// var topBarHeight=$('.top-bar').height();
	var topBarHeight=40;
	var initialHeight=$(window).height()-topBarHeight;

	$('.file-browser').css({'height':initialHeight});
	$('.file-editor').css({'height':initialHeight});
	$('#editor').css({'height':initialHeight});
	$('.file-preview').css({'height':initialHeight});
	$('.content-wrapper').css({'height':initialHeight});
	$('#preview').css({
		'height':$('.file-preview').width()-gap,
		'width':$('.file-preview').width()-gap,
		'margin-top':(($('.file-preview').height()-$('.file-preview').width())/2)+5,
		'margin-left':gap/2
	});

	var dynamicHeight=0;
	$(window).resize(function() {
		dynamicHeight = $(window).height()-topBarHeight;
  		$('.file-browser').css({'height':dynamicHeight});
  		$('.file-editor').css({'height':dynamicHeight});
  		$('#editor').css({'height':dynamicHeight});
  		$('.file-preview').css({'height':dynamicHeight});
  		$('.content-wrapper').css({'height':dynamicHeight});

		$('#preview').css({
			'height':$('.file-preview').width()-gap,
			'width':$('.file-preview').width()-gap,
			'margin-top':(($('.file-preview').height()-$('.file-preview').width())/2)+5,
			'margin-left':gap/2
		});
	});

	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
	editor.getSession().setMode("ace/mode/markdown");
	editor.setValue(""); 
	editor.gotoLine(1);

	var mobileMenuHidden = true;
	$('.top-bar').click(function(){
		if(mobileMenuHidden)
		{
			$(this).animate({
				'height':'130px'
			},500);
			mobileMenuHidden = false;
		}
		else
		{
			$(this).animate({
				'height':'40px'
			},500);
			mobileMenuHidden = true;
		}
	});

});