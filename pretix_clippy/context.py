import pytz
from django.conf import settings
from django.template.loader import get_template
from django.utils.timezone import now

from pretix.control.signals import html_head


def contextprocessor(request):
    ctx = {}
    if not settings.DEBUG and not 'staging.pretix.eu' in settings.SITE_URL and now().astimezone(pytz.timezone('Europe/Berlin')).date().isoformat() != '2019-04-01':
        return ctx

    if request.path.startswith('/control/'):
        _html_head = []
        template = get_template('pretix_clippy/control_head.html')

        if hasattr(request, 'event') and request.user.is_authenticated:
            for receiver, response in html_head.send(request.event, request=request):
                _html_head.append(response)

        _html_head.append(template.render({}))

        ctx['html_head'] = "".join(_html_head)

    return ctx
