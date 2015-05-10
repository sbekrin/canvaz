$.fn.spectro.extensions.attributes =
	avaibleFor: -> '[spectro-attributes]'
	label: -> Spectro.i18n 'attributes'
	panel: ($element) ->
		'''
		<div class="spectro-panelset__panel__contents">
			<label tabindex="2" class="spectro-panelset__panel__contents__property spectro-input">
				<span class="spectro-input-label">Text property</span>
				<input type="text" class="spectro-input-control" />
			</label>
			<label tabindex="3" class="spectro-panelset__panel__contents__property spectro-input">
				<span class="spectro-input-label">List property</span>
				<select class="spectro-input-control">
					<option>Value</option>
				</select>
			</label>
		</div>
		'''