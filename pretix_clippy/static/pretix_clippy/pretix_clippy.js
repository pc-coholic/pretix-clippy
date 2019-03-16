$(document).ready(function() {
    if (Cookies.get('hideAgent') !== "true") {
        loadClippy();
    }
});

$('a').has('span.fa.fa-paperclip').click(function(e) {
    e.preventDefault();
    loadClippy();
});

function loadClippy() {
    $('a').has('span.fa.fa-paperclip').hide();
    Cookies.remove('hideAgent');

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
            } else if ($(this).hasClass('alert-warning')) {
                agent.stop();
                agent.play('GetTechy');
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
                var today = new Date();
                var curHr = today.getHours();

                if (curHr < 12) {
                    agent.speak(gettext('Good morning!'));
                } else if (curHr < 18) {
                    agent.speak(gettext('Good afternoon!'));
                } else {
                    agent.speak(gettext('Good evening!'));
                }
                break;

            case '/control/events/add':
                var prefix = $('#id_event_wizard-prefix').val();
                var switchstring = $('#id_' + prefix + "-current_step").val();
                switch (switchstring) {
                    case 'foundation':
                        agent.stop();
                        agent.play('GetAttention');

                        agent.ask(
                            gettext('It looks like you\'re creating a new event. Would you like help?'),
                            [gettext('Yes'), gettext('No')],
                            function(choice) {
                                if (choice === gettext('Yes')) {
                                    dialog([
                                        gettext('Here, you first need to decide for the organizer the event belongs to. You will not be able to change this association later. This will determine default settings for the event, as well as access control to the event’s settings.'),
                                        gettext('Second, you need to select the languages that the ticket shop should be available in. You can change this setting later, but if you select it correctly now, it will automatically ask you for all descriptions in the respective languages starting from the next step.'),
                                        gettext('Last on this page, you can decide if this event represents an event series. In this cases, the event will turn into multiple events included in once, meaning that you will get one combined ticket shop for multiple actual events. This is useful if you have a large number of events that are very similar to each other and that should be sold together (i.e. users should be able to buy tickets for multiple events at the same time). Those single events can differ in available products, quotas, prices and some meta information, but most settings need to be the same for all of them. We recommend to use this feature only if you really know that you need it and if you really run a lot of events, not if you run e.g. a yearly conference.'),
                                        gettext('Once you set these values, you can proceed to the next step.')
                                    ]);
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
                                if (choice === gettext('Yes')) {
                                    dialog([
                                        gettext('In this step, you will be asked more detailed questions about your event. In particular, you can fill in the following fields'),
                                        gettext('Name: This is the public name of your event. It should be descriptive and tell both you and the user which event you are dealing with, but should still be concise. You probably know how your event is named already ;)'),
                                        gettext('Short form: This will be used in multiple places. For example, the URL of your ticket shop will include this short form of your event name, but it will also be the default prefix e.g. for invoice numbers. We recommend to use some natural abbreviation of your event name, maybe together with a date, of no more than 10 characters. This is the only value on this page that can’t be changed later.'),
                                        gettext('Event start time: The date and time that your event starts at. You can later configure settings to hide the time, if you don’t want to show that.'),
                                        gettext('Event end time: The date and time your event ends at. You can later configure settings to hide this value completely – or you can just leave it empty. It’s optional!'),
                                        gettext('Location: This is the location of your event in a human-readable format. We will show this on the ticket shop frontpage, but it might also be used e.g. in Wallet tickets.'),
                                        gettext('Event currency: This is the currency all prices and payments in your shop will be handled in.'),
                                        gettext('Sales tax rate: If you need to pay a form of sales tax (also known as VAT in many countries) on your products, you can set a tax rate in percent here that will be used as a default later. After creating your event, you can also create multiple tax rates or fine-tune the tax settings.'),
                                        gettext('Default language: If you selected multiple supported languages in the previous step, you can now decide which one should be displayed by default.'),
                                        gettext('Start of presale: If you set this date, no ticket will be sold before this date. We normally recommend not to set this date during event creation because it will make testing your shop harder.'),
                                        gettext('End of presale: If you set this date, no ticket will be sold after this date.'),
                                        gettext('If all of this is set, you can proceed to the next step. If this is your first event, there will not be a next step and you are done!')
                                    ]);
                                }
                            }
                        );
                        break;

                    case 'copy':
                        agent.ask(
                            gettext("Did you know? In the event overview, you can also clone events."),
                            [gettext("Sure, whatever..."), gettext("Stop creating this event and take me there!")],
                            function(choice) {
                                if (choice === gettext("Stop creating this event and take me there!")) {
                                    agent.speak("OK, hold on!");
                                    $(location).delay(1000).attr('href', '/control/events/');
                                }
                            }
                        );
                        break;
                }
                break;

            case '/control/events/':
                agent.stop();
                agent.gestureAt($('.fa-copy:first').position().left, $('.fa-copy:first').position().top);
                agent.speak(gettext("Have you seen our fancy new Clone-Button? It makes duplicating events even easier!"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/$/) || {}).input:
                agent.stop();
                agent.animate();
                var text = gettext("Great event you've got there!")
                var num = parseInt($('.numwidget:first > span.num').text())
                if (num > 1) {
                    text += " " + gettext('And you already have {num} attendees, that have ordered a ticket!', num).replace(/\{num\}/g, num)
                }
                agent.speak(text);
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/$/) || {}).input:
                agent.stop();
                agent.animate();
                agent.speak(gettext("In this section, you can edit the general settings for your event. Specific settings like - for example for Payments - can be found in the left hand sidebar."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment$/) || {}).input:
                agent.stop();
                agent.animate();
                agent.speak(gettext("Here you can set up the payment methods, you want to accept. Don't forget to enable the corresponding plugin first by clicking the \"Plugins\"-button in the left hand navigation."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/banktransfer$/) || {}).input:
                agent.stop();
                agent.animate();
                agent.speak(gettext("The banktransfer payment method will ask your participants to transfer the amount due into your bank account. However, it is up to you to mark the corresponding orders by hand as paid."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/cashpayment$/) || {}).input:
                agent.stop();
                agent.animate();
                agent.speak(gettext("An excellent choice for a payment method! Especially if you offer payment at the door."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/bitpay$/) || {}).input:
                agent.stop();
                agent.animate();
                // You must be very techy if you offer Bitcoin payment at your events! I like it!
                agent.speak(gettext("y0U Mu57 83 v3Ry 73CHy 1F y0U 0FF3r 817C01n p4Ym3N7 @ y0Ur 3V3n72! 1 l1K3 17!"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/fake_creditcard$/) || {}).input:
                agent.stop();
                agent.animate();
                agent.speak(gettext("All payments made through this payment provider will automatically marked as paid! Great for testing your ticket shop in test mode, but do not forget to disable it before going live!"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/manual$/) || {}).input:
                agent.stop();
                agent.animate();
                agent.speak(gettext("An excellent choice for a payment method! Especially if you offer payment at the door."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/mollie$/) || {}).input:
                agent.stop();
                agent.animate();
                agent.speak(gettext("{provider} supports many different payment methods. Just make sure you also have the payment methods of your choice also enabled in your {provider}-account before enabling them here.", "Mollie").replace(/\{provider\}/g, "Mollie"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/paypal$/) || {}).input:
                agent.stop();
                agent.animate();
                agent.speak(gettext("You can't go wrong with PayPal! All my paperclip-friends use it!"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/sepadebit$/) || {}).input:
                agent.stop();
                agent.animate();
                agent.speak(gettext("I'll be happy to collect the banking information of your participants and convert them into a SEPA debit file which you can then hand to your bank for processing. Don't forget to check with your bank, if they can handle SEPA-debits for you."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/sofort$/) || {}).input:
                agent.stop();
                agent.animate();
                agent.speak(gettext("If you are using SOFORT (or Klarna, as they call themselves nowadays), please be aware, that even it is called \"SOFORT\", the payment is not always instant. Also, did you know, that Stripe, Mollie and Wirecard can also process SOFORT for you?"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/stripe_settings$/) || {}).input:
                agent.stop();
                agent.animate();
                agent.speak(gettext("{provider} supports many different payment methods. Just make sure you also have the payment methods of your choice also enabled in your {provider}-account before enabling them here.", "Stripe").replace(/\{provider\}/g, "Stripe"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/wirecard$/) || {}).input:
                agent.stop();
                agent.animate();
                agent.speak(gettext("{provider} supports many different payment methods. Just make sure you also have the payment methods of your choice also enabled in your {provider}-account before enabling them here.", "Wirecard").replace(/\{provider\}/g, "Wirecard"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/items\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/items\/[0-9]+\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/items\/[0-9]+\/addons$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/items\/[0-9]+\/variations$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/quotas\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/quotas\/[0-9]+\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/categories\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/categories\/[0-9]+\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/questions\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/questions\/[0-9]+\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/questions\/[0-9]+\/change$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/[A-Z0-9]+\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/[A-Z0-9]+\/delete$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/[A-Z0-9]+\/transition$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/[A-Z0-9]+\/mail_history$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/overview\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/refunds\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/export\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/waitinglist\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/statistics\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/vouchers\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/vouchers\/[0-9]+\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/vouchers\/add$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/vouchers\/bulk_add$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/vouchers\/tags\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/checkinlists\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/checkinlists\/[0-9]+\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/checkinlists\/[0-9]+\/change$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/pretixdroid\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/billing\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/badges\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/badges\/1\/editor$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/banktransfer\/import\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/sendmail\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/sendmail\/history\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/campaigns\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/campaigns\/add$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/campaigns\/b199NlSve\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/campaigns\/b199NlSve\/edit$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/offlinesales\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/offlinesales\/add$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/offlinesales\/1\/tickets\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/sepa\/exports\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/pages\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/pages\/create$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/pages\/[0-9]+\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/stretchgoals\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/stretchgoals\/settings\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/certificates\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/certificates\/add$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/certificates\/1\/editor$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/shipping\/list\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/organizers\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/edit$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/settings\/display$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/profile$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/teams$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/team\/[0-9]+\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/team\/add$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/devices$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/device\/add$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/webhooks$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/webhook\/add$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/pos\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/pos\/[0-9]+\/transactions\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/pos\/[0-9]+\/transactions\/3\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/pos\/[0-9]+\/closings\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/billing\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/banktransfer\/import\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/resellers\/report\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/privacy\/$/) || {}).input:

            case ($(location).attr('pathname').match(/^\/control\/support\/$/) || {}).input:
                break;

            case "/control/sudo/":
                agent.stop();
                agent.animate();
                agent.speak(gettext("Welcome, mighty sudo user! All your actions will be recorded - so don't do anything stupid. I will definitely snitch on you!"));
                break;
        }

        function dialog(dialogarray) {
            if (dialogarray.length === 1) {
                agent.speak(dialogarray.pop())
            } else {
                agent.ask(dialogarray.shift(), [gettext('Continue')], function() { dialog(dialogarray)} )
            }
        }

        $('.clippy').contextPopup({
            items: [
                {
                    label: 'Hide',
                    action: function() {
                        Cookies.set('hideAgent', "true");
                        $('a').has('span.fa.fa-paperclip').show();
                        agent.stop();
                        agent.hide();
                    }
                },
                null,
                {
                    label: 'Options...',
                    action: function() {
                        agent.stop();
                        agent.ask(
                            gettext("Do you really expect us to implement a dedicated Options dialog on an April Fools joke?"),
                            [gettext('Yes'), gettext('No')],
                            function(choice) {
                                if (choice === gettext('Yes')) {
                                    agent.ask(
                                        gettext("Well, we didn't. But feel free to do it yourself! You can find my source code here: {url}", "https://github.com/pc-coholic/pretix-clippy").replace(/\{url\}/g, "https://github.com/pc-coholic/pretix-clippy"),
                                        [gettext('Okay'), gettext('Take me there!')],
                                        function(choice) {
                                            if (choice === gettext("Take me there!")) {
                                                agent.speak("OK, hold on!");
                                                $(location).delay(1000).attr('href', 'https://github.com/pc-coholic/pretix-clippy');
                                            }
                                        }
                                    );
                                } else {
                                    agent.speak(gettext("Yeah, exactly."));
                                }
                            }
                        );
                    }
                }, {
                    label: 'Choose Assistant...',
                    action: function() {
                        agent.stop();
                        agent.speak(gettext("You shall not have any other Assistants beside me! Except perhaps Alexa. She's nice..."));
                    }
                }, {
                    label: 'Animate!',
                    action: function() {
                        agent.stop();
                        agent.animate();
                    }
                },
            ]
        });
    }, function() {}, '/static/pretix_clippy/clippy-js/agents/Clippy');
}