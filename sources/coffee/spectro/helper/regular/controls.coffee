# Spectro element controls helper
class Spectro.Controls extends Spectro.Helper
	defaults:
		activeClass: 'spectro-controls--active'
	
	constructor: (@$target) ->
		super

		label = @$target.data('scheme').attr('spectro-label') or @$target.prop('tagName')

		@$container = $ """
			<div class="spectro-controls spectro-helper">
				<ul class="spectro-controls__toolbar">
					<li class="spectro-controls__toolbar__tool spectro-controls__toolbar__tool--label" title="#{Spectro.i18n('setup')}">#{label}</li>
					<li class="spectro-controls__toolbar__tool spectro-controls__toolbar__tool--handle" title="#{Spectro.i18n('move')}"></li>
					<li class="spectro-controls__toolbar__tool spectro-controls__toolbar__tool--remove" title="#{Spectro.i18n('remove')}"></li>
				</ul>
			</div>
		"""
		.appendTo 'body'
		.on 'mouseover.spectro', =>
			@show()
		.on 'mouseleave.spectro', =>
			if not @$target.is ':focus' then @hide()
		.on 'click.spectro', =>
			@$target.focus()

		$target = @$target
		controls = @

		$removeAction = @$container.find '.spectro-controls__toolbar__tool--remove'
		$moveAction = @$container.find '.spectro-controls__toolbar__tool--handle'
		$setupAction = @$container.find '.spectro-controls__toolbar__tool--label'

		# Remove action
		if $target.is ':spectro-removeable'
			$removeAction.on 'mousedown touchstart', (event) ->
				event.stopPropagation()

				# Remove target element
				$target
					.addClass $.fn.spectro.defaults.removedElementClass
					.on 'transitionend oTransitionEnd otransitionend webkitTransitionEnd', =>

						$parent = $target.parent()

						# Remove target element
						$target.remove()

						# Clean whitespaces on parent to fix ':empty' css selector
						if $parent.children().length is 0
							$parent.html ''

						# Hide controls
						controls.hide()

		else $removeAction.hide()

		# Drag and drop
		if $target.is ':spectro-draggable'

			# Universal drag handler
			dragHandler = (event) ->
				event.preventDefault()

				# Reset focus
				$focusedElement = $ document.activeElement

				if $focusedElement.is ':spectro-enabled'
					$focusedElement.blur()
				
				# Set drag&drop stuff
				$.fn.spectro.$draggedElement = $target
				$.fn.spectro.isDrag = true

				# Visuals
				$.fn.spectro.$draggedElement
					.attr 'aria-grabbed', true
					.addClass $.fn.spectro.defaults.draggedElementClass

				$('html').addClass $.fn.spectro.defaults.documentDraggedClass

			# Better user experience when dragging non-text elements
			$moveAction.on 'mousedown touchstart', dragHandler
			$target.on 'dragstart.spectro', dragHandler

		else $moveAction.hide()

		# Properties setup
		if $target.is ':spectro-setupable'
			$setupAction.on 'mousedown touchstart', (event) ->
				event.preventDefault()

				$label = $ this

				initialLocation =
					top: $label.offset().top
					left: $label.offset().left
					width: $label.outerWidth()
					height: $label.outerHeight()

				sidebar = new Spectro.Sidebar $target, initialLocation

		else $setupAction.hide()

	show: ->
		controls = this

		# Prevent removed elements, dragged elements and already focused elements to be focused
		if not @$target.is ':spectro-controlable' then return

		@$target.addClass $.fn.spectro.defaults.hoveredElementClass
		@$container.addClass @defaults.activeClass
		@update()

	update: ->
		@$container.css
			width: @$target.outerWidth()
			top: @$target.offset().top
			left: @$target.offset().left

	hide: ->
		@$container
			.removeClass @defaults.activeClass
			.css
				width: 'auto'
				left: 0
				top: 0

		@$target.removeClass $.fn.spectro.defaults.hoveredElementClass