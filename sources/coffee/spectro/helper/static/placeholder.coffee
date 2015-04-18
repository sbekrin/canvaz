# Spectro placeholder helper
class Spectro.Placeholder extends Spectro.StaticHelper
	@get: ->
		if not @$container?
			@$container = $ '''
				<div class="spectro-placeholder spectro-placeholder--horizontal spectro-helper">
					<hr class="spectro-placeholder__line" />
				</div>
			'''
			.appendTo 'body'

		return @

	@destroy: ->
		if @$container?
			@$container.remove()
			@$container = null

	@show: ($target, isVertical = false) ->
		top = $target.offset().top
		left = $target.offset().left

		# Switch orientation
		if isVertical
			if $.fn.spectro.draggedElementDropBefore is false
				left += $target.outerWidth()

			@$container
				.addClass 'spectro-placeholder--vertical'
				.removeClass 'spectro-placeholder--horizontal'
				.css height: $target.outerHeight()
		else
			if $.fn.spectro.draggedElementDropBefore is false
				top += $target.outerHeight()

			@$container
				.addClass 'spectro-placeholder--horizontal'
				.removeClass 'spectro-placeholder--vertical'
				.css width: $target.outerWidth()
		
		# Apply styles
		@$container
			.addClass 'spectro-placeholder--active'
			.css
				top: top
				left: left