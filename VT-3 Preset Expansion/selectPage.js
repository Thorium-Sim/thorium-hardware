export function selectPage(pageNumber) {
    launchpadPageNum = pageNumber;
    launchpadOutput.send('cc', { //update the new button to flash (that's what the "-4" is for)
        controller: launchpadPageNum + 104,
        value: (pageColors[launchpadPageNum] - 4),
        channel: 0
    });
    switch (pageNumber) {
        case 0:
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
            break;
        case 1:
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
            break;
        case 2:
            launchpadButtonNum = 0;
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
            break;
        case 3:
        case 4:
        case 5:
            for (var x = 0; x < 9; x++) {
                for (var y = 0; y < 8; y++) {
                    launchpadOutput.send('noteon', {
                        note: XYToButton(x, y),
                        velocity: calcColorValue(0, 3, 0),
                        channel: 0
                    });
                }
            }
            break;
        case 6:
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
            break;
        case 7:
        default:
            break;
    }
};