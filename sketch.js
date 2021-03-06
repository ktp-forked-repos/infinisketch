"use strict";

const createSketch = () => ({
    data: {},
    view: {
        center: [0, 0],
        scale: 1,
    },
    paletteOffset: [0, 0],
    pix2sketch: function pix2sketch(pix) {
        return [
            (pix[0] - window.innerWidth/2) / this.view.scale + this.view.center[0],
            (window.innerHeight/2 - pix[1]) / this.view.scale + this.view.center[1]
        ];
    },
    events: {},
    on(event, func) {
        if (!(event in this.events)) {
            this.events[event] = [];
        }
        this.events[event].push(func);
    },
    trigger(event, ...args) {
        if (!(event in this.events)) {
            return;
        }
        for (let e in this.events[event]) {
            this.events[event][e](this, ...args);
        }
    },
})