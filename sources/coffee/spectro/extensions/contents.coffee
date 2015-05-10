$.fn.spectro.extensions.contents =
	avaibleFor: -> ':not(:void):not(:empty)[spectro-editable!="true"]'
	label: -> Spectro.i18n 'contents'
	panel: ($element) ->
		$parentScheme = $element.data 'scheme'
		$base = $ '<ul class="spectro-panelset__list"></ul>'

		# Append all children elements
		$parentScheme.children().each ->
			$scheme = $ this

			$component = $ """
				<li class="spectro-panelset__list__item"
					data-ghost-tag="#{$scheme.prop 'tagName'}"
					draggable="true">
					#{$scheme.attr 'spectro-label'}
				</li>
			"""

			$component
				.on 'mousedown touchdown', (event) ->
					event.preventDefault()
					
					$clone = $(this).spectro 'clone', $scheme

					# Setup drag and drop
					$.fn.spectro.$draggedElement = $clone
					$.fn.spectro.isDrag = true

					$.fn.spectro.$draggedElement.attr 'aria-grabbed', true
					$('html').addClass $.fn.spectro.classes.documentDraggedClass

			$base.append $component
		
		# Return tab contents
		return $base