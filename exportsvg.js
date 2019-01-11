"use strict";

/* Returns SVG element representing current view of sketch,
 * given a palette
 */
function exportsvg(sketch, palette) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let svgns = svg.namespaceURI;

    let style = document.createElementNS(svgns, "style");
    style.innerHTML += `
        .line {
            fill: none;
            stroke: #000;
        }
    `;
    svg.appendChild(style);

    let c = sketch.view.center;
    let s = sketch.view.scale;
    let w = [window.innerWidth, window.innerHeight];
    let bounds = [
        c[0] - w[0] / 2 / s,
        c[1] - w[1] / 2 / s,
        w[0] / s,
        w[1] / s
    ]
    svg.setAttribute("viewBox", bounds.join(" "));

    for (let i in sketch.data) {
        let obj = sketch.data[i];
        if (obj.type !== "line") {
            continue;
        }
        let line = document.createElementNS(svgns, "polyline");
        line.classList.add("line");
        line.style.strokeWidth = 2 * obj.width;

        let pointsstr = ""
        for (let j in obj.points) {
            let p = obj.points[j];
            pointsstr += `${p[0]} ${-p[1]} `;
        }
        line.setAttribute("points", pointsstr);
        svg.appendChild(line);
    }

    return svg;
}