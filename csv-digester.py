import json

data = []
with open("AutoSelector.csv", "r") as f:
    data = f.readlines()

#split the header row to get the bargram titles and categorize them
bargramTitles = data[0].split(",")
attributes = {
    bargramTitles[0].rstrip(): ("cat",),
    bargramTitles[1].rstrip(): ("skip"),
    bargramTitles[2].rstrip(): ("cat",),
    bargramTitles[3].rstrip(): ("cat",),
    bargramTitles[5].rstrip(): ("con", [0, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000]),
    bargramTitles[4].rstrip(): ("con", [0, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000]),
    bargramTitles[6].rstrip(): ("con",[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65]),
    bargramTitles[7].rstrip(): ("con",[10 ,20 ,30, 40, 50, 60, 70]),
    bargramTitles[8].rstrip(): ("con",[0, 100, 200, 300, 400, 500]),
    bargramTitles[9].rstrip(): ("con",[80, 90, 100, 110, 120, 130, 140]),
    bargramTitles[10].rstrip(): ("con",[140,150, 160, 170, 180, 190, 200, 210, 220, 230]),
    bargramTitles[11].rstrip(): ("con",[34, 35, 36, 37, 38, 39, 40, 42, 43, 44]),
    bargramTitles[12].rstrip(): ("con",[37, 38, 39, 40, 41, 42, 43, 44]),
    bargramTitles[13].rstrip(): ("cat",),
    bargramTitles[14].rstrip(): ("cat",),
}

print(attributes)
def categorical_bins(colnumber):
    categories = []
    for i in range(1, len(data)):
        categories.append(data[i].split(',')[colnumber])
    return list(set(categories))

def categorical_map(colnumber):
    bins = {k:v+1 for v,k in enumerate(categorical_bins(colnumber))} 
    bargramMap = []

    for i in range(1, len(data)):
        bargramMap.append({"id" : i,"bin": bins[data[i].split(',')[colnumber]]})
    return list(bins.keys()), bargramMap


def continuous_map(colnumber, bins):
    bargramMap = []
    for i in range(1, len(data)):
        temp = float(data[i].split(',')[colnumber])
        noted = False
        for j in range(len(bins)-1):

            if temp >= bins[j] and temp < bins[j + 1]:
                bargramMap.append({"id": i, "bin": j+1})
                noted = True
            elif j == len(bins)-2 and temp >= bins[j+1]:
                bargramMap.append({"id": i, "bin": j+2})
                noted = True
        if not noted:
            print(f"line: {i}, {colnumber} - {bargramTitles[colnumber]}. {temp}")

        
    return bins, bargramMap


#(1, "cat", 38, bargram_one_bins, [
def generate_output(id, kind, title, bargram_info):
    bargram = {
        "id" : id,
        "type" : kind,
        "title": title,
        "bintitles": bargram_info[0],
        "entities" : bargram_info[1]
    }
    return bargram

bargrams = []
            
for i,v in enumerate(attributes.keys()):
    if i != 1 and i < len(attributes.keys()):
        if attributes[v][0] == "cat":
            bargrams.append(generate_output(i, "cat", v, categorical_map(i)))
        elif attributes[v][0] == "con":
            bargrams.append(generate_output(i, "con", v, continuous_map(i, attributes[v][1])))
            
    else:
        pass
    
    
with open("bins.json", "w") as f:
    json.dump(bargrams,f)