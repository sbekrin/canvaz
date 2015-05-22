$.fn.spectro.extensions.contents =
	selector: ':not(:void):not(:empty)[spectro-editable!="true"]'
	label: Spectro.i18n 'contents'
	panel: ($element) ->
		$parentScheme = $element.data 'scheme'
		$ul = $ '<ul class="spectro-panelset__list"></ul>'

		# Append children elements
		$parentScheme.children().each ->
			$scheme = $ this
			label = $scheme.attr 'spectro-label'

			$li = $ """
				<li class="spectro-panelset__list__item"
					data-ghost-tag="#{$scheme.prop 'tagName'}"
					title="#{label}"
					draggable="true">
					#{label}
				</li>
			"""

			$li.data 'scheme', $scheme
			$ul.append $li

		# Bind dragstart event
		$ul.on 'mousedown touchdown', 'li', (event) ->
			event.preventDefault()

			$clone = $(this).spectro 'clone'

			# Setup drag and drop
			$.fn.spectro.$draggedElement = $clone
			$.fn.spectro.isDrag = true

			$.fn.spectro.$draggedElement.attr 'aria-grabbed', true
			$('html').addClass $.fn.spectro.classes.documentDraggedClass
		
		# Return tab contents
		return $ul