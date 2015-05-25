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
					<li class="spectro-controls__toolbar__tool spectro-controls__toolbar__tool--label"><span>#{label}</span></li>
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

		$remove = @$container.find '.spectro-controls__toolbar__tool--remove'
		$move = @$container.find '.spectro-controls__toolbar__tool--handle'
		$label = @$container.find '.spectro-controls__toolbar__tool--label'

		# Remove action
		$remove.on 'mousedown touchstart', (event) ->
			event.stopPropagation()
			
			$target.spectro 'remove'

		# Drag and drop
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
			$.fn.spectro.$draggedElement.attr 'aria-grabbed', true
			$('html').addClass $.fn.spectro.classes.documentDraggedClass

		# Better user experience when dragging non-text elements
		$move.on 'mousedown touchstart', dragHandler

		# Direct drag and drop for void elements
		if $target.is ':void'
			$target.on 'dragstart.spectro', dragHandler

		# Label
		$label.on 'mousedown touchstart', (event) ->
			event.preventDefault()

			# Focus on element
			$target.trigger 'focus.spectro'

			selection = window.getSelection()

			# Select text in editable elements
			if $target.is ':spectro-editable'
				range = document.createRange()
				range.selectNodeContents $target[0]
				selection.removeAllRanges()
				selection.addRange range

			# Clean text selection on others
			else
				selection.removeAllRanges()

	show: ->
		$container = @$container
		$target = @$target

		$remove = $container.find '.spectro-controls__toolbar__tool--remove'
		$move = $container.find '.spectro-controls__toolbar__tool--handle'
		$label = $container.find '.spectro-controls__toolbar__tool--label'

		# Check remove action
		if $target.is ':spectro-removeable'
			$remove.show()
		else $remove.hide()

		# Drag and drop label
		if $target.is ':spectro-draggable'
			$move.show()
		else $move.hide()

		# Setup label
		$label.show()

		# Prevent removed, dragged and already focused elements to be focused
		if not @$target.is ':spectro-controlable' then return

		$target.addClass $.fn.spectro.classes.hoveredElementClass
		$container.addClass @defaults.activeClass

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

		@$target.removeClass $.fn.spectro.classes.hoveredElementClass