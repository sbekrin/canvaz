# Spectro base helper class
class Spectro.Helper
	registry = []
	$container: null
	$target: null
	
	@clean: ->
		for helper in registry
			helper.destroy()

	constructor: ->
		registry.push this

	show: -> null
	
	hide: -> null

	destroy: ->
		if this.$container?
			this.$container.remove()
			this.$container = null