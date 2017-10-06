export function buttonPressed(x, y) {
    switch (launchpadPageNum) {
        case 0:
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
            break;
        case 1:
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
            break;
        case 2:
            //Nothing Needed here.  All functionality is handled in the page select
        case 3:
        case 4:
        case 5:
            //We are going to wait here...
            break;
        case 6:
            //save it to the file
            var tempVar = buttonToXY(launchpadButtonNum);
            var p = selectedPage;
            presets[p][tempVar[0]][tempVar[1]].color.red = Math.round(x / 2 - .5);
            presets[p][tempVar[0]][tempVar[1]].color.green = Math.round(y / 2 - .5);
            updateFile();
            selectPage(p);
            break;
        case 7:
        default:
            //Save it to the file
            var p = curPage;
            presets[p][x][y].midi = { "pitch": pitch, "formant": formant, "mixbalance": mixbalance, "robot": robot, "bypass": bypass, "reverb": reverb };
            updateFile();
            selectPage(p);
            break;
    }
}