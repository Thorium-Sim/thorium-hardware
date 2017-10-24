var easymidi = require('easymidi');
var helperScripts = require("./helperFunctions");
var buttonScripts = require("./buttonPressed");
var pageScripts = require("./selectPage");

//Insert some sort of auto detection for the launchpad vs launchpad mini & other midi devices
//As well as other error handling stuffs.

//Variables
//var launchpadOutput = new easymidi.Output('Launchpad Mini');
//var launchpadInput = new easymidi.Input('Launchpad Mini');
var launchpadOutput = new easymidi.Output('Launchpad MK2 8');
var launchpadInput = new easymidi.Input('Launchpad MK2 8');
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
    helperScripts.calcColorValue(3, 3, 0),
    helperScripts.calcColorValue(3, 3, 0),
    helperScripts.calcColorValue(3, 3, 0),
    helperScripts.calcColorValue(0, 3, 0),
    helperScripts.calcColorValue(0, 3, 0),
    helperScripts.calcColorValue(0, 3, 0),
    helperScripts.calcColorValue(3, 0, 0),
    helperScripts.calcColorValue(3, 0, 0)
];
var presets = helperScripts.readFile();









exports.sendMidiMessage = function(device, type, message) {
    switch (device) {
        case 'launchpad':
            launchpadOutput.send(type, message);
            break;
        case 'vt3':
            vt3Output.send(type, message);
            break;
        default:
            console.log("No midi device to send to");
    }
}



function sendMidiMessage(device, type, message) {
    switch (device) {
        case 'launchpad':
            launchpadOutput.send(type, message);
            break;
        case 'vt3':
            vt3Output.send(type, message);
            break;
        default:
            console.log("No midi device to send to");
    }
}





//Setup
launchpadOutput.send('reset'); //Rest the launchpad for use
sendMidiMessage('launchpad', 'cc', { controller: 0, value: 40, channel: 0 }); //This tells the launchpad to blink the buttons
for (x = 0; x < 8; x++) { //Setup the top row of button colors
    sendMidiMessage('launchpad', 'cc', { controller: (x + 104), value: pageColors[x], channel: 0 });
}
for (var x = 0; x < 9; x++) {
    for (var y = 0; y < 8; y++) {
        sendMidiMessage('launchpad', 'noteon', {
            note: helperScripts.XYToButton(x, y),
            velocity: helperScripts.calcColorValue(0, 0, 0),
            channel: 0
        });
    }
}

//Listeners
launchpadInput.on('cc', function(msg) { //Page Select
    if (msg.value === 127) { //The Launchpad sends two messages each time the button is pressed and released.  This prevents it.
        console.log(msg);
        for (x = 0; x < 8; x++) { //Setup the top row of button colors
            sendMidiMessage('launchpad', 'cc', { controller: (x + 104), value: pageColors[x], channel: 0 });
        }
        if (msg.controller - 104 === 0) {
            selectedPage = 0;
        }
        if (msg.controller - 104 === 1) {
            selectedPage = 0;
        }
        pageScripts.selectPage(msg.controller - 104, curPage, launchpadButtonNum, pageColors, presets); //the top buttons are 104 to 111, so for the sake of making it a little easier, we shrink the numbers
    }
});

launchpadInput.on('noteon', function(msg) { //Button Select
    if (msg.velocity === 127) {
        console.log(msg);
        var x = helperScripts.buttonToXY(msg.note)[0]
        var y = helperScripts.buttonToXY(msg.note)[1]
        buttonScripts.buttonPressed(x, y, pitch, formant, mixbalance, robot, bypass, reverb, curPage, launchpadPageNum, launchpadButtonNum, selectedPage, presets);
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