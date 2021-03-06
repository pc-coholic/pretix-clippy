from django.apps import AppConfig
from django.utils.translation import ugettext_lazy


class PluginApp(AppConfig):
    name = 'pretix_clippy'
    verbose_name = 'Clippy for pretix'

    class PretixPluginMeta:
        name = ugettext_lazy('Clippy for pretix')
        author = 'Martin Gross'
        description = ugettext_lazy('Plugin to add Clippy to pretix - The one plugin you didn\'t knew you even needed it. Until now.')
        visible = False
        version = '1.0.0'

    def ready(self):
        from . import signals  # NOQA
        from django.conf import settings

        # Yes. Seriously. Sorry, not sorry.
        settings.TEMPLATES[0]['OPTIONS']['context_processors'].append('pretix_clippy.context.contextprocessor')


default_app_config = 'pretix_clippy.PluginApp'
