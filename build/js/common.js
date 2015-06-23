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
          if ((window.localStorage != null) && window.localStorage.getItem('scheme')) {
            return $target.spectro('enable', {
              scheme: $.parseXML(window.localStorage.getItem('scheme'))
            });
          } else {
            return $.get($(this).data('spectro-scheme'), function(response) {
              if (window.localStorage != null) {
                window.localStorage.setItem('scheme', new XMLSerializer().serializeToString(response));
              }
              return $target.spectro('enable', {
                scheme: response
              });
            });
          }
        });
      } else {
        return $('[data-spectro-scheme]').each(function() {
          return $(this).spectro('disable');
        });
      }
    });
  });

}).call(this);
