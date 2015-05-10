# Prevent panelset tabs to fall of canvas
$window = $ window

$window.resize ->
	$panelsetContents = $ '.spectro-panelset__tab__contents'
	$tabs = $ '.spectro-panelset__tab__label'
	$activeTab = $ 'input:checked + .spectro-panelset__tab'

	windowHeight = $window.height()
	switcherHeight = $('.spectro-switcher').outerHeight()
	tabHeight = $tabs.first().outerHeight()
	tabsHeight = tabHeight * $tabs.length
	activeTabPadding = parseInt($activeTab.css('padding-top')) + parseInt($activeTab.css('padding-bottom'))
	
	maxHeight = windowHeight - (switcherHeight + tabsHeight + activeTabPadding)

	$panelsetContents.css 'max-height', maxHeight + 'px'

$window.trigger 'resize'

# Spectro tabpanel helper
class Spectro.Panelset extends Spectro.Helper

	constructor: (@$target) ->
		super

		# Setup container
		@$container = $ '<div class="spectro-panelset spectro-helper"></div>'

		$tabs = @$container
		$container = @$container
		$target = @$target

		# Show container
		$container.appendTo 'body'
		
		window.setTimeout ->
			$container.addClass 'spectro-panelset--active'
		, 0

		# Append tab extensions
		for key, extension of $.fn.spectro.extensions
			if $target.data('scheme').is extension.avaibleFor()
				this.addPanelTab key, extension.label(), extension.panel $target

		# Show first tab
		$container.find('.spectro-panelset__input').get(0).checked = true

	addPanelTab: (code, label, $contents) ->
		$panelTab = $ """
			<input type="radio" class="spectro-panelset__input" id="spectro-panelset-#{code}" name="spectro-panelset" value="#{code}" hidden>
			<div class="spectro-panelset__tab">
				<label for="spectro-panelset-contents" class="spectro-panelset__tab__label">#{label}</label>
				<div class="spectro-panelset__tab__contents"></div>
			</div>
		"""

		$panelTab.find('.spectro-panelset__tab__contents').append $contents

		@$container.append $panelTab