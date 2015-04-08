$.extend $.expr[':'],

	# Spectro `:void` selector helper
	# Checks if set element is self-closing
	'void': (element) ->
		[ 'area', 'base', 'br', 'col', 'command',
		  'embed', 'hr', 'img', 'input', 'keygen',
		  'link', 'meta', 'param', 'source', 'track',
		  'wbr' ].indexOf(element.tagName.toLowerCase()) > -1

	# Spectro `:spectro-enabled` selector helper
	# Checks if element is enabled
	'spectro-enabled': (element) -> $(element).spectro 'enabled'

	# Spectro `:spectro-editable` selector helper
	# Checks if set element is contenteditable
	'spectro-editable': (element) ->
		$element = $ element
		$scheme = $element.data 'scheme'
		
		return not $scheme.is(':void') and
			   $element.parent().hasClass $.fn.spectro.defaults.enabledElementClass or
			   $scheme.attr('spectro-editable') is 'true' and $scheme.children().length is 0

	# TODO:
	'spectro-setupable': (element) -> true

	# Spectro `:spectro-draggable` selector helper
	# Checks of element can be moved
	'spectro-draggable': (element) ->
		$element = $ element

		if $element.attr('data-spectro-scheme') isnt null and
		   $element.parent().children().length is 1
			return false
		else
			return true

	# Spectro `:spectro-removeable` selector helper
	# Checks if element can be removed
	'spectro-removeable': (element) -> not $(element).attr('data-spectro-scheme')?

	# Spectro `:spectro-controlable` selector helper
	# Checks if controls are allowed for set element
	'spectro-controlable': (element) ->
		$element =  $ element

		# Prevent controls for active, removed and dragged elements
		return $element.parents(':focus').length is 0 and
				not $element.hasClass $.fn.spectro.defaults.removedElementClass and
				not $element.hasClass $.fn.spectro.defaults.draggedElementClass and
				not $element.is ':focus'
				
	# Spectro `:spectro-inline` selector helper
	# Checks if element is inline
	'spectro-inline': (element) ->
		$element = $ element

		# This filter checks for `spectro-editable` parents
		filter = ->
			$scheme = $(this).data 'scheme'

			return $scheme.attr('spectro-label')? and
				   $scheme.attr('spectro-editable') is 'true'

		# Check if set element has `spectro-editable` container
		return $element.parents('.' + $.fn.spectro.defaults.enabledElementClass).filter(filter).length isnt 0