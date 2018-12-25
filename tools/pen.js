"use strict";

const createPen = () => {
    let id = 0;
    let curr;
    return {
        down: function(inputs, sketch) {
            curr = {
                type: "line",
                points: [inputs.p],
                width: inputs.weight,
                palette: inputs.palette,
                update: true
            };
            sketch.create("line" + id, curr);
            id ++;
        },
        move: function(inputs, sketch) {
            curr.points.push([inputs.p[0], inputs.p[1]]);
            curr.update = true;
        },
        up: function(inputs, sketch) {
            if (inputs.p[0] !== inputs.p0[0] && inputs.p[1] !== inputs.p0[1]) {
                return;
            }
            curr.points.push([inputs.p[0] + 2, inputs.p[1] + 2]);
        }
    }
}