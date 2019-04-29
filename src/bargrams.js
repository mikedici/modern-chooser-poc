function loadJsonDataFromFile(filename) {
    return fetch(filename)
        .then(function (response) {
            return response.json();
        });
}

let binsDataPromise = loadJsonDataFromFile("bins.json");
let allRecordsPromise = loadJsonDataFromFile("records.json");

let allRecords = [];
let filteredRecords = [];
let filterParams = {};
let bargramMap = {};

Promise.all([binsDataPromise, allRecordsPromise])
    .then(values => {
        // everything that relies on that data must be within this anonymous function
        let data = values[0];
        allRecords = values[1];
        filteredRecords = allRecords;

        class Bargram {
            constructor(id, title, type, bins, bintitles, entities) {
                this.title = title;
                this.bintitles = bintitles;
                this.type = type;
                this.bins = bins;
                this.entities = entities;
                this.id = id;
            }

            display() {
                //console.log("entered display()");
                let parent = document.getElementsByClassName('chooser-container')[0];

                let bargram_title = document.createElement("div");
                let bargram_title_text = document.createElement("h4");
                bargram_title_text.className = 'attribute-title';
                bargram_title_text.innerText = this.title;
                bargram_title.appendChild(bargram_title_text);
                bargram_title.setAttribute("style", "grid-row:" + this.id.toString() + ";grid-column:2; align-self: end;");
                parent.appendChild(bargram_title);
                //console.log("parent created");
                let bargram_container = document.createElement("div");
                bargram_container.setAttribute("style", "grid-row:" + this.id.toString() + ";display:inline-grid;grid-gap=0;grid-column:3;");

                //console.log("bargram_container created");
                for (let j = 1; j <= this.bins; j++) {
                    let bargram_section = document.createElement("div");
                    bargram_section.setAttribute("style", "display:inline-grid;grid-template-columns:auto;grid-template-rows: auto auto;grid-row:1;grid-column:" + j.toString() + ";");

                    // generate entity icons
                    let bargram_section_top = document.createElement("div");
                    bargram_section_top.setAttribute("style", "grid-row:1;grid-column:" + j.toString() + "; align-self: start;");

                    for (let k = 0; k < this.entities.length; k++) {
                        //console.log("inner loop reached");
                        if (this.entities[k].bin === j) {
                            let temp = document.createElement("img");
                            temp.style.maxWidth = "10px";
                            temp.setAttribute("class", "entity" + this.entities[k].id);
                            temp.setAttribute("id", "bargram" + this.id.toString() + "-entity" + (k + 1).toString());
                            temp.setAttribute("src", "datasets/car-computer-icons-clip-art-car-icon.jpg");
                            temp.setAttribute("height", "8px");
                            temp.setAttribute("height", "8px");
                            bargram_section_top.appendChild(temp);
                            //console.log("img appended");
                        }
                    }

                    // generate bargram buttons
                    let bargram_section_bottom = document.createElement("div");
                    bargram_section_bottom.setAttribute("style", "grid-row:2;grid-column:" + j.toString() + "; align-self: end;");

                    let bin_button = document.createElement("button");
                    bin_button.setAttribute("id", "bin-btn-" + this.id + "-" + j);
                    bin_button.setAttribute("data-bargram-id", this.id);
                    bin_button.setAttribute("data-bargram-title", this.title);
                    bin_button.setAttribute("data-bargram-data-type", this.type);
                    bin_button.setAttribute("data-bin-index", "" + (j - 1));
                    if (this.type === 'con') {
                        bin_button.setAttribute("data-bin-range-max", "" + this.bintitles[j]);
                    }
                    bin_button.setAttribute("data-selected", '0');
                    bin_button.setAttribute("style", "width:100%; padding:0; cursor:pointer;");
                    bin_button.setAttribute("title", this.bintitles[j - 1]);

                    if (bargram_section_top.children.length <= 5) {
                        bin_button.innerText = "."
                    } else {
                        if (this.bintitles[j - 1].length >= bargram_section_top.children.length) {
                            bin_button.innerText = this.bintitles[j - 1].slice(0, bargram_section_top.children.length) + ".";
                        } else {
                            bin_button.innerText = this.bintitles[j - 1];
                        }
                    }
                    if (bargram_section_top.children.length >= 1) {
                        bargram_section_bottom.append(bin_button);
                        bargram_section.appendChild(bargram_section_bottom);
                        bargram_section.appendChild(bargram_section_top);
                        //console.log("top row of section complete");
                        bargram_container.appendChild(bargram_section);
                    }
                    bin_button.addEventListener('click', binButtonClicked);
                    //console.log("section complete");
                }


                parent.appendChild(bargram_container);
                //console.log("bargram complete");
            }
        }

        for (let i = 0; i < data.length; i++) {
            let bargram = new Bargram(data[i].id, data[i].title, data[i].type, data[i].bintitles.length, data[i].bintitles, data[i].entities);
            bargramMap[data[i].id] = bargram;
            bargram.display();
        }

        let entity_set = new Set();
        let entity_status = {};

        let icons = document.getElementsByTagName("img");
        // build a set of entities and start with no borders
        for (let i = 0; i < icons.length; i++) {
            entity_set.add(icons[i].classList[0]);
            icons[i].style.borderWidth = "2px";
            icons[i].style.borderStyle = "solid";
            icons[i].style.borderColor = "#ffffff00";

        }

        entity_set = Array.from(entity_set);
        //init the status of all entities to false;
        for (let j = 0; j < entity_set.length; j++) {
            entity_status[entity_set[j]] = false;
        }
        //console.log(entity_set);
        //console.log(entity_status);

        register_icon_listeners(icons, entity_status, entity_set);
        updateFilterResultsView();
    });

let register_icon_listeners = (icons, entity_status, entity_set) => {
    for (let i = 0; i < icons.length; i++) {
        // register an event listener for each icon
        icons[i].addEventListener("click", (event) => {
            let clicked = event.target.classList[0];
            // toggle the status of the entity
            entity_status[clicked] = !entity_status[clicked];

            // loop through all entity icons in the entity set
            for (let j = 0; j < entity_set.length; j++) {
                let entity_icons = document.getElementsByClassName(entity_set[j]);
                for (let k = 0; k < entity_icons.length; k++) {
                    // if the status is true set the border to red
                    if (entity_status[entity_set[j]]) {
                        entity_icons[k].style.borderWidth = "2px";
                        entity_icons[k].style.borderStyle = "solid";
                        entity_icons[k].style.borderColor = "red";
                        //if there isn't an image in results for this entity create one
                        if (document.getElementById(entity_set[j]) === null) {

                            let temp = document.createElement("img");

                            temp.id = entity_set[j];
                            temp.setAttribute("src", "entities/" + entity_set[j] + ".jpg");
                            // temp.setAttribute("width", "30px");
                            //console.log(temp);
                            document.getElementById("results").appendChild(temp);
                        }
                        //if the status is false
                    } else {
                        // make the border transparent
                        entity_icons[k].style.borderWidth = "2px";
                        entity_icons[k].style.borderStyle = "solid";
                        entity_icons[k].style.borderColor = "#ffffff00";
                        // remove the image if it exists
                        if (document.getElementById(entity_set[j]) !== null) {
                            document.getElementById(entity_set[j]).remove();
                        }

                    }
                }
            }
        });
    }

};

function binButtonClicked(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();
    let targetElement = $(event.target);
    let isSelected = parseInt(targetElement.attr('data-selected'));
    let filterParamData = {
        bargramId: parseInt(targetElement.attr('data-bargram-id')),
        bargramTitle: targetElement.attr('data-bargram-title'),
        bargramDataType: targetElement.attr('data-bargram-data-type'),
        binIndex: parseInt(targetElement.attr('data-bin-index')),
        binTitle: targetElement.attr('title')
    };
    if (filterParamData['bargramDataType'] === 'con') {
        filterParamData['binTitle'] = parseFloat(filterParamData['binTitle']);
        filterParamData['binRangeMax'] = parseFloat(bargramMap[filterParamData['bargramId']].bintitles[filterParamData['binIndex']+1]);
    }
    console.log(isSelected, filterParams, filterParamData);
    if (isSelected) {
        toggleBinButtonActiveState(targetElement);
        delete filterParams[filterParamData['bargramTitle']];
        targetElement.attr('data-selected', '0');
    } else {
        if (filterParams[filterParamData['bargramTitle']]) {
            let currentActiveBinButton = $('button#bin-btn-'+ filterParams[filterParamData['bargramTitle']].bargramId + '-' + (filterParams[filterParamData['bargramTitle']].binIndex + 1));
            toggleBinButtonActiveState(currentActiveBinButton);
            currentActiveBinButton.attr('data-selected', '0');
        }
        toggleBinButtonActiveState(targetElement);
        filterParams[filterParamData['bargramTitle']] = filterParamData;
        targetElement.attr('data-selected', '1');
    }
    console.log(parseInt(targetElement.attr('data-selected')), filterParams, filterParamData);
    updateFilterResults();
    updateFilterResultsView();
}

function toggleBinButtonActiveState(btnElement) {
    btnElement.toggleClass('active-bin-btn');
}

function updateFilterResults() {
    filteredRecords = [];
    for (let i = 0; i < allRecords.length; i++) {
        let recordMatch = isFilterConditionsMatch(allRecords[i]);
        if (recordMatch) {
            filteredRecords.push(allRecords[i]);
        }
    }
}

function isFilterConditionsMatch(record) {
    let match = true;
    for (let attribute in filterParams) {
        if (filterParams.hasOwnProperty(attribute)) {
            let paramData = filterParams[attribute];
            match = match && isConditionMatch(paramData, record, attribute);
            if (!match) {
                match = false;
                break;
            }
        }
    }
    return match;
}

function isConditionMatch(paramData, record, attribute) {
    if (paramData['bargramDataType'] === 'cat' && record[attribute] === paramData['binTitle']) {
        return true;
    } else if (paramData['bargramDataType'] === 'con' && (paramData['binTitle'] <= record[attribute] && record[attribute] < paramData['binRangeMax'])) {
        return true;
    }
    return false;
}

function updateFilterResultsView() {
    let containerElement = $('div#filtered-results-container');
    clearCurrentResults(containerElement);
    let gridContainerElement = $("<div style='display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); grid-column-gap: 15px; grid-row-gap: 15px;'></div>");
    let gridItem = "<div class='grid-item' " +
                        "style='display: inline-grid; grid-template-rows: auto auto; grid-template-columns:auto; " +
                                "border: 1px solid brown; height: 120px; width: 120px;'>" +
                    "</div>";
    gridContainerElement.appendTo(containerElement);

    for (let i = 0; i < filteredRecords.length; i++) {
        let gridItemElement = $(gridItem);
        let itemImage = "<div class='item-image' style='grid-row: 1; grid-column:1; align-self: stretch; justify-self: stretch;'>" +
                            "<img src='cars/" + filteredRecords[i].Image + ".jpg' height='100%' width='100%'>" +
                        "</div>";
        let itemTitle = "<div class='item-title' style='grid-row: 2; grid-column:1; align-self: end; justify-content: center'>" +
                            filteredRecords[i].Details +
                        "</div>";
        $(itemImage).appendTo(gridItemElement);
        $(itemTitle).appendTo(gridItemElement);
        gridItemElement.appendTo(gridContainerElement);
    }
}

function clearCurrentResults(jqDomElement) {
    jqDomElement = jqDomElement || $('div#filtered-results-container');
    jqDomElement.empty();
}

$('button.reset-btn').click(function () {
    for(let param in filterParams){
        let activeBinButton = $('button#bin-btn-'+ filterParams[param].bargramId + '-' + (filterParams[param].binIndex + 1));
        toggleBinButtonActiveState(activeBinButton);
        activeBinButton.attr('data-selected', '0');
    }
    filterParams = {};
    filteredRecords = allRecords;
    updateFilterResultsView();
});