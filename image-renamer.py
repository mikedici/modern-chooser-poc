filenames = []
# Read the filenames from a txt file
with open("ezviz-cars-images.txt", "r") as filenames_input:
    filenames = filenames_input.readlines()
# remove the linebreaks
for i in range(len(filenames)):
    filenames[i] = filenames[i].rstrip()

# for every name in the list copy the file into entites with a new filename "entity{j+1}".jpg
for j in range(len(filenames)):
    filename = filenames[j]
    if len(filename) < 14:
        filename = f"00{filename}"
    new_filename = f"entity{j+1}"
    with open(f"cars/{filename}.jpg", "rb") as f:
        with open(f"entities/{new_filename}.jpg", "wb") as o:
            o.write(f.read())
