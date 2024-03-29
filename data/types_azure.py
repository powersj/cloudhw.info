#!/usr/bin/env python3
"""Print missing Microsoft Azure instance types."""

import json
import subprocess
import sys

from tabulate import tabulate


def azure_instance_types():
    """Return list of possible Microsoft Azure instance types."""
    cmd = ["az", "vm", "list-sizes", "--location", "westus", "--output", "json"]
    output = subprocess.run(cmd, capture_output=True)
    if output.returncode != 0:
        print("Oops: az vm list-sizes command failed!")
        print(output.stderr.decode("utf-8"))
        sys.exit(1)

    return json.loads(output.stdout)


def known_azure_sizes():
    """Return known Microsoft Azure instance types."""
    with open("instance-types.json", "r") as json_file:
        json_types = json.loads(json_file.read())
        return [
            type["size"] for type in json_types if type["cloud"] == "Microsoft Azure"
        ]


known_types = known_azure_sizes()
missing_types = []
for azure_type in azure_instance_types():
    name = azure_type["name"].replace("Standard_", "")
    if "Promo" in name:
        continue
    if name not in known_types:
        missing_types.append(
            [name, azure_type["numberOfCores"], azure_type["memoryInMB"]]
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
