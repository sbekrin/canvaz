(function() {
  $.fn.spectro.extensions.wysiwyg = {
    selector: 'p[spectro-editable="true"]',
    label: Spectro.i18n('contents'),
    panel: function($element) {
      $element.off('dblclick.spectro').on('dblclick.spectro', function(event) {
        var $this, i, range, selection, spacesCount, string;
        $this = $(this);
        selection = $element.spectro('selection');
        if ($this.is(':focus') && selection !== null) {
          event.stopPropagation();
          if (/(.+)(\s{1,})/g.test(selection.toString())) {
            string = selection.toString();
            spacesCount = 0;
            i = string.length;
            while (i--) {
              if (/\s/.test(string[i])) {
                spacesCount++;
              } else {
                break;
              }
            }
            range = selection.getRangeAt(0).cloneRange();
            range.setEnd(range.endContainer, range.endOffset - spacesCount);
            selection.removeAllRanges();
            return selection.addRange(range);
          }
        }
      }).on('mouseup.spectro touchend.spectro', function(event) {
        var $this, popover, selection;
        $this = $(this);
        selection = $element.spectro('selection');
        if ($this.is(':focus') && selection !== null) {
          event.stopPropagation();
          popover = Spectro.Popover.get();
          return popover.show($this);
        }
      });
      return null;
    }
  };

}).call(this);
