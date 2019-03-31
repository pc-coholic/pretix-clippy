Clippy for pretix
==========================

This is a plugin for `pretix`_. 

Development setup
-----------------

1. Make sure that you have a working `pretix development setup`_.

2. Clone this repository, eg to ``local/pretix-clippy``.

3. Activate the virtual environment you use for pretix development.

4. Execute ``python setup.py develop`` within this directory to register this application with pretix's plugin registry.

5. Execute ``make`` within this directory to compile translations.

6. Restart your local pretix server. You can now use the plugin from this repository for your events by enabling it in
   the 'plugins' tab in the settings.

Acknowledgements
----------------
- `Perhanid's clippy.js fork`_, based on `smore Inc's clippy.js`_
- `Joe Walnes' jquery-simple-context-menu`_
- `js-cookie`_
- `Shalom Yerushalmy's css-wordart`_
- `Raphael Michel`_ for the very dirty `context_processors` hack

License
-------

Copyright 2019 Martin Gross

Released under the terms of the Apache License 2.0


.. _pretix: https://github.com/pretix/pretix
.. _pretix development setup: https://docs.pretix.eu/en/latest/development/setup.html
.. _perhanid's clippy.js fork: https://github.com/perhanid/clippy.js
.. _smore Inc's clippy.js: https://github.com/smore-inc/clippy.js
.. _Joe Walnes' jquery-simple-context-menu: https://github.com/joewalnes/jquery-simple-context-menu/
.. _Raphael Michel: https://github.com/raphaelm
.. _js-cookie: https://github.com/js-cookie/js-cookie
.. _Shalom Yerushalmy's css-wordart: https://github.com/yershalom/css-wordart
