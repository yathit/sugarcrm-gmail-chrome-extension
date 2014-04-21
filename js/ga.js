/**
 * Google Analytics tracker.
 */

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-33861582-6', 'auto');
ga('send', 'pageview');

window.addEventListener('message', function(event) {
  // we don't need to check origin here, since we are in chrome extension sandbox page.
  var command = event.data.command;
  var context = event.data.context;
  if (command == 'send') {
    // event, label, action
    ga('send', context[0], context[1], context[2]);
  }
  // window.console.log(command, context);
});
