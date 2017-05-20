function initHeader(){
	$('.menuPhoto').click(function(){
		$('#menu').toggle();
	});
	$('section, #page, .logoPhoto, .cameraPhoto, .menu-item').click(function(){
		$('#menu').hide();
	});
}