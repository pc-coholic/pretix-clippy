from django.template.loader import get_template


def contextprocessor(request):
    ctx = {}

    if request.path.startswith('/control/'):
        template = get_template('pretix_clippy/control_head.html')

        ctx = {
            'html_head': template.render({})
        }

    return ctx
