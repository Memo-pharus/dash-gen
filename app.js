const dashboard = {
  endpoint: "/dashboard/new/data/",
  sections: []
};

// Ensure buttons are connected properly
document.addEventListener("DOMContentLoaded", () => {
  const importButton = document.getElementById("importJson");
  const exportButton = document.getElementById("exportJson");
  const addSectionButton = document.getElementById("addSection");

  if (importButton) {
    importButton.addEventListener("click", importJson);
  }
  if (exportButton) {
    exportButton.addEventListener("click", exportJson);
  }
  if (addSectionButton) {
    addSectionButton.addEventListener("click", addSection);
  }
});


function addSection() {
  const section = {
    title: "New Section",
    content: []
  };

  dashboard.sections.push(section);
  renderDashboard();
}

function renderDashboard() {
  const dashboardDiv = document.getElementById("dashboard");
  dashboardDiv.innerHTML = "";

  dashboard.sections.forEach((section, sectionIndex) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("section");

    const sectionTitle = document.createElement("h2");
    sectionTitle.contentEditable = true;
    sectionTitle.textContent = section.title;
    sectionTitle.addEventListener("input", (e) => {
      dashboard.sections[sectionIndex].title = e.target.textContent;
    });

    const addGroupButton = document.createElement("button");
    addGroupButton.textContent = "Add Group";
    addGroupButton.addEventListener("click", () => addGroup(sectionIndex));

    sectionDiv.appendChild(sectionTitle);
    sectionDiv.appendChild(addGroupButton);

    section.content.forEach((group, groupIndex) => {
      const groupDiv = document.createElement("div");
      groupDiv.classList.add("group");

      const groupTitle = document.createElement("input");
      groupTitle.type = "text";
      groupTitle.placeholder = "Group Title";
      groupTitle.value = group.title || "";
      groupTitle.addEventListener("input", (e) => {
        dashboard.sections[sectionIndex].content[groupIndex].title = e.target.value;
      });

      const groupSize = document.createElement("input");
      groupSize.type = "number";
      groupSize.placeholder = "Group Size (1-12)";
      groupSize.value = group.size || 12;
      groupSize.addEventListener("input", (e) => {
        dashboard.sections[sectionIndex].content[groupIndex].size = parseInt(e.target.value, 10);
      });

      const addBlockButton = document.createElement("button");
      addBlockButton.textContent = "Add Block";
      addBlockButton.addEventListener("click", () => addBlock(sectionIndex, groupIndex));

      groupDiv.appendChild(groupTitle);
      groupDiv.appendChild(groupSize);
      groupDiv.appendChild(addBlockButton);

      group.blocks.forEach((block, blockIndex) => {
        const blockDiv = document.createElement("div");
        blockDiv.classList.add("block");

        const blockType = createDropdown(
          "Type",
          ["ban", "chart", "table"],
          block.type || "ban",
          (value) => {
            dashboard.sections[sectionIndex].content[groupIndex].blocks[blockIndex].type = value;
            renderDashboard();
          }
        );

        const blockTitle = document.createElement("input");
        blockTitle.type = "text";
        blockTitle.placeholder = "Block Title";
        blockTitle.value = block.title || "";
        blockTitle.addEventListener("input", (e) => {
          dashboard.sections[sectionIndex].content[groupIndex].blocks[blockIndex].title = e.target.value;
        });

        const blockSize = document.createElement("input");
        blockSize.type = "number";
        blockSize.placeholder = "Width (1-12)";
        blockSize.value = block.size || 3;
        blockSize.addEventListener("input", (e) => {
          dashboard.sections[sectionIndex].content[groupIndex].blocks[blockIndex].size = parseInt(e.target.value, 10);
        });

        const blockIdApi = document.createElement("input");
        blockIdApi.type = "text";
        blockIdApi.placeholder = "idApi";
        blockIdApi.value = block.idApi || "";
        blockIdApi.addEventListener("input", (e) => {
          dashboard.sections[sectionIndex].content[groupIndex].blocks[blockIndex].idApi = e.target.value;
        });

        const blockId = document.createElement("input");
        blockId.type = "text";
        blockId.placeholder = "ID";
        blockId.value = block.id || "";
        blockId.addEventListener("input", (e) => {
          dashboard.sections[sectionIndex].content[groupIndex].blocks[blockIndex].id = e.target.value;
        });

        blockDiv.appendChild(blockType);
        blockDiv.appendChild(blockTitle);
        blockDiv.appendChild(blockSize);
        blockDiv.appendChild(blockIdApi);
        blockDiv.appendChild(blockId);

        if (block.type === "chart") {
          const showTooltip = createCheckbox(
            "Show Tooltip",
            block.showTooltip,
            (value) => {
              dashboard.sections[sectionIndex].content[groupIndex].blocks[blockIndex].showTooltip = value;
            }
          );

          const isGrouped = createCheckbox(
            "Is Grouped",
            block.isGrouped,
            (value) => {
              dashboard.sections[sectionIndex].content[groupIndex].blocks[blockIndex].isGrouped = value;
            }
          );

          blockDiv.appendChild(showTooltip);
          blockDiv.appendChild(isGrouped);
        }

        if (block.type === "ban") {
          const unitDropdown = createDropdown(
            "Unit",
            ["number", "money", "percent"],
            block.unit || "number",
            (value) => {
              dashboard.sections[sectionIndex].content[groupIndex].blocks[blockIndex].unit = value;
            }
          );

          const decimalCheckbox = createCheckbox(
            "Decimal",
            block.decimal,
            (value) => {
              dashboard.sections[sectionIndex].content[groupIndex].blocks[blockIndex].decimal = value;
            }
          );

          const shortenCheckbox = createCheckbox(
            "Shorten",
            block.shorten,
            (value) => {
              dashboard.sections[sectionIndex].content[groupIndex].blocks[blockIndex].shorten = value;
            }
          );

          blockDiv.appendChild(unitDropdown);
          blockDiv.appendChild(decimalCheckbox);
          blockDiv.appendChild(shortenCheckbox);
        }

        groupDiv.appendChild(blockDiv);
      });

      sectionDiv.appendChild(groupDiv);
    });

    dashboardDiv.appendChild(sectionDiv);
  });
}

function addGroup(sectionIndex) {
  dashboard.sections[sectionIndex].content.push({
    title: "New Group",
    size: 12,
    blocks: []
  });
  renderDashboard();
}

function addBlock(sectionIndex, groupIndex) {
  dashboard.sections[sectionIndex].content[groupIndex].blocks.push({
    type: "ban",
    title: "",
    idApi: "",
    id: "",
    size: 3
  });
  renderDashboard();
}

function createCheckbox(label, checked, onChange) {
  const wrapper = document.createElement("div");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = checked || false;
  input.addEventListener("change", (e) => onChange(e.target.checked));

  const text = document.createElement("label");
  text.textContent = label;

  wrapper.appendChild(input);
  wrapper.appendChild(text);
  return wrapper;
}

function createDropdown(label, options, selected, onChange) {
  const wrapper = document.createElement("div");
  const select = document.createElement("select");

  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    opt.selected = option === selected;
    select.appendChild(opt);
  });

  select.addEventListener("change", (e) => onChange(e.target.value));
  const text = document.createElement("label");
  text.textContent = label;

  wrapper.appendChild(text);
  wrapper.appendChild(select);
  return wrapper;
}

function exportJson() {
  const json = JSON.stringify(dashboard, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "dashboard.json";
  link.click();
}

function importJson() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const importedDashboard = JSON.parse(reader.result);

        console.log("Imported JSON:", importedDashboard); // Log the imported file for debugging

        // Validate the structure of the imported JSON
        if (validateDashboard(importedDashboard)) {
          Object.assign(dashboard, importedDashboard);
          renderDashboard();
          alert("File imported successfully!");
        } else {
          console.error("Validation failed. Imported JSON structure is invalid.");
          alert("Invalid dashboard structure. Please check the JSON file.");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error.message);
        alert("Failed to parse JSON file. Please ensure the file is properly formatted.");
      }
    };

    reader.onerror = () => {
      alert("Error reading the file. Please try again.");
    };

    reader.readAsText(file);
  });

  input.click();
}

function validateDashboard(data) {
  // Check that the structure matches expected fields
  if (typeof data !== "object" || !Array.isArray(data.sections)) {
    return false;
  }

  // Check each section for content and valid types
  return data.sections.every((section) => {
    if (!Array.isArray(section.content)) return false;

    return section.content.every((content) => {
      // Validate each block type (bans, charts, tables)
      return (
        (content.bans && Array.isArray(content.bans)) ||
        (content.charts && Array.isArray(content.charts)) ||
        (content.tables && Array.isArray(content.tables)) ||
        (content.size && typeof content.size === "number")
      );
    });
  });
}




renderDashboard();
