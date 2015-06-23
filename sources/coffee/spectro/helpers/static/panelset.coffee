# Prevent panelset tabs to fall of canvas
$window = $ window

$window.on 'resize.spectro', ->

	# Can we avoid all of this?
	if not $('.spectro-panelset__tab__label').length then return

	$panelsetContents = $ '.spectro-panelset__tab__contents'
	$tabs = $ '.spectro-panelset__tab__label'
	$activeTab = $ 'input:checked + .spectro-panelset__tab'

	# Some weird calculations
	windowHeight = $window.height()
	switcherHeight = $('.spectro-switcher').outerHeight()
	tabHeight = $tabs.first().outerHeight()
	tabsHeight = tabHeight * $tabs.length
	activeTabPadding = parseInt($activeTab.css('padding-top')) + parseInt($activeTab.css('padding-bottom'))
	
	maxHeight = windowHeight - (switcherHeight + tabsHeight + activeTabPadding)

	$panelsetContents.css 'max-height', maxHeight + 'px'

$window.trigger 'resize.spectro'

# Spectro panelset helper
class Spectro.Panelset extends Spectro.StaticHelper
	@get: ->
		if not @$container?
			@$container = $ '<div class="spectro-panelset spectro-helper"></div>'
			.appendTo 'body'

		return @

	@destroy: ->
		if @$container?
			@$container.remove()
			@$container = null

	# Assign extension-related stuff on focus
	@show: ($target) ->

		# Append tab extensions
		for key, extension of $.fn.spectro.extensions
			if extension.focus? and
			   $target.data('scheme').is extension.selector
				@add key, extension.label, extension.focus $target

		# Expand first tab
		$firstInput = @$container.find '.spectro-panelset__input'

		if $firstInput.length
			$firstInput.get(0).checked = true

		# Update max-height
		$window.trigger 'resize.spectro'

	@reset: -> @$container.html ''

	@add: (code, label, $contents) ->

		# Prevent empty panels to be added
		if not $contents? then return

		$panelTab = $ """
			<input type="radio" class="spectro-panelset__input" id="spectro-panelset-#{code}" name="spectro-panelset" value="#{code}" hidden>
			<div class="spectro-panelset__tab">
				<label for="spectro-panelset-#{code}" class="spectro-panelset__tab__label">#{label}</label>
				<div class="spectro-panelset__tab__contents"></div>
			</div>
		"""

		$panelTab.find('.spectro-panelset__tab__contents').append $contents

		@$container.append $panelTab