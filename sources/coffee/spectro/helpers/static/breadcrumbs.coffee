# Spectro breadcrumbs helper
class Spectro.Breadcrumbs extends Spectro.StaticHelper
	@get: ->
		if not @$container?
			@$container = $ '''
				<div class="spectro-breadcrumbs spectro-helper">
					<ul class="spectro-breadcrumbs__list"></ul>
				</div>
			'''
			.appendTo 'body'

		return @

	@destroy: ->
		if @$container?
			@$container.remove()
			@$container = null

	#@show: -> @$container.addClass 'spectro-breadcrumbs--active'

	@reset: ->
		@$container
			.find '.spectro-breadcrumbs__list'
			.html ''

	@add: (label, callback) ->
		$crumb = $ """
			<li class="spectro-breadcrumbs__list__item" tabindex="0"><span>#{label}</span></li>
		"""
		.on 'click.spectro', ->
			callback()

		@$container
			.find '.spectro-breadcrumbs__list'
			.append $crumb	