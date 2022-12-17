const fs = require("fs");
const path = require("path");
const { callbackify } = require("util");

const answer = [];
fs.readFile(path.join(__dirname, "switch-transceiver-details.txt"), {encoding: 'utf-8'}, (err, data) => {
    if(err){
        console.log(err);
        return;
    }

    // Data manip
    data = data.split("Port ");
    data.shift();

    // For every port:
    for(let i = 0; i < data.length; i++){
        data[i] = "Port" + data[i]; // "Port" was removed by splitting.
        data[i] = data[i].split("\n");

        const port = {};
        // For every line look for keys
        for(let j = 0; j < data[i].length; j++){

            data[i][j] = data[i][j].split(":");

            // Ignore keyless lines
            if(data[i][j].length == 1){
                continue;
            }
            
            // Multiple keys per line -> new Object()
            if(data[i][j].length > 2){
                const subset = {};

                // Threshhold values can be ignored
                if(data[i][j][0].includes("Threshold")){
                    continue;
                }

                // Line now looks something like: ["first", "second  shouldBeThird", "shouldbeFourth"]
                data[i][j][1] = data[i][j][1].trim().split(/[ ]{2,}/);

                // Default is "value"
                subset["value"] = formatValue(data[i][j][1][0]);
                subset[formatKey(data[i][j][1][1])] = formatValue(data[i][j][2]);

                // Add object with key to port object
                port[formatKey(data[i][j][0])] = subset; // e.g. temp: {},
                continue;
            }

            // Only one key in line:
            port[formatKey(data[i][j][0])] = formatValue(data[i][j][1]);
        }
        //console.log(port);
        answer.push(port);

    }    
    console.info(answer);
});

function formatKey(string){
    const nonAlphNum = string.search(/[^a-zA-Z\d\s:]/); // 
    string = ( (nonAlphNum == -1) ? string : string.slice(0, nonAlphNum));
    string = string.trim();
    string = string.replaceAll(" ", "_").toLowerCase();
    return string;
}


function formatValue(string){
    return string==+string?+string:string.trim();
}