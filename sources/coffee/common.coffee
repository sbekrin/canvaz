$ ->
	$('input[name="spectro-mode"]').change ->
		if this.value is 'edit'
			$('[data-spectro-scheme]').each ->
				$target = $(this)

				if $target.spectro 'enabled' then return

				$.get $(this).data('spectro-scheme'), (response) ->
					$target.spectro 'enable', scheme: response
		else
			$('[data-spectro-scheme]').each ->
				$(this).spectro 'disable'