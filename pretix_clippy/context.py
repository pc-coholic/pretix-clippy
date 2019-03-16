from django.template.loader import get_template


def contextprocessor(request):
    ctx = {}

    if request._namespace == 'control':
        template = get_template('pretix_clippy/control_head.html')

        ctx = {
            'html_head': template.render({})
        }

    return ctx
