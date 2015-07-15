(function() {
  $.fn.spectro.extensions.wysiwyg = {
    selector: 'p[spectro-editable="true"]',
    label: 'Format',
    $lastTouchedElement: null,
    prepare: function($target, activeElements) {
      var $scheme, extension, items;
      if (activeElements == null) {
        activeElements = [];
      }
      $scheme = $target.data('scheme');
      extension = this;
      items = [];
      $scheme.children().each(function() {
        var $checkbox, $child, $item, tagName;
        tagName = this.tagName;
        $child = $(this);
        $item = $("<label class=\"spectro-popover__list__item\" title=\"" + ($child.attr('spectro-label')) + "\">\n	<input type=\"checkbox\" hidden />\n	<span class=\"spectro-icon\">" + ($child.attr('spectro-icon')) + "</span>\n</label>");
        $checkbox = $item.find('input[type="checkbox"]');
        if (activeElements.indexOf(tagName) > -1) {
          $checkbox.attr('checked', true);
        }
        $checkbox.on('change', function(event) {
          var $dummy, $element, $hookAfter, $hookBefore, $replacement, element, exception, range, replacement, selection;
          selection = $target.spectro('selection');
          if (selection != null) {
            range = selection.getRangeAt(0);
          } else if (extension.$lastTouchedElement != null) {
            range = document.createRange();
            range.selectNode(extension.$lastTouchedElement.get(0));
            selection = window.getSelection();
            selection.addRange(range);
          } else {
            return;
          }
          try {
            if (this.checked) {
              document.execCommand('fontName', false, 'spectro-dummy');
              $dummy = $('font[face="spectro-dummy"]');
              $replacement = $("<" + tagName + " />");
              $replacement.html($dummy.html());
              replacement = $replacement.get(0);
              $dummy.replaceWith(replacement);
              range.selectNode(replacement);
              selection.removeAllRanges();
              selection.addRange(range);
              extension.$lastTouchedElement = $replacement;
            } else if (extension.$lastTouchedElement != null) {
              $element = extension.$lastTouchedElement;
              while (!$element.hasClass($.fn.spectro.classes.enabledElementClass)) {
                element = $element.get(0);
                if (element == null) {
                  break;
                }
                if (element.tagName.toLowerCase() === tagName) {
                  $hookBefore = $('<span />');
                  $hookAfter = $('<span />');
                  $element.before($hookBefore);
                  $element.after($hookAfter);
                  $element.contents().unwrap();
                  extension.$lastTouchedElement = $element.parent();
                  range.setStartAfter($hookBefore.get(0));
                  range.setEndBefore($hookAfter.get(0));
                  $hookBefore.remove();
                  $hookAfter.remove();
                  break;
                }
                $element = $element.parent();
              }
            }
          } catch (_error) {
            exception = _error;
            $checkbox.attr('checked', false);
          }
          selection.removeAllRanges();
          return selection.addRange(range);
        });
        return items.push($item);
      });
      return items;
    },
    enable: function($target) {
      var child, children, extension, popover, _i, _len, _ref;
      popover = Spectro.Popover.get();
      extension = this;
      children = [];
      _ref = $target.data('scheme').children();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        children.push(child.tagName);
      }
      return $target.on('mousedown.spectro-wysiwyg', function(event) {
        return extension.$lastTouchedElement = null;
      }).on('click.spectro-wysiwyg', children.join(','), function(event) {
        var $container, $this, activeElements, offset, position;
        event.stopPropagation();
        $this = $(this);
        extension.$lastTouchedElement = $this;
        activeElements = [];
        $container = $this;
        while (!$container.hasClass($.fn.spectro.classes.enabledElementClass)) {
          activeElements.push($container.prop('tagName').toLowerCase());
          $container = $container.parent();
        }
        popover.clean();
        popover.addAll(extension.prepare($target, activeElements));
        offset = $this.offset();
        position = {
          x: offset.left + $this.outerWidth() / 2,
          y: offset.top
        };
        return popover.show(position);
      }).on('mouseup.spectro-wysiwyg keyup.spectro-wysiwyg touchend.spectro-wysiwyg', function(event) {
        var box, position, range, selection;
        selection = $target.spectro('selection');
        if ($target.is(':focus') && (selection != null) && !selection.isCollapsed) {
          event.stopPropagation();
          position = {
            x: 0,
            y: 0
          };
          range = selection.getRangeAt(0);
          box = range.getBoundingClientRect();
          position.x = box.left + box.width / 2;
          position.y = $(document).scrollTop() + box.top;
          popover.clean();
          popover.addAll(extension.prepare($target));
          return popover.show(position);
        } else {
          return popover.hide();
        }
      });
    },
    disable: function($target) {
      return $target.off('.spectro-wysiwyg');
    }
  };

}).call(this);
