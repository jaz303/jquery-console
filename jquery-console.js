(function() {
    
  var zMax = 50000;
  function nextZ() { return zMax++; }

  if (window.__JQUERY_CONSOLE__) {

    window.__JQUERY_CONSOLE__.css('zIndex', nextZ()).toggle();

  } else {

    function init() {

      var $log = $('<div/>').css({fontSize: '11px', fontFamily: 'monospace', color: 'white', marginBottom: '7px', overflow: 'auto', height: '120px', border: '1px solid #a0a0a0', padding: '5px', textAlign: 'left'});
      var $input = $('<input type="text" />').css({border: '1px solid #a0a0a0', padding: '3px', width: '444px', fontSize: '11px'});

      function format(value) {
        return value.toString();
      }

      function append(text, color) {
        $log.append($('<div/>').css({'color': color || 'black', margin: 0, padding: 0}).text(text));
        $log[0].scrollTop = $log[0].scrollHeight;
      }

      $input.keypress(function(evt) {
        if (evt.keyCode == 13) {
          try {
            var cmd = this.value;
            append('> ' + cmd);
            append(format(eval(cmd)));
          } catch (e) {
            append(e.toString(), '#ff0000');
          } finally {
            this.value = '';
          }
        }
      });

      var $container = $('<div/>').css({
        backgroundColor: 'white', padding: '7px', position: 'absolute', opacity: 0.9,
        top: '10px', right: '10px', width: '450px', border: '1px solid black',
        zIndex: nextZ()}).appendTo(document.body);

      $container.append($log).append($input);

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