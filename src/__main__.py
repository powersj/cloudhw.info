#!/usr/bin/env python3
# This file is part of cloudhw.info. See LICENSE for license infomation.
"""Main module."""

import argparse
import logging
import os
import pathlib
import shutil
import sys
from distutils.dir_util import copy_tree

from .generate import Generate


def parse_args():
    """Set up command-line arguments."""
    parser = argparse.ArgumentParser("cloudhw.info")
    parser.add_argument(
        "--debug", action="store_true", help="additional logging output"
    )
    parser.add_argument("--root_dir", default="html", help="base directory for output")
    return parser.parse_args()


def setup_logging(debug):
    """Set up logging.

    Args:
        debug: boolean, if additional logging
    """
    logging.basicConfig(
        stream=sys.stdout,
        format="%(message)s",
        level=logging.DEBUG if debug else logging.INFO,
    )


def launch():
    """Launch site generation."""
    args = parse_args()
    setup_logging(args.debug)

    if os.path.exists(args.root_dir):
        shutil.rmtree(args.root_dir, ignore_errors=True)
    pathlib.Path(args.root_dir).mkdir(exist_ok=True)

    Generate(args.root_dir)

    copy_tree("static", args.root_dir)


if __name__ == "__main__":
    sys.exit(launch())
