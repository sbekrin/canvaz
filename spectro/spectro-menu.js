(function (window, document, undefined) {
	var customElement = Object.create(HTMLElement.prototype),
		ownerDocument = (document._currentScript || document.currentScript).ownerDocument;

	customElement.createdCallback = function ( ) {

		// Append shadow root
		var root = this.createShadowRoot(),
			template = ownerDocument.querySelector('template'),
			clone = document.importNode(template.content, true);

		root.appendChild(clone);

		// Replace linked style files with style tags
		var shadowRoot = this.shadowRoot,
			links = shadowRoot.querySelectorAll('link[rel="stylesheet"]');

		$(links).each(function ( ) {
			var link = this;

			$.get(link.href, function (response) {
				$(shadowRoot).prepend($('<style />', {
					html: response
				}));
			});

			link.remove();
		});

		// Add proximity slide-out
		/*
		var $menu = $(this);

		$(window).on('mousemove', function (event) {
			if ($menu.attr('active') == 'true') {
				$menu.css('transform', 'none');
				return;
			}

			var cursor = {
					x: event.clientX,
					y: event.clientY
				},
				$window = $(window),
				windowWidth = $window.width(),
				menuWidth = $menu.width();

			if (cursor.x > (windowWidth - menuWidth * 2)) {
				var translation = -Math.min(cursor.x - windowWidth + menuWidth * 2, menuWidth);
				
				$menu.css('transform', 'translateX(' + translation  + 'px)');
			} else {
				$menu.css('transform', 'none');
			}
		});
		*/

		// Controls
		var $menu = $(this);

		$(shadowRoot.querySelector('.close-controls')).on('click', function ( ) {
			$menu.removeAttr('active');
		});

		/*
		$(shadowRoot.querySelector('.save-controls')).on('click', function ( ) {

			// Find spectro root container
			var $root = $element;

			while ($root.parent().hasClass(window.spectro.ELEMENT_CLASS)) {
				$root = $root.parent();
			}

			$root.trigger('spectrosave', {
				node: $root.get(),
				html: $root.prop('outerHTML')
			});
		});
		*/
	};

	customElement.focusOn = function (element) {
		var $element = $(element),
			scheme = $element.data('scheme'),
			$scheme = $(scheme),
			shadowRoot = this.shadowRoot,
			menu = this;

		var $pathCard = $(shadowRoot.querySelector('.path-card')),
			$classesCard = $(shadowRoot.querySelector('.classes-card')),
			$attributesCard = $(shadowRoot.querySelector('.attributes-card')),
			$contentsCard = $(shadowRoot.querySelector('.contents-card'));

		// Setup dom tree
		(function ( ) {

			// Find parent container
			var $parent = $element,	
				path = [ $element ];

			while ($parent.parent().hasClass(window.spectro.ELEMENT_CLASS)) {
				$parent = $parent.parent();

				path.push($parent);
			}

			path.reverse();

			var $tree = $pathCard.find('.card-list');

			$tree.html('');

			// Compile tree
			var $item;

			$(path).each(function ( ) {
				var $element = $(this),
					$scheme = $($element.data('scheme'));

				$item = $('<li />')
				.text($scheme.attr('spectro-label') || this.nodeName.toLowerCase())
				.on('click', function (event) {
					$element.focus();
				})
				.appendTo($tree);
			});

			$item.addClass('active');
		})();

		// Setup classes
		(function ( ) {
			var $classes = $classesCard.find('.card-list');

			if (scheme && !!$scheme.attr('spectro-classes')) {

				// Clean prev. classes
				$classes.html('');

				var expression = $scheme.attr('spectro-classes') || '[]';

				expression = expression.replace(/'/g, '"');
				expression = '{ "data": ' + expression + ' }';
				
				var json = $.parseJSON(expression);
				
				$(json.data).each(function ( ) {
					var label = this[0],
						value = this[1];

					var $label = $('<label />'),
						$text = label,
						$li = $('<li />'),
						$control;

					// Display dropdown list
					if ($.isArray(value)) {
						$control = $('<select />', {
							class: 'input'
						});

						$(value).each(function (event) {
							var label = this[0],
								name = this[1];

							$option = $('<option />', {
								text: label,
								value: name
							});

							// Set option as selected if class already set
							if ($element.hasClass(name)) {
								$option.attr('selected', 'selected');
							}

							$control.append($option);
						});

						$control.on('change', function (event) {
							$(value).each(function ( ) {
								$element.removeClass(this[1]);
							});

							$element.addClass($control.find(':selected').val());
						});

						$label
						.append($text)
						.append($control);
					} else {

						// Display checkbox
						$control = $('<input />', { type: 'checkbox' });

						// Check the box if class is already set
						if ($element.hasClass(value)) {
							$control.attr('checked', 'checked');
						}

						// Watch checkbox status change
						$control.on('change', function (event) {
							if (this.checked) {
								$element.addClass(value);
							} else {
								$element.removeClass(value);
							}

							$element.focus();
						});	

						$label
						.append($control)
						.append($text);		
					}

					$li
					.append($label)
					.appendTo($classes);
				});

				$classesCard.addClass('visible');
			} else {
				$classesCard.removeClass('visible');
			}
		})();

		// Setup attributes
		(function ( ) {
			var $attributes = $attributesCard.find('.card-list'),
				attributes = [];

			// Remove some attributes
			var expression =  $scheme.attr('spectro-attributes') || '[]';

			expression = expression.replace(/'/g, '"'); // Replace single quotes with double ones
			expression = '{ "data": ' + expression + ' }'; // Wrap json data

			var json = $.parseJSON(expression);
			
			$(json.data).each(function ( ) {
				var label = this[0],
					name = this[1],
					type = this[2];

				// Skip 'class' and 'spectro-*' attributes
				if ($.inArray(name, [ 'class' ]) >= 0 ||
					name.indexOf('spectro-') == 0) {
					return; // continue
				}

				attributes.push({
					label: label,
					name: name,
					type: type
				});
			});

			// Add attributes listning if any exist
			if (attributes.length > 0) {
				$attributes.html('');

				$(attributes).each(function ( ) {
					var	label = this.label,
						name = this.name,
						type = this.type;

					$li = $('<li />')
					.appendTo($attributes);

					$label = $('<label />')
					.append($('<span />').text(label))
					.appendTo($li);

					$input = $('<input />', {
						type: type,
						name: name,
						value: $element.attr(name),
						class: 'input'
					})
					.on('input', function (event) {
						$element.attr(name, this.value);
					})
					.appendTo($label);
				});

				$attributesCard.addClass('visible');
			} else {
				$attributesCard.removeClass('visible');
			}
		})();

		// Setup content
		(function ( ) {
			var $content = $contentsCard.find('.card-list');

			if ($scheme.children().length <= 0) {
				$contentsCard.removeClass('visible');
			} else {
				$contentsCard.addClass('visible');
				$content.html('');

				$scheme.children().each(function ( ) {
					
					// Preview text
					var label = $(this).attr('spectro-label') || this.nodeName,
						dummyScheme = this,
						$dummyScheme = $(dummyScheme);

					$preview = $('<span />').text(label);

					// Copy styles
					var node = this.nodeName,
						$ghost = $('<' + node + ' />').appendTo($element);

					$([ 'color', 'font', 'font-family', 'font-size',
						'background', 'text-decoration', 'border', 'list-style' ]).each(function ( ) {
						$preview.css(this, $ghost.css(this));
					});

					$ghost.remove();
					
					// Reduce space usage
					$preview.css('line-height', '100%');

					// Add result to list
					var $item = $('<li />')
					.attr('draggable', 'true')
					.append($preview)
					.appendTo($content)
					.on('dragstart.spectro', function (event) {
						var dataTransfer = event.originalEvent.dataTransfer,
							$dummy = $('<' + node + ' />');

						// Copy default attributes
						$($dummyScheme.prop('attributes')).each(function ( ) {
							if (this.nodeName.indexOf('spectro-') == 0) {
								return; // continue
							} else {
								$dummy.attr(this.nodeName, this.value);
							}
						});

						$dummy
						.attr('class', $dummyScheme.attr('class'))
						.spectro({
							scheme: dummyScheme
						});

						// Add text if not container
						if ($dummyScheme.children().length <= 0) {
							$dummy.text(label);
						}

						// Set up drag and drop
						dataTransfer.dropEffect = 'move';
						dataTransfer.setData('text/html', $dummy.prop('outerHTML'));

						window.spectro.$lastDraggedElement = $dummy;
					})
					.on('dragend.spectro', function (event) {
						$('.' + window.spectro.DROPZONE_CLASS).remove();		
						window.spectro.$lastDraggedElement = null;
					});
				});
			}
		})();
	};

	customElement.focusOut = function (element) {
		var shadowRoot = this.shadowRoot;

		var $pathCard = $(shadowRoot.querySelector('.path-card'));

		// Highlight last item in path
		$pathCard.find('.card-list li').last().removeClass('active');
	};

	document.registerElement('spectro-menu', {
		prototype: customElement
	});
})(window, document);