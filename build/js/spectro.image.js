(function() {
  $.fn.spectro.extensions.image = {
    selector: 'img',
    label: 'Image',
    panel: function($element) {
      var $panel, $url;
      $panel = $('<div />');
      $url = $('<label class="spectro-input"> <span class="spectro-input__label">Source:</span> <input type="text" class="spectro-input__control" value="' + $element.attr('src') + '" /> </label>');
      $panel.append($url);
      return $panel;
    }
  };

}).call(this);
