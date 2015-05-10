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
      var $element, $scheme, hasNoChildren, isForcedEditable, isNotVoid, isParentEnabled;
      $element = $(element);
      $scheme = $element.data('scheme');
      isNotVoid = !$scheme.is(':void');
      isParentEnabled = $element.parent().hasClass($.fn.spectro.classes.enabledElementClass);
      isForcedEditable = $scheme.attr('spectro-editable') === 'true';
      hasNoChildren = $scheme.children().length === 0;
      return isNotVoid && isParentEnabled && (isForcedEditable || hasNoChildren);
    },
    'spectro-setupable': function(element) {
      var $element, extension, key, _ref;
      $element = $(element);
      _ref = $.fn.spectro.extensions;
      for (key in _ref) {
        extension = _ref[key];
        if ($element.data('scheme').is(extension.avaibleFor())) {
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
      return $element.parents(':focus').length === 0 && !$element.hasClass($.fn.spectro.classes.removedElementClass && !$element.hasClass($.fn.spectro.classes.draggedElementClass && !$element.is(':focus')));
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
      var $moveAction, $removeAction, $setupAction, $target, controls, dragHandler, label;
      this.$target = _at_$target;
      Controls.__super__.constructor.apply(this, arguments);
      label = this.$target.data('scheme').attr('spectro-label') || this.$target.prop('tagName');
      this.$container = $("<div class=\"spectro-controls spectro-helper\">\n	<ul class=\"spectro-controls__toolbar\">\n		<li class=\"spectro-controls__toolbar__tool spectro-controls__toolbar__tool--label\" title=\"" + (Spectro.i18n('setup')) + "\"><span>" + label + "</span></li>\n		<li class=\"spectro-controls__toolbar__tool spectro-controls__toolbar__tool--handle\" title=\"" + (Spectro.i18n('move')) + "\"></li>\n		<li class=\"spectro-controls__toolbar__tool spectro-controls__toolbar__tool--remove\" title=\"" + (Spectro.i18n('remove')) + "\"></li>\n	</ul>\n</div>").appendTo('body').on('mouseover.spectro', (function(_this) {
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
      $removeAction = this.$container.find('.spectro-controls__toolbar__tool--remove');
      $moveAction = this.$container.find('.spectro-controls__toolbar__tool--handle');
      $setupAction = this.$container.find('.spectro-controls__toolbar__tool--label');
      if ($target.is(':spectro-removeable')) {
        $removeAction.on('mousedown touchstart', function(event) {
          event.stopPropagation();
          return $target.addClass($.fn.spectro.classes.removedElementClass).on('transitionend oTransitionEnd otransitionend webkitTransitionEnd', (function(_this) {
            return function() {
              var $parent;
              $parent = $target.parent();
              $target.trigger($.fn.spectro.events.change);
              $target.remove();
              if ($parent.children().length === 0) {
                $parent.html('');
              }
              return controls.hide();
            };
          })(this));
        });
      } else {
        $removeAction.hide();
      }
      if ($target.is(':spectro-draggable')) {
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
        $moveAction.on('mousedown touchstart', dragHandler);
        if ($target.is(':void')) {
          $target.on('dragstart.spectro', dragHandler);
        }
      } else {
        $moveAction.hide();
      }
      if ($target.is(':spectro-setupable')) {
        $setupAction.on('mousedown touchstart', function(event) {
          var $label, initialLocation;
          event.preventDefault();
          $label = $(this);
          initialLocation = {
            top: $label.offset().top,
            left: $label.offset().left,
            width: $label.outerWidth(),
            height: $label.outerHeight()
          };
          return new Spectro.Panelset($target, initialLocation);
        });
      } else {
        $setupAction.hide();
      }
    }

    Controls.prototype.show = function() {
      var controls;
      controls = this;
      if (!this.$target.is(':spectro-controlable')) {
        return;
      }
      this.$target.addClass($.fn.spectro.classes.hoveredElementClass);
      this.$container.addClass(this.defaults.activeClass);
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

  $window = $(window);

  $window.resize(function() {
    var $activeTab, $panelsetContents, $tabs, activeTabPadding, maxHeight, switcherHeight, tabHeight, tabsHeight, windowHeight;
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

  $window.trigger('resize');

  Spectro.Panelset = (function(_super) {
    __extends(Panelset, _super);

    function Panelset(_at_$target) {
      var $container, $tabs, $target, extension, key, _ref;
      this.$target = _at_$target;
      Panelset.__super__.constructor.apply(this, arguments);
      this.$container = $('<div class="spectro-panelset spectro-helper"></div>');
      $tabs = this.$container;
      $container = this.$container;
      $target = this.$target;
      $container.appendTo('body');
      window.setTimeout(function() {
        return $container.addClass('spectro-panelset--active');
      }, 0);
      _ref = $.fn.spectro.extensions;
      for (key in _ref) {
        extension = _ref[key];
        if ($target.data('scheme').is(extension.avaibleFor())) {
          this.addPanelTab(key, extension.label(), extension.panel($target));
        }
      }
      $container.find('.spectro-panelset__input').get(0).checked = true;
    }

    Panelset.prototype.addPanelTab = function(code, label, $contents) {
      var $panelTab;
      $panelTab = $("<input type=\"radio\" class=\"spectro-panelset__input\" id=\"spectro-panelset-" + code + "\" name=\"spectro-panelset\" value=\"" + code + "\" hidden>\n<div class=\"spectro-panelset__tab\">\n	<label for=\"spectro-panelset-contents\" class=\"spectro-panelset__tab__label\">" + label + "</label>\n	<div class=\"spectro-panelset__tab__contents\"></div>\n</div>");
      $panelTab.find('.spectro-panelset__tab__contents').append($contents);
      return this.$container.append($panelTab);
    };

    return Panelset;

  })(Spectro.Helper);

  Spectro.StaticHelper = (function() {
    function StaticHelper() {}

    StaticHelper.$container = null;

    return StaticHelper;

  })();

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

    Breadcrumbs.show = function() {
      return this.$container.addClass('spectro-breadcrumbs--active');
    };

    Breadcrumbs.reset = function() {
      return this.$container.find('.spectro-breadcrumbs__list').html('');
    };

    Breadcrumbs.add = function(label, callback) {
      var $crumb;
      $crumb = $("<li class=\"spectro-breadcrumbs__list-item\" tabindex=\"0\">" + label + "</li>").on('click.spectro', function() {
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
        this.$container = $('<div class="spectro-placeholder spectro-placeholder--horizontal spectro-helper">\n	<hr class="spectro-placeholder__line" />\n</div>').appendTo('body');
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
      if (this.$container != null) {
        this.$container.remove();
        return this.$container = null;
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
      selection = $target.selection();
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
    return $.fn.selection = function() {
      var $element, selection;
      selection = window.getSelection();
      if (selection.isCollapsed === true || selection.toString().replace(/\s/g, '') === '') {
        return null;
      }
      $element = $(selection.anchorNode.parentElement);
      $element = $element.parents('.' + $.fn.spectro.classes.enabledElementClass).is(':spectro-editable');
      if ($element.length === 0) {
        return null;
      }
      return selection;
    };
  })(jQuery);

  (function($) {
    var $document, $html, methods;
    $document = $(document);
    $html = $('html');
    $document.on('mouseup.spectro mouseleave.spectro touchend.spectro touchcancel.spectro', function() {
      var draggedElement;
      if ($('.' + $.fn.spectro.classes.enabledElementClass).length === 0) {
        return;
      }
      Spectro.Popover.hide();
      if ($.fn.spectro.isDrag && ($.fn.spectro.$draggedElement != null)) {
        $.fn.spectro.$draggedElement.attr('aria-grabbed', false);
        $html.removeClass($.fn.spectro.classes.documentDraggedClass);
        if ($.fn.spectro.$lastDragoveredElement != null) {
          if ($.fn.spectro.$lastDragoveredElement.spectro('accepts', $.fn.spectro.$draggedElement)) {
            $.fn.spectro.$lastDragoveredElement.append($.fn.spectro.$draggedElement);
          } else if ($.fn.spectro.draggedElementDropBefore === true) {
            $.fn.spectro.$lastDragoveredElement.before($.fn.spectro.$draggedElement);
          } else {
            $.fn.spectro.$lastDragoveredElement.after($.fn.spectro.$draggedElement);
          }
          $.fn.spectro.$draggedElement.trigger($.fn.spectro.events.change);
        }
        draggedElement = $.fn.spectro.$draggedElement;
        Spectro.Placeholder.destroy();
        $.fn.spectro.isDrag = false;
        $.fn.spectro.$draggedElement = null;
        $.fn.spectro.$lastDragoveredElement = null;
        $.fn.spectro.draggedElementDropBefore = false;
        return draggedElement.trigger('mouseover.spectro');
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
        if ($scheme.attr('spectro-label') != null) {
          controls = new Spectro.Controls($this);
          if (!$html.hasClass($.fn.spectro.classes.documentEnabledClass)) {
            $html.addClass($.fn.spectro.classes.documentEnabledClass);
          }
          if ($this.is(':spectro-inline')) {
            return;
          }
          $this.attr('tabindex', 0).attr('aria-label', $scheme.attr('spectro-label')).attr('aria-grabbed', false).addClass($.fn.spectro.classes.enabledElementClass).trigger($.fn.spectro.events.enable).on('mouseover.spectro', function(event) {
            if (!$.fn.spectro.isDrag && $.fn.spectro.$draggedElement === null) {
              event.stopPropagation();
              controls.show();
              if ($this.is(':spectro-editable')) {
                return $this.attr({
                  contenteditable: true
                });
              }
            }
          }).on('mouseover.spectro', function(event) {
            if ($.fn.spectro.isDrag && $.fn.spectro.$draggedElement !== null && $.fn.spectro.$draggedElement[0] !== $this[0]) {
              if ($this.spectro('accepts', $.fn.spectro.$draggedElement) && $this.children().length === 0) {
                return $.fn.spectro.$lastDragoveredElement = $this;
              }
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
          }).on('dblclick.spectro', function(event) {
            var i, range, selection, spacesCount, string;
            $this = $(this);
            selection = $this.selection();
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
            var popover, selection;
            $this = $(this);
            popover = Spectro.Popover.get();
            selection = $this.selection();
            if ($this.is(':focus') && selection !== null) {
              event.stopPropagation();
              return popover.show($this);
            }
          }).on('mouseout.spectro', function(event) {
            $this = $(this);
            if (!$this.is(':focus')) {
              $this.removeAttr('contenteditable');
              return controls.hide();
            }
          }).on('focus.spectro', function(event) {
            var $parent, path;
            event.preventDefault();
            if (!$this.is(':spectro-controlable')) {
              return;
            }
            $this = $(this);
            if (!$this.hasClass($.fn.spectro.classes.activeElementClass)) {
              $this.addClass($.fn.spectro.classes.activeElementClass);
            }
            if ($this.is(':spectro-editable') && $this.attr('contenteditable') !== 'true') {
              $this.attr('contenteditable', true);
            }
            breadcrumbs.reset();
            controls.show();
            $parent = $this;
            path = [];
            while ($parent.hasClass($.fn.spectro.classes.enabledElementClass) && $parent[0] !== document) {
              path.push($parent);
              $parent = $parent.parent();
            }
            path.reverse();
            $(path).each(function() {
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
            return breadcrumbs.show();
          }).on('blur.spectro', function(event) {
            controls.hide();
            return $(this).removeAttr('contenteditable').removeClass($.fn.spectro.classes.activeElementClass);
          }).on('keydown.spectro', function(event) {
            var $clone;
            $this = $(this);
            $this.trigger($.fn.spectro.events.change);
            if (event.keyCode === 13) {
              event.preventDefault();
              event.stopPropagation();
              $clone = $this.spectro('clone');
              $this.after($clone);
              $clone.focus();
              return false;
            } else if (event.keyCode === 46 && event.ctrlKey === true && $this.is(':spectro-removeable')) {
              event.preventDefault();
              event.stopPropagation();
              return $this.blur().remove();
            } else if ((event.keyCode === 38 || event.keyCode === 40) && event.ctrlKey === true && $this.is(':spectro-draggable')) {
              event.preventDefault();
              event.stopPropagation();
              if (event.keyCode === 38) {
                $this.prev().before($this);
              } else {
                $this.next().after($this);
              }
              return $this.focus();
            }
          }).on('paste.spectro', function(event) {
            event.preventDefault();
            event.stopPropagation();
            return document.execCommand('insertHTML', false, event.originalEvent.clipboardData.getData('text/plain'));
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
        if ($html.hasClass($.fn.spectro.classes.documentEnabledClass)) {
          $html.removeClass($.fn.spectro.classes.documentEnabledClass);
        }
        $this.removeClass($.fn.spectro.classes.enabledElementClass).removeAttr('tabindex').removeAttr('aria-label').removeAttr('aria-grabbed').trigger($.fn.spectro.events.disable).off('.spectro').children().each(function() {
          return $(this).spectro('disable');
        });
        if ($this.attr('class') === '') {
          $this.removeAttr('class');
        }
        Spectro.Helper.clean();
        Spectro.Breadcrumbs.destroy();
        return Spectro.Placeholder.destroy();
      },
      enabled: function() {
        return $(this).hasClass($.fn.spectro.classes.enabledElementClass);
      },
      disabled: function() {
        return !$(this).spectro('enabled');
      },
      accepts: function($element) {
        var $elementScheme, $scheme, $this;
        $this = $(this);
        if ($this.data('scheme') == null) {
          return false;
        }
        $elementScheme = $element.data('scheme');
        $scheme = $this.data('scheme');
        if ($elementScheme.parents().length - 1 !== $scheme.parents().length) {
          return false;
        }
        return $scheme.find("> " + ($elementScheme.prop('tagName')) + "[spectro-label='" + ($elementScheme.attr('spectro-label')) + "']").length !== 0;
      },
      neighbor: function($element) {
        var $this;
        $this = $(this);
        return $this.parent().spectro('accepts', $element);
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
    $.fn.spectro.extensions = [];
    $.fn.spectro.extensions.contents = {
      avaibleFor: function() {
        return ':not(:void):not(:empty)[spectro-editable!="true"]';
      },
      label: function() {
        return Spectro.i18n('contents');
      },
      panel: function($element) {
        var $base, $parentScheme;
        $parentScheme = $element.data('scheme');
        $base = $('<ul class="spectro-panelset__list"></ul>');
        $parentScheme.children().each(function() {
          var $component, $scheme;
          $scheme = $(this);
          $component = $("\n<li class=\"spectro-panelset__list__item\"\n\n	data-ghost-tag=\"" + ($scheme.prop('tagName')) + "\"\n\n	draggable=\"true\">\n\n	" + ($scheme.attr('spectro-label')) + "\n\n</li>\n");
          $component.on('mousedown touchdown', function(event) {
            var $clone;
            event.preventDefault();
            $clone = $(this).spectro('clone', $scheme);
            $.fn.spectro.$draggedElement = $clone;
            $.fn.spectro.isDrag = true;
            $.fn.spectro.$draggedElement.attr('aria-grabbed', true);
            return $('html').addClass($.fn.spectro.classes.documentDraggedClass);
          });
          return $base.append($component);
        });
        return $base;
      }
    };
    $.fn.spectro.extensions.attributes = {
      avaibleFor: function() {
        return '[spectro-attributes]';
      },
      label: function() {
        return Spectro.i18n('attributes');
      },
      panel: function($element) {
        return '<div class="spectro-panelset__panel__contents">\n	<label tabindex="2" class="spectro-panelset__panel__contents__property spectro-input">\n		<span class="spectro-input-label">Text property</span>\n		<input type="text" class="spectro-input-control" />\n	</label>\n	<label tabindex="3" class="spectro-panelset__panel__contents__property spectro-input">\n		<span class="spectro-input-label">List property</span>\n		<select class="spectro-input-control">\n			<option>Value</option>\n		</select>\n	</label>\n</div>';
      }
    };
    $.fn.spectro.extensions.styles = {
      avaibleFor: function() {
        return '[spectro-classes]';
      },
      label: function() {
        return Spectro.i18n('styles');
      },
      panel: function($element) {
        return null;
      }
    };
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
    return $.fn.spectro.i18n = {
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
  })(jQuery);

}).call(this);
