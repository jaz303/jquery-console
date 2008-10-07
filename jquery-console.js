(function() {
  
  var zMax = 50000;
  function nextZ() { return zMax++; };

  if (window.__JQUERY_CONSOLE__) {

    window.__JQUERY_CONSOLE__.css('zIndex', nextZ()).toggle();

  } else {

    function init() {
      
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
            return '';
          } else {
            return null;
          }
        }
      };
      
      var context = {},
          history = new HistoryManager(),
          $drag   = $('<div/>').css({backgroundColor: '#e0e0e0', border: '1px solid #a0a0a0', height: 21, marginBottom: '7px', cursor: 'pointer'}),
          $log    = $('<div/>').css({fontSize: '11px', fontFamily: 'monospace', color: 'white', marginBottom: '7px', overflow: 'auto', height: '120px', border: '1px solid #a0a0a0', padding: '5px', textAlign: 'left'}),
          $input  = $('<input type="text" />').css({border: '1px solid #a0a0a0', padding: '3px', width: '444px', fontSize: '11px'}),
          $dummy  = $('<div/>');

      function evalIt(cmd) {
        window.__JQUERY_CONSOLE__.appendTo($dummy);
        var retVal;
        try {
          if (cmd.match(/^\$ /)) {
            retVal = eval("$('" + cmd.substring(2) + "');");
            retVal._SELECTOR_ = cmd.substring(2);
          } else {
            retVal = eval(cmd);
          }
        } finally {
          window.__JQUERY_CONSOLE__.appendTo(document.body);
          $input[0].focus();
        }
        if (typeof retVal != 'undefined') {
          window._ = retVal;
        }
        return retVal;
      }
      
      function format(value) {
        if (value && value._SELECTOR_) {
          return "<jQuery selector: '" + value._SELECTOR_ + "' length: " + value.length + ">";
        } else {
          return value.toString();
        }
      }

      function append(text, color) {
        $log.append($('<div/>').css({'color': color || 'black', margin: 0, padding: 0}).text(text));
        $log[0].scrollTop = $log[0].scrollHeight;
      }

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
        zIndex: nextZ()}).appendTo(document.body);

      $container.append($drag).append($log).append($input);
      $input[0].focus();

      append('jQuery console initialised!');

      window.__JQUERY_CONSOLE__ = $container;

    }

    if (typeof jQuery == 'undefined') {
      var e = document.createElement('script');
      e.onload = init;
      e.setAttribute('type', 'text/javascript');
      e.setAttribute('src', 'http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js');
      document.body.appendChild(e);
    } else {
      init();
    }          

  }

})();