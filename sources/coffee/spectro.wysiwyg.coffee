$.fn.spectro.extensions.wysiwyg =
	selector: 'p[spectro-editable="true"]'
	label: 'Format'
	$lastTouchedElement: null
	prepare: ($target, activeElements = []) ->
		$scheme = $target.data 'scheme'
		extension = this
		items = []

		# Collect avaible elements
		$scheme.children().each ->
			tagName = this.tagName
			$child = $ this
			$item = $ """
				<label class="spectro-popover__list__item" title="#{$child.attr 'spectro-label'}">
					<input type="checkbox" hidden />
					<span class="spectro-icon">#{$child.attr 'spectro-icon'}</span>
				</label>
			"""

			$checkbox = $item.find 'input[type="checkbox"]'

			$checkbox.attr 'checked', true if activeElements.indexOf(tagName) > -1
			
			$checkbox.on 'change', (event) ->
				selection = $target.spectro 'selection'

				if selection?
					range = selection.getRangeAt 0

				else if extension.$lastTouchedElement?
					range = document.createRange()
					range.selectNode extension.$lastTouchedElement.get 0

					selection = window.getSelection()
					selection.addRange range

				else return

				# Use try cath in case of selection API exceptions
				try
					if this.checked
						
						# One day I will rewrite this using pure Selection API. One day...
						document.execCommand 'fontName', false, 'spectro-dummy'

						$dummy = $ 'font[face="spectro-dummy"]'

						$replacement = $ "<#{tagName} />"
						$replacement.html $dummy.html()
						replacement = $replacement.get 0

						$dummy.replaceWith replacement
						range.selectNode replacement

						selection.removeAllRanges()
						selection.addRange range

						# Fix 
						extension.$lastTouchedElement = $replacement

					else if extension.$lastTouchedElement?
						$element = extension.$lastTouchedElement

						while not $element.hasClass $.fn.spectro.classes.enabledElementClass

							element = $element.get 0

							# Prevent inf. loop
							if not element? then break

							if element.tagName.toLowerCase() is tagName

								$hookBefore = $ '<span />'
								$hookAfter = $ '<span />'

								$element.before $hookBefore
								$element.after $hookAfter
								$element.contents().unwrap()

								extension.$lastTouchedElement = $element.parent()

								range.setStartAfter $hookBefore.get 0
								range.setEndBefore $hookAfter.get 0

								$hookBefore.remove()
								$hookAfter.remove()

								break

							$element = $element.parent()

				catch exception
					$checkbox.attr 'checked', false

				# Select text
				selection.removeAllRanges()
				selection.addRange range

			items.push $item

		return items

	enable: ($target) ->

		popover = Spectro.Popover.get()
		extension = this
		children = []
		children.push child.tagName for child in $target.data('scheme').children()

		# Bind events to target
		$target
			.on 'mousedown.spectro-wysiwyg', (event) ->
				extension.$lastTouchedElement = null

			.on 'click.spectro-wysiwyg', children.join(','), (event) ->
				event.stopPropagation()

				$this = $ this
				extension.$lastTouchedElement = $this

				# This is tricky, as inline elements could contains each others
				activeElements = []
				$container = $this

				while not $container.hasClass $.fn.spectro.classes.enabledElementClass
					activeElements.push $container.prop('tagName').toLowerCase()
					$container = $container.parent()

				popover.clean()
				popover.addAll extension.prepare $target, activeElements

				offset = $this.offset()

				position =
					x: offset.left + $this.outerWidth() / 2
					y: offset.top

				popover.show position
			
			.on 'mouseup.spectro-wysiwyg keyup.spectro-wysiwyg touchend.spectro-wysiwyg', (event) ->
				selection = $target.spectro 'selection'

				# Display popover
				if $target.is(':focus') and
				   selection? and
				   not selection.isCollapsed 

					event.stopPropagation()
					position = x: 0, y: 0

					# Most common case: wrap / unwrap selected text
					range = selection.getRangeAt 0
					box = range.getBoundingClientRect()

					position.x = box.left + box.width / 2
					position.y = $(document).scrollTop() + box.top

					# Setup and show popover
					popover.clean()
					popover.addAll extension.prepare $target
					popover.show position

				else
					popover.hide()

	disable: ($target) ->
		$target.off '.spectro-wysiwyg'