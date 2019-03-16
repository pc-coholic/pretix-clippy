from django.dispatch import receiver
from django.template.loader import get_template
from django.utils.translation import pgettext, ugettext_lazy as _
from pretix.control.signals import html_page_start, nav_topbar


@receiver(html_page_start, dispatch_uid="clippy_html_page_start")
def html_page_start(sender, request=None, **kwargs):
    template = get_template('pretix_clippy/control_body.html')
    return template.render({})


@receiver(nav_topbar, dispatch_uid="support_nav")
def control_support_nav(sender, request=None, **kwargs):
    return [
        {
            'label': _('Clippy'),
            'icon': 'paperclip',
            'url': ""
        }
    ]
