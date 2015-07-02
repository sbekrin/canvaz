# Spectro popover helper
class Spectro.Popover extends Spectro.StaticHelper
	@get: ->
		if not @$container?
			@$container = $ '''
				<div class="spectro-popover spectro-helper">
					<div class="spectro-popover__list"></div>
				</div>
			'''
			.on 'mousedown', (event) ->
				event.preventDefault()
				event.stopPropagation()
			
			.appendTo 'body'

		return @

	@destroy: ->
		if @$container?
			@$container.remove()
			@$container = null

	@add: ($item) ->
		@$container
			.find '.spectro-popover__list'
			.append $item

	@addAll: (items) -> @add $item for $item in items

	@show: (position = x: 0, y: 0) ->

		$window = $ window

		#scroll =
		#	x: $window.scrollLeft()
		#	y: $window.scrollTop()

		# Shift popover to center by x axis
		position.x -= @width() / 2

		# Show popover
		@$container
			.addClass 'spectro-popover--active'
			.css
				left: position.x + 'px'
				top: position.y + 'px'

	@isActive: -> @$container.hasClass 'spectro-popover--active'

	@width: -> @$container.outerWidth()

	@hide: -> @$container.removeClass 'spectro-popover--active' if @$container?

	@clean: ->
		@$container
			.find '.spectro-popover__list'
			.html ''
