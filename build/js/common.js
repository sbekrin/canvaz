(function() {
  $(function() {
    return $('input[name="spectro-mode"]').change(function() {
      if (this.value === 'edit') {
        return $('[data-spectro-scheme]').each(function() {
          var $target;
          $target = $(this);
          if ($target.spectro('enabled')) {
            return;
          }
          return $.get($(this).data('spectro-scheme'), function(response) {
            return $target.spectro('enable', {
              scheme: response
            });
          });
        });
      } else {
        return $('[data-spectro-scheme]').each(function() {
          return $(this).spectro('disable');
        });
      }
    });
  });

}).call(this);
