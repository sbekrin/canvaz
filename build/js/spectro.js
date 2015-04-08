(function() {
  var Spectro, _base, _base1,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice;

  Spectro = (function() {
    function Spectro() {}

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
        this.$container = $("<div class=\"spectro-controls spectro-helper\">\n	<ul class=\"spectro-controls__toolbar\">\n		<li class=\"spectro-controls__toolbar__tool spectro-controls__toolbar__tool--label\" title=\"" + $.fn.spectro.i18n.setup + "\">" + label + "</li>\n		<li class=\"spectro-controls__toolbar__tool spectro-controls__toolbar__tool--handle\" title=\"" + $.fn.spectro.i18n.move + "\"></li>\n		<li class=\"spectro-controls__toolbar__tool spectro-controls__toolbar__tool--remove\" title=\"" + $.fn.spectro.i18n.remove + "\"></li>\n	</ul>\n</div>").appendTo('body').on('mouseover.spectro', (function(_this) {
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
            $target.addClass($.fn.spectro.defaults.removedElementClass).on('transitionend oTransitionEnd otransitionend webkitTransitionEnd', (function(_this) {
              return function() {
                return $target.remove();
              };
            })(this));
            return controls.hide();
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
            $.fn.spectro.$draggedElement.addClass($.fn.spectro.defaults.draggedElementClass);
            return $('html').addClass($.fn.spectro.defaults.documentDraggedClass);
          };
          $moveAction.on('mousedown touchstart', dragHandler);
          $target.on('dragstart', dragHandler);
        } else {
          $moveAction.hide();
        }
        if ($target.is(':spectro-setupable')) {
          $setupAction.on('mousedown touchstart', function(event) {
            var $label, initialLocation, sidebar;
            event.preventDefault();
            $label = $(this);
            initialLocation = {
              top: $label.offset().top,
              left: $label.offset().left,
              width: $label.outerWidth(),
              height: $label.outerHeight()
            };
            return sidebar = new Spectro.Sidebar($target, initialLocation);
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
        this.$target.addClass($.fn.spectro.defaults.hoveredElementClass);
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
        return this.$target.removeClass($.fn.spectro.defaults.hoveredElementClass);
      };

      return Controls;

    })(Spectro.Helper);

    Spectro.Sidebar = (function(_super) {
      __extends(Sidebar, _super);

      function Sidebar(_at_$target, initialLocation) {
        this.$target = _at_$target;
        Sidebar.__super__.constructor.apply(this, arguments);
        if (initialLocation == null) {
          initialLocation = {
            top: $target.offset().top,
            left: $target.offset().left,
            width: $target.outerWidth(),
            height: $target.outerHeight()
          };
        }
        this.$container = $('<div class="spectro-sidebar spectro-sidebar--active spectro-helper">\n	<section class="spectro-sidebar__section">\n		<h2 class="spectro-sidebar__section-title">#{$.fn.spectro.i18n.sidebarStyles}</h2>\n		<div class="spectro-sidebar__section-contents">\n			<label class="spectro-sidebar__section-contents__property">\n				<input type="checkbox">Use alternative style \n			</label>\n		</div>\n	</section>\n	<section class="spectro-sidebar__section">\n		<h2 class="spectro-sidebar__section-title">#{$.fn.spectro.i18n.sidebarAttributes}</h2>\n		<div class="spectro-sidebar__section-contents">\n			<label tabindex="2" class="spectro-sidebar__section-contents__property spectro-input"><span class="spectro-input-label">Text property</span>\n				<input type="text" class="spectro-input-control" />\n			</label>\n			<label tabindex="3" class="spectro-sidebar__section-contents__property spectro-input"><span class="spectro-input-label">List property</span>\n				<select class="spectro-input-control">\n					<option>Value</option>\n				</select>\n			</label>\n		</div>\n	</section>\n	<section class="spectro-sidebar__section">\n		<h2 class="spectro-sidebar__section-title">#{$.fn.spectro.i18n.sidebarContent}</h2>\n		<ul class="spectro-sidebar__section-contents">\n			<li draggable="true" tabindex="0" class="spectro-sidebar__section-contents__item">Heading</li>\n			<li draggable="true" tabindex="0" class="spectro-sidebar__section-contents__item">Paragraph</li>\n			<li draggable="true" tabindex="0" class="spectro-sidebar__section-contents__item">List</li>\n		</ul>\n	</section>\n</div>').appendTo('body');
        this.$container.css({
          top: initialLocation.top + 'px',
          left: initialLocation.left + 'px',
          width: initialLocation.width + 'px',
          height: initialLocation.height + 'px',
          overflow: 'hidden',
          color: 'rgba(0, 0, 0, 0)'
        });
        window.setTimeout((function(_this) {
          return function() {
            return _this.$container.css({
              top: '',
              left: '',
              width: '',
              height: '',
              overflow: '',
              color: ''
            });
          };
        })(this), 100);
      }

      return Sidebar;

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

      Placeholder.show = function($target) {
        var top;
        top = $target.offset().top;
        if ($.fn.spectro.draggedElementDropBefore === false) {
          top += $target.outerHeight();
        }
        return this.$container.addClass('spectro-placeholder--active').css({
          top: top,
          left: $target.offset().left,
          width: $target.outerWidth()
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
        var $scheme, $window, box, drops, popover, range, scrollLeft, scrollTop, selection;
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

    return Spectro;

  })();

  $.extend($.expr[':'], {
    'void': function(element) {
      return ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'].indexOf(element.tagName.toLowerCase()) > -1;
    },
    'spectro-enabled': function(element) {
      return $(element).spectro('enabled');
    },
    'spectro-editable': function(element) {
      var $element, $scheme;
      $element = $(element);
      $scheme = $element.data('scheme');
      return !$scheme.is(':void') && $element.parent().hasClass($.fn.spectro.defaults.enabledElementClass || $scheme.attr('spectro-editable') === 'true' && $scheme.children().length === 0);
    },
    'spectro-setupable': function(element) {
      return true;
    },
    'spectro-draggable': function(element) {
      var $element;
      $element = $(element);
      if ($element.attr('data-spectro-scheme') !== null && $element.parent().children().length === 1) {
        return false;
      } else {
        return true;
      }
    },
    'spectro-removeable': function(element) {
      return $(element).attr('data-spectro-scheme') == null;
    },
    'spectro-controlable': function(element) {
      var $element;
      $element = $(element);
      return $element.parents(':focus').length === 0 && !$element.hasClass($.fn.spectro.defaults.removedElementClass && !$element.hasClass($.fn.spectro.defaults.draggedElementClass && !$element.is(':focus')));
    },
    'spectro-inline': function(element) {
      var $element, filter;
      $element = $(element);
      filter = function() {
        var $scheme;
        $scheme = $(this).data('scheme');
        return ($scheme.attr('spectro-label') != null) && $scheme.attr('spectro-editable') === 'true';
      };
      return $element.parents('.' + $.fn.spectro.defaults.enabledElementClass).filter(filter).length !== 0;
    }
  });

  if ((_base = String.prototype).startsWith == null) {
    _base.startsWith = function(s) {
      return this.slice(0, s.length) === s;
    };
  }

  if ((_base1 = String.prototype).endsWith == null) {
    _base1.endsWith = function(s) {
      return s === '' || this.slice(-s.length) === s;
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
      $element = $element.parents('.' + $.fn.spectro.defaults.enabledElementClass).is(':spectro-editable');
      if ($element.length === 0) {
        return null;
      }
      return selection;
    };
  })(jQuery);

  (function($) {
    var methods;
    $(document).on('mouseup.spectro mouseleave.spectro touchend.spectro touchcancel.spectro', function() {
      Spectro.Popover.hide();
      if ($.fn.spectro.isDrag && ($.fn.spectro.$draggedElement != null)) {
        $.fn.spectro.$draggedElement.removeClass($.fn.spectro.defaults.draggedElementClass);
        $('html').removeClass($.fn.spectro.defaults.documentDraggedClass);
        if ($.fn.spectro.$lastDragoveredElement != null) {
          if ($.fn.spectro.draggedElementDropBefore === true) {
            $.fn.spectro.$lastDragoveredElement.before($.fn.spectro.$draggedElement);
          } else {
            $.fn.spectro.$lastDragoveredElement.after($.fn.spectro.$draggedElement);
          }
        }
        Spectro.Placeholder.destroy();
        $.fn.spectro.isDrag = false;
        $.fn.spectro.$draggedElement = null;
        $.fn.spectro.$lastDragoveredElement = null;
        return $.fn.spectro.draggedElementDropBefore = false;
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
          $('html').addClass($.fn.spectro.defaults.documentEnabledClass);
          if ($this.is(':spectro-inline')) {
            return;
          }
          $this.attr('tabindex', 0).attr('aria-label', $scheme.attr('spectro-label')).addClass($.fn.spectro.defaults.enabledElementClass).trigger('spectro.enable').on('mouseover.spectro', function(event) {
            if (!$.fn.spectro.isDrag && $.fn.spectro.$draggedElement === null) {
              if ($this.attr('data-spectro-scheme') != null) {
                return;
              }
              event.stopPropagation();
              controls.show();
              if ($this.is(':spectro-editable')) {
                return $this.attr({
                  contenteditable: true
                });
              }
            }
          }).on('mousemove.spectro touchmove.spectro', function(event) {
            var placeholder;
            event.stopPropagation();
            placeholder = Spectro.Placeholder.get();
            $this = $(this);
            if ($.fn.spectro.isDrag && $.fn.spectro.$draggedElement !== null && $.fn.spectro.$draggedElement[0] !== $this[0]) {
              if ($this.spectro('accepts', $.fn.spectro.$draggedElement)) {
                if (event.pageY > $this.offset().top + $this.outerHeight() / 2) {
                  $.fn.spectro.draggedElementDropBefore = false;
                } else {
                  $.fn.spectro.draggedElementDropBefore = true;
                }
                $.fn.spectro.$lastDragoveredElement = $this;
                return placeholder.show($this);
              }
            }
          }).on('mouseup.spectro touchend.spectro', function(event) {
            var i, popover, range, selection, spacesCount, string;
            $this = $(this);
            popover = Spectro.Popover.get();
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
                selection.addRange(range);
              }
              return popover.show($this);
            }
          }).on('mouseleave.spectro', function(event) {
            event.stopPropagation();
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
            $this.addClass($.fn.spectro.defaults.activeElementClass);
            if ($this.is(':spectro-editable') && $this.attr('contenteditable') !== 'true') {
              $this.attr({
                contenteditable: true
              });
            }
            breadcrumbs.reset();
            controls.show();
            $parent = $this;
            path = [];
            while ($parent.hasClass($.fn.spectro.defaults.enabledElementClass) && $parent[0] !== document) {
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
          }).on('blur.spectro', function() {
            controls.hide();
            return $(this).removeAttr('contenteditable').removeClass($.fn.spectro.defaults.activeElementClass);
          }).on('keydown.spectro', function(event) {
            var $clone;
            $this = $(this);
            if (event.keyCode === 13) {
              event.preventDefault();
              event.stopPropagation();
              $clone = $('<' + $this.prop('tagName') + ' />');
              $this.after($clone);
              $clone.html('').spectro('enable', {
                scheme: $this.data('scheme')
              });
              $clone.focus();
              return false;
            } else if ((event.keyCode === 46 || event.keyCode === 8) && $this.is(':spectro-removeable' && $.trim($this.html()) === '')) {
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
        return $this.children().each(function() {
          var $child, childTagName;
          $child = $(this);
          childTagName = $child.prop('tagName').toLowerCase();
          return $child.spectro('enable', {
            scheme: $scheme.find('> ' + childTagName).get(0)
          });
        });
      },
      accepts: function($element) {
        return $(this).data('scheme').parent().find('> [spectro-label="' + $element.data('scheme').attr('spectro-label') + '"]').length !== 0;
      },
      disable: function() {
        $('html').removeClass($.fn.spectro.defaults.documentEnabledClass).off('.spectro');
        $(this).removeClass($.fn.spectro.defaults.enabledElementClass).removeAttr('tabindex').removeAttr('aria-label').off('.spectro').trigger('spectro.disable').children().each(function() {
          return $(this).spectro('disable');
        });
        Spectro.Helper.clean();
        Spectro.Breadcrumbs.destroy();
        return Spectro.Placeholder.destroy();
      },
      enabled: function() {
        return $(this).hasClass($.fn.spectro.defaults.enabledElementClass);
      },
      disabled: function() {
        return !$element.spectro('enabled');
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
    $.fn.spectro.isDrag = false;
    $.fn.spectro.$draggedElement = null;
    $.fn.spectro.$lastDragoveredElement = null;
    $.fn.spectro.draggedElementDropBefore = false;
    $.fn.spectro.defaults = {
      enabledElementClass: 'spectro-element',
      hoveredElementClass: 'spectro-element--hover',
      activeElementClass: 'spectro-element--active',
      removedElementClass: 'spectro-element--removed',
      draggedElementClass: 'spectro-element--dragged',
      documentEnabledClass: 'spectro--enabled',
      documentDraggedClass: 'spectro--dragged'
    };
    return $.fn.spectro.i18n = {
      remove: 'Remove element',
      setup: 'Setup element',
      move: 'Move element',
      sidebarStyles: 'Styles',
      sidebarAttributes: 'Attributes',
      sidebarContent: 'Content'
    };
  })(jQuery);

}).call(this);
