from django.dispatch import receiver
from django.template.loader import get_template
from pretix.control.signals import html_page_start


@receiver(html_page_start, dispatch_uid="clippy_html_page_start")
def html_page_start(sender, request=None, **kwargs):
    template = get_template('pretix_clippy/control.html')
    return template.render({})
