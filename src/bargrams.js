// get the data
fetch("bins.json")
// load the json into memory
    .then(response => response.json())
    // call the json in memory "data" and feed it to an anonymous function
    .then(data => {
        // everything that relies on that data must be within this anonymous function
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
                console.log("entered display()");
                let parent = document.getElementsByClassName('chooser-container')[0];

                let bargram_title = document.createElement("div");
                let bargram_title_text = document.createElement("h4");
                bargram_title_text.className = 'attribute-title';
                bargram_title_text.innerText = this.title;
                bargram_title.appendChild(bargram_title_text);
                bargram_title.setAttribute("style", "grid-row:" +this.id.toString() + ";grid-column:2; align-self: end;");
                parent.appendChild(bargram_title);
                console.log("parent created");
                let bargram_container = document.createElement("div");
                bargram_container.setAttribute("style", "grid-row:" + this.id.toString() + ";display:inline-grid;grid-gap=0;grid-column:3;");

                console.log("bargram_container created");
                for (let j = 1; j <= this.bins; j++) {
                    let bargram_section = document.createElement("div");
                    bargram_section.setAttribute("style", "display:inline-grid;grid-template-columns:auto;grid-template-rows: auto auto;grid-row:1;grid-column:" + j.toString() + ";");

                    // generate entity icons
                    let bargram_section_top = document.createElement("div");
                    bargram_section_top.setAttribute("style", "grid-row:1;grid-column:" + j.toString() + "; align-self: start;");


                    for (let k = 0; k < this.entities.length; k++) {
                        console.log("inner loop reached");
                        if (this.entities[k].bin === j) {
                            let temp = document.createElement("img");
                            temp.style.maxWidth = "10px";
                            temp.setAttribute("class", "entity" + this.entities[k].id);
                            temp.setAttribute("id", "bargram" + this.id.toString() + "-entity" + (k + 1).toString());
                            temp.setAttribute("src", "datasets/car-computer-icons-clip-art-car-icon.jpg");
                            temp.setAttribute("height", "8px");
                            temp.setAttribute("height", "8px");
                            bargram_section_top.appendChild(temp);
                            console.log("img appended");
                        }
                    }

                    // generate bargram buttons
                    let bargram_section_bottom = document.createElement("div");
                    bargram_section_bottom.setAttribute("style", "grid-row:2;grid-column:" + j.toString() + "; align-self: end;");


                    let bin_button = document.createElement("button");
                    bin_button.setAttribute("style", "width:100%;padding:0;git ");

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
                        console.log("top row of section complete");
                        bargram_container.appendChild(bargram_section);
                    }
                    console.log("section complete");
                }


                parent.appendChild(bargram_container);
                console.log("bargram complete");
            }
        }

        // let bargram_one_bins = ['Suzuki', 'Daewoo', 'AM General', 'Kia', 'Infiniti', 'Jeep', 'Audi', 'Toyota', 'Volvo', 'Chrysler', 'Lexus', 'GMC', 'BMW', 'Mazda', 'Nissan', 'Saab', 'Lincoln', 'Subaru', 'Isuzu', 'Buick', 'Volkswagen', 'Jaguar', 'Mercury', 'Cadillac', 'Plymouth', 'Mitsubishi', 'Oldsmobile', 'Acura', 'Hyundai', 'Saturn', 'Porsche', 'Mercedes-Benz', 'Ford', 'Dodge', 'Chevrolet', 'Pontiac', 'Honda', 'Land Rover'];
        //
        // let tim = new Bargram(1, "cat", 38, bargram_one_bins, [{'id': 1, 'bin': 3}, {'id': 2, 'bin': 28}, {
        //     'id': 3,
        //     'bin': 28
        // }]);
        // tim.display();


        let bargrams = [];
        for (let i = 0; i < data.length; i++) {
            bargrams.push(new Bargram(data[i].id, data[i].title, data[i].type, data[i].bintitles.length, data[i].bintitles, data[i].entities));
        }

        for (let i = 0; i < bargrams.length; i++) {
            bargrams[i].display();
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
        console.log(entity_set);
        console.log(entity_status);

        let register_icon_listeners = () => {
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
                                    console.log(temp);
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
        register_icon_listeners();

    });