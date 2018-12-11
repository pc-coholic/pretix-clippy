clippy.load({name:'Clippy', path:'/static/pretix_clippy/agents/'}, function(agent) {
    agent.show();

    var forms = $('form');
    for (var i = 0; i < forms.length; i++) {
        forms[i].addEventListener('invalid', function(e) {
            agent.stop();
            agent.play('GetAttention');
            agent.speak(gettext('Oh no! Looks like you forgot to properly fill out a field!'));
        }, true);

        forms[i].addEventListener('submit', function(e) {
            agent.stop();
            agent.play('CheckingSomething');
        }, true);
    }

    $('.alert').each(function(index) {
      if ($(this).hasClass('alert-danger')) {
        agent.stop();
        agent.play('GetArtsy');
        agent.speak($(this).text().trim());
      } else if ($(this).hasClass('alert-success')) {
        agent.stop();
        agent.play('Congratulate');
        agent.speak($(this).text().trim());
      }
    });

    switch ($(location).attr('pathname')) {
      case '/control/events/add':
        agent.stop();
        agent.speak(gettext('It looks like you\'re creating a new event. Would you like help?'));
        break;
    }
});
