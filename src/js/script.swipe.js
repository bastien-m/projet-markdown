if($(window).width()<=992)
{
	$('#file-browser').css({
	'width':'0px'
	});
}

(function($) {
	var mobileExplorerHidden = true;
	$('#file-editor').hammer()
	.on('swiperight',function(e){
		if(mobileExplorerHidden)
		{
			$('#file-browser').animate({
				'width':'120px'
			},250);
			mobileExplorerHidden = false;
		}
	}).on('swipeleft',function(){
		if(!mobileExplorerHidden)
		{
			$('#file-browser').animate({
				'width':'0px'
			},250);
			mobileExplorerHidden = true;
		}
	});

	$('#file-browser').hammer()
	.on('swipeleft',function(){
		if(!mobileExplorerHidden)
		{
			$('#file-browser').animate({
				'width':'0px'
			},250);
			mobileExplorerHidden = true;
		}
	});
})(jQuery);