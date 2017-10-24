var helperScripts = require("./helperFunctions");
var sendMessage = require("./index");

exports.selectPage = function(pageNumber, curPage, launchpadButtonNum, pageColors, presets) {
    sendMessage.sendMidiMessage('launchpad', 'cc', { //update the new button to flash (that's what the "-4" is for)
        controller: pageNumber + 104,
        value: (pageColors[pageNumber] - 4),
        channel: 0
    });
    switch (pageNumber) {
        case 0:
            curPage = 0;
            for (var x = 0; x < 9; x++) {
                for (var y = 0; y < 8; y++) {
                    sendMessage.sendMidiMessage('launchpad', 'noteon', {
                        note: helperScripts.XYToButton(x, y),
                        velocity: helperScripts.calcColorValue(presets[0][x][y].color.red, presets[0][x][y].color.green, 0),
                        channel: 0
                    });
                }
            }
            break;
        case 1:
            curPage = 1;
            for (var x = 0; x < 9; x++) {
                for (var y = 0; y < 8; y++) {
                    sendMessage.sendMidiMessage('launchpad', 'noteon', {
                        note: helperScripts.XYToButton(x, y),
                        velocity: helperScripts.calcColorValue(presets[1][x][y].color.red, presets[1][x][y].color.green, 0),
                        channel: 0
                    });
                }
            }
            break;
        case 2: //Does nothing for right now...
            launchpadButtonNum = 0;
            for (var x = 0; x < 9; x++) {
                for (var y = 0; y < 8; y++) {
                    sendMessage.sendMidiMessage('launchpad', 'noteon', {
                        note: helperScripts.XYToButton(x, y),
                        velocity: helperScripts.calcColorValue(0, 0, 0),
                        channel: 0
                    });
                }
            }
            //selectPage(Math.round(Math.random()));
            //buttonPressed(Math.random() * 9, Math.random() * 8);
            break;
        case 3:
        case 4:
        case 5:
            for (var x = 0; x < 9; x++) {
                for (var y = 0; y < 8; y++) {
                    sendMessage.sendMidiMessage('launchpad', 'noteon', {
                        note: helperScripts.XYToButton(x, y),
                        velocity: helperScripts.calcColorValue(0, 3, 0),
                        channel: 0
                    });
                }
            }
            break;
        case 6:
            for (var x = 0; x < 9; x++) {
                for (var y = 0; y < 8; y++) {
                    sendMessage.sendMidiMessage('launchpad', 'noteon', {
                        note: helperScripts.XYToButton(x, y),
                        velocity: helperScripts.calcColorValue(0, 0, 0),
                        channel: 0
                    });
                }
            }
            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 8; y++) {
                    sendMessage.sendMidiMessage('launchpad', 'noteon', {
                        note: helperScripts.XYToButton(x, y),
                        velocity: helperScripts.calcColorValue(x / 2, y / 2 - .5, 0),
                        channel: 0
                    });
                }
            }
            break;
        case 7:
        default:
            break;
    }

};