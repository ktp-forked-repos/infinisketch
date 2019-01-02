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
                width: inputs.weight / sketch.view.scale,
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

const createEraser = (sketch) => {
    let bounds = {};
    sketch.onCreate.push(create);
    sketch.onUpdate.push(update);
    sketch.onRemove.push(remove);
    function create(sketch, name) {
        if (sketch.data[name].type === "line") {
            let p = sketch.data[name].points[0];
            bounds[name] = [p[0], p[1], p[0], p[1]];
        }
    }
    function update(sketch, name, props) {
        let up = sketch.data[name]
        if (up.type === "line" && props.indexOf("points") >= 0) {
            let pnt = up.points[up.points.length - 1];
            let bound = bounds[name];
            bound[0] = Math.min(bound[0], pnt[0]);
            bound[1] = Math.min(bound[1], pnt[1]);
            bound[2] = Math.max(bound[2], pnt[0]);
            bound[3] = Math.max(bound[3], pnt[1]);
        }
    }
    function remove(sketch, name) {
        if (sketch.data[name].type !== "line") {
            return;
        }
        delete bounds[name];
    }
    return {
        move: ({inputs, sketch, ...rest}) => {
            let p = sketch.pix2sketch(inputs.p);
            for (let i in bounds) {
                let b = bounds[i];
                if (!(b[0] < p[0] && p[0] < b[2] && b[1] < p[1] && p[1] < b[3])) {
                    continue;
                }
                let stroke = sketch.data[i];
                for (let j = 0; j < stroke.points.length; j ++) {
                    let pnt = stroke.points[j];
                    let rad = inputs.weight * 20 / sketch.view.scale;
                    if (Math.abs(pnt[0] - p[0]) < rad
                            && Math.abs(pnt[1] - p[1]) < rad) {
                        sketch.remove(i);
                        break;
                    }
                }
            }
        },
    }
}