(function() {
  var $window, _base, _base1,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice;

  window.Spectro = {};

  $.extend($.expr[':'], {
    'void': function(element) {
      return ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'audio', 'video'].indexOf(element.tagName.toLowerCase()) > -1;
    },
    'spectro-enabled': function(element) {
      return $(element).spectro('enabled');
    },
    'spectro-editable': function(element) {
      var $element, $scheme, hasNoChildren, isForcedEditable, isNotVoid;
      $element = $(element);
      $scheme = $element.data('scheme');
      if ($scheme == null) {
        return false;
      }
      isNotVoid = !$scheme.is(':void');
      isForcedEditable = $scheme.attr('spectro-editable') === 'true';
      hasNoChildren = $scheme.children().length === 0;
      return isNotVoid && (isForcedEditable || hasNoChildren);
    },
    'spectro-setupable': function(element) {
      var $element, extension, key, _ref;
      $element = $(element);
      _ref = $.fn.spectro.extensions;
      for (key in _ref) {
        extension = _ref[key];
        if ($element.data('scheme').is(extension.selector)) {
          return true;
        }
      }
      return false;
    },
    'spectro-draggable': function(element) {
      var $element;
      $element = $(element);
      return $element.attr('data-spectro-scheme') == null;
    },
    'spectro-removeable': function(element) {
      return $(element).data('scheme').get(0).parentElement !== null;
    },
    'spectro-controlable': function(element) {
      var $element;
      $element = $(element);
      return $element.parents(':focus').length === 0 && !$element.hasClass($.fn.spectro.classes.removedElementClass && !$element.hasClass($.fn.spectro.classes.draggedElementClass && !element === document.activeElement));
    },
    'spectro-inline': function(element) {
      var $element, filter;
      $element = $(element);
      filter = function() {
        var $scheme;
        $scheme = $(this).data('scheme');
        return ($scheme.attr('spectro-label') != null) && $scheme.attr('spectro-editable') === 'true';
      };
      return $element.parents('.' + $.fn.spectro.classes.enabledElementClass).filter(filter).length !== 0;
    }
  });

  Spectro.i18n = function(phraseCode) {
    return $.fn.spectro.i18n[$.fn.spectro.lang][phraseCode];
  };

  Spectro.Helper = (function() {
    var registry;

    registry = [];

    Helper.prototype.$container = null;

    Helper.prototype.$target = null;

    Helper.clean = function() {
      var helper, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = registry.length; _i < _len; _i++) {
        helper = registry[_i];
        _results.push(helper.destroy());
      }
      return _results;
    };

    function Helper() {
      registry.push(this);
    }

    Helper.prototype.show = function() {
      return null;
    };

    Helper.prototype.hide = function() {
      return null;
    };

    Helper.prototype.destroy = function() {
      if (this.$container != null) {
        this.$container.remove();
        return this.$container = null;
      }
    };

    return Helper;

  })();

  Spectro.Controls = (function(_super) {
    __extends(Controls, _super);

    Controls.prototype.defaults = {
      activeClass: 'spectro-controls--active'
    };

    function Controls(_at_$target) {
      var $label, $move, $remove, $target, controls, dragHandler, label;
      this.$target = _at_$target;
      Controls.__super__.constructor.apply(this, arguments);
      label = this.$target.data('scheme').attr('spectro-label') || this.$target.prop('tagName');
      this.$container = $("<div class=\"spectro-controls spectro-helper\">\n	<ul class=\"spectro-controls__toolbar\">\n		<li class=\"spectro-controls__toolbar__tool spectro-controls__toolbar__tool--label\"><span>" + label + "</span></li>\n		<li class=\"spectro-controls__toolbar__tool spectro-controls__toolbar__tool--handle\" title=\"" + (Spectro.i18n('move')) + "\"></li>\n		<li class=\"spectro-controls__toolbar__tool spectro-controls__toolbar__tool--remove\" title=\"" + (Spectro.i18n('remove')) + "\"></li>\n	</ul>\n</div>").appendTo('body').on('mouseover.spectro', (function(_this) {
        return function() {
          return _this.show();
        };
      })(this)).on('mouseleave.spectro', (function(_this) {
        return function() {
          if (!_this.$target.is(':focus')) {
            return _this.hide();
          }
        };
      })(this)).on('click.spectro', (function(_this) {
        return function() {
          return _this.$target.focus();
        };
      })(this));
      $target = this.$target;
      controls = this;
      $remove = this.$container.find('.spectro-controls__toolbar__tool--remove');
      $move = this.$container.find('.spectro-controls__toolbar__tool--handle');
      $label = this.$container.find('.spectro-controls__toolbar__tool--label');
      $remove.on('mousedown touchstart', function(event) {
        event.stopPropagation();
        return $target.spectro('remove');
      });
      dragHandler = function(event) {
        var $focusedElement;
        event.preventDefault();
        $focusedElement = $(document.activeElement);
        if ($focusedElement.is(':spectro-enabled')) {
          $focusedElement.blur();
        }
        $.fn.spectro.$draggedElement = $target;
        $.fn.spectro.isDrag = true;
        $.fn.spectro.$draggedElement.attr('aria-grabbed', true);
        return $('html').addClass($.fn.spectro.classes.documentDraggedClass);
      };
      $move.on('mousedown touchstart', dragHandler);
      if ($target.is(':void')) {
        $target.on('dragstart.spectro', dragHandler);
      }
      $label.on('mousedown touchstart', function(event) {
        var range, selection;
        event.preventDefault();
        $target.trigger('focus.spectro');
        selection = window.getSelection();
        if ($target.is(':spectro-editable')) {
          range = document.createRange();
          range.selectNodeContents($target[0]);
          selection.removeAllRanges();
          return selection.addRange(range);
        } else {
          return selection.removeAllRanges();
        }
      });
    }

    Controls.prototype.show = function() {
      var $container, $label, $move, $remove, $target;
      $container = this.$container;
      $target = this.$target;
      $remove = $container.find('.spectro-controls__toolbar__tool--remove');
      $move = $container.find('.spectro-controls__toolbar__tool--handle');
      $label = $container.find('.spectro-controls__toolbar__tool--label');
      if ($target.is(':spectro-removeable')) {
        $remove.show();
      } else {
        $remove.hide();
      }
      if ($target.is(':spectro-draggable')) {
        $move.show();
      } else {
        $move.hide();
      }
      $label.show();
      if (!this.$target.is(':spectro-controlable')) {
        return;
      }
      $target.addClass($.fn.spectro.classes.hoveredElementClass);
      $container.addClass(this.defaults.activeClass);
      return this.update();
    };

    Controls.prototype.update = function() {
      return this.$container.css({
        width: this.$target.outerWidth(),
        top: this.$target.offset().top,
        left: this.$target.offset().left
      });
    };

    Controls.prototype.hide = function() {
      this.$container.removeClass(this.defaults.activeClass).css({
        width: 'auto',
        left: 0,
        top: 0
      });
      return this.$target.removeClass($.fn.spectro.classes.hoveredElementClass);
    };

    return Controls;

  })(Spectro.Helper);

  Spectro.StaticHelper = (function() {
    function StaticHelper() {}

    StaticHelper.$container = null;

    return StaticHelper;

  })();

  $window = $(window);

  $window.on('resize.spectro', function() {
    var $activeTab, $panelsetContents, $tabs, activeTabPadding, maxHeight, switcherHeight, tabHeight, tabsHeight, windowHeight;
    if (!$('.spectro-panelset__tab__label').length) {
      return;
    }
    $panelsetContents = $('.spectro-panelset__tab__contents');
    $tabs = $('.spectro-panelset__tab__label');
    $activeTab = $('input:checked + .spectro-panelset__tab');
    windowHeight = $window.height();
    switcherHeight = $('.spectro-switcher').outerHeight();
    tabHeight = $tabs.first().outerHeight();
    tabsHeight = tabHeight * $tabs.length;
    activeTabPadding = parseInt($activeTab.css('padding-top')) + parseInt($activeTab.css('padding-bottom'));
    maxHeight = windowHeight - (switcherHeight + tabsHeight + activeTabPadding);
    return $panelsetContents.css('max-height', maxHeight + 'px');
  });

  $window.trigger('resize.spectro');

  Spectro.Panelset = (function(_super) {
    __extends(Panelset, _super);

    function Panelset() {
      return Panelset.__super__.constructor.apply(this, arguments);
    }

    Panelset.get = function() {
      if (this.$container == null) {
        this.$container = $('<div class="spectro-panelset spectro-helper"></div>').appendTo('body');
      }
      return this;
    };

    Panelset.destroy = function() {
      if (this.$container != null) {
        this.$container.remove();
        return this.$container = null;
      }
    };

    Panelset.show = function($target) {
      var $firstInput, extension, key, _ref;
      _ref = $.fn.spectro.extensions;
      for (key in _ref) {
        extension = _ref[key];
        if ($target.data('scheme').is(extension.selector)) {
          this.add(key, extension.label, extension.panel($target));
        }
      }
      $firstInput = this.$container.find('.spectro-panelset__input');
      if ($firstInput.length) {
        $firstInput.get(0).checked = true;
      }
      return $window.trigger('resize.spectro');
    };

    Panelset.reset = function() {
      return this.$container.html('');
    };

    Panelset.add = function(code, label, $contents) {
      var $panelTab;
      if ($contents == null) {
        return;
      }
      $panelTab = $("<input type=\"radio\" class=\"spectro-panelset__input\" id=\"spectro-panelset-" + code + "\" name=\"spectro-panelset\" value=\"" + code + "\" hidden>\n<div class=\"spectro-panelset__tab\">\n	<label for=\"spectro-panelset-" + code + "\" class=\"spectro-panelset__tab__label\">" + label + "</label>\n	<div class=\"spectro-panelset__tab__contents\"></div>\n</div>");
      $panelTab.find('.spectro-panelset__tab__contents').append($contents);
      return this.$container.append($panelTab);
    };

    return Panelset;

  })(Spectro.StaticHelper);

  Spectro.Breadcrumbs = (function(_super) {
    __extends(Breadcrumbs, _super);

    function Breadcrumbs() {
      return Breadcrumbs.__super__.constructor.apply(this, arguments);
    }

    Breadcrumbs.get = function() {
      if (this.$container == null) {
        this.$container = $('<div class="spectro-breadcrumbs spectro-helper">\n	<ul class="spectro-breadcrumbs__list"></ul>\n</div>').appendTo('body');
      }
      return this;
    };

    Breadcrumbs.destroy = function() {
      if (this.$container != null) {
        this.$container.remove();
        return this.$container = null;
      }
    };

    Breadcrumbs.reset = function() {
      return this.$container.find('.spectro-breadcrumbs__list').html('');
    };

    Breadcrumbs.add = function(label, callback) {
      var $crumb;
      $crumb = $("<li class=\"spectro-breadcrumbs__list__item\" tabindex=\"0\"><span>" + label + "</span></li>").on('click.spectro', function() {
        return callback();
      });
      return this.$container.find('.spectro-breadcrumbs__list').append($crumb);
    };

    return Breadcrumbs;

  })(Spectro.StaticHelper);

  Spectro.Placeholder = (function(_super) {
    __extends(Placeholder, _super);

    function Placeholder() {
      return Placeholder.__super__.constructor.apply(this, arguments);
    }

    Placeholder.get = function() {
      if (this.$container == null) {
        this.$container = $('<div class="spectro-placeholder spectro-placeholder--horizontal">\n	<hr class="spectro-placeholder__line" />\n</div>').appendTo('body');
      }
      return this;
    };

    Placeholder.destroy = function() {
      if (this.$container != null) {
        this.$container.remove();
        return this.$container = null;
      }
    };

    Placeholder.show = function($target, isVertical) {
      var left, top;
      if (isVertical == null) {
        isVertical = false;
      }
      top = $target.offset().top;
      left = $target.offset().left;
      if (isVertical) {
        if ($.fn.spectro.draggedElementDropBefore === false) {
          left += $target.outerWidth();
        }
        this.$container.addClass('spectro-placeholder--vertical').removeClass('spectro-placeholder--horizontal').css({
          height: $target.outerHeight()
        });
      } else {
        if ($.fn.spectro.draggedElementDropBefore === false) {
          top += $target.outerHeight();
        }
        this.$container.addClass('spectro-placeholder--horizontal').removeClass('spectro-placeholder--vertical').css({
          width: $target.outerWidth()
        });
      }
      return this.$container.addClass('spectro-placeholder--active').css({
        top: top,
        left: left
      });
    };

    return Placeholder;

  })(Spectro.StaticHelper);

  Spectro.Popover = (function(_super) {
    __extends(Popover, _super);

    function Popover() {
      return Popover.__super__.constructor.apply(this, arguments);
    }

    Popover.get = function() {
      if (this.$container == null) {
        this.$container = $('<div class="spectro-popover spectro-helper">\n	<ul class="spectro-popover__list">\n		<li class="spectro-popover__list-item">\n			<span class="spectro-icon spectro-icon--clearformat">\n		</li>\n	</ul>\n</div>').appendTo('body');
      }
      return this;
    };

    Popover.destroy = function() {
      var $container, container;
      container = this.container;
      if (typeof $container !== "undefined" && $container !== null) {
        $container.remove();
        return $container = null;
      }
    };

    Popover.show = function($target) {
      var $scheme, box, drops, popover, range, scrollLeft, scrollTop, selection;
      $scheme = $target.data('scheme');
      if ($scheme.children().length === 0) {
        return;
      }
      this.$container.addClass('spectro-popover--active');
      $window = $(window);
      scrollLeft = $window.scrollLeft();
      scrollTop = $window.scrollTop();
      selection = $target.spectro('selection');
      range = selection.getRangeAt(0);
      box = range.cloneRange().getBoundingClientRect();
      this.clean();
      if ($scheme.attr('spectro-editable') !== 'true') {
        return;
      }
      drops = [];
      popover = this;
      $scheme.children().each(function() {
        var $drop, $element, $ghost, $label, property, tagName, _i, _len, _ref;
        $element = $(this);
        tagName = $element.prop('tagName');
        $label = $('<span />').text($element.attr('spectro-label'));
        $ghost = $('<' + tagName + ' />');
        $ghost.appendTo($target);
        _ref = ['font', 'text-decoration', 'text-transform', 'color', 'background'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          property = _ref[_i];
          $label.css(property, $ghost.css(property));
        }
        $ghost.remove();
        $drop = $('<li class="spectro-popover__list-item"></li>');
        $drop.append($label).on('mousedown touchstart', function() {
          var $newElement, attribute, error, _j, _len1, _ref1;
          $newElement = $('<' + tagName + ' />');
          _ref1 = $element.get(0).attributes;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            attribute = _ref1[_j];
            if (!attribute.name.startsWith('spectro-')) {
              $newElement.attr(attribute.name, attribute.value);
            }
          }
          try {
            return selection.getRangeAt(0).cloneRange().surroundContents($newElement.get(0));
          } catch (_error) {
            error = _error;
          }
        });
        return popover.add($drop);
      });
      return this.$container.css({
        left: (scrollLeft + box.left + (box.width / 2) - (this.$container.outerWidth() / 2)) + 'px',
        top: (scrollTop + box.top) + 'px'
      });
    };

    Popover.hide = function() {
      if (this.$container != null) {
        return this.$container.removeClass('spectro-popover--active');
      }
    };

    Popover.clean = function() {
      return this.$container.find('.spectro-popover__list').html('');
    };

    Popover.add = function($element) {
      return this.$container.find('.spectro-popover__list').append($element);
    };

    return Popover;

  })(Spectro.StaticHelper);

  if ((_base = String.prototype).startsWith == null) {
    _base.startsWith = function(string) {
      return this.slice(0, string.length) === string;
    };
  }

  if ((_base1 = String.prototype).endsWith == null) {
    _base1.endsWith = function(string) {
      return s === '' || this.slice(-string.length) === string;
    };
  }

  (function($) {
    var $document, $html, methods;
    $document = $(document);
    $html = $('html');
    $document.on('mouseup.spectro mouseleave.spectro touchend.spectro touchcancel.spectro', function() {
      var $draggedElement, spectro;
      spectro = $.fn.spectro;
      if ($('.' + spectro.classes.enabledElementClass).length === 0) {
        return;
      }
      Spectro.Popover.hide();
      if (spectro.isDrag && (spectro.$draggedElement != null)) {
        spectro.$draggedElement.attr('aria-grabbed', false);
        $html.removeClass($.fn.spectro.classes.documentDraggedClass);
        if (spectro.$lastDragoveredElement != null) {
          if (spectro.$lastDragoveredElement.spectro('accepts', $.fn.spectro.$draggedElement)) {
            spectro.$lastDragoveredElement.append($.fn.spectro.$draggedElement);
          } else if (spectro.draggedElementDropBefore === true) {
            spectro.$lastDragoveredElement.before($.fn.spectro.$draggedElement);
          } else {
            spectro.$lastDragoveredElement.after($.fn.spectro.$draggedElement);
          }
          spectro.$draggedElement.trigger($.fn.spectro.events.change);
        }
        $draggedElement = spectro.$draggedElement;
        Spectro.Placeholder.destroy();
        $.fn.spectro.isDrag = false;
        $.fn.spectro.$draggedElement = null;
        $.fn.spectro.$lastDragoveredElement = null;
        $.fn.spectro.draggedElementDropBefore = false;
        if (jQuery.contains(document, $draggedElement[0])) {
          return $draggedElement.trigger('focus.spectro');
        } else {
          return $draggedElement.spectro('remove');
        }
      }
    });
    methods = {
      enable: function(options) {
        var $scheme, $this, breadcrumbs, controls, scheme;
        breadcrumbs = Spectro.Breadcrumbs.get();
        scheme = options.scheme;
        if (scheme instanceof XMLDocument) {
          scheme = scheme.firstChild;
        }
        $scheme = $(scheme);
        $this = $(this);
        $this.data('scheme', $scheme);
        if ($scheme.attr('spectro-label')) {
          $.fn.spectro.enabledElements++;
          controls = new Spectro.Controls($this);
          $this.data('controls', controls);
          if (!$html.hasClass($.fn.spectro.classes.documentEnabledClass)) {
            $html.addClass($.fn.spectro.classes.documentEnabledClass);
          }
          if ($this.is(':spectro-inline')) {
            return;
          }
          $this.attr('tabindex', 0).attr('aria-label', $scheme.attr('spectro-label')).attr('aria-grabbed', false).attr('contenteditable', $this.is(':spectro-editable')).addClass($.fn.spectro.classes.enabledElementClass).trigger($.fn.spectro.events.enable).on('mouseover.spectro dragover.spectro', function(event) {
            var $spectro;
            $spectro = $.fn.spectro;
            if (!$spectro.isDrag && $spectro.$draggedElement === null) {
              event.stopPropagation();
              return controls.show();
            } else if ($spectro.isDrag && $spectro.$draggedElement !== null && $spectro.$draggedElement[0] !== $this[0] && $this.spectro('accepts', $spectro.$draggedElement) && $this.children().length === 0) {
              $.fn.spectro.$lastDragoveredElement = $this;
              return $this.addClass($.fn.spectro.classes.activeElementClass);
            }
          }).on('mousemove.spectro touchmove.spectro', function(event) {
            var isVertical, placeholder;
            placeholder = Spectro.Placeholder.get();
            $this = $(this);
            if ($.fn.spectro.isDrag && $.fn.spectro.$draggedElement !== null && $.fn.spectro.$draggedElement[0] !== $this[0]) {
              if ($this.spectro('neighbor', $.fn.spectro.$draggedElement)) {
                isVertical = false;
                if ($scheme.attr('spectro-orientation') === 'vertical') {
                  isVertical = true;
                  if (event.pageX > $this.offset().left + $this.outerWidth() / 2) {
                    $.fn.spectro.draggedElementDropBefore = false;
                  } else {
                    $.fn.spectro.draggedElementDropBefore = true;
                  }
                } else {
                  if (event.pageY > $this.offset().top + $this.outerHeight() / 2) {
                    $.fn.spectro.draggedElementDropBefore = false;
                  } else {
                    $.fn.spectro.draggedElementDropBefore = true;
                  }
                }
                $.fn.spectro.$lastDragoveredElement = $this;
                return placeholder.show($this, isVertical);
              }
            }
          }).on('mouseout.spectro dragleave.spectro', function(event) {
            var $spectro;
            $this = $(this);
            $spectro = $.fn.spectro;
            if ($spectro.isDrag && $this.hasClass($spectro.classes.activeElementClass)) {
              $this.removeClass($spectro.classes.activeElementClass);
            }
            if (!$this.is(':focus')) {
              return controls.hide();
            }
          }).on('focus.spectro', function(event) {
            var $parent, path;
            event.preventDefault();
            $this = $(this);
            if (!$this.is(':spectro-controlable')) {
              return;
            }
            if (!$this.hasClass($.fn.spectro.classes.activeElementClass)) {
              $this.addClass($.fn.spectro.classes.activeElementClass);
            }
            Spectro.Panelset.get();
            Spectro.Panelset.reset();
            Spectro.Panelset.show($this);
            breadcrumbs.reset();
            $parent = $this;
            path = [];
            while ($parent.hasClass($.fn.spectro.classes.enabledElementClass) && $parent[0] !== document) {
              path.push($parent);
              $parent = $parent.parent();
            }
            path.reverse();
            return $(path).each(function() {
              var $item, index, label;
              $item = $(this);
              label = $item.data('scheme').attr('spectro-label') || $item.prop('tagName');
              index = $item.index($item.prop('tagName'));
              index += 1;
              if (index !== 1) {
                label += ' #' + index;
              }
              return breadcrumbs.add(label, (function() {
                return $item.focus();
              }));
            });
          }).on('blur.spectro', function(event) {
            controls.hide();
            return $(this).removeClass($.fn.spectro.classes.activeElementClass);
          }).on('keydown.spectro', function(event) {
            var $clone, ctrlKey, keyCode;
            $this = $(this);
            $this.trigger($.fn.spectro.events.change);
            keyCode = event.keyCode;
            ctrlKey = event.ctrlKey === true;
            if (keyCode === 27) {
              event.preventDefault();
              event.stopPropagation();
              return $this.trigger('blur');
            } else if (keyCode === 13) {
              event.preventDefault();
              event.stopPropagation();
              $clone = $this.spectro('clone');
              $this.after($clone);
              $clone.focus();
              return false;
            } else if ((keyCode === 46 || keyCode === 8) && (ctrlKey === true || $this.is(':void')) && $this.is(':spectro-removeable')) {
              event.preventDefault();
              event.stopPropagation();
              return $this.spectro('remove');
            } else if ((keyCode === 38 || keyCode === 40) && ctrlKey === true && $this.is(':spectro-draggable')) {
              event.preventDefault();
              event.stopPropagation();
              if (keyCode === 38) {
                $this.prev().before($this);
              } else {
                $this.next().after($this);
              }
              return $this.focus();
            }
          }).on('dragover.spectro', function(event) {
            event.stopPropagation();
            $this = $(this);
            if (!$this.is(':focus')) {
              return $this.focus();
            }
          }).on('input.spectro paste.spectro', function(event) {
            event.stopPropagation();
            $this = $(this);
            return $this.html($this.text());
          });
        }
        return window.setTimeout(function() {
          return $this.children().each(function() {
            var $child, childTagName;
            $child = $(this);
            childTagName = $child.prop('tagName').toLowerCase();
            return $child.spectro('enable', {
              scheme: $scheme.find('> ' + childTagName)
            });
          });
        }, 1);
      },
      disable: function() {
        var $this;
        $this = $(this);
        $.fn.spectro.enabledElements--;
        if ($.fn.spectro.enabledElements === 0 && $html.hasClass($.fn.spectro.classes.documentEnabledClass)) {
          $html.removeClass($.fn.spectro.classes.documentEnabledClass);
        }
        $this.removeClass($.fn.spectro.classes.enabledElementClass).removeAttr('tabindex').removeAttr('aria-label').removeAttr('aria-grabbed').removeAttr('contenteditable').trigger($.fn.spectro.events.disable).off('.spectro').children().each(function() {
          return $(this).spectro('disable');
        });
        if ($.trim($this.attr('class')) === '') {
          $this.removeAttr('class');
        }
        Spectro.Helper.clean();
        Spectro.Breadcrumbs.destroy();
        Spectro.Placeholder.destroy();
        return Spectro.Panelset.destroy();
      },
      enabled: function() {
        return $(this).hasClass($.fn.spectro.classes.enabledElementClass);
      },
      disabled: function() {
        return !$(this).spectro('enabled');
      },
      accepts: function($target) {
        var $scheme, $targetScheme, $this;
        $this = $(this);
        if ($this.data('scheme') == null) {
          return false;
        }
        $targetScheme = $target.data('scheme');
        $scheme = $this.data('scheme');
        if ($targetScheme.parents().length - 1 !== $scheme.parents().length) {
          return false;
        }
        return $scheme.find("> " + ($targetScheme.prop('tagName')) + "[spectro-label='" + ($targetScheme.attr('spectro-label')) + "']").length !== 0;
      },
      neighbor: function($element) {
        var $this;
        $this = $(this);
        return $this.parent().spectro('accepts', $element);
      },
      remove: function() {
        var $parent, $this;
        $.fn.spectro.enabledElements--;
        $this = $(this);
        $this.addClass($.fn.spectro.classes.removedElementClass);
        $parent = $this.parent();
        $this.parent().focus();
        $this.trigger($.fn.spectro.events.change).remove();
        if ($parent.children().length === 0) {
          $parent.html('');
        }
        if ($this.data('controls') != null) {
          return $this.data('controls').destroy();
        }
      },
      clone: function($scheme) {
        var $clone, $this, attribute, _i, _len, _ref;
        if ($scheme == null) {
          $scheme = null;
        }
        $this = $(this);
        $scheme = $scheme || $this.data('scheme');
        $clone = $('<' + $scheme.prop('tagName') + ' />');
        _ref = $scheme.get(0).attributes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attribute = _ref[_i];
          if (!attribute.name.startsWith('spectro-')) {
            $clone.attr(attribute.name, attribute.value);
          }
        }
        $clone.spectro('enable', {
          scheme: $scheme
        });
        return $clone;
      },
      selection: function() {
        var selection;
        selection = window.getSelection();
        if (selection.isCollapsed === true || selection.toString().replace(/\s/g, '') === '') {
          return null;
        }

        /* Search for editable element
        			$element = $ selection.anchorNode.parentElement
        			$element = $element.parents('.' + $.fn.spectro.classes.enabledElementClass).is ':spectro-editable'
        			
        			if $element.length is 0 then return null
         */
        return selection;
      }
    };
    $.fn.spectro = function() {
      var method, options;
      method = arguments[0], options = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (methods[method]) {
        return methods[method].apply(this, options);
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, options);
      } else {
        return console.warn('Spectro: Unknown method');
      }
    };
    $.fn.spectro.enabledElements = 0;
    $.fn.spectro.isDrag = false;
    $.fn.spectro.$draggedElement = null;
    $.fn.spectro.$lastDragoveredElement = null;
    $.fn.spectro.draggedElementDropBefore = false;
    $.fn.spectro.classes = {
      enabledElementClass: 'spectro-element',
      hoveredElementClass: 'spectro-element--hover',
      activeElementClass: 'spectro-element--active',
      removedElementClass: 'spectro-element--removed',
      documentEnabledClass: 'spectro--enabled',
      documentDraggedClass: 'spectro--dragged'
    };
    $.fn.spectro.events = {
      enable: 'enable.spectro',
      disable: 'disable.spectro',
      change: 'change.spectro'
    };
    $.fn.spectro.lang = $html.attr('lang') || 'en';
    $.fn.spectro.i18n = {
      en: {
        remove: 'Remove element',
        setup: 'Setup element',
        move: 'Move element',
        styles: 'Styles',
        attributes: 'Properties',
        contents: 'Contents'
      },
      de: {
        remove: 'Entfernen element',
        setup: 'Setup element',
        move: 'Verschieben element',
        styles: 'Styles',
        attributes: 'Eigenschaften',
        contents: 'Inhalt'
      },
      ru: {
        remove: 'Удалить элемент',
        setup: 'Настроить элемент',
        move: 'Переместить элемент',
        styles: 'Стили',
        attributes: 'Свойства',
        contents: 'Содержимое'
      }
    };
    return $.fn.spectro.extensions = {};
  })(jQuery);

}).call(this);
