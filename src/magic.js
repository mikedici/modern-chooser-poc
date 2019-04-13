fetch("datasets/sample.json")
    .then(response => response.json())
    .then(data => {

        const FIELDS = Object.keys(data[0]);
        const NO_BARGRAMS = FIELDS.length;

        let type_parser = () => {
            let temp = [];
            for (let i = 0; i < NO_BARGRAMS; i++) {
                let current = parseFloat(data[0][FIELDS[i]]);
                if (current === current) {
                    temp.push("numeric");
                } else {
                    temp.push("categorical");
                }
            }
            return temp;
        }

        let category_bin_count = (field_index) => {
            /* Determine the number of distinct categories by
             appending all possible values to a set and returning its size. */

            let temp = new Set();
            for (let i = 0; i < data.length; i++) {
                temp.add(data[i][FIELDS[field_index]]);
            }
            return temp;
        }

        let numeric_bin_info = (field_index) => {
            let temp = {};
            let values = [];
            for (let i = 0; i < data.length; i++) {
                values.push(data[i][FIELDS[field_index]]);
            }

            temp["max"] = values.reduce((a, b) => {
                return Math.max(a, b);
            });
            temp["min"] = values.reduce((a, b) => {
                return Math.min(a, b);
            })
            return temp;

        }

        let create_numeric_bargram = (field_index) => {
            let elements = [];
            for (let i = 0; i < category_bin_count(field_index).size; i++) {

            }
        }

        let create_categorical_bargram = (field_index) => {
            let category_info = category_bin_count(field_index);



            let row1 = [];
            let row2 = [];
            /* this will create the "buttons" */
            for (let i = 0; i < category_info.size; i++) {
                let current_category = Array.from(category_info.values())[i];
                for (let j = 0; j < data.length; j++) {
                    if (data[j][FIELDS[field_index]] === current_category) {
                        let img_div = document.createElement("div")
                        img_div.setAttribute("id", j.toString());
                        img_div.setAttribute("class", "row1");
                        img_div.setAttribute("style", "grid-column: " + (i+1).toString());



                        let img = document.createElement("img");
                        img.setAttribute("src", "datasets/car-computer-icons-clip-art-car-icon.jpg");
                        img_div.appendChild(img);

                        row1.push(img_div);

                    }
                }
                /* create the entity icons */
                row2.push(document.createElement("div"));
                row2[i].setAttribute("id", i.toString());
                row2[i].setAttribute("class", "row2");
                row2[i].setAttribute("style", "grid-column: " + (i+1).toString() + "/" + (i+2).toString());
                row2[i].classList.add("bargrams", FIELDS[field_index])
                row2[i].innerText = current_category;

            }

            return Array.concat(row1,row2);

        }
        console.log(type_parser());
        console.log(category_bin_count(1).size);
        console.log(category_bin_count(2).size);
        console.log(numeric_bin_info(0).max);
        console.log(numeric_bin_info(0).min);

        let bargram1 = document.createElement("div");
        bargram1.setAttribute("class", "inline-grid-container");
        bargram1.setAttribute("id", "1");
        create_categorical_bargram(1).forEach((element) => {
            bargram1.appendChild(element);
        });
        document.getElementsByClassName("chooser-container")[0].appendChild(bargram1);
    });


