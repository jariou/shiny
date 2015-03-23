  var checkboxGroupInputBinding = new InputBinding();
  $.extend(checkboxGroupInputBinding, {
    find: function(scope) {
      return $(scope).find('.shiny-input-checkboxgroup');
    },
    getValue: function(el) {
      // Select the checkbox objects that have name equal to the grouping div's id
      var $objs = $('input:checkbox[name="' + $escape(el.id) + '"]:checked');
      var values = new Array($objs.length);
      for (var i = 0; i < $objs.length; i ++) {
        values[i] = $objs[i].value;
      }
      return values;
    },
    setValue: function(el, value) {
      // Clear all checkboxes
      $('input:checkbox[name="' + $escape(el.id) + '"]').prop('checked', false);

      // Accept array
      if (value instanceof Array) {
        for (var i = 0; i < value.length; i++) {
          $('input:checkbox[name="' + $escape(el.id) + '"][value="' + $escape(value[i]) + '"]')
            .prop('checked', true);
        }
      // Else assume it's a single value
      } else {
        $('input:checkbox[name="' + $escape(el.id) + '"][value="' + $escape(value) + '"]')
          .prop('checked', true);
      }

    },
    getState: function(el) {
      var $objs = $('input:checkbox[name="' + $escape(el.id) + '"]');

      // Store options in an array of objects, each with with value and label
      var options = new Array($objs.length);
      for (var i = 0; i < options.length; i++) {
        options[i] = { value:   $objs[i].value,
                       label:   this._getLabel($objs[i]) };
      }

      return { label:    $(el).find('label[for="' + $escape(el.id) + '"]').text(),
               value:    this.getValue(el),
               options:  options
             };
    },
    receiveMessage: function(el, data) {
      var $el = $(el);

      // This will replace all the options
      if (data.hasOwnProperty('options')) {
        // Clear existing options and add each new one
        $el.find('div.shiny-options-group').remove();
        // Backward compatibility: for HTML generated by shinybootstrap2 package
        $el.find('label.checkbox').remove();
        $el.append(data.options);
      }

      if (data.hasOwnProperty('value'))
        this.setValue(el, data.value);

      if (data.hasOwnProperty('label'))
        $el.find('label[for="' + $escape(el.id) + '"]').text(data.label);

      $(el).trigger('change');
    },
    subscribe: function(el, callback) {
      $(el).on('change.checkboxGroupInputBinding', function(event) {
        callback();
      });
    },
    unsubscribe: function(el) {
      $(el).off('.checkboxGroupInputBinding');
    },
    // Given an input DOM object, get the associated label. Handles labels
    // that wrap the input as well as labels associated with 'for' attribute.
    _getLabel: function(obj) {
      // If <label><input /><span>label text</span></label>
      if (obj.parentNode.tagName === "LABEL") {
        return $.trim($(obj.parentNode).find('span').text());
      }

      return null;
    },
    // Given an input DOM object, set the associated label. Handles labels
    // that wrap the input as well as labels associated with 'for' attribute.
    _setLabel: function(obj, value) {
      // If <label><input /><span>label text</span></label>
      if (obj.parentNode.tagName === "LABEL") {
        $(obj.parentNode).find('span').text(value);
      }

      return null;
    }

  });
  inputBindings.register(checkboxGroupInputBinding, 'shiny.checkboxGroupInput');
