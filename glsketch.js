"use strict";

const BUFF_SIZE = 65536;

class GlSketch {
    constructor(palette) {
        var cvs = document.createElement("canvas");
        this.domElement = cvs;
        this.numPoints = 0;
        this.prev = [0,0];
        this.style = {
            "lineWidth": 2,
            "paletteX": 0,
            "paletteY": 0,
        };

        this.gl = cvs.getContext("webgl2");

        this.programInfo = twgl.createProgramInfo(this.gl, [vs, fs]);
        this.gl.useProgram(this.programInfo.program);

        this.arrays = {
            a_pos: {
                numComponents: 2,
                data: new Float32Array(BUFF_SIZE),
            },
            a_paletteCoord: {
                numComponents: 2,
                data: new Float32Array(BUFF_SIZE),
            }
        };
        this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.arrays);
        this.palette = twgl.createTexture(this.gl, {
            "src": palette,
            "width": palette.width,
            "height": palette.height,
            "wrap": this.gl.CLAMP_TO_EDGE,
            "minmag": this.gl.NEAREST,
        });
        this.uniforms = {
            u_aspect: 1,
            u_offset: new Float32Array([0,0]),
            u_scale: 1,
            u_palette: this.palette,
        }
    }

    resize() {
        twgl.resizeCanvasToDisplaySize(this.gl.canvas, window.devicePixelRatio);
        this.size = [this.gl.canvas.width, this.gl.canvas.height];
        this.uniforms.u_aspect = this.size[0]/this.size[1];
        this.gl.viewport(0,0, this.size[0], this.size[1]);
    }
    render() {
        twgl.setAttribInfoBufferFromArray(this.gl, this.bufferInfo.attribs.a_pos, this.arrays.a_pos);
        twgl.setAttribInfoBufferFromArray(this.gl, this.bufferInfo.attribs.a_paletteCoord, this.arrays.a_paletteCoord);
        twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
        twgl.setUniforms(this.programInfo, this.uniforms);
        twgl.drawBufferInfo(this.gl, this.bufferInfo, this.gl.TRIANGLE_STRIP, this.numPoints)
    }
    addPoint(coord) {
        var x = 2. * (coord[0]/window.innerHeight) - 1.;
        var y = 2. * (1. - (coord[1]/window.innerHeight)) - 1.;
        x /= this.uniforms.u_scale; y /= this.uniforms.u_scale;
        x -= this.uniforms.u_offset[0];
        y -= this.uniforms.u_offset[1];
        this.arrays["a_pos"].data[this.numPoints*2] = x;
        this.arrays["a_pos"].data[this.numPoints*2+1] = y;
        this.arrays["a_paletteCoord"].data[this.numPoints*2] = this.style.paletteX;
        this.arrays["a_paletteCoord"].data[this.numPoints*2+1] = this.style.paletteY;
        this.numPoints ++;
    }
    setStyle(prop, val) {
        if (prop in this.style) {
            this.style[prop] = val;
        }
    }

    draw(coord) {
        if (this.numPoints % 1000 == 0) {
            console.log("points", this.numPoints);
        }
        var norm = [
            -coord[1]+this.prev[1],
            coord[0]-this.prev[0]
        ];
        var dist = Math.sqrt(Math.pow(norm[0],2)+ Math.pow(norm[1],2))/this.style.lineWidth;
        norm[0] /= dist; norm[1] /= dist;
        this.addPoint([coord[0]-norm[0], coord[1]-norm[1]]);
        this.addPoint([coord[0]+norm[0], coord[1]+norm[1]]);
        this.prev = coord;
    }
    erase(coord) {
        console.log("erase", coord);
    }
    pan(delta) {
        var scale = 1/this.size[1]*2/this.uniforms.u_scale;
        this.uniforms.u_offset[0] -= delta[0] * scale;
        this.uniforms.u_offset[1] += delta[1] * scale;
    }
    zoom(delta) {
        console.log("zoom", delta);
        this.uniforms.u_scale *= delta;
    }
    move(coord) {
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

uniform float u_aspect;
uniform vec2 u_offset;
uniform float u_scale;

in vec2 a_pos;
in vec2 a_paletteCoord;

out vec2 v_paletteCoord;

void main() {
    vec2 pos = a_pos;
    pos.x /= u_aspect;
    pos = (pos+u_offset) * u_scale;
    gl_Position = vec4(pos, 0, 1);
    v_paletteCoord = a_paletteCoord;
    //v_paletteCoord = a_pos;
}
`;

const fs = `#version 300 es
precision highp float;

in vec2 v_paletteCoord;

uniform sampler2D u_palette;

out vec4 o_color;

void main() {
    //o_color = vec4(1, 0, 0.5, 1);
    //o_color = vec4(v_paletteCoord, 1, 1);
    o_color = texture(u_palette, v_paletteCoord);
}
`;