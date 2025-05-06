#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

# os.environ['GDAL_LIBRARY_PATH'] = r'C:\Users\LENOVO\anaconda3\envs\pygdal\Library\bin\gdal306.dll'

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sonatrach__project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
