"use strict";

const createPen = () => {
    let id = 0;
    let curr;
    return {
        down: ({inputs, sketch, ...rest}) => {
            id ++;
            curr = {
                type: "line",
                points: [sketch.pix2sketch(inputs.p)],
                width: inputs.weight,
                palette: inputs.palette,
                update: true
            };
            sketch.create("line" + id, curr);
        },
        move: ({inputs, sketch, ...rest}) => {
            curr.points.push(sketch.pix2sketch(inputs.p));
            sketch.update("line" + id, ["points"]);
        },
        up: ({inputs, sketch, ...rest}) => {
            if (inputs.p[0] !== inputs.p0[0] && inputs.p[1] !== inputs.p0[1]) {
                return;
            }
            curr.points.push(sketch.pix2sketch([inputs.p[0] + 2, inputs.p[1] + 2]));
            sketch.update("line" + id, ["points"]);
        }
    }
}