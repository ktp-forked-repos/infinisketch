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
        twgl.drawBufferInfo(this.gl, bufferInfo, this.gl.LINES, this.numPoints)
    }
    addPoint(coord) {
        this.arrays["a_pos"].data[this.numPoints*2] = coord[0];
        this.arrays["a_pos"].data[this.numPoints*2+1] = coord[1];
        this.numPoints ++;
    }

    draw(coord) {
        console.log("draw", coord);
        this.addPoint(this.prev);
        this.addPoint(coord)
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
    }
    strokeEnd() {
        console.log("end");
    }
}

const vs = `#version 300 es

in vec2 a_pos;
uniform vec2 u_res;

void main() {
    float x = 2. * (a_pos.x/u_res.x) - 1.;
    float y = 2. * (1. - (a_pos.y/u_res.y)) - 1.;
    gl_Position = vec4(x, y, 0, 1);
}
`;

const fs = `#version 300 es
precision highp float;

out vec4 o_color;

void main() {
    o_color = vec4(1, 0, 0.5, 1);
}
`;