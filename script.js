// Get canvas and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Store circles
let circles = [];
let selectedCircle = null;
let isDragging = false;

// Draw all circles
function drawCircles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);

        if (circle === selectedCircle) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "blue";
        }

        ctx.fill();
        ctx.closePath();
    });
}

// Check if mouse is inside a circle
function getCircleAt(x, y) {
    for (let i = circles.length - 1; i >= 0; i--) {
        let c = circles[i];
        let dist = Math.sqrt((x - c.x) ** 2 + (y - c.y) ** 2);
        if (dist <= c.radius) {
            return c;
        }
    }
    return null;
}

// MOUSE CLICK (ADD OR SELECT)
canvas.addEventListener("mousedown", function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let clickedCircle = getCircleAt(x, y);

    if (clickedCircle) {
        selectedCircle = clickedCircle;
        isDragging = true;
    } else {
        // Add new circle
        const newCircle = {
            x: x,
            y: y,
            radius: 20
        };
        circles.push(newCircle);
        selectedCircle = newCircle;
    }

    drawCircles();
});

// MOUSE MOVE (DRAG)
canvas.addEventListener("mousemove", function (e) {
    if (isDragging && selectedCircle) {
        const rect = canvas.getBoundingClientRect();
        selectedCircle.x = e.clientX - rect.left;
        selectedCircle.y = e.clientY - rect.top;

        drawCircles();
    }
});

// STOP DRAGGING
canvas.addEventListener("mouseup", function () {
    isDragging = false;
});

canvas.addEventListener("mouseleave", function () {
    isDragging = false;
});

// DELETE KEY
document.addEventListener("keydown", function (e) {
    if (e.key === "Delete" && selectedCircle) {
        circles = circles.filter(c => c !== selectedCircle);
        selectedCircle = null;
        drawCircles();
    }
});

// RESIZE WITH SCROLL
canvas.addEventListener("wheel", function (e) {
    if (selectedCircle) {
        e.preventDefault();

        if (e.deltaY < 0) {
            selectedCircle.radius += 2; // Scroll up
        } else {
            selectedCircle.radius -= 2; // Scroll down
            if (selectedCircle.radius < 5) {
                selectedCircle.radius = 5;
            }
        }

        drawCircles();
    }
});

// Initial draw
drawCircles();