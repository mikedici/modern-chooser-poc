// get the data
fetch("datasets/sample.json")
// load the json into memory
    .then(response => response.json())
    // call the json in memory "data" and feed it to an anonymous function
    .then(data => {
        // everything that relies on that data must be within this anonymous function
        class Bargram {
            constructor(id, type, bins, entities) {
                this.type = type;
                this.bins = bins;
                this.entities = entities;
                this.id = id;
            }

            display() {
                console.log("entered display()");
                let parent = document.getElementsByClassName('chooser-container')[0];


                console.log("parent created");
                let bargram_container = document.createElement("div");
                bargram_container.setAttribute("style", "grid-row:" + this.id.toString() + ";display:inline-grid;grid-gap=0;");

                console.log("bargram_container created");
                for (let j = 1; j <= this.bins; j++) {
                    let bargram_section = document.createElement("div");
                    bargram_section.setAttribute("style", "display:inline-grid;grid-template-columns:auto;grid-template-rows: auto auto;grid-row:1;grid-column:" + j.toString() + ";");


                    // generate bargram buttons
                    let bargram_section_bottom = document.createElement("div");
                    bargram_section_bottom.setAttribute("style", "grid-row:2;grid-column:" + j.toString() + ";");


                    let bin_button = document.createElement("button");
                    bin_button.setAttribute("style", "width:100%;padding:0;git ");

                    bin_button.innerText = j.toString();
                    bargram_section_bottom.append(bin_button);
                    bargram_section.appendChild(bargram_section_bottom);


                    // generate entity icons
                    let bargram_section_top = document.createElement("div");
                    bargram_section_top.setAttribute("style", "grid-row:1;grid-column:" + j.toString() +";");



                    for (let k = 0; k < this.entities.length; k++) {
                        console.log("inner loop reached");
                        if (this.entities[k].bin === j) {
                            let temp = document.createElement("img");
                            temp.style.maxWidth = "40px";
                            temp.setAttribute("id", "bargram" + this.id.toString() + "-entity" + (k + 1).toString());
                            temp.setAttribute("src", "datasets/car-computer-icons-clip-art-car-icon.jpg");
                            bargram_section_top.appendChild(temp);
                            console.log("img appended");
                        }
                    }
                    bargram_section.appendChild(bargram_section_top);
                    console.log("top row of section complete");
                    bargram_container.appendChild(bargram_section);
                    console.log("section complete");
                }


                parent.appendChild(bargram_container);
                console.log("bargram complete");
            }
        }

        let tim = new Bargram(1, "cat", 4, [{id: 1, bin: 1}, {id: 2, bin: 1}, {id: 3, bin: 1},
            {id: 4, bin: 2}, {id: 5, bin: 2}, {id: 6, bin: 2}, {id: 7, bin: 2}, {id: 8, bin: 2}, {id: 9, bin: 2},
            {id: 10, bin: 2}, {id: 11, bin: 3}, {id: 12, bin: 3}, {id: 13, bin: 3}, {id: 14, bin: 3}, {id: 15, bin: 3},
            {id: 16, bin: 3}, {id: 17, bin: 3}, {id: 18, bin: 3}, {id: 19, bin: 4}, {id: 20, bin: 4}]);

        let bob = new Bargram(2, "cat", 20, [{id: 1, bin: 1}, {id: 2, bin: 2}, {id: 3, bin: 3},
            {id: 4, bin: 4}, {id: 5, bin: 5}, {id: 6, bin: 6}, {id: 7, bin: 7}, {id: 8, bin: 8}, {id: 9, bin: 9},
            {id: 10, bin: 10}, {id: 11, bin: 11}, {id: 12, bin: 12}, {id: 13, bin: 13}, {id: 14, bin: 14}, {id: 15, bin: 15},
            {id: 16, bin: 16}, {id: 17, bin: 17}, {id: 18, bin: 18}, {id: 19, bin: 19}, {id: 20, bin: 20}]);
        let dave = new Bargram(3, "cat", 10, [{id: 1, bin: 1}, {id: 2, bin: 1}, {id: 3, bin: 2},
            {id: 4, bin: 2}, {id: 5, bin: 3}, {id: 6, bin: 3}, {id: 7, bin: 4}, {id: 8, bin: 4}, {id: 9, bin: 5},
            {id: 10, bin: 5}, {id: 11, bin: 6}, {id: 12, bin: 6}, {id: 13, bin: 7}, {id: 14, bin: 7}, {id: 15, bin: 8},
            {id: 16, bin: 8}, {id: 17, bin: 9}, {id: 18, bin: 9}, {id: 19, bin: 10}, {id: 20, bin: 10}]);
        tim.display();
        bob.display();
        dave.display();
    });