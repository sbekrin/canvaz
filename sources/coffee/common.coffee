$ ->
	$('#spectro-switcher').change ->
		$parent = $(this).parents '.spectro-switcher'
		
		if this.checked
			$parent.addClass 'spectro-switcher--active'
	
			#$('#spectro-sidebar').addClass 'spectro-sidebar--active'
			$('#spectro-breadcrumbs').addClass 'spectro-breadcrumbs--active'
			$('#spectro-notification').addClass 'spectro-notification--active'

			# Traverse all Spectro elements
			$('[data-spectro-scheme]').each ->
				$target = $(this)

				# Check if not enabled
				if $target.spectro 'enabled' then return

				# Enable spectro then scheme load is done
				$.get $(this).data('spectro-scheme'), (response) ->
					$target.spectro 'enable', scheme: response
		else
			$parent.removeClass 'spectro-switcher--active'
			
			#$('#spectro-sidebar').removeClass 'spectro-sidebar--active'
			$('#spectro-breadcrumbs').removeClass 'spectro-breadcrumbs--active'
			$('#spectro-notification').removeClass 'spectro-notification--active'

			$('[data-spectro-scheme]').each ->
				$(this).spectro 'disable'