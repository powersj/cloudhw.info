#!/usr/bin/env python3
"""Print missing Google Cloud instance types."""

import json
import subprocess
import sys

from tabulate import tabulate


def gce_instance_types():
    """Return list of possible Googlce Cloud instance types."""
    cmd = [
        "gcloud",
        "compute",
        "machine-types",
        "list",
        "--format=json",
        '--filter="zone:(us-west1)"',
    ]
    output = subprocess.run(cmd, capture_output=True)
    if output.returncode != 0:
        print("Oops: gcloud compute machine-types command failed!")
        sys.exit(1)

    return json.loads(output.stdout)


def known_google_sizes():
    """Return known Azure instance types."""
    with open("instance-types.json", "r") as json_file:
        json_types = json.loads(json_file.read())
        return [type["size"] for type in json_types if type["cloud"] == "Google Cloud"]


known_types = known_google_sizes()
missing_types = []
for google_type in gce_instance_types():
    if google_type["name"] not in known_types:
        missing_types.append(
            [google_type["name"], google_type["guestCpus"], google_type["memoryMb"]]
        )

if missing_types:
    print(
        tabulate(
            missing_types,
            ["Size", "CPUs", "Memory"],
            colalign=("left", "right", "right"),
            tablefmt="pretty",
        )
    )
else:
    print("Nothing missing!")
