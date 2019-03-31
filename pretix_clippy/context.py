from django.template.loader import get_template
from pretix.control.signals import html_head


def contextprocessor(request):
    ctx = {}

    if request.path.startswith('/control/'):
        _html_head = []
        template = get_template('pretix_clippy/control_head.html')

        if hasattr(request, 'event') and request.user.is_authenticated:
            for receiver, response in html_head.send(request.event, request=request):
                _html_head.append(response)

        _html_head.append(template.render({}))

        ctx['html_head'] = "".join(_html_head)

    return ctx
