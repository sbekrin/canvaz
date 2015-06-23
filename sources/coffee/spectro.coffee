window.Spectro = {}

#= require spectro/selectors.coffee
#= require spectro/i18n.coffee
#= require spectro/helpers/regular.coffee
#= require spectro/helpers/regular/controls.coffee
#= require spectro/helpers/static.coffee
#= require spectro/helpers/static/panelset.coffee
#= require spectro/helpers/static/breadcrumbs.coffee
#= require spectro/helpers/static/placeholder.coffee
#= require spectro/helpers/static/popover.coffee

# String prototype extension
String::startsWith ?= (string) -> @[...string.length] is string
String::endsWith ?= (string) -> s is '' or @[-string.length..] is string

# Spectro plugin
(($) ->
	$document = $ document
	$html = $ 'html'

	# Global document events
	$document.on 'mouseup.spectro mouseleave.spectro touchend.spectro touchcancel.spectro', ->

		spectro = $.fn.spectro

		# Only if any Spectro instance is active
		if $('.' + spectro.classes.enabledElementClass).length is 0 then return

		# Hide popover
		Spectro.Popover.hide()

		if spectro.isDrag and
		   spectro.$draggedElement?

			# Remove drag state from draggable element
			spectro.$draggedElement.attr 'aria-grabbed', false

			# Remove drag class from document to show back controls
			$html.removeClass $.fn.spectro.classes.documentDraggedClass

			if spectro.$lastDragoveredElement?

				# Place element inside target
				if spectro.$lastDragoveredElement.spectro 'accepts', $.fn.spectro.$draggedElement
					spectro.$lastDragoveredElement.append $.fn.spectro.$draggedElement

				# Place element before target
				else if spectro.draggedElementDropBefore is true
					spectro.$lastDragoveredElement.before $.fn.spectro.$draggedElement

				# Place element after target
				else
					spectro.$lastDragoveredElement.after $.fn.spectro.$draggedElement

				# Trigger change event on root element
				spectro.$draggedElement.trigger $.fn.spectro.events.change

			# Show controls for dragged element later
			$draggedElement = spectro.$draggedElement

			# Remove placeholder
			Spectro.Placeholder.destroy()

			$.fn.spectro.isDrag = false
			$.fn.spectro.$draggedElement = null
			$.fn.spectro.$lastDragoveredElement = null
			$.fn.spectro.draggedElementDropBefore = false

			# Make sure element stays in DOM and show controls
			if jQuery.contains document, $draggedElement[0]
				$draggedElement.trigger 'focus.spectro'
			else
				$draggedElement.spectro 'remove'

	# Plugin methods
	methods =

		# Enables Spectro chain
		enable: (options) ->

			# Singleton helpers
			breadcrumbs = Spectro.Breadcrumbs.get()

			# Get root element instead of whole xml document
			scheme = options.scheme

			if scheme instanceof XMLDocument
				scheme = scheme.firstChild

			$scheme = $ scheme
			$this = $ this

			# Hightlight invalid element
			if scheme is undefined
				return $this.addClass $.fn.spectro.classes.invalidElementClass

			# Bind scheme before any helpers creation
			$this.data 'scheme', $scheme

			# Check if this is component
			if $scheme.attr 'spectro-label'

				$.fn.spectro.enabledElements++

				# Create controls for active element
				controls = new Spectro.Controls $this
				$this.data 'controls', controls

				# Add class to document
				if not $html.hasClass $.fn.spectro.classes.documentEnabledClass
					$html.addClass $.fn.spectro.classes.documentEnabledClass

				# Enable extensions on call
				for key, extension of $.fn.spectro.extensions
					if extension.enable? and
					   $this.data('scheme').is extension.selector
						extension.enable $this

				# No setup required for inline elements
				if $this.is ':spectro-inline' then return

				# Bind attributes and data
				$this
					.attr 'tabindex', 0
					.attr 'aria-label', $scheme.attr 'spectro-label'
					.attr 'aria-grabbed', false
					.attr 'contenteditable', $this.is ':spectro-editable'
					.addClass $.fn.spectro.classes.enabledElementClass
					.trigger $.fn.spectro.events.enable
					.on 'mouseover.spectro dragover.spectro', (event) ->
						$spectro = $.fn.spectro

						# If this is not drag action
						if not $spectro.isDrag and
						   $spectro.$draggedElement is null
							event.stopPropagation()
							controls.show()

						# Check if dragged element acceptable here
						else if $spectro.isDrag and
								$spectro.$draggedElement isnt null and
								$spectro.$draggedElement[0] isnt $this[0] and
								$this.spectro('accepts', $spectro.$draggedElement) and
								$this.children().length is 0

							# Highlight dropzone
							$.fn.spectro.$lastDragoveredElement = $this
							$this.addClass $.fn.spectro.classes.activeElementClass

					# Show visuals and proceed drag and drop action
					.on 'mousemove.spectro touchmove.spectro', (event) ->
						
						# Get placeholder singleton
						$this = $ this

						# If this is drag action and element is not draggable target
						if $.fn.spectro.isDrag and
						   $.fn.spectro.$draggedElement isnt null and
						   $.fn.spectro.$draggedElement[0] isnt $this[0]

							# If element is allowed inside
							if $this.spectro 'neighbor', $.fn.spectro.$draggedElement

								isVertical = false

								# Decide where to drop element (before or after)
								if $scheme.attr('spectro-orientation') is 'vertical'

									# Vertical insertion
									isVertical = true

									if event.pageX > $this.offset().left + $this.outerWidth() / 2
										$.fn.spectro.draggedElementDropBefore = false
									else
										$.fn.spectro.draggedElementDropBefore = true

								else

									# Horizontal insertion
									if event.pageY > $this.offset().top + $this.outerHeight() / 2
										$.fn.spectro.draggedElementDropBefore = false
									else
										$.fn.spectro.draggedElementDropBefore = true

								# This will keep drop target same as palceholder location
								$.fn.spectro.$lastDragoveredElement = $this

								placeholder = Spectro.Placeholder.get()
								placeholder.show $this, isVertical

					# Hide visual border and controls (if not focused)
					.on 'mouseout.spectro dragleave.spectro', (event) ->
						$this = $ this
						$spectro = $.fn.spectro

						# Clean up dropzone highlight
						if $spectro.isDrag and
						   $this.hasClass $spectro.classes.activeElementClass
							$this.removeClass $spectro.classes.activeElementClass

						# Hide controls
						if not $this.is ':focus'
							controls.hide()

					# Show controls and helpers specific to set element
					.on 'focus.spectro', (event) ->
						event.preventDefault()

						$this = $ this

						if not $this.is ':spectro-controlable' then return

						# Add class for active element
						if not $this.hasClass $.fn.spectro.classes.activeElementClass
							$this.addClass $.fn.spectro.classes.activeElementClass

						# Clean helpers
						Spectro.Panelset.get()
						Spectro.Panelset.reset()
						Spectro.Panelset.show $this

						breadcrumbs.reset()
						controls.show()

						# Compile parents path
						$parent = $this
						path = []

						while $parent.hasClass($.fn.spectro.classes.enabledElementClass) and
							  $parent[0] isnt document
							path.push $parent
							$parent = $parent.parent()

						path.reverse()

						$(path).each ->
							$item = $ this
							label = $item.data('scheme').attr('spectro-label') or $item.prop('tagName')
							index = $item.index $item.prop 'tagName'
							index += 1

							if index isnt 1
								label += ' #' + index

							breadcrumbs.add label, (-> $item.focus())

						#breadcrumbs.show()	

					# Hide controls when loosing focus
					.on 'blur.spectro', (event) ->
						controls.hide()

						$(this).removeClass $.fn.spectro.classes.activeElementClass

					# Some usefull hotkeys
					.on 'keydown.spectro', (event) ->
						$this = $ this
						$this.trigger $.fn.spectro.events.change

						keyCode = event.keyCode
						ctrlKey = event.ctrlKey is true

						# Unfocus element on `Esc`
						if keyCode is 27
							event.preventDefault()
							event.stopPropagation()

							$this.trigger 'blur'

						# Clone element instead of messy markup on `Enter`
						else if keyCode is 13
							event.preventDefault()
							event.stopPropagation()
							
							$clone = $this.spectro 'clone'
							$this.after $clone
							$clone.focus()

							return false

						# Remove empty element on `Ctrl` + `Backspace/Delete` or
						# simply `Backspace/Delete` on void elements
						else if (keyCode is 46 or keyCode is 8) and
								(ctrlKey is true or $this.is ':void') and
								$this.is ':spectro-removeable'

							event.preventDefault()
							event.stopPropagation()

							$this.spectro 'remove'

						# Move element on `Ctrl` + `Up/Down Arrow`
						else if (keyCode is 38 or keyCode is 40) and
								ctrlKey is true and
								$this.is ':spectro-draggable'

							event.preventDefault()
							event.stopPropagation()

							if keyCode is 38
								$this.prev().before $this
							else
								$this.next().after $this

							$this.focus()	

					# This is required due to Firefox bug, when
					# dragged text does't insert into target
					.on 'dragover.spectro', (event) ->
						event.stopPropagation()

						$this = $ this

						if not $this.is ':focus'
							$this.focus()

					# Prevent custom markup when copy text from
					# Word-alike editors or other sources
					.on 'input.spectro paste.spectro', (event) ->
						event.stopPropagation()

						$this = $ this
						$this.html $this.text()

			# Proceed spectro enable for children
			# Made this async to prevent document lock on huge elements
			window.setTimeout ->
				$this.children().each ->
					$child = $ this
					childTagName = $child.prop('tagName').toLowerCase()
					$target = $scheme.find '> ' + childTagName

					$child.spectro 'enable', scheme: $target[0]
			, 1

		# Disables Spectro chain
		disable: ->
			$this = $ this

			$.fn.spectro.enabledElements--

			# Disable document
			if $.fn.spectro.enabledElements is 0 and
			   $html.hasClass $.fn.spectro.classes.documentEnabledClass
				$html.removeClass $.fn.spectro.classes.documentEnabledClass

			# Disable extensions on call
			for key, extension of $.fn.spectro.extensions
				if extension.disable? and
				   $this.data('scheme')? and
				   $this.data('scheme').is extension.selector
					extension.disable $this

			$this
				.removeClass $.fn.spectro.classes.enabledElementClass
				.removeAttr 'tabindex'
				.removeAttr 'aria-label'
				.removeAttr 'aria-grabbed'
				.removeAttr 'contenteditable'
				.trigger $.fn.spectro.events.disable
				.off '.spectro'
				.children().each ->
					$(this).spectro 'disable'

			# Clean up empty class attribute
			if $.trim($this.attr('class')) is ''
				$this.removeAttr 'class'

			# Clean all helpers
			Spectro.Helper.clean()
			Spectro.Breadcrumbs.destroy()
			Spectro.Placeholder.destroy()
			Spectro.Panelset.destroy()

		# Checks if Spectro chain enabled
		enabled: -> $(this).hasClass $.fn.spectro.classes.enabledElementClass

		# Checks if Spectro chain disabled
		disabled: -> not $(this).spectro 'enabled'

		# Checks if element accepts another
		accepts: ($target) ->
			$this = $ this

			# Check scope
			if not $this.data('scheme')? then return false

			# Retrieve schemas
			$targetScheme = $target.data 'scheme'
			$scheme = $this.data 'scheme'

			# Compare nesting level
			if $targetScheme.parents().length - 1 isnt $scheme.parents().length then return false

			# Search elements
			return $scheme
				.find "> #{$targetScheme.prop 'tagName'}[spectro-label='#{$targetScheme.attr 'spectro-label'}']"
				.length isnt 0

		# Checks if element is valid near to another
		neighbor: ($element) ->
			$this = $ this

			return $this.parent().spectro 'accepts', $element

		# Removes element
		remove: ->
			$.fn.spectro.enabledElements--
			$this = $ this

			$this.addClass $.fn.spectro.classes.removedElementClass

			$parent = $this.parent()

			# Change focus
			$this.parent().focus()

			# Remove target element
			$this
				.trigger $.fn.spectro.events.change
				.remove()

			# Clean whitespaces on parent to fix ':empty' css selector
			if $parent.children().length is 0
				$parent.html ''

			# TODO: Hide controls
			if $this.data('controls')?
				$this.data('controls').destroy()

		# Creates clone of active element
		clone: ($scheme = null) ->
			$this = $ this

			$scheme = $scheme or $this.data 'scheme'

			$clone = $ '<' + $scheme.prop('tagName') + ' />'

			# Copy attributes except spectro-* related
			for attribute in $scheme.get(0).attributes
				if not attribute.name.startsWith 'spectro-'
					$clone.attr attribute.name, attribute.value

			# Enable clone element
			$clone.spectro 'enable', scheme: $scheme[0]

			return $clone

		# Get text selection in element
		selection: ->
			selection = window.getSelection()

			# Check if selection is not empty
			if selection.isCollapsed is true or
			   selection.toString().replace(/\s/g, '')  is ''
				return null

			### Search for editable element
			$element = $ selection.anchorNode.parentElement
			$element = $element.parents('.' + $.fn.spectro.classes.enabledElementClass).is ':spectro-editable'
			
			if $element.length is 0 then return null###

			return selection

	# Spectro entrypoint method
	$.fn.spectro = (method, options...) ->
		if methods[method]
			methods[method].apply this, options
		else if typeof method is 'object' or not method
			methods.init.apply this, options
		else
			console.warn 'Spectro: Unknown method'

	# Global variables
	$.fn.spectro.enabledElements = 0
	$.fn.spectro.isDrag = false
	$.fn.spectro.$draggedElement = null
	$.fn.spectro.$lastDragoveredElement = null
	$.fn.spectro.draggedElementDropBefore = false

	# Spectro default classes
	$.fn.spectro.classes =
		enabledElementClass: 'spectro-element'
		hoveredElementClass: 'spectro-element--hover'
		activeElementClass: 'spectro-element--active'
		removedElementClass: 'spectro-element--removed'
		invalidElementClass: 'spectro-element--invalid'
		documentEnabledClass: 'spectro--enabled'
		documentDraggedClass: 'spectro--dragged'

	# Spectro default events
	$.fn.spectro.events =
		enable: 'enable.spectro'
		disable: 'disable.spectro'
		change: 'change.spectro'

	# Spectro localization stuff
	$.fn.spectro.lang = $html.attr('lang') or 'en'
	$.fn.spectro.i18n =
		en:
			remove: 'Remove element'
			setup: 'Setup element'
			move: 'Move element'
			styles: 'Styles'
			attributes: 'Properties'
			contents: 'Contents'
		de:
			remove: 'Entfernen element'
			setup: 'Setup element'
			move: 'Verschieben element'
			styles: 'Styles'
			attributes: 'Eigenschaften'
			contents: 'Inhalt'
		ru:
			remove: 'Удалить элемент'
			setup: 'Настроить элемент'
			move: 'Переместить элемент'
			styles: 'Стили'
			attributes: 'Свойства'
			contents: 'Содержимое'

	# Extensions object
	$.fn.spectro.extensions = {}

)(jQuery)