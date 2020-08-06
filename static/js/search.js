/** This file is part of cloudhw.info. See LICENSE for license infomation.
 * 
 * Used to generate main page content
 *
 * Hey you! Welcome to this madness. Fair warning, before doing this
 * project I did not know really any JS. I did not even know that the
 * var, let, and const keywords even existed. If you think "hey you
 * should do XYZ", then please open a bug and help me learn!
 *
 * */

"use strict";

const AWS = "Amazon Web Services";
const Azure = "Microsoft Azure";
const GCP = "Google Cloud Platform";

const TypeAWS = {
    "options": {
        "a": "AMD EPYC processors",
        "d": "Additional local storage",
        "e": "Expanded NVMe instance storage capacity",
        "g": "AWS Graviton processors",
        "n": "Network optimized (Up to 100 Gb/s)",
        "s": "Cost-effective GPU workloads",
        "6tb": "6 TiB of Memory",
        "9tb": "9 TiB of Memory",
        "12tb": "12 TiB of Memory",
        "18tb": "18 TiB of Memory",
        "24tb": "24 TiB of Memory",
    },
    "sizes": {
        "nano": "1-2x CPUs",
        "micro": "1-2x CPUs",
        "small": "1-2x CPUs",
        "medium": "2x CPUs",
        "large": "2x CPUs",
        "xlarge": "4x CPUs",
        "2xlarge": "8x CPUs",
        "4xlarge": "16x CPUs",
        "8xlarge": "32x CPUs",
        "12xlarge": "48x CPUs",
        "16xlarge": "64x CPUs",
        "24xlarge": "96x CPUs",
        "32xlarge": "128x CPUs",
        "metal": "Baremetal instance"
    }
};

const TypeAzure = {
    "options": {
        "a": "AMD EPYC processors",
        "d": "Attached storage",
        "i": "Isolated hardware",
        "l": "Larger memory to CPU (uncertain)",
        "m": "Additional memory",
        "r": "RDMA support",
        "s": "Premium storage",
        "t": "Standard memory to CPU (uncertain)"
    }
};

const TypeGCP = {
    "sizes": {
        "micro": "Shared-core machine type",
        "small": "Shared-core machine type",
        "medium": "Shared-core machine type",
        "standard": "Balanced CPU to memory ratio",
        "highmem": "Increased memory to CPU ratio",
        "highcpu": "Increased CPU to memory ratio",
        "ultramem": "Very large memory",
        "megamem": "Very large memory"
    }
};

class InstanceToken {
    constructor(index, value, description, highlight = true) {
        this.index = index;
        this.value = value;
        this.description = description;
        this.highlight = highlight;
    }

    header() {
        if (this.highlight === false) {
            return `${this.value}&nbsp;&nbsp;`;
        }

        return `<code id="header_${this.index}">${this.value}</code>&nbsp;&nbsp;`;
    }

    box() {
        if (this.highlight === false) {
            return "";
        }

        return `
        <div class="column">
            <div id="box_${this.index}" class="box">
                <p class="content has-text-centered">
                    ${this.description}
                </p>
            </div>
        </div>`;
    }

}


function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", "../instance-types.json", true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState === 4 && xobj.status === 200) {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function addFamilyMember(member, target_size) {
    var row_start = "<tr>";
    if (member.size === target_size) {
        row_start = "<tr class=\"is-selected\">";
    }

    var storage = member.storage_boot;
    if (member.storage_extra) {
        storage = storage + ` and ${member.storage_extra}`
    }

    return `
    ${row_start}
      <th>${member.size}</th>
      <td class="has-text-centered">${member.cpu}</td>
      <td class="has-text-centered">${member.memory}</td>
      <td class="has-text-centered">${member.network_bandwidth}</td>
      <td class="has-text-centered">${storage}</td>
      <td class="has-text-centered">${member.other_devices}</td>
    </tr>`;
}

function loadFamilyTable(family, target_size) {
    var table = `
    <div class="box">
    <p class="subtitle">
        <span class="icon">
            <i class="mdi mdi-server" aria-hidden="true"></i>
        </span>
        Family Sizes
    </p>
    <div class="content">
    <table class="table is-hoverable is-narrow is-striped ">
    <thead>
        <tr>
            <th>Size</th>
            <th class="has-text-centered">CPU</th>
            <th class="has-text-centered">Memory (GiB)</th>
            <th class="has-text-centered">Network (Gbps)</th>
            <th class="has-text-centered">Storage</th>
            <th class="has-text-centered">Other Devices</th>
        </tr>
    </thead>
    <tbody>`;

    for (const member of family) {
        table = table + addFamilyMember(member, target_size);
    }

    document.getElementById("family").innerHTML = table + "</tbody></table></div></div>";
}

function loadInstanceBoxes(instance) {
    var icon = "cloud";
    if (instance.cloud === AWS) {
        icon = "aws";
    } else if (instance.cloud === GCP) {
        icon = "google-cloud";
    } else if (instance.cloud === Azure) {
        icon = "microsoft-azure";
    }
    var overview = `
    <span class="icon">
        <i class="mdi mdi-${icon}" aria-hidden="true"></i>
    </span>
    <a href="${instance.family_url}">
        ${instance.cloud} ${instance.family} family
    </a>`;
    document.getElementById("details").innerHTML = `
    <div class="box">
    <p class="subtitle">
        <span class="icon">
            <i class="mdi mdi-clipboard-text" aria-hidden="true"></i>
        </span>
        Overview
    </p>
    <p class="content">${overview}</p>
    </div>
    `;

    var cpu = instance.cpu;
    if (instance.cpu_type) {
        cpu = cpu + `x ${instance.cpu_type}`;
    }
    document.getElementById("cpu").innerHTML = `
    <div class="box">
    <p class="subtitle">
        <span class="icon">
            <i class="mdi mdi-memory" aria-hidden="true"></i>
        </span>
        CPU
    </p>
    <p class="content">${cpu}</p>
    </div>
    `;

    var memory = instance.memory;
    if (memory) {
        memory = memory + " GiB";
    }
    document.getElementById("memory").innerHTML = `
    <div class="box">
    <p class="subtitle">
        <span class="icon">
            <i class="mdi mdi-chip" aria-hidden="true"></i>
        </span>
        Memory
    </p>
    <p class="content">${memory}</p>
    </div>
    `;

    var network = instance.network_bandwidth;
    if (network) {
        network = network + " Gbps";
    }
    document.getElementById("network").innerHTML = `
    <div class="box">
    <p class="subtitle">
        <span class="icon">
            <i class="mdi mdi-router-network" aria-hidden="true"></i>
        </span>
        Network
    </p>
    <p class="content">${network}</p>
    </div>
    `;

    var storage = instance.storage_boot;
    if (instance.storage_extra) {
        storage += ` and ${instance.storage_extra}`;
    }
    document.getElementById("storage").innerHTML = `
    <div class="box">
    <p class="subtitle">
        <span class="icon">
            <i class="mdi mdi-harddisk" aria-hidden="true"></i>
        </span>
        Storage
    </p>
    <p class="content" >${storage}</p>
    </div>
    `;

    document.getElementById("notes").innerHTML = `
    <div class="box">
        <p class="subtitle">
            <span class="icon">
                <i class="mdi mdi-expansion-card-variant" aria-hidden="true"></i>
            </span>
            Other Devices
        </p>
        <p class="content" id="notes">${instance.other_devices}</p>
    </div>
    `;
}

function indexOfFirstDigit(input) {
    let i = 0;
    for (; input[i] < "0" || input[i] > "9"; i=i+1);
    return i === input.length ? -1 : i;
}

function waitForElement(elementId, callBack) {
    window.setTimeout(function() {
        var element = document.getElementById(elementId);
        if(element) {
            callBack(elementId, element);
        } else {
            waitForElement(elementId, callBack);
        }
    }, 100)
}

function decodeAWS(instance) {
    var tokens = [];

    const firstDigit = indexOfFirstDigit(instance.size.split(".")[0]);
    const family = instance.size.split(".")[0].substr(0, firstDigit + 1);
    const options = instance.size.split(".")[0].substr(firstDigit + 1);
    const size = instance.size.split(".")[1];

    // u-* instances are different than everything else
    if (family.startsWith("u-")) {
        const tb = instance.size.split(".")[0].slice(0, -1).replace("u-", "");

        tokens.push(new InstanceToken(0, "u", instance.family_category));
        tokens.push(new InstanceToken(1, "-", "", false));
        tokens.push(new InstanceToken(2, tb, TypeAWS.options[tb]));
        tokens.push(new InstanceToken(3, "1.", "", false));
        tokens.push(new InstanceToken(4, size, TypeAWS.sizes[size]));

        return tokens;
    }

    tokens.push(new InstanceToken(0, family, instance.family_category));

    var counter = 1;
    for (const option of options.split("")) {
        tokens.push(new InstanceToken(counter, option, TypeAWS.options[option]));
        counter = counter + 1;
    }

    tokens.push(new InstanceToken(counter, ".", "", false));
    tokens.push(new InstanceToken(counter + 1, size, TypeAWS.sizes[size]));

    return tokens;
}

function decodeAzure(instance) {
    var tokens = [];

    let size = instance.size.split("_");

    var family = "";
    var cpus = "";
    var options = [];

    let prefix = size[0].split("");
    for (let i = 0; i < prefix.length; i=i+1) {
        if (/^\d+$/.test(prefix[i])) {
            cpus += prefix[i];
        } else {
            if (cpus === "") {
                family += prefix[i];
            } else {
                options += prefix[i];
            }
        }
    }

    tokens.push(new InstanceToken(0, family, instance.family_category));
    tokens.push(new InstanceToken(1, cpus, "Number of CPUs"));

    var counter = 2;
    for (const option of options) {
        tokens.push(new InstanceToken(counter, option, TypeAzure.options[option]));
        counter = counter + 1;
    }

    if (size.length > 1) {
        tokens.push(new InstanceToken(counter, "_", "", false));
        tokens.push(new InstanceToken(counter + 1, size[1], "Version"));
    }

    return tokens;
}

function decodeGCP(instance) {
    var tokens = [];
    const values = instance.size.split("-");

    tokens.push(new InstanceToken(0, values[0], instance.family_category));
    tokens.push(new InstanceToken(1, "-", "", false));
    tokens.push(new InstanceToken(2, values[1], TypeGCP.sizes[values[1]]));

    if (values.length > 2) {
        tokens.push(new InstanceToken(3, "-", "", false));
        tokens.push(new InstanceToken(4, values[2], "Number of CPUs"));
    }

    return tokens;
}

function drawConnections(tokens) {
    const red = "rgb(255, 56, 96)";
    const circleRadius = 3;

    jsPlumb.reset();
    jsPlumb.ready(function() {
        for (const token of tokens) {
            if (token.highlight === false) {
                continue;
            }

            jsPlumb.connect({
                source: `header_${token.index}`,
                target: `box_${token.index}`,
                anchors: ["Bottom", "Top"],
                connector: ["Straight"],
                paintStyle: {
                    stroke: red,
                    strokeWidth: 2
                },
                endpointStyle: {
                    radius: circleRadius
                },
                endpoints: ["Dot", "Blank"]
            });
        }
    });
}

function loadTypeDecoder(instance) {
    var tokens;

    if (instance.cloud === AWS) {
        tokens = decodeAWS(instance);
    } else if (instance.cloud === Azure) {
        tokens = decodeAzure(instance);
    } else if (instance.cloud === GCP) {
        tokens = decodeGCP(instance);
    } else {
        return;
    }

    var header = "<h2 class=\"title has-text-centered has-font-monospace\">";
    var boxes = "<div class=\"columns\">";
    for (const token of tokens) {
        header += token.header();
        boxes += token.box();
    }
    header += "</h2>";
    boxes += "</div>";

    document.getElementById("decoder").innerHTML = header + boxes;
    return tokens;
}

function findInstance(search_input, instance_types) {
    var instance;
    for (const type of instance_types) {
        if (type.size === search_input) {
            instance = type;
            break;
        }
    }

    if (instance === undefined) {
        if (search_input !== "") {
            const unknown = "Oops: unknown instance type";
            document.getElementById("decoder").innerHTML = unknown;
        }

        return
    }

    document.title = `${instance.size} | cloudhw.info`;

    var family = [];
    for (const instance_type of instance_types) {
        if (instance_type.family === instance.family) {
            family.push(instance_type);
        }
    }

    const tokens = loadTypeDecoder(instance);
    loadInstanceBoxes(instance);
    loadFamilyTable(family, instance.size);

    waitForElement("decoder", function() {
        drawConnections(tokens);
    });
}

window.onload = function() {
    loadJSON(function(response) {
        const instance_types = JSON.parse(response);
        var searchBox = document.getElementById("instance-search");

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const type = urlParams.get('type')
        if (type !== undefined) {
            searchBox.value = type;
            findInstance(searchBox.value, instance_types);
        }
    });
}
