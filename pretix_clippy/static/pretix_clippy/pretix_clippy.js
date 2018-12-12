var clippyExists = setInterval(function() {
  if (typeof(clippy) == 'object') {
    clearInterval(clippyExists);

    clippy.load('Clippy', function(agent) {
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

      var timer;
      $(document).bind('keydown', function() {
        if (timer == undefined) {
          agent.stop();
          agent.play('Writing', 3600000);
        }

        clearTimeout(timer);
        timer = setTimeout(function() {
            agent.stop();
            timer = undefined;
        }, 2000);
      });

      switch ($(location).attr('pathname')) {
        case '/control/':
          var today = new Date()
          var curHr = today.getHours()

          if (curHr < 12) {
            agent.speak(gettext('Good morning!'));
          } else if (curHr < 18) {
            agent.speak(gettext('Good afternoon!'));
          } else {
            agent.speak(gettext('Good evening!'));
          }
          break;

        case '/control/events/add':
        switch ($('#id_event_wizard-current_step').val()) {
          case 'foundation':
            agent.stop();
            agent.play('GetAttention');
            agent.ask(
              gettext('It looks like you\'re creating a new event. Would you like help?'),
              [gettext('Yes'), gettext('No')],
              function(choice) {
                if (choice == gettext('Yes')) {
                  agent.ask(
                    gettext('Here, you first need to decide for the organizer the event belongs to. You will not be able to change this association later. This will determine default settings for the event, as well as access control to the event’s settings.'),
                    [gettext('Continue')],
                    function() {
                      agent.ask(
                        gettext('Second, you need to select the languages that the ticket shop should be available in. You can change this setting later, but if you select it correctly now, it will automatically ask you for all descriptions in the respective languages starting from the next step.'),
                        [gettext('Continue')],
                        function() {
                          agent.ask(
                            gettext('Last on this page, you can decide if this event represents an event series. In this cases, the event will turn into multiple events included in once, meaning that you will get one combined ticket shop for multiple actual events. This is useful if you have a large number of events that are very similar to each other and that should be sold together (i.e. users should be able to buy tickets for multiple events at the same time). Those single events can differ in available products, quotas, prices and some meta information, but most settings need to be the same for all of them. We recommend to use this feature only if you really know that you need it and if you really run a lot of events, not if you run e.g. a yearly conference.'),
                            [gettext('Continue')],
                            function() {
                              agent.speak(gettext('Once you set these values, you can proceed to the next step.'));
                            }
                          );
                        }
                      );
                    }
                  );
                }
              }
            );
            break;

          case 'basics':
            agent.stop();
            agent.animate();
            agent.ask(
              gettext('It looks like you\'re creating a new event. Would you like help?'),
              [gettext('Yes'), gettext('No')],
              function(choice) {
                if (choice == gettext('Yes')) {
                  agent.ask(
                    gettext('In this step, you will be asked more detailed questions about your event. In particular, you can fill in the following fields'),
                    [gettext('Continue')],
                    function() {
                      agent.ask(
                        gettext('Name: This is the public name of your event. It should be descriptive and tell both you and the user which event you are dealing with, but should still be concise. You probably know how your event is named already ;)'),
                        [gettext('Continue')],
                        function() {
                          agent.ask(
                            gettext('Short form: This will be used in multiple places. For example, the URL of your ticket shop will include this short form of your event name, but it will also be the default prefix e.g. for invoice numbers. We recommend to use some natural abbreviation of your event name, maybe together with a date, of no more than 10 characters. This is the only value on this page that can’t be changed later.'),
                            [gettext('Continue')],
                            function() {
                              agent.ask(
                                gettext('Event start time: The date and time that your event starts at. You can later configure settings to hide the time, if you don’t want to show that.'),
                                [gettext('Continue')],
                                function() {
                                  agent.ask(
                                    gettext('Event end time: The date and time your event ends at. You can later configure settings to hide this value completely – or you can just leave it empty. It’s optional!'),
                                    [gettext('Continue')],
                                    function() {
                                      agent.ask(
                                        gettext('Location: This is the location of your event in a human-readable format. We will show this on the ticket shop frontpage, but it might also be used e.g. in Wallet tickets.'),
                                        [gettext('Continue')],
                                        function() {
                                          agent.ask(
                                            gettext('Event currency: This is the currency all prices and payments in your shop will be handled in.'),
                                            [gettext('Continue')],
                                            function() {
                                              agent.ask(
                                                gettext('Sales tax rate: If you need to pay a form of sales tax (also known as VAT in many countries) on your products, you can set a tax rate in percent here that will be used as a default later. After creating your event, you can also create multiple tax rates or fine-tune the tax settings.'),
                                                [gettext('Continue')],
                                                function() {
                                                  agent.ask(
                                                    gettext('Default language: If you selected multiple supported languages in the previous step, you can now decide which one should be displayed by default.'),
                                                    [gettext('Continue')],
                                                    function() {
                                                      agent.ask(
                                                        gettext('Start of presale: If you set this date, no ticket will be sold before this date. We normally recommend not to set this date during event creation because it will make testing your shop harder.'),
                                                        [gettext('Continue')],
                                                        function() {
                                                          agent.ask(
                                                            gettext('End of presale: If you set this date, no ticket will be sold after this date.'),
                                                            [gettext('Continue')],
                                                            function() {
                                                              agent.speak(gettext('If all of this is set, you can proceed to the next step. If this is your first event, there will not be a next step and you are done!'));
                                                            }
                                                          );
                                                        }
                                                      );
                                                    }
                                                  );
                                                }
                                              );
                                            }
                                          );
                                        }
                                      );
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              }
            );
            break;
          }
          break;
      }
    }, function() {}, '/static/pretix_clippy/agents/Clippy');
  }
}, 100);
