$ ->
	$('input[name="spectro-mode"]').change ->
		if this.value is 'edit'
			$('[data-spectro-scheme]').each ->
				$target = $(this)

				# Check if container already enabled
				if $target.spectro 'enabled' then return

				# Check if scheme file is cached
				if window.localStorage? and
				   window.localStorage.getItem 'scheme'
					$target.spectro 'enable', scheme: $.parseXML window.localStorage.getItem 'scheme' 
				
				# Else load scheme
				else
					$.get $(this).data('spectro-scheme'), (response) ->
						if window.localStorage?
							window.localStorage.setItem 'scheme', new XMLSerializer().serializeToString response

						$target.spectro 'enable', scheme: response
		else
			$('[data-spectro-scheme]').each ->
				$(this).spectro 'disable'