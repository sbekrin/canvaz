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

	@show: ($target) ->
		top = $target.offset().top

		# Show placeholder under actual element
		if $.fn.spectro.draggedElementDropBefore is false
			top += $target.outerHeight()

		@$container
			.addClass 'spectro-placeholder--active'
			.css
				top: top
				left: $target.offset().left
				width: $target.outerWidth()