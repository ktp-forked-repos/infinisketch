"use strict";

const createPen = () => {
    let id = 0;
    let curr;
    return {
        down: function(inputs, sketch) {
            id ++;
            curr = {
                type: "line",
                points: [inputs.p],
                width: inputs.weight,
                palette: inputs.palette,
                update: true
            };
            sketch.create("line" + id, curr);
        },
        move: function(inputs, sketch) {
            curr.points.push([inputs.p[0], inputs.p[1]]);
            sketch.update("line" + id, ["points"]);
        },
        up: function(inputs, sketch) {
            if (inputs.p[0] !== inputs.p0[0] && inputs.p[1] !== inputs.p0[1]) {
                return;
            }
            curr.points.push([inputs.p[0] + 2, inputs.p[1] + 2]);
            sketch.update("line" + id, ["points"]);
        }
    }
}