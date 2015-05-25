(function() {
  $.fn.spectro.extensions.wysiwyg = {
    selector: 'p[spectro-editable="true"]',
    label: 'Format',
    panel: function($target) {
      var $element, $panel, element, _i, _len, _ref;
      $target.off('dblclick.spectro').on('dblclick.spectro', function(event) {
        var $this, i, range, selection, spacesCount, string;
        $this = $(this);
        selection = $target.spectro('selection');
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
      });

      /*
      		.on 'mouseup.spectro touchend.spectro', (event) ->
      			$this = $ this
      			selection = $element.spectro 'selection'
      
      			if $this.is(':focus') and
      			   selection isnt null
      				event.stopPropagation()
      
      				 * Show popover if required
      				popover = Spectro.Popover.get()
      				popover.show $this
       */
      $panel = $('<div />');
      _ref = $target.data('scheme').children();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        $element = $(element);
        $panel.append('<button class="spectro-button">' + $element.attr('spectro-label') + '</button>');
      }
      return $panel;
    }
  };

}).call(this);
