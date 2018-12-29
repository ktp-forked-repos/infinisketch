"use strict";

const BUFF_SIZE = 65536;

const createGlview = (paletteimg, sketch) => {
    const vs = `#version 300 es

    uniform float u_aspect;
    uniform vec2 u_offset;
    uniform float u_scale;

    in vec2 a_pos;
    in vec2 a_paletteCoord;

    out vec2 v_paletteCoord;

    void main() {
        vec2 pos;
        pos.x = (a_pos.x + u_offset.x) / u_aspect;
        pos.y = (a_pos.y + u_offset.y);
        pos *= u_scale;
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
        if (v_paletteCoord.x < 0. || v_paletteCoord.y < 0.) {
            o_color = vec4(0, 0, 0, 0);
        } else {
            o_color = texture(u_palette, v_paletteCoord);
        }
    }
    `;

    sketch.onCreate.push(update);
    sketch.onUpdate.push(draw);

    let cvs = document.createElement("canvas");
    let gl = cvs.getContext("webgl2");
    let programInfo = twgl.createProgramInfo(gl, [vs, fs], ["a_pos", "a_paletteCoord"]);
    gl.useProgram(programInfo.program);

    let numPoints = 0;
    let updateRanges = [];

    let attribLocs = {
        a_pos: gl.getAttribLocation(programInfo.program, "a_pos"),
        a_paletteCoord: gl.getAttribLocation(programInfo.program, "a_paletteCoord"),
    }
    let strokes = new Float32Array(BUFF_SIZE);
    let strokesBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, strokesBuff);
    gl.bufferData(gl.ARRAY_BUFFER, strokes, gl.DYNAMIC_DRAW);

    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(attribLocs["a_pos"]);
    gl.vertexAttribPointer(attribLocs["a_pos"], 2, gl.FLOAT, false, 4*4, 0);
    gl.enableVertexAttribArray(attribLocs["a_paletteCoord"]);
    gl.vertexAttribPointer(attribLocs["a_paletteCoord"], 2, gl.FLOAT, false, 4*4, 4*2);

    let palette = twgl.createTexture(gl, {
        "src": paletteimg,
        "width": paletteimg.width,
        "height": paletteimg.height,
        "wrap": gl.CLAMP_TO_EDGE,
        "minmag": gl.NEAREST,
    });
    let uniforms = {
        u_aspect: 1,
        u_offset: new Float32Array([0,0]),
        u_scale: 1,
        u_palette: palette,
    }
    let size = [0, 0];

    function resize() {
        twgl.resizeCanvasToDisplaySize(gl.canvas, window.devicePixelRatio);
        size = [gl.canvas.width, gl.canvas.height];
        uniforms.u_aspect = size[0]/size[1];
        gl.viewport(0,0, size[0], size[1]);
    }
    function updatePoint(idx) {}
    function render() {
        gl.bindBuffer(gl.ARRAY_BUFFER, strokesBuff);
        while (updateRanges.length > 0) {
            update = updateRanges.pop();
            gl.bufferSubData(gl.ARRAY_BUFFER, 4*update[0], 
                strokes, update[0], 4*update[1]);
        }
//         gl.bufferData(gl.ARRAY_BUFFER, strokes, gl.DYNAMIC_DRAW);
        twgl.setUniforms(programInfo, uniforms);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, numPoints);
//         twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_STRIP, numPoints)
    }
    function update(name, obj) {
        console.log(name, obj);
    }
    function addPoint(coord, style) {
        var x = 2. * (coord[0] - window.innerWidth/2)/window.innerHeight;
        var y = 2. * (1. - (coord[1]/window.innerHeight)) - 1.;
        x /= uniforms.u_scale; y /= uniforms.u_scale;
        x -= uniforms.u_offset[0];
        y -= uniforms.u_offset[1];
        strokes[numPoints*4] = x;
        strokes[numPoints*4+1] = y;
        strokes[numPoints*4+2] = style.paletteX;
        strokes[numPoints*4+3] = style.paletteY;
        let i;
        for (i = 1; i < updateRanges.length; i ++) {
            if (updateRanges[i] > numPoints * 4) {
                break;
            }
        }
        if (updateRanges.length > 0 && 
                updateRanges[i-1][0] + updateRanges[i-1][1] === numPoints * 4) {
            updateRanges[i-1][1] += 4;
        } else {
            updateRanges.splice(i, 0, [numPoints*4, 4]);
        }
        numPoints ++;
    }
    function addLine(prev, coord, style) {
        style = style || style;
        var norm = [
            -coord[1]+prev[1],
            coord[0]-prev[0]
        ];
        var dist = Math.sqrt(Math.pow(norm[0],2)+ Math.pow(norm[1],2))/style.lineWidth;
        norm[0] /= dist; norm[1] /= dist;
        addPoint([coord[0]-norm[0], coord[1]-norm[1]], style);
        addPoint([coord[0]+norm[0], coord[1]+norm[1]], style);
    }

    function draw (sketch, name, prop) {
        let line = sketch.data[name];
        let coord = line.points[line.points.length-1];
        let prev = line.points[line.points.length-2];
        if (numPoints % 1000 == 0) {
            console.log("points", numPoints);
        }
        addLine(prev, coord, {lineWidth: line.width});
    }
    function pan(delta) {
        var scale = 1/window.innerHeight*2/uniforms.u_scale;
        uniforms.u_offset[0] += delta[0] * scale;
        uniforms.u_offset[1] -= delta[1] * scale;
    }
    function zoom(delta) {
        uniforms.u_scale *= delta;
    }

    return {
        domElement: cvs,
        size,
        resize,
        pan,
        zoom,
        render,
    }
}