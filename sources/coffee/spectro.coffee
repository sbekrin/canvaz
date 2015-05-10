window.Spectro = {}

#= require spectro/selectors.coffee
#= require spectro/i18n.coffee
#= require spectro/helpers/regular.coffee
#= require spectro/helpers/regular/controls.coffee
#= require spectro/helpers/regular/panelset.coffee
#= require spectro/helpers/static.coffee
#= require spectro/helpers/static/breadcrumbs.coffee
#= require spectro/helpers/static/placeholder.coffee
#= require spectro/helpers/static/popover.coffee

# String prototype extension
String::startsWith ?= (string) -> @[...string.length] is string
String::endsWith ?= (string) -> s is '' or @[-string.length..] is string

# Text selection polyfill
(($) ->
	$.fn.selection = ->
		selection = window.getSelection()

		# Check if selection is not empty
		if selection.isCollapsed is true or
		   selection.toString().replace(/\s/g, '')  is ''
			return null

		# Search for editable element
		$element = $ selection.anchorNode.parentElement
		$element = $element.parents('.' + $.fn.spectro.classes.enabledElementClass).is ':spectro-editable'

		if $element.length is 0 then return null

		return selection
)(jQuery)

# Spectro plugin
(($) ->
	$document = $ document
	$html = $ 'html'

	# Global document events
	$document.on 'mouseup.spectro mouseleave.spectro touchend.spectro touchcancel.spectro', ->

		# Only if any Spectro instance is active
		if $('.' + $.fn.spectro.classes.enabledElementClass).length is 0 then return

		# Hide popover
		Spectro.Popover.hide()

		if $.fn.spectro.isDrag and
		   $.fn.spectro.$draggedElement?

			# Remove drag state from draggable element
			$.fn.spectro.$draggedElement.attr 'aria-grabbed', false

			# Remove drag class from document to show back controls
			$html.removeClass $.fn.spectro.classes.documentDraggedClass

			if $.fn.spectro.$lastDragoveredElement?

				# Place element inside target
				if $.fn.spectro.$lastDragoveredElement.spectro 'accepts', $.fn.spectro.$draggedElement
					$.fn.spectro.$lastDragoveredElement.append $.fn.spectro.$draggedElement

				# Place element before target
				else if $.fn.spectro.draggedElementDropBefore is true
					$.fn.spectro.$lastDragoveredElement.before $.fn.spectro.$draggedElement

				# Place element after target
				else
					$.fn.spectro.$lastDragoveredElement.after $.fn.spectro.$draggedElement

				# Trigger change event on root element
				$.fn.spectro.$draggedElement.trigger $.fn.spectro.events.change

			# Show controls for dragged element later
			draggedElement = $.fn.spectro.$draggedElement

			# Remove placeholder
			Spectro.Placeholder.destroy()

			$.fn.spectro.isDrag = false
			$.fn.spectro.$draggedElement = null
			$.fn.spectro.$lastDragoveredElement = null
			$.fn.spectro.draggedElementDropBefore = false

			# We have to clean up drag data to show controls
			draggedElement.trigger 'mouseover.spectro'

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

			# Bind scheme before any helpers creation
			$this.data 'scheme', $scheme

			# Check if this is component
			if $scheme.attr('spectro-label')?

				# Create controls for active element
				controls = new Spectro.Controls $this

				# Add class to document
				if not $html.hasClass $.fn.spectro.classes.documentEnabledClass
					$html.addClass $.fn.spectro.classes.documentEnabledClass;

				# No setup required for inline stuff
				if $this.is ':spectro-inline' then return

				$this
					.attr 'tabindex', 0
					.attr 'aria-label', $scheme.attr 'spectro-label'
					.attr 'aria-grabbed', false
					.addClass $.fn.spectro.classes.enabledElementClass
					.trigger $.fn.spectro.events.enable
					.on 'mouseover.spectro', (event) ->

						# If this is not drag action
						if not $.fn.spectro.isDrag and
						   $.fn.spectro.$draggedElement is null

							# Prevent root element to be focused
							#if $this.attr('data-spectro-scheme')? then return

							event.stopPropagation()
							controls.show()

							# Make element content editable (if allowed) on mouseover to prevent
							# caret to disappear in Firefox
							if $this.is ':spectro-editable'
								$this.attr contenteditable: true
					.on 'mouseover.spectro', (event) ->
						if $.fn.spectro.isDrag and
						   $.fn.spectro.$draggedElement isnt null and
						   $.fn.spectro.$draggedElement[0] isnt $this[0]

							if $this.spectro('accepts', $.fn.spectro.$draggedElement) and
							   $this.children().length is 0
								$.fn.spectro.$lastDragoveredElement = $this
					.on 'mousemove.spectro touchmove.spectro', (event) ->

						# Get placeholder singleton
						placeholder = Spectro.Placeholder.get()
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

								placeholder.show $this, isVertical
					.on 'dblclick.spectro', (event) ->
						$this = $ this
						selection = $this.selection()

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
								selection.addRange(range)
					.on 'mouseup.spectro touchend.spectro', (event) ->
						$this = $ this
						popover = Spectro.Popover.get()
						selection = $this.selection()

						if $this.is(':focus') and
						   selection isnt null
							event.stopPropagation()

							# Show popover if required
							popover.show $this
					.on 'mouseout.spectro', (event) ->
						#event.stopPropagation()

						$this = $ this

						if not $this.is ':focus'
							$this.removeAttr 'contenteditable'
							controls.hide()					
					.on 'focus.spectro', (event) ->
						event.preventDefault()

						if not $this.is ':spectro-controlable' then return

						$this = $ this

						if not $this.hasClass $.fn.spectro.classes.activeElementClass
							$this.addClass $.fn.spectro.classes.activeElementClass

						# If element is not contenteditable yet
						if $this.is(':spectro-editable') and $this.attr('contenteditable') isnt 'true'
							$this.attr 'contenteditable', true

						# Clean helpers
						breadcrumbs.reset()
						controls.show()

						# Compile parents path
						$parent = $this
						path = []

						while $parent.hasClass($.fn.spectro.classes.enabledElementClass) and $parent[0] isnt document
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

						breadcrumbs.show()					
					.on 'blur.spectro', (event) ->
						controls.hide()

						$ this
							.removeAttr 'contenteditable'
							.removeClass $.fn.spectro.classes.activeElementClass					
					.on 'keydown.spectro', (event) ->
						$this = $ this
						$this.trigger $.fn.spectro.events.change

						# Clone element instead of messy markup on `Enter`
						if event.keyCode is 13
							event.preventDefault()
							event.stopPropagation()
							
							$clone = $this.spectro 'clone'

							$this.after $clone
							
							$clone.focus()

							return false

						# Remove empty element on `Ctrl` + `Delete`
						else if event.keyCode is 46 and
								event.ctrlKey is true and
								$this.is ':spectro-removeable'

							event.preventDefault()
							event.stopPropagation()

							$this
								.blur()
								.remove()

						# Move element below when `Ctrl` + `Up/Down Arrow`
						else if (event.keyCode is 38 or event.keyCode is 40) and
								event.ctrlKey is true and
								$this.is ':spectro-draggable'

							event.preventDefault()
							event.stopPropagation()

							if event.keyCode is 38
								$this.prev().before $this
							else
								$this.next().after $this

							$this.focus()					
					.on 'paste.spectro', (event) ->
						event.preventDefault();
						event.stopPropagation();

						# Allow plain text insertion only 
						document.execCommand 'insertHTML', false, event.originalEvent.clipboardData.getData 'text/plain'	

			# Proceed spectro enable for children
			# Made this async to prevent document lock on huge elements
			window.setTimeout ->
				$this.children().each ->
					$child = $ this
					childTagName = $child.prop('tagName').toLowerCase()

					$child.spectro 'enable', scheme: $scheme.find('> ' + childTagName)
			, 1

		# Disables Spectro chain
		disable: ->
			$this = $ this

			# Disable document once
			if $html.hasClass $.fn.spectro.classes.documentEnabledClass
				$html.removeClass $.fn.spectro.classes.documentEnabledClass

			$this
				.removeClass $.fn.spectro.classes.enabledElementClass
				.removeAttr 'tabindex'
				.removeAttr 'aria-label'
				.removeAttr 'aria-grabbed'
				.trigger $.fn.spectro.events.disable
				.off '.spectro'
				.children().each ->
					$(this).spectro 'disable'

			# Clean up empty class attribute
			if $this.attr('class') is ''
				$this.removeAttr 'class'

			# Clean all helpers
			Spectro.Helper.clean()
			Spectro.Breadcrumbs.destroy()
			Spectro.Placeholder.destroy()

		# Checks if Spectro chain enabled
		enabled: -> $(this).hasClass $.fn.spectro.classes.enabledElementClass

		# Checks if Spectro chain disabled
		disabled: -> not $(this).spectro 'enabled'

		# Checks if element accepts another
		accepts: ($element) ->
			$this = $ this

			# Check scope
			if not $this.data('scheme')? then return false

			# Retrieve schemas
			$elementScheme = $element.data 'scheme'
			$scheme = $this.data 'scheme'

			# Compare nesting level for alike elments
			if $elementScheme.parents().length - 1 isnt $scheme.parents().length then return false

			return $scheme
				.find "> #{$elementScheme.prop 'tagName'}[spectro-label='#{$elementScheme.attr 'spectro-label'}']"
				.length isnt 0

		# Checks if element is valid near to another
		neighbor: ($element) ->
			$this = $ this

			return $this.parent().spectro 'accepts', $element

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
			$clone.spectro 'enable', scheme: $scheme

			return $clone

	# Spectro entrypoint method
	$.fn.spectro = (method, options...) ->
		if methods[method]
			methods[method].apply this, options
		else if typeof method is 'object' or not method
			methods.init.apply this, options
		else
			console.warn 'Spectro: Unknown method'

	# Extensions object
	$.fn.spectro.extensions = []

	#= require spectro/extensions/contents.coffee
	#= require spectro/extensions/attributes.coffee
	#= require spectro/extensions/styles.coffee

	# Global variables
	$.fn.spectro.isDrag = false
	$.fn.spectro.$draggedElement = null
	$.fn.spectro.$lastDragoveredElement = null
	$.fn.spectro.draggedElementDropBefore = false

	# Spectro defaults
	$.fn.spectro.classes =
		enabledElementClass: 'spectro-element'
		hoveredElementClass: 'spectro-element--hover'
		activeElementClass: 'spectro-element--active'
		removedElementClass: 'spectro-element--removed'
		documentEnabledClass: 'spectro--enabled'
		documentDraggedClass: 'spectro--dragged'

	# Events list
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
)(jQuery)