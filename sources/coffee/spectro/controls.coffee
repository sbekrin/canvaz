$ ->
	# List menu control
	$('.spectro-list-menu').each ->
		$list = $ this
	
		$list
			.find '.spectro-list-menu__label'
			.on 'click', ->
				$list.toggleClass 'spectro-list-menu--active'