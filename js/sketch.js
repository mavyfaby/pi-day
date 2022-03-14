let time = 0;
let paths = [];
let points = [];
let fourier;

function setShadow(x, y, b, c) {
    drawingContext.shadowBlur = b;
    drawingContext.shadowColor = c;
    drawingContext.shadowOffsetX = x;
    drawingContext.shadowOffsetY = y;
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    pixelDensity(1);

    if (window.innerWidth < 768) {
        const offset = { x: -150, y: -125 };

        for (let i = 0; i < PI_SYMBOL_SMALL.length; i += 2) {
            const c = new Complex(PI_SYMBOL_SMALL[i] + offset.x, PI_SYMBOL_SMALL[i + 1] + offset.y);
            points.push(c);
        }
    } else {
        const offset = { x: -300, y: -250 };

        for (let i = 0; i < PI_SYMBOL.length; i += 2) {
            const c = new Complex(PI_SYMBOL[i] + offset.x, PI_SYMBOL[i + 1] + offset.y);
            points.push(c);
        }
    }

    fourier = dft(points);
}

function epicycle(x, y, rotation, fourier) {
    for (const i in fourier) {
        const { freq, amp: radius, phase } = fourier[i];

        let prevx = x;
        let prevy = y;

        x += radius * cos((freq * time) + phase + rotation);
        y += radius * sin((freq * time) + phase + rotation);

        noFill();
        stroke(255, 50);
        ellipse(prevx, prevy, radius * 2);

        stroke(200);
        line(prevx, prevy, x, y);
    }

    return createVector(x, y);
}

function draw() {
    background(12);
    
    push();
    noStroke();
    fill(59, 130, 246);
    textFont("monospace");
    textSize(12);
    text("Date     : March 14, 2022", 20, 30);
    text("Author   : Maverick G. Fabroa", 20, 50);
    text("DFT      : The Coding Train", 20, 70);
    text("Progress : " + ((time / TWO_PI) * 100).toFixed(2) + "%", 20, 90);
    pop();

    const v = epicycle(width / 2, height / 2, 0, fourier);
    paths.unshift(v);

    push();
    noFill();
    stroke(59, 130, 246);
    beginShape();
    setShadow(5, 10, 25, "rgb(59, 130, 246)");
    strokeWeight(4);

    for (const i in paths) {
        vertex(paths[i].x, paths[i].y);
    }

    endShape();
    pop();

    time += TWO_PI / fourier.length;

    if (time > TWO_PI) {
        time = 0;
        paths = [];
    }
}



