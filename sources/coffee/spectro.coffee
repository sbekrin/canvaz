# Spectro namespace
class Spectro
	#= require spectro/i18n.coffee
	#= require spectro/helper/regular.coffee
	#= require spectro/helper/regular/controls.coffee
	#= require spectro/helper/regular/sidebar.coffee
	#= require spectro/helper/static.coffee
	#= require spectro/helper/static/breadcrumbs.coffee
	#= require spectro/helper/static/placeholder.coffee
	#= require spectro/helper/static/popover.coffee

#= require spectro/selectors.coffee
#= require spectro/controls.coffee

# String prototype extension
String::startsWith ?= (s) -> @[...s.length] is s
String::endsWith ?= (s) -> s is '' or @[-s.length..] is s

# Text selection polyfill
(($) ->
	$.fn.selection = ->
		selection = window.getSelection()

		# Check if selection is not empty
		if selection.isCollapsed is true or
		   selection.toString().replace(/\s/g, '')  is ''
			return null

		# Search for editable element
		$element = $(selection.anchorNode.parentElement)
		$element = $element.parents('.' + $.fn.spectro.defaults.enabledElementClass).is(':spectro-editable')

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
		if $('.' + $.fn.spectro.defaults.enabledElementClass).length is 0 then return

		# Hide popover
		Spectro.Popover.hide()

		if $.fn.spectro.isDrag and
		   $.fn.spectro.$draggedElement?

			# Remove drag state from draggable element
			$.fn.spectro.$draggedElement
				.attr 'aria-grabbed', false
				.removeClass $.fn.spectro.defaults.draggedElementClass

			# Remove drag class from document to show back controls
			$html.removeClass $.fn.spectro.defaults.documentDraggedClass

			# Drop drag element after target
			if $.fn.spectro.$lastDragoveredElement?
				if $.fn.spectro.draggedElementDropBefore is true
					$.fn.spectro.$lastDragoveredElement.before $.fn.spectro.$draggedElement
				else
					$.fn.spectro.$lastDragoveredElement.after $.fn.spectro.$draggedElement

			# Focus on dragged element
			$.fn.spectro.$draggedElement.focus()

			# Remove placeholder
			Spectro.Placeholder.destroy()

			$.fn.spectro.isDrag = false
			$.fn.spectro.$draggedElement = null
			$.fn.spectro.$lastDragoveredElement = null
			$.fn.spectro.draggedElementDropBefore = false

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
				if not $html.hasClass $.fn.spectro.defaults.documentEnabledClass
					$html.addClass $.fn.spectro.defaults.documentEnabledClass;

				# No setup required for inline stuff
				if $this.is ':spectro-inline' then return

				$this
					.attr 'tabindex', 0
					.attr 'aria-label', $scheme.attr 'spectro-label'
					.attr 'aria-grabbed', false
					.addClass $.fn.spectro.defaults.enabledElementClass
					.trigger 'spectro.enable'

					.on 'mouseover.spectro', (event) ->

						# If this is not drag action
						if not $.fn.spectro.isDrag and
						   $.fn.spectro.$draggedElement is null

							# Prevent root element to be focused
							if $this.attr('data-spectro-scheme')? then return

							event.stopPropagation()
							controls.show()

							# Make element content editable (if allowed) on mouseover to prevent
							# caret to disappear in Firefox
							if $this.is ':spectro-editable'
								$this.attr contenteditable: true

					.on 'mousemove.spectro touchmove.spectro', (event) ->
						# Well this is required for vertical components
						# not a bug or something
						#event.stopPropagation()

						# Get placeholder singleton
						placeholder = Spectro.Placeholder.get()
						$this = $ this

						# If this is drag action and element is not drag target
						if $.fn.spectro.isDrag and
						   $.fn.spectro.$draggedElement isnt null and
						   $.fn.spectro.$draggedElement[0] isnt $this[0]

							# If element is allowed here
							if $this.spectro 'accepts', $.fn.spectro.$draggedElement

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
						#console.log $this.selection() isnt null
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

					.on 'mouseleave.spectro', (event) ->
						#event.stopPropagation()

						$this = $ this

						if not $this.is ':focus'
							$this.removeAttr 'contenteditable'
							controls.hide()
					
					.on 'focus.spectro', (event) ->
						event.preventDefault()

						if not $this.is ':spectro-controlable' then return

						$this = $ this

						if not $this.hasClass $.fn.spectro.defaults.activeElementClass
							$this.addClass $.fn.spectro.defaults.activeElementClass

						# If element is not contenteditable yet
						if $this.is(':spectro-editable') and $this.attr('contenteditable') isnt 'true'
							$this.attr contenteditable: true

						# Clean helpers
						breadcrumbs.reset()
						controls.show()

						# Compile parents path
						$parent = $this
						path = []

						while $parent.hasClass($.fn.spectro.defaults.enabledElementClass) and $parent[0] isnt document
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
					
					.on 'blur.spectro', ->
						controls.hide()

						$ this
							.removeAttr 'contenteditable'
							.removeClass $.fn.spectro.defaults.activeElementClass
					
					.on 'keydown.spectro', (event) ->
						$this = $ this

						# Clone element instead of messy markup on `Enter` hit
						if event.keyCode is 13
							event.preventDefault()
							event.stopPropagation()
							
							$clone = $ '<' + $this.prop('tagName') + ' />'

							$this.after $clone

							$clone
								.html ''
								.spectro 'enable', scheme: $this.data('scheme')

							$clone.focus()

							return false

						# Remove empty element on `Delete` or `Backspace` hit
						else if (event.keyCode is 46 or event.keyCode is 8) and
								$this.is ':spectro-removeable' and
								$.trim($this.html()) is ''

							event.preventDefault()
							event.stopPropagation()

							$this
								.blur()
								.remove()

						# Move element below when `Ctrl` + `Up/Down Arrow` is hit
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
			$this.children().each ->
				$child = $ this
				childTagName = $child.prop('tagName').toLowerCase()

				$child.spectro 'enable', scheme: $scheme.find('> ' + childTagName).get 0

		# Checks if element accepts another
		accepts: ($element) -> $(this).data('scheme').parent().find('> [spectro-label="' + $element.data('scheme').attr('spectro-label') + '"]').length isnt 0

		# Disables Spectro chain
		disable: ->
			$this = $ this

			# Disable document once
			if $html.hasClass $.fn.spectro.defaults.documentEnabledClass
				$html.removeClass $.fn.spectro.defaults.documentEnabledClass

			$this
				.removeClass $.fn.spectro.defaults.enabledElementClass
				.removeAttr 'tabindex'
				.removeAttr 'aria-label'
				.removeAttr 'aria-grabbed'
				.off '.spectro'
				.trigger 'spectro.disable'
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
		enabled: -> $(this).hasClass $.fn.spectro.defaults.enabledElementClass

		# Checks if Spectro chain disabled
		disabled: -> not $element.spectro 'enabled'

	# Spectro entrypoint method
	$.fn.spectro = (method, options...) ->
		if methods[method]
			methods[method].apply this, options
		else if typeof method is 'object' or not method
			methods.init.apply this, options
		else
			console.warn 'Spectro: Unknown method'

	# Global variables
	$.fn.spectro.isDrag = false
	$.fn.spectro.$draggedElement = null
	$.fn.spectro.$lastDragoveredElement = null
	$.fn.spectro.draggedElementDropBefore = false

	# Spectro defaults
	$.fn.spectro.defaults =
		enabledElementClass: 'spectro-element'
		hoveredElementClass: 'spectro-element--hover'
		activeElementClass: 'spectro-element--active'
		removedElementClass: 'spectro-element--removed'
		draggedElementClass: 'spectro-element--dragged'
		documentEnabledClass: 'spectro--enabled'
		documentDraggedClass: 'spectro--dragged'

	# Spectro localization stuff
	$.fn.spectro.lang = $html.attr('lang') or 'en'
	$.fn.spectro.i18n =
		en:
			remove: 'Remove element'
			setup: 'Setup element'
			move: 'Move element'
			sidebarStyles: 'Styles'
			sidebarAttributes: 'Attributes'
			sidebarContent: 'Content'
)(jQuery)