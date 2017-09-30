var easymidi = require('easymidi');

//Insert some sort of auto detection for the launchpad vs launchpad mini & other midi devices
//As well as other error handling stuffs.

//Variables
var launchpadOutput = new easymidi.Output('Launchpad Mini');
var launchpadInput = new easymidi.Input('Launchpad Mini');
var vt3Output = new easymidi.Output('VT-3');
var vt3Input = new easymidi.Input('VT-3');

var pitch = 64;
var formant = 64;
var mixbalance = 127;
var robot = 0;
var bypass = 0;
var reverb = 0;

var curPage = 0;

var launchpadPageNum = -1;
var launchpadButtonNum = -1;
var selectedPage = -1
var pageColors = [
    calcColorValue(3, 3, 0),
    calcColorValue(3, 3, 0),
    calcColorValue(3, 3, 0),
    calcColorValue(0, 3, 0),
    calcColorValue(0, 3, 0),
    calcColorValue(0, 3, 0),
    calcColorValue(3, 0, 0),
    calcColorValue(3, 0, 0)
];

//Setup
launchpadOutput.send('reset'); //Rest the launchpad for use
launchpadOutput.send('cc', { controller: 0, value: 40, channel: 0 }); //This tells the launchpad to blink the buttons
for (x = 0; x < 8; x++) { //Setup the top row of button colors
    launchpadOutput.send('cc', { controller: (x + 104), value: pageColors[x], channel: 0 });
}
for (var x = 0; x < 9; x++) {
    for (var y = 0; y < 8; y++) {
        launchpadOutput.send('noteon', {
            note: XYToButton(x, y),
            velocity: calcColorValue(0, 0, 0),
            channel: 0
        });
    }
}
var presets = importFile();

/*
//uncomment this to reset (or setup) the presets file
presets = [0, 1];
presets[0] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71]
presets[1] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71]
for (var x = 0; x < 72; x++) {
    presets[0][x] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63]
    presets[1][x] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63]
    for (var y = 0; y < 63; y++) {
        presets[0][x][y] = { "color":0, "midi":0 };
        presets[1][x][y] = { "color":0, "midi":0 };
        presets[0][x][y].color = { "red": 0, "green": 0 };
        presets[1][x][y].color = { "red": 0, "green": 0 };
        presets[0][x][y].midi = { "pitch": 64, "formant": 64, "mixbalance": 127, "robot": 0, "bypass": 0, "reverb": 0 };
        presets[1][x][y].midi = { "pitch": 64, "formant": 64, "mixbalance": 127, "robot": 0, "bypass": 0, "reverb": 0 };
    }
}
    updateFile();
*/

//Listeners
launchpadInput.on('cc', function(msg) {
    if (msg.value === 127) { //The Launchpad sends two messages each time the button is pressed and released.  This prevents it.
        console.log(msg);
        for (x = 0; x < 8; x++) { //Setup the top row of button colors
            launchpadOutput.send('cc', { controller: (x + 104), value: pageColors[x], channel: 0 });
        }
        selectPage(msg.controller - 104); //the top buttons are 104 to 111, so for the sake of making it a little easier, we shrink the numbers
    }
});

launchpadInput.on('noteon', function(msg) {
    if (msg.velocity === 127) {
        console.log(msg);
        var x = buttonToXY(msg.note)[0]
        var y = buttonToXY(msg.note)[1]
        buttonPressed(x, y);
    }
});

vt3Input.on('cc', function(msg) {
    console.log(msg);
    switch (msg.controller) {
        case 12: //Pitch
            pitch = msg.value;
            break;
        case 13: //Formant
            formant = msg.value;
            break;
        case 16: //Mix Balance
            mixbalance = msg.value;
            break;
        case 17: //Robot
            robot = msg.value;
            break;
        case 18: //bypass
            bypass = msg.value;
            break;
        case 91: //reverb
            reverb = msg.value;
            break;
        default: //Just do Pitch anyways.
            pitch = msg.value;
            break;
    }
});

//Functions
function selectPage(pageNumber) {
    launchpadPageNum = pageNumber;
    launchpadOutput.send('cc', { //update the new button to flash (that's what the "-4" is for)
        controller: launchpadPageNum + 104,
        value: (pageColors[launchpadPageNum] - 4),
        channel: 0
    });
    switch (pageNumber) {
        case 0:
            selectPage0();
            break;
        case 1:
            selectPage1();
            break;
        case 2:
            selectPage2();
            break;
        case 3:
            selectPage3();
            break;
        case 4:
            selectPage4();
            break;
        case 5:
            selectPage5();
            break;
        case 6:
            selectPage6();
            break;
        case 7:
            selectPage7();
            break;
        default:
            selectPage0();
            break;
    }
};

function selectPage0() {
    selectedPage = 0;
    curPage = 0;
    for (var x = 0; x < 9; x++) {
        for (var y = 0; y < 8; y++) {
            launchpadOutput.send('noteon', {
                note: XYToButton(x, y),
                velocity: calcColorValue(presets[0][x][y].color.red, presets[0][x][y].color.green, 0),
                channel: 0
            });
        }
    }
};

function selectPage1() {
    selectedPage = 1;
    curPage = 1;
    for (var x = 0; x < 9; x++) {
        for (var y = 0; y < 8; y++) {
            launchpadOutput.send('noteon', {
                note: XYToButton(x, y),
                velocity: calcColorValue(presets[1][x][y].color.red, presets[1][x][y].color.green, 0),
                channel: 0
            });
        }
    }
};

function selectPage2() {
    launchpadButtonNum = -1;
    for (var x = 0; x < 9; x++) {
        for (var y = 0; y < 8; y++) {
            launchpadOutput.send('noteon', {
                note: XYToButton(x, y),
                velocity: calcColorValue(0, 0, 0),
                channel: 0
            });
        }
    }
    selectPage(Math.round(Math.random()));
    buttonPressed(Math.random() * 9, Math.random() * 8);
};

function selectPage3() {
    for (var x = 0; x < 9; x++) {
        for (var y = 0; y < 8; y++) {
            launchpadOutput.send('noteon', {
                note: XYToButton(x, y),
                velocity: calcColorValue(0, 3, 0),
                channel: 0
            });
        }
    }
};

function selectPage4() {
    for (var x = 0; x < 9; x++) {
        for (var y = 0; y < 8; y++) {
            launchpadOutput.send('noteon', {
                note: XYToButton(x, y),
                velocity: calcColorValue(0, 3, 0),
                channel: 0
            });
        }
    }
};

function selectPage5() {
    for (var x = 0; x < 9; x++) {
        for (var y = 0; y < 8; y++) {
            launchpadOutput.send('noteon', {
                note: XYToButton(x, y),
                velocity: calcColorValue(0, 3, 0),
                channel: 0
            });
        }
    }
};

function selectPage6() {
    for (var x = 0; x < 9; x++) {
        for (var y = 0; y < 8; y++) {
            launchpadOutput.send('noteon', {
                note: XYToButton(x, y),
                velocity: calcColorValue(0, 0, 0),
                channel: 0
            });
        }
    }
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            launchpadOutput.send('noteon', {
                note: XYToButton(x, y),
                velocity: calcColorValue(x / 2, y / 2 - .5, 0),
                channel: 0
            });
        }
    }
};

function selectPage7() {

};

function buttonPressed(x, y) {
    switch (launchpadPageNum) {
        case 0:
            selectBtnOnPage0(x, y);
            break;
        case 1:
            selectBtnOnPage1(x, y);
            break;
        case 2:
            selectBtnOnPage2(x, y);
            break;
        case 3:
            selectBtnOnPage3(x, y);
            break;
        case 4:
            selectBtnOnPage4(x, y);
            break;
        case 5:
            selectBtnOnPage5(x, y);
            break;
        case 6:
            selectBtnOnPage6(x, y);
            break;
        case 7:
            selectBtnOnPage7(x, y);
            break;
        default:
            selectBtnOnPage0(x, y);
            break;
    }
}

function selectBtnOnPage0(x, y) {
    selectPage0();
    if (XYToButton(x, y) === launchpadButtonNum) {
        //send the bypass command from presets.default.midi
    } else {
        launchpadButtonNum = XYToButton(x, y)
        launchpadOutput.send('noteon', {
            note: XYToButton(x, y),
            velocity: calcColorValue(0, 3, 1),
            channel: 0
        });
    }
    console.log(presets[0][x][y].midi);
    console.log(presets[0][x][y].color);
    vt3Output.send('cc', {
        controller: 12,
        value: presets[0][x][y].midi.pitch,
        channel: 3
    });
    vt3Output.send('cc', {
        controller: 13,
        value: presets[0][x][y].midi.formant,
        channel: 3
    });
    vt3Output.send('cc', {
        controller: 16,
        value: presets[0][x][y].midi.mixbalance,
        channel: 3
    });
    vt3Output.send('cc', {
        controller: 17,
        value: presets[0][x][y].midi.robot,
        channel: 3
    });
    vt3Output.send('cc', {
        controller: 18,
        value: presets[0][x][y].midi.bypass,
        channel: 3
    });
    vt3Output.send('cc', {
        controller: 91,
        value: presets[0][x][y].midi.reverb,
        channel: 3
    });
}

function selectBtnOnPage1(x, y) {
    selectPage1();
    if (XYToButton(x, y) === launchpadButtonNum) {
        //send the bypass command
    } else {
        launchpadButtonNum = XYToButton(x, y)
        launchpadOutput.send('noteon', {
            note: XYToButton(x, y),
            velocity: calcColorValue(3, 0, 1),
            channel: 0
        });
    }
    console.log(presets[1][x][y].midi);
    console.log(presets[1][x][y].color);
    vt3Output.send('cc', {
        controller: 12,
        value: presets[1][x][y].midi.pitch,
        channel: 0
    });
    vt3Output.send('cc', {
        controller: 13,
        value: presets[1][x][y].midi.formant,
        channel: 0
    });
    vt3Output.send('cc', {
        controller: 16,
        value: presets[1][x][y].midi.mixbalance,
        channel: 0
    });
    vt3Output.send('cc', {
        controller: 17,
        value: presets[1][x][y].midi.robot,
        channel: 0
    });
    vt3Output.send('cc', {
        controller: 18,
        value: presets[1][x][y].midi.bypass,
        channel: 0
    });
    vt3Output.send('cc', {
        controller: 91,
        value: presets[1][x][y].midi.reverb,
        channel: 0
    });
}

function selectBtnOnPage2(x, y) {
    //We aren't going to do anything here...
}

function selectBtnOnPage3(x, y) {
    //We are going to wait here...
}

function selectBtnOnPage4(x, y) {
    //We are going to wait here...
}

function selectBtnOnPage5(x, y) {
    //We are going to wait here...
}

function selectBtnOnPage6(x, y) {
    //save it to the file
    var tempVar = buttonToXY(launchpadButtonNum);
    var p = selectedPage;
    presets[p][tempVar[0]][tempVar[1]].color.red = Math.round(x / 2 - .5);
    presets[p][tempVar[0]][tempVar[1]].color.green = Math.round(y / 2 - .5);
    updateFile();
    selectPage(p);
}

function selectBtnOnPage7(x, y) {
    //Save it to the file
    var p = curPage;
    presets[p][x][y].midi = { "pitch": pitch, "formant": formant, "mixbalance": mixbalance, "robot": robot, "bypass": bypass, "reverb": reverb };
    updateFile();
    selectPage(p);
}

function buttonToXY(b) { //From the button value on the Launchpad to the physical XY position on the board
    var x = b % 16;
    var y = (b - x) / 16;
    return [x, y];
};

function XYToButton(x, y) {
    return (16 * y + x);
};

function calcColorValue(red, green, flashing) { //The color values for the launchpad are kinda random.  This calculates the right values.
    red = Math.min(Math.max(red, 0), 3);
    green = Math.min(Math.max(green, 0), 3);
    if (flashing) {
        flashing = 8;
    } else {
        flashing = 12;
    }
    return (16 * green + red + flashing);
};

function updateFile() { //Updates the presets file
    var fs = require('fs');
    fs.writeFile("./presets.json", JSON.stringify(presets));
};

function importFile() { //reads from the presets file
    var fs = require('fs');
    var contents = JSON.parse(fs.readFileSync("./presets.json", 'utf8'));
    return contents;
}