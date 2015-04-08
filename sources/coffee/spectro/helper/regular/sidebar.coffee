# Spectro sidebar helper
class Spectro.Sidebar extends Spectro.Helper

	constructor: (@$target, initialLocation) ->
		super

		# Use target as initial location if not set
		initialLocation ?=
			top: $target.offset().top
			left: $target.offset().left
			width: $target.outerWidth()
			height: $target.outerHeight()

		# Setup container
		@$container = $ '''
			<div class="spectro-sidebar spectro-sidebar--active spectro-helper">
				<section class="spectro-sidebar__section">
					<h2 class="spectro-sidebar__section-title">#{$.fn.spectro.i18n.sidebarStyles}</h2>
					<div class="spectro-sidebar__section-contents">
						<label class="spectro-sidebar__section-contents__property">
							<input type="checkbox">Use alternative style 
						</label>
					</div>
				</section>
				<section class="spectro-sidebar__section">
					<h2 class="spectro-sidebar__section-title">#{$.fn.spectro.i18n.sidebarAttributes}</h2>
					<div class="spectro-sidebar__section-contents">
						<label tabindex="2" class="spectro-sidebar__section-contents__property spectro-input"><span class="spectro-input-label">Text property</span>
							<input type="text" class="spectro-input-control" />
						</label>
						<label tabindex="3" class="spectro-sidebar__section-contents__property spectro-input"><span class="spectro-input-label">List property</span>
							<select class="spectro-input-control">
								<option>Value</option>
							</select>
						</label>
					</div>
				</section>
				<section class="spectro-sidebar__section">
					<h2 class="spectro-sidebar__section-title">#{$.fn.spectro.i18n.sidebarContent}</h2>
					<ul class="spectro-sidebar__section-contents">
						<li draggable="true" tabindex="0" class="spectro-sidebar__section-contents__item">Heading</li>
						<li draggable="true" tabindex="0" class="spectro-sidebar__section-contents__item">Paragraph</li>
						<li draggable="true" tabindex="0" class="spectro-sidebar__section-contents__item">List</li>
					</ul>
				</section>
			</div>
		'''
		.appendTo 'body'

		@$container.css
			top: initialLocation.top + 'px'
			left: initialLocation.left + 'px'
			width: initialLocation.width + 'px'
			height: initialLocation.height + 'px'
			overflow: 'hidden'
			color: 'rgba(0, 0, 0, 0)'

		window.setTimeout =>
			@$container.css
				top: ''
				left: ''
				width: ''
				height: ''
				overflow: ''
				color: ''
		, 100