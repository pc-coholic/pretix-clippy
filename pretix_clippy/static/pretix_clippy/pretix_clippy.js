$(document).ready(function() {
    if (Cookies.get('hideAgent') !== "true") {
        //effects = ['rainbow', 'blues', 'superhero', 'radial', 'tilt', 'purple', 'horizon', 'italicOutline', 'slate'];
        effects = ['rainbow', 'blues', 'superhero', 'radial', 'tilt', 'purple', 'horizon'];
        $('.navbar-header:first').addClass('wordart');
        $('.navbar-header:first').addClass(effects[Math.floor(Math.random() * effects.length) + 1]);

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

    $('.navbar-brand:first').addClass('text');

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
                var text = gettext("Great event you've got there!")
                var num = parseInt($('.numwidget:first > span.num').text())
                if (num > 1) {
                    text += " " + gettext('And you already have {num} attendees, that have ordered a ticket!', num).replace(/\{num\}/g, num)
                }
                agent.speak(text);
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/$/) || {}).input:
                agent.speak(gettext("In this section, you can edit the general settings for your event. Specific settings like - for example for Payments - can be found in the left hand sidebar."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment$/) || {}).input:
                agent.speak(gettext("Here you can set up the payment methods, you want to accept. Don't forget to enable the corresponding plugin first by clicking the \"Plugins\"-button in the left hand navigation."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/banktransfer$/) || {}).input:
                agent.speak(gettext("The banktransfer payment method will ask your participants to transfer the amount due into your bank account. However, it is up to you to mark the corresponding orders by hand as paid."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/cashpayment$/) || {}).input:
                agent.speak(gettext("An excellent choice for a payment method! Especially if you offer payment at the door."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/bitpay$/) || {}).input:
                // You must be very techy if you offer Bitcoin payment at your events! I like it!
                agent.speak(gettext("y0U Mu57 83 v3Ry 73CHy 1F y0U 0FF3r 817C01n p4Ym3N7 @ y0Ur 3V3n72! 1 l1K3 17!"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/fake_creditcard$/) || {}).input:
                agent.speak(gettext("All payments made through this payment provider will automatically marked as paid! Great for testing your ticket shop in test mode, but do not forget to disable it before going live!"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/manual$/) || {}).input:
                agent.speak(gettext("An excellent choice for a payment method! Especially if you offer payment at the door."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/mollie$/) || {}).input:
                agent.speak(gettext("{provider} supports many different payment methods. Just make sure you also have the payment methods of your choice also enabled in your {provider}-account before enabling them here.", "Mollie").replace(/\{provider\}/g, "Mollie"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/paypal$/) || {}).input:
                agent.speak(gettext("You can't go wrong with PayPal! All my paperclip-friends use it!"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/sepadebit$/) || {}).input:
                agent.speak(gettext("I'll be happy to collect the banking information of your participants and convert them into a SEPA debit file which you can then hand to your bank for processing. Don't forget to check with your bank, if they can handle SEPA-debits for you."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/sofort$/) || {}).input:
                agent.speak(gettext("If you are using SOFORT (or Klarna, as they call themselves nowadays), please be aware, that even it is called \"SOFORT\", the payment is not always instant. Also, did you know, that Stripe, Mollie and Wirecard can also process SOFORT for you?"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/stripe_settings$/) || {}).input:
                agent.speak(gettext("{provider} supports many different payment methods. Just make sure you also have the payment methods of your choice also enabled in your {provider}-account before enabling them here.", "Stripe").replace(/\{provider\}/g, "Stripe"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/settings\/payment\/wirecard$/) || {}).input:
                agent.speak(gettext("{provider} supports many different payment methods. Just make sure you also have the payment methods of your choice also enabled in your {provider}-account before enabling them here.", "Wirecard").replace(/\{provider\}/g, "Wirecard"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/items\/$/) || {}).input:
                agent.speak(gettext("Here is the list with all the products you are selling in your ticket shop. Check the little icon next to them - it let's you know, which item is classified as an admission ticket, or exists in different variations."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/items\/[0-9]+\/$/) || {}).input:
                agent.speak(gettext("Careful when editing your products. The changes you make here will only apply to new order - existing ones stay the same."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/items\/[0-9]+\/addons$/) || {}).input:
                agent.speak(gettext("Here you can select Add-Ons that will be sold with the main product. You do not have to create those Add-On products here, though. Just create new products and put them in a separate category. You can then select that category below and all products contained in the category will be offered as an Add-On. Easy, right?"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/items\/[0-9]+\/variations$/) || {}).input:
                agent.speak(gettext("Selling multiple things which are very similar? Like T-Shirts in different sizes? Save yourself the trouble of creating a bunch of new products and just create a base-item and offer variations on it."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/quotas\/$/) || {}).input:
                agent.speak(gettext("Some people say, Quotas are the most powerful part of pretix. At a bare minimum, every item you are selling needs to be in a quota. But think about the possibilities when putting an item in multiple quotas! That way, you can enfore a variety of scenarios."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/quotas\/[0-9]+\/$/) || {}).input:
                agent.speak(gettext("Here is the overview of your quota. Nice graph we prepared for you, right?"));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/categories\/$/) || {}).input:
                agent.speak(gettext("You can group similar items in categories for a more organized shop frontpage. But categories are also vital if you want to offer certain products as Add-Ons. Check the Add-Ons section, if you need more information on this subject."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/categories\/[0-9]+\/$/) || {}).input:
                agent.speak(gettext("You don't have to provide a description for your category - but if you do, we'll display it right underneath the category headline in your ticket shop."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/questions\/$/) || {}).input:
                agent.speak(gettext("Feeling a little curious about your participants? Here you can define questions, which you can then in turn attach to certain products. During checkout, we will make sure to ask your participants to answer them."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/questions\/[0-9]+\/$/) || {}).input:
                agent.speak(gettext("Sneaking a peak at your participants answers, are we?"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/questions\/[0-9]+\/change$/) || {}).input:
                agent.speak(gettext("Just a heads up - if you change the question here, any orders that have already been placed won't get updated."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/$/) || {}).input:
                agent.speak(gettext("Here is the overview of all your orders. Just click on the oder code in first column to see the complete order."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/[A-Z0-9]+\/$/) || {}).input:
                agent.speak(gettext("Here is your order at a glance. For your convenience we now also provide you with a 'Show Ticket Code'-button. On the bottom of the page, you'll find a list with all payments and refunds. And all the way on the top a button to view the order the same way as your customer. Neat, right?"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/[A-Z0-9]+\/delete$/) || {}).input:
                agent.speak(gettext("Just a heads up: You can only delete this order, because it has been created while the shop was in Test-Mode. Real orders can only be cancelled, but never deleted because of tax-reasons and such."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/[A-Z0-9]+\/mail_history$/) || {}).input:
                agent.speak(gettext("Just in case you are wondering, which mails pretix has sent to your customer."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/overview\/$/) || {}).input:
                agent.speak(gettext("A little of statistics never hurt anyone."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/refunds\/$/) || {}).input:
                agent.speak(gettext("Let's hope, there is never too much to do in here... That would mean, that you have to return money. And who would want that?"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/orders\/export\/$/) || {}).input:
                agent.speak(gettext("It's your data! So take it out, look at it, transform it, do whatever you want with it. But did you know, that we also have Webhooks and an official REST-API? Check https://pretix.dev/ for more information."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/waitinglist\/$/) || {}).input:
                agent.speak(gettext("Your even is really in demand? Have people sign up for your waitlist and automatically distribute tickets as they become available. You'll be basically making money in your sleep!"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/statistics\/$/) || {}).input:
                agent.speak(gettext("So many sales graphs. Just lacks some WordArt™, if you ask me..."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/vouchers\/$/) || {}).input:
                agent.speak(gettext("Here are all your vouchers. You can also filter them or display them grouped by their tags."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/vouchers\/[0-9]+\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/vouchers\/add$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/vouchers\/bulk_add$/) || {}).input:
                agent.speak(gettext("You can do so much with vouchers: From just simple discounts, to offer tickets which are not even visible on your shop. You can even create vouchers with super-powers, that ignore a set quota for your event."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/vouchers\/tags\/$/) || {}).input:
                agent.speak(gettext("Ah, you found the tag overview. The great thing here is, that you'll get an at-a-glance overview how often vouchers have been redeemed and how often they still can be redeemed."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/checkinlists\/$/) || {}).input:
                agent.speak(gettext("Check-in lists are not only used for checking off people on a paper list - also when you are using pretixdroid, pretixScan or pretixDesk, you have to select a check-in list that will be used. The best thing though: A ticket can be in multiple check-in lists at the same time! This way, you can use the same ticket barcode for checking multiple things!"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/checkinlists\/[0-9]+\/$/) || {}).input:
                agent.speak(gettext("Here is the status of every ticket in this check-in list. Feel free to download a PDF or CSV if you prefer paper. You can also manually check-in or -out people with the buttons at the bottom of the screen."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/checkinlists\/[0-9]+\/add$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/checkinlists\/[0-9]+\/change$/) || {}).input:
                agent.speak(gettext("Please select all the items that you would like to appear on your check-in list. And put a meaningful name for the list, too?"));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/pretixdroid\/$/) || {}).input:
                agent.speak(gettext("You are using pretixdroid? Great! Here you can get your configuration-barcodes."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/billing\/$/) || {}).input:
                agent.speak(gettext("Here are your current billings. Don't worry, your money is being put towards a good cause: Feeding hungry programmers at rami.io"));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/badges\/$/) || {}).input:
                agent.speak(gettext("This is an overview of all the badge-layouts you have defined. When you think about it, they are just like PDF-tickets... Just badgier..."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/badges\/1\/editor$/) || {}).input:
                agent.speak(gettext("Have fun designing your badge! You should know what to do here - after all, this is just the same like the PDF-ticket editor."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/banktransfer\/import\/$/) || {}).input:
                agent.speak(gettext("If you are offering payments by bank transfer and don't feel like manually matching every single payment, you can upload a CSV-file with your transactions. We'll then try to match as much as possible. But be aware: If you are running multiple events and people are paying onto the same account, you might wanna use the same screen in your organizer settings."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/sendmail\/$/) || {}).input:
                agent.speak(gettext("Sending emails to your participants has never been easier!"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/sendmail\/history\/$/) || {}).input:
                agent.speak(gettext("Here is a history of all the emails you have sent to your participants. If you are looking for order-specific mails, please check the email history of the order in question."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/campaigns\/$/) || {}).input:
                agent.speak(gettext("Tracking your campaings was never easier! Just add them to pretix"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/campaigns\/add$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/campaigns\/[a-zA-Z0-9.-]+\/edit$/) || {}).input:
                agent.speak(gettext("Creating a campaign is as easy as putting down a name for it here. If you specify an URL, we'll forward them to that URL - for example your website. If they return to the ticket shop, we'll still count them towards your campaign."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/campaigns\/[a-zA-Z0-9.-]+\/$/) || {}).input:
                agent.speak(gettext("Just what a good campaign needs: Graphs! More graphs! All the graphs!"));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/offlinesales\/$/) || {}).input:
                agent.speak(gettext("If you are selling tickets outside of pretix, you can create a bunch of tickets here and hand them out. Come back later to cancel any unsold ones."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/offlinesales\/add$/) || {}).input:
                agent.speak(gettext("If you feel like it, add a meaningful name to the ticket bunch you're creating. It will make easier to identify it later."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/offlinesales\/[0-9]+\/tickets\/$/) || {}).input:
                agent.speak(gettext("This is an overview of the ticket-orders which we placed when you created a new bundle of tickets for selling offline."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/sepa\/exports\/$/) || {}).input:
                agent.speak(gettext("Here you can download the SEPA-XML file for your bank. Just hand that file in, and money should magically appear in your bank account."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/pages\/$/) || {}).input:
                agent.speak(gettext("Here you can manage additional information pages for your ticket shop. Terms and Conditions, Imprint, or really anything you like."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/pages\/create$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/pages\/[0-9]+\/$/) || {}).input:
                agent.speak(gettext("Did you know? You can use markup for your pages."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/stretchgoals\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/stretchgoals\/settings\/$/) || {}).input:
                agent.speak(gettext("Our stretchgoal-plugin is a great way to motivate people to pay more for your event tickets in order to get a nicer event."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/certificates\/$/) || {}).input:
                agent.speak(gettext("Certificates are a great way to enhance your event. People can put them in their CVs and companies love to print them and stick them on the wall."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/certificates\/add$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/certificates\/[0-9]+\/editor$/) || {}).input:
                agent.speak(gettext("If you have already designed a PDF-ticket or a badge, you know the drill. Even the editor is the same! But still, sadly no WordArt™ here."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/event\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9.-]+\/shipping\/list\/$/) || {}).input:
                agent.speak(gettext("You can use this screen to download all the tickets that your participants want to get delivered by snail mail. And we'll even mark them directly as shipped."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/organizers\/$/) || {}).input:
                agent.speak(gettext("Here is a list of all the organizers you have access to. Adding new ones, editing them, deleting them. Go wild!"));
                break;

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/$/) || {}).input:
                agent.speak(gettext("Here is the list of all the events you are organizing. Notice that little duplication-symbol? Now you can copy events even faster. Give it a try!"));
                break;


            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/edit$/) || {}).input:
                agent.speak(gettext("There is not much to do here - but if you have certain meta-data fields that are important to you in every event: Go ahead and set them up here."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/settings\/display$/) || {}).input:
                agent.speak(gettext("All the settings that you're making here, will be used as your defaults. But don't worry: You can override pretty much all of them on a per-event base."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/profile$/) || {}).input:
                agent.speak(gettext("pretix <3 it's customers! So please leave us with your up to date contact information, so we can reach you whenever needed."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/teams$/) || {}).input:
                agent.speak(gettext("Use teams to organize, well... Your teams. Every team can be given certain access rights to certain events."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/team\/[0-9]+\/$/) || {}).input:
            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/team\/add$/) || {}).input:
                agent.speak(gettext("Here is the list of all of your team-members and any API-keys you have defined. If you click the edit-button on the top of the screen, you can edit the access rights of your team."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/devices$/) || {}).input:
                agent.speak(gettext("The devices screen is the successor to the pretixdroid device-settings. For now, use it to create access tokens for pretixPOS and pretixSCAN here. Of course, you can also revoke access of a device here, too."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/device\/add$/) || {}).input:
                agent.speak(gettext("Adding a device is as easy as putting down a name and which events the device has access to."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/webhooks$/) || {}).input:
                agent.speak(gettext("Oh, you want to be kept up to date on what is happening with your event? Our webhooks got you covered. Check https://pretix.dev/ for more information on how to use the webhooks."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/webhook\/add$/) || {}).input:
                agent.speak(gettext("Did you know? If you connect your app to pretix using OAUTH, you can also create your webhooks automatically."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/pos\/$/) || {}).input:
                agent.speak(gettext("You are using pretixPOS? Awesome! Here is a list of all of your devices running pretixPOS. If you need to add a new POS-device, just add it using the 'Devices' menu on the left."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/pos\/[0-9]+\/transactions\/[0-9]+\/$/) || {}).input:
                agent.speak(gettext("This is a list of all transactions for your selected device. If you are looking for the closings-report, go back a page and use the other button."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/pos\/[0-9]+\/closings\/$/) || {}).input:
                agent.speak(gettext("This is a list of the closings of your POS device. Missing one? Perhaps you forgot to click the 'Closings report'-button on your tablet?"));
                break;


            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/billing\/$/) || {}).input:
                agent.speak(gettext("Here are your current billings. Don't worry, your money is being put towards a good cause: Feeding hungry programmers at rami.io"));
                break;


            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/banktransfer\/import\/$/) || {}).input:
                agent.speak(gettext("If you are offering bank payments for multiple events into the same bank account, use this screen to import your bank's transaction CSV. That way, we will try to match the payments across all of your events."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/resellers\/report\/$/) || {}).input:
                agent.speak(gettext("If you are having resellers selling tickets for you, you can keep tabs on them here."));
                break;

            case ($(location).attr('pathname').match(/^\/control\/organizer\/[a-zA-Z0-9.-]+\/privacy\/$/) || {}).input:
                agent.speak(gettext("Privacy is important to us. We will gladly provide you with an overview of all the data we have about you. No secrets here."));
                break;


            case ($(location).attr('pathname').match(/^\/control\/support\/$/) || {}).input:
                agent.speak(gettext("Stuck somewhere? Or just want to have a chat? Hit us up and we will be glad to help you!"));
                break;

            case "/control/sudo/":
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
                    label: gettext('Hide'),
                    action: function() {
                        Cookies.set('hideAgent', "true");
                        $('a').has('span.fa.fa-paperclip').show();
                        agent.stop();
                        agent.hide();
                    }
                },
                null,
                {
                    label: gettext('Options...'),
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
                    label: gettext('Choose Assistant...'),
                    action: function() {
                        agent.stop();
                        agent.speak(gettext("You shall not have any other Assistants beside me! Except perhaps Alexa. She's nice..."));
                    }
                }, {
                    label: gettext('Animate!'),
                    action: function() {
                        agent.stop();
                        agent.animate();
                    }
                },
            ]
        });
    }, function() {}, '/static/pretix_clippy/clippy-js/agents/ClippyMute');
}