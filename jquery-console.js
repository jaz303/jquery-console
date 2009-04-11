(function() {

  if (window.__JQUERY_CONSOLE__) {

    window.__JQUERY_CONSOLE__.toggle();

  } else {
    
    function init($) {
      
      function HistoryManager() {
        this.curr     = -1;
        this.entries  = [];
      };

      HistoryManager.prototype = {
        push: function(item) {
          if (this.entries.length && this.entries[0] == item) return;
          if (item.match(/^\s*$/)) return;
          this.entries.unshift(item);
          this.curr = -1;
        },
        scroll: function(direction) {
          var moveTo = this.curr + (direction == 'prev' ? 1 : -1);
          if (moveTo >= 0 && moveTo < this.entries.length) {
            this.curr = moveTo;
            return this.entries[this.curr];
          } else if (moveTo == -1) {
            this.curr = moveTo;
            return '';
          } else {
            return null;
          }
        }
      };
      
      var context = {},
          history = new HistoryManager(),
          $drag   = $('<div/>').css({backgroundColor: '#e0e0e0', border: '1px solid #a0a0a0', fontSize: '11px', fontFamily: 'sans-serif', lineHeight: 1, padding: '5px', marginBottom: '7px', cursor: 'pointer', textAlign: 'right'}).html($('<a/>').text('[X]').click(function() { window.__JQUERY_CONSOLE__.hide(); })),
          $log    = $('<div/>').css({fontSize: '11px', fontFamily: 'monospace', color: 'white', marginBottom: '7px', overflow: 'auto', height: '120px', border: '1px solid #a0a0a0', padding: '5px', textAlign: 'left'}),
          $input  = $('<input type="text" />').css({border: '1px solid #a0a0a0', padding: '3px', width: '444px', fontSize: '11px'}),
          $dummy  = $('<div/>');
      
      function evalIt(cmd) {
        window.__JQUERY_CONSOLE__.appendTo($dummy);
        var result;
        try {
          if (cmd == 'reset!') {
            context = {};
            result  = true;
          } else {
            if (cmd.match(/^\$ /)) cmd = "$('" + cmd.substring(2) + "');";
            else cmd = '(' + cmd + ')';
            var result = eval(cmd);
          }
        } finally {
          window.__JQUERY_CONSOLE__.appendTo(document.body);
          $input[0].focus();
        }
        if (typeof result != 'undefined') {
          window._ = result;
          if (typeof result == 'object' && result.selector)
            window._$ = result;
        }
        return result;
      };
      
      function format(value) {
        if (value === null) {
          return 'null';
        } else if (typeof value == 'undefined') {
          return 'undefined';
        } else if (typeof value == 'string') {
          return '"' + value.replace('"', '\\"') + '"';
        } else if (typeof value == 'function' ||
                   typeof value == 'number' ||
                   value instanceof RegExp ||
                   value === true || value === false) {
          return value.toString();
        } else if (value.selector) {
          return "<jQuery selector: '" + value.selector + "' length: " + value.length + ">";
        } else if (value instanceof Array) {
          return '[' + $.map(value, format).join(', ') + ']';
        } else if (value instanceof Date) {
          return "@" + value.getFullYear() +
                 "-" + value.getMonth() +
                 "-" + value.getDate() + 
                 "T" + value.getHours() +
                 ":" + value.getMinutes() +
                 ":" + value.getSeconds() +
                 "." + value.getMilliseconds();
        } else {
          var o = [];
          for (var k in value) o.push(k + ': ' + format(value[k]));
          return '{' + o.join(', ') + '}';
        }
      };
      
      function append(text, color) {
        $log.append($('<div/>').css({'color': color || 'black', margin: 0, padding: 0}).text(text));
        $log[0].scrollTop = $log[0].scrollHeight;
      };
      
      var dragging = null;
      $drag.mousedown(function(evt) {
        dragging = [evt.pageX - $container[0].offsetLeft,
                    evt.pageY - $container[0].offsetTop];
      }).mouseup(function() {
        dragging = null;
      });
      
      $(document).mousemove(function(evt) {
        if (dragging) 
          $container.css({left: evt.pageX - dragging[0], top: evt.pageY - dragging[1]});
      });
      
      $input.keydown(function(evt) {
        var valid = {38: 'prev', 40: 'next'};
        if (evt.keyCode in valid) {
          var curr = history.scroll(valid[evt.keyCode]);
          if (curr !== null) $input.val(curr);
        }
      });
      
      $input.keypress(function(evt) {
        if (evt.keyCode == 13) {
          try {
            var cmd = this.value;
            append('> ' + cmd);
            append(format(evalIt.call(context, cmd)));
          } catch (e) {
            append(e.toString(), '#ff0000');
          } finally {
            history.push(cmd);
            this.value = '';
          }          
        }
      });

      var pos = ($.browser.msie && $.browser.version < 7) ? 'absolute' : 'fixed';

      var $container = $('<div/>').css({
        backgroundColor: 'white', padding: '7px', position: pos, opacity: 0.9,
        top: '10px', right: '10px', width: '450px', border: '1px solid black',
        zIndex: 99999
      }).appendTo(document.body);

      $container.append($drag).append($log).append($input);
      $input[0].focus();

      append('jQuery console initialised!', 'green');
      append('(using jQuery version ' + $.fn.jquery + ')');

      window.__JQUERY_CONSOLE__ = $container;
    
    };

    if (typeof jQuery == 'undefined' || !jQuery.fn.jquery.match(/^1\.3/)) {
      var e = document.createElement('script'), jq = null;
      e.onload = function() { jq = jQuery; jQuery.noConflict(true); init(jq); };
      e.setAttribute('type', 'text/javascript');
      e.setAttribute('src', 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js');
      document.body.appendChild(e);
    } else {
      init(jQuery);
    }

  }
  
})();