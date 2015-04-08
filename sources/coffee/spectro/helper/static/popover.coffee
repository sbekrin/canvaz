# Spectro popover helper
class Spectro.Popover extends Spectro.StaticHelper
	@get: ->
		if not @$container?
			@$container = $ '''
				<div class="spectro-popover spectro-helper">
					<ul class="spectro-popover__list">
						<li class="spectro-popover__list-item">
							<span class="spectro-icon spectro-icon--clearformat">
						</li>
					</ul>
				</div>
			'''
			.appendTo 'body'

		return @

	@destroy: ->
		if @$container?
			@$container.remove()
			@$container = null

	@show: ($target) ->

		# Get list of allowed elements
		$scheme = $target.data 'scheme'

		if $scheme.children().length is 0 then return

		# Show popover
		@$container.addClass 'spectro-popover--active'

		$window = $ window
		scrollLeft = $window.scrollLeft()
		scrollTop = $window.scrollTop()
		selection = $target.selection()
		range = selection.getRangeAt(0)
		box = range.cloneRange().getBoundingClientRect()

		# Reset prev. elements
		@clean()

		# Double check
		if $scheme.attr('spectro-editable') isnt 'true' then return

		drops = []

		# Add `clean markup` action
		#drops.push $('<li class="spectro-popover__list-item"><span></span></li>')

		popover = this

		# Collect drops
		$scheme.children().each ->
			$element = $ this
			tagName = $element.prop 'tagName'

			$label = $('<span />').text($element.attr 'spectro-label')

			# Append empty dummy to copy styles
			$ghost = $ '<' + tagName + ' />'
			$ghost.appendTo $target

			for property in [ 'font', 'text-decoration', 'text-transform', 'color', 'background' ]
				$label.css property, $ghost.css property

			# Remove dummy
			$ghost.remove()

			# Append drop
			$drop = $ '<li class="spectro-popover__list-item"></li>'
			$drop
				.append $label
				.on 'mousedown touchstart', ->
					$newElement = $ '<' + tagName + ' />'

					# Keep only default attributes and remove `spectro-*` related stuff
					for attribute in $element.get(0).attributes
						if not attribute.name.startsWith 'spectro-'
							$newElement.attr attribute.name, attribute.value

					try
						selection.getRangeAt(0).cloneRange().surroundContents($newElement.get(0))
					catch error

			# Register drop
			popover.add $drop

		# Move popover to target
		@$container.css
			left: (scrollLeft + box.left + (box.width / 2) - (@$container.outerWidth() / 2)) + 'px'
			top: (scrollTop + box.top) + 'px'

	@hide: ->
		if @$container?
			@$container.removeClass 'spectro-popover--active'

	@clean: ->
		@$container
			.find '.spectro-popover__list'
			.html('')

	@add: ($element) ->
		@$container
			.find '.spectro-popover__list'
			.append $element