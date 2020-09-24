# This file is part of cloudhw.info. See LICENSE for license infomation.
"""Generate module."""

import html
import json
import os

from jinja2 import Environment, PackageLoader


class Generate:
    """Code to generate pages from templates."""

    def __init__(self, root_dir):
        """Go through and generate all pages."""
        self.root_dir = root_dir
        env = Environment(loader=PackageLoader("src", "templates"))

        json_data = self._read_json("static/instance-types.json")
        json_data = sorted(
            json_data, key=lambda k: (k["cloud"], k["family"], k["family_sort"])
        )

        instance_types = [val["size"] for val in json_data]
        self._generate_index(env, instance_types)
        self._generate_search(env, instance_types)
        self._generate_data(env, json_data)

        for page in ["about.html", "sources.html"]:
            template = env.get_template(page)
            self._write_file(page, template.render())

    def _generate_data(self, env, json_data):
        """Generate data page with large table."""
        metadata = {"instances": []}

        for instance_type in json_data:
            metadata["instances"].append(
                """
                <td class="has-text-centered">{cloud}</td>
                <td class="has-text-centered">{category}</td>
                <td class="has-text-centered">{family}</td>
                <td class="has-text-centered"><a href="{url}">{size}</a></td>
                <td class="has-text-centered">{cpu}</td>
                <td class="has-text-centered">{memory}</td>
                <td class="has-text-centered">{storage_boot}</td>
                <td class="has-text-centered">{storage_extra}</td>
                <td class="has-text-centered">{network}</td>
                <td class="has-text-centered">{other_devs}</td>
                <td class="has-text-centered">{cpu_type}</td>
                """.format(
                    cloud=instance_type["cloud"],
                    category=instance_type["family_category"],
                    family=instance_type["family"],
                    url="search.html?type=%s" % instance_type["size"],
                    size=instance_type["size"],
                    cpu=instance_type["cpu"],
                    memory=instance_type["memory"],
                    storage_boot=instance_type["storage_boot"],
                    storage_extra=instance_type["storage_extra"],
                    network=html.escape(instance_type["network_bandwidth"]),
                    other_devs=instance_type["other_devices"],
                    cpu_type=instance_type["cpu_type"],
                )
            )

        template = env.get_template("download.html")
        self._write_file("download.html", template.render(metadata))

    def _generate_index(self, env, instance_types):
        """Generate home page."""
        template = env.get_template("index.html")
        index = template.render({"instance_types": instance_types})
        self._write_file("index.html", index)

    def _generate_search(self, env, instance_types):
        """Generate search page."""
        template = env.get_template("search.html")
        index = template.render({"instance_types": instance_types})
        self._write_file("search.html", index)

    def _read_json(self, filepath):
        """Read a json file and return as array."""
        with open(filepath, "r") as json_file:
            return json.loads(json_file.read())

    def _write_file(self, filename, content):
        """Write file."""
        with open(os.path.join(self.root_dir, filename), "w") as file:
            file.write(content)
