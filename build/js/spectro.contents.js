(function() {
  $.fn.spectro.extensions.contents = {
    selector: ':not(:void):not(:empty)[spectro-editable!="true"]',
    label: Spectro.i18n('contents'),
    focus: function($element) {
      var $parentScheme, $ul;
      $parentScheme = $element.data('scheme');
      $ul = $('<ul class="spectro-panelset__list"></ul>');
      $parentScheme.children().each(function() {
        var $li, $scheme, icon, label;
        $scheme = $(this);
        label = $scheme.attr('spectro-label');
        icon = $scheme.attr('spectro-icon');
        if (icon === void 0) {
          icon = '';
        }
        $li = $("<li class=\"spectro-panelset__list__item spectro-button\"\n	data-ghost-tag=\"" + ($scheme.prop('tagName')) + "\"\n	title=\"" + label + "\"\n	draggable=\"true\">\n	" + label + "\n	<div class=\"spectro-icon\">" + icon + "</div>\n</li>");
        $li.data('scheme', $scheme);
        return $ul.append($li);
      });
      $ul.on('mousedown touchdown', 'li', function(event) {
        var $clone;
        event.preventDefault();
        $clone = $(this).spectro('clone');
        $.fn.spectro.$draggedElement = $clone;
        $.fn.spectro.isDrag = true;
        $.fn.spectro.$draggedElement.attr('aria-grabbed', true);
        return $('html').addClass($.fn.spectro.classes.documentDraggedClass);
      });
      return $ul;
    }
  };

}).call(this);
