"use strict";

const createSketch = () => ({
    data: {},
    onCreate: [],
    create(name, obj) {
        this.data[name] = obj;
        for (let i in this.onCreate) {
            this.onCreate[i](name, obj);
        }
    }
})