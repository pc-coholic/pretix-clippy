import os
from distutils.command.build import build

from django.core import management
from setuptools import setup, find_packages


try:
    with open(os.path.join(os.path.dirname(__file__), 'README.rst'), encoding='utf-8') as f:
        long_description = f.read()
except:
    long_description = ''


class CustomBuild(build):
    def run(self):
        management.call_command('compilemessages', verbosity=1)
        build.run(self)


cmdclass = {
    'build': CustomBuild
}


setup(
    name='pretix-clippy',
    version='1.0.0',
    description='Plugin to add Clippy to pretix - The one plugin you didn\'t knew you even needed it. Until now.',
    long_description=long_description,
    url='https://github.com/pc-coholic/pretix-clippy',
    author='Martin Gross',
    author_email='martin@pc-coholic.de',
    license='Apache Software License',

    install_requires=[],
    packages=find_packages(exclude=['tests', 'tests.*']),
    include_package_data=True,
    cmdclass=cmdclass,
    entry_points="""
[pretix.plugin]
pretix_clippy=pretix_clippy:PretixPluginMeta
""",
)
