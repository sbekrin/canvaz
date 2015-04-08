(function() {
  $(function() {
    return $('#spectro-switcher').change(function() {
      var $parent;
      $parent = $(this).parents('.spectro-switcher');
      if (this.checked) {
        $parent.addClass('spectro-switcher--active');
        $('#spectro-breadcrumbs').addClass('spectro-breadcrumbs--active');
        $('#spectro-notification').addClass('spectro-notification--active');
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
        $parent.removeClass('spectro-switcher--active');
        $('#spectro-breadcrumbs').removeClass('spectro-breadcrumbs--active');
        $('#spectro-notification').removeClass('spectro-notification--active');
        return $('[data-spectro-scheme]').each(function() {
          return $(this).spectro('disable');
        });
      }
    });
  });

}).call(this);
