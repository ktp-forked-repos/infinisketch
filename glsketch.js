"use strict";

const BUFF_SIZE = 65536;

class GlSketch {
    constructor(size) {
        var cvs = document.createElement("canvas");
        this.domElement = cvs;
        this.gl = cvs.getContext("webgl2");

        this.programInfo = twgl.createProgramInfo(this.gl, [vs, fs]);
        this.gl.useProgram(this.programInfo.program);

        this.arrays = {
            a_pos: {
                numComponents: 2,
                data: new Float32Array(BUFF_SIZE),
            }
        };
        this.uniforms = {
            u_res: [0,0],
        }
        this.numPoints = 0;
        this.prev = [0,0];
    }

    resize() {
        twgl.resizeCanvasToDisplaySize(this.gl.canvas);
        this.uniforms["u_res"] = [this.gl.canvas.width, this.gl.canvas.height];
        this.gl.viewport(0,0, this.gl.canvas.width, this.gl.canvas.height);
    }
    render() {
        var bufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.arrays);
        twgl.setBuffersAndAttributes(this.gl, this.programInfo, bufferInfo);
        twgl.setUniforms(this.programInfo, this.uniforms);
        twgl.drawBufferInfo(this.gl, bufferInfo, this.gl.TRIANGLE_STRIP, this.numPoints)
    }
    addPoint(coord) {
        var x = 2. * (coord[0]/this.gl.canvas.width) - 1.;
        var y = 2. * (1. - (coord[1]/this.gl.canvas.height)) - 1.;
        this.arrays["a_pos"].data[this.numPoints*2] = x;
        this.arrays["a_pos"].data[this.numPoints*2+1] = y;
        this.numPoints ++;
    }

    draw(coord) {
//         console.log("draw", coord);
        if (this.numPoints % 1000 == 0) {
            console.log("points", this.numPoints);
        }
        var norm = [
            -coord[1]+this.prev[1],
            coord[0]-this.prev[0]
        ];
        var dist = Math.sqrt(Math.pow(norm[0],2)+ Math.pow(norm[1],2))/10;
        norm[0] /= dist; norm[1] /= dist;
        this.addPoint([coord[0]-norm[0], coord[1]-norm[1]]);
        this.addPoint([coord[0]+norm[0], coord[1]+norm[1]]);
        this.prev = coord;
    }
    erase(coord) {
        console.log("erase", coord);
    }
    pan(delta) {
        console.log("pan", delta);
    }
    zoom(delta) {
        console.log("zoom", delta);
    }
    move(coord) {
        console.log("move", coord);
        this.prev = coord;
        this.addPoint(coord);
        this.addPoint(coord);
    }
    strokeEnd() {
        console.log("end");
        this.addPoint(this.prev);
        this.addPoint(this.prev);
    }
}

const vs = `#version 300 es

in vec2 a_pos;

void main() {
    gl_Position = vec4(a_pos, 0, 1);
}
`;

const fs = `#version 300 es
precision highp float;

out vec4 o_color;

void main() {
    o_color = vec4(1, 0, 0.5, 1);
}
`;