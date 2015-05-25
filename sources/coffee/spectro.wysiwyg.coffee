$.fn.spectro.extensions.wysiwyg =
	selector: 'p[spectro-editable="true"]'
	label: 'Format'
	panel: ($target) ->
		$target
		.off 'dblclick.spectro' # TODO: Add onEnable and onDisable extension methods
		.on 'dblclick.spectro', (event) ->
			$this = $ this
			selection = $target.spectro 'selection'

			# If element is active, contenteditable and has text selected
			if $this.is(':focus') and
			   selection isnt null
				event.stopPropagation()

				# Remove trailing whitespace then doubleclick word on windows
				if /(.+)(\s{1,})/g.test selection.toString()

					# Count whitespaces from back
					string = selection.toString();
					spacesCount = 0

					i = string.length

					while i--
						if /\s/.test string[i]
							spacesCount++
						else break

					# Create new selection
					range = selection.getRangeAt(0).cloneRange()
					range.setEnd range.endContainer, range.endOffset - spacesCount

					selection.removeAllRanges()
					selection.addRange range

		###
		.on 'mouseup.spectro touchend.spectro', (event) ->
			$this = $ this
			selection = $element.spectro 'selection'

			if $this.is(':focus') and
			   selection isnt null
				event.stopPropagation()

				# Show popover if required
				popover = Spectro.Popover.get()
				popover.show $this
		###

		$panel = $ '<div />'

		# Collect avaible inline elements
		for element in $target.data('scheme').children()
			$element = $ element
			$panel.append '<button class="spectro-button">' + $element.attr('spectro-label') + '</button>'

		return $panel