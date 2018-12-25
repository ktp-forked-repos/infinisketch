"use strict";

const createMove = () => ({
    move: ({inputs, view, ...rest}) => {
        view.pan(inputs.d);
    }
});

const createZoom = () => ({
    move: ({inputs, view, ...rest}) => {
        view.zoom(Math.exp(-inputs.d[1]/100));
    }
})