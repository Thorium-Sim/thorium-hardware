export function buttonToXY(b) { //From the button value on the Launchpad to the physical XY position on the board
    var x = b % 16;
    var y = (b - x) / 16;
    return [x, y];
};

export function XYToButton(x, y) {
    return (16 * y + x);
};

export function calcColorValue(red, green, flashing) { //The color values for the launchpad are kinda random.  This calculates the right values.
    red = Math.min(Math.max(red, 0), 3);
    green = Math.min(Math.max(green, 0), 3);
    if (flashing) {
        flashing = 8;
    } else {
        flashing = 12;
    }
    return (16 * green + red + flashing);
};

export function updateFile() { //Updates the presets file
    var fs = require('fs');
    fs.writeFile("./presets.json", JSON.stringify(presets));
};

export function readFile() { //reads from the presets file
    var fs = require('fs');
    var contents = JSON.parse(fs.readFileSync("./presets.json", 'utf8'));
    return contents;
}
