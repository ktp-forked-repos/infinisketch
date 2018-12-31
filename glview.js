"use strict";

const BUFF_SIZE = 65536;

const createGlview = (paletteimg, sketch) => {
    const vs = `#version 300 es

    uniform float u_vheight;
    uniform float u_aspect;
    uniform vec2 u_center;
    uniform float u_scale;

    in vec2 a_pos;
    in vec2 a_paletteCoord;

    out vec2 v_paletteCoord;

    void main() {
        vec2 pos;
        pos.x = (a_pos.x - u_center.x) / u_aspect;
        pos.y = (a_pos.y - u_center.y);
        pos *= 2. * u_scale / u_vheight;
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

    sketch.onCreate.push(create);
    sketch.onUpdate.push(draw);
    sketch.onRemove.push(remove);

    let cvs = document.createElement("canvas");
    let gl = cvs.getContext("webgl2");
    let programInfo = twgl.createProgramInfo(gl, [vs, fs], ["a_pos", "a_paletteCoord"]);
    gl.useProgram(programInfo.program);

    let updateRanges = [];

    let attribLocs = {
        a_pos: gl.getAttribLocation(programInfo.program, "a_pos"),
        a_paletteCoord: gl.getAttribLocation(programInfo.program, "a_paletteCoord"),
    }
    let strokes = new Float32Array(BUFF_SIZE);
    let strokesBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, strokesBuff);
    gl.bufferData(gl.ARRAY_BUFFER, strokes, gl.DYNAMIC_DRAW);

    let allocator = createAlloc({arr: strokes});
    let allocs = {};

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
        u_vheight: window.innerHieght,
        u_aspect: 1,
        u_center: new Float32Array([0,0]),
        u_scale: 1,
        u_palette: palette,
    }
    let size = [0, 0];

    function resize() {
        twgl.resizeCanvasToDisplaySize(gl.canvas, window.devicePixelRatio);
        size = [gl.canvas.width, gl.canvas.height];
        uniforms.u_vheight = size[1];
        uniforms.u_aspect = size[0]/size[1];
        gl.viewport(0,0, size[0], size[1]);
        render();
    }
    function render() {
        gl.bindBuffer(gl.ARRAY_BUFFER, strokesBuff);
        while (updateRanges.length > 0) {
            let update = updateRanges.pop();
            gl.bufferSubData(gl.ARRAY_BUFFER, 4*update[0], 
                strokes, update[0], update[1]);
        }
//         gl.bufferData(gl.ARRAY_BUFFER, strokes, gl.DYNAMIC_DRAW);
        uniforms.u_center[0] = sketch.view.center[0];
        uniforms.u_center[1] = sketch.view.center[1];
        uniforms.u_scale = sketch.view.scale * window.devicePixelRatio;
        twgl.setUniforms(programInfo, uniforms);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, BUFF_SIZE / 4);
    }
    function create(sketch, name) {
        let line = sketch.data[name];
        if (line["type"] !== "line") {
            return;
        }
        let idx = allocator.alloc(96)
        allocs[name] = [idx, 96];
        console.log(allocs);
        addPoint(line.points[0], line, idx);
        addPoint(line.points[0], line, idx+4);
    }
    function addUpdate(idx, size) {
        let i;
        for (i = 1; i < updateRanges.length; i ++) {
            if (updateRanges[i] > idx+size) {
                break;
            }
        }
        if (updateRanges.length > 0 && 
                updateRanges[i-1][0] + updateRanges[i-1][1] === idx) {
            updateRanges[i-1][1] += size;
        } else {
            updateRanges.splice(i, 0, [idx, size]);
        }
    }
    function addPoint(coord, style, idx) {
        strokes[idx] = coord[0];
        strokes[idx+1] = coord[1];
        strokes[idx+2] = style.palette[0];
        strokes[idx+3] = style.palette[1];
        addUpdate(idx, 4);
    }
    function addLine(prev, coord, style, idx) {
        var norm = [
            -coord[1]+prev[1],
            coord[0]-prev[0]
        ];
        var dist = Math.sqrt(Math.pow(norm[0],2)+ Math.pow(norm[1],2))/style.lineWidth;
        norm[0] /= dist; norm[1] /= dist;
        addPoint([coord[0]-norm[0], coord[1]-norm[1]], style, idx);
        addPoint([coord[0]+norm[0], coord[1]+norm[1]], style, idx+4);
        addPoint(coord, style, idx+8);
        addPoint(coord, style, idx+12);
    }

    function draw (sketch, name, prop) {
        let line = sketch.data[name];
        if (line["type"] !== "line") {
            return;
        }
        if (line["points"].length < 2) {
            return;
        }
        let coord = line.points[line.points.length-1];
        let prev = line.points[line.points.length-2];
        let block = allocs[name];
        if (line.points.length * 8 > block[1] - 16) {
            console.log("realloc");
            let newalloc = allocator.realloc(allocs[name][0], Math.trunc(allocs[name][1] * 2));
            if (newalloc < 0) {
                console.log("Can not realloc");
                return;
            }
            allocs[name][0] = newalloc;
            allocs[name][1] *= 2;
        }
        addLine(prev, coord, {lineWidth: line.width, palette: line.palette}, block[0] + line.points.length * 8 - 8);
    }
    function remove (sketch, name) {
        let line = sketch.data[name];
        if (line["type"] !== "line") {
            return;
        }
        let alloc = allocs[name];
        allocator.memset(alloc[0], 0, alloc[1]);
        addUpdate(alloc[0], alloc[1]);
        allocator.free(alloc[0]);
        delete allocs[name];
    }

    return {
        domElement: cvs,
        size,
        resize,
        render,
        _strokes: strokes,
    }
}