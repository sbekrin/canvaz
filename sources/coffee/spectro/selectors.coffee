$.extend $.expr[':'],

	# Spectro `:void` selector helper
	# Checks if set element is self-closing
	#
	# Well, <audio> and <video> elements are not void, but their contents
	# are not supposed to be edited
	'void': (element) ->
		[ 'area', 'base', 'br', 'col', 'command',
		  'embed', 'hr', 'img', 'input', 'keygen',
		  'link', 'meta', 'param', 'source', 'track',
		  'wbr', 'audio', 'video' ].indexOf(element.tagName.toLowerCase()) > -1

	# Spectro `:spectro-enabled` selector helper
	# Checks if element is enabled
	'spectro-enabled': (element) -> $(element).spectro 'enabled'

	# Spectro `:spectro-editable` selector helper
	# Checks if set element is contenteditable
	'spectro-editable': (element) ->
		$element = $ element
		$scheme = $element.data 'scheme'

		if not $scheme?
			return false

		isNotVoid = not $scheme.is ':void'
		#isParentEnabled = $element.parent().hasClass $.fn.spectro.classes.enabledElementClass
		isForcedEditable = $scheme.attr('spectro-editable') is 'true'
		hasNoChildren = $scheme.children().length is 0
		
		#return isNotVoid and isParentEnabled and (isForcedEditable or hasNoChildren)
		return isNotVoid and (isForcedEditable or hasNoChildren)

	# Spectro `:spectro-setupable` selector helper
	# Checks if any extension avaible for set element
	'spectro-setupable': (element) ->
		$element = $ element
		
		for key, extension of $.fn.spectro.extensions
			if $element.data('scheme').is extension.selector
				return true

		return false

	# Spectro `:spectro-draggable` selector helper
	# Checks if element can be moved
	# So far only root element is static
	'spectro-draggable': (element) ->
		$element = $ element

		return not $element.attr('data-spectro-scheme')?

	# Spectro `:spectro-removeable` selector helper
	# Checks if element can be removed
	# So far only root element is static
	'spectro-removeable': (element) -> $(element).data('scheme').get(0).parentElement isnt null

	# Spectro `:spectro-controlable` selector helper
	# Checks if controls are allowed for set element
	'spectro-controlable': (element) ->
		$element =  $ element

		# Prevent controls for active, removed and dragged elements
		return $element.parents(':focus').length is 0 and
				not $element.hasClass $.fn.spectro.classes.removedElementClass and
				not $element.hasClass $.fn.spectro.classes.draggedElementClass and
				#not $element.is ':focus'
				not element is document.activeElement
				
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
		return $element.parents('.' + $.fn.spectro.classes.enabledElementClass).filter(filter).length isnt 0