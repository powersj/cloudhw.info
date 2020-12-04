#!/usr/bin/env python3
"""Print missing AWS EC2 instance types."""

import json

from boto3.session import Session
from tabulate import tabulate


def ec2_instance_types():
    """Return list of possible AWS EC2 instance types."""
    session = Session()
    ec2 = session.client("ec2")
    response = ec2.describe_instance_types()

    instance_types = response["InstanceTypes"]
    while "NextToken" in response:
        nextToken = response["NextToken"] if "NextToken" in response else None
        response = ec2.describe_instance_types(NextToken=nextToken)
        instance_types.extend(response["InstanceTypes"])

    return sorted(instance_types, key=lambda i: i["InstanceType"])


def known_ec2_sizes():
    """Return known AWS EC2 instance types."""
    with open("instance-types.json", "r") as json_file:
        json_types = json.loads(json_file.read())
        return [
            type["size"]
            for type in json_types
            if type["cloud"] == "Amazon Web Services"
        ]


known_types = known_ec2_sizes()
missing_types = []
for aws_type in ec2_instance_types():
    if aws_type["CurrentGeneration"] and aws_type["InstanceType"] not in known_types:
        if "Hypervisor" in aws_type:
            hypervisor = aws_type["Hypervisor"]
        else:
            hypervisor = "unknown"

        missing_types.append(
            [
                aws_type["InstanceType"],
                hypervisor,
                aws_type["VCpuInfo"]["DefaultVCpus"],
                aws_type["MemoryInfo"]["SizeInMiB"],
                aws_type["NetworkInfo"]["NetworkPerformance"],
            ]
        )

if missing_types:
    print(
        tabulate(
            missing_types,
            ["Size", "Virt", "CPUs", "Memory", "Network"],
            colalign=("left", "center", "right", "right", "right"),
            tablefmt="pretty",
        )
    )
else:
    print("Nothing missing!")
