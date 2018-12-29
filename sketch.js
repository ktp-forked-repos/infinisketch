"use strict";

const createSketch = () => ({
    data: {},
    onCreate: [],
    create(name, obj) {
        this.data[name] = obj;
        for (let i in this.onCreate) {
            this.onCreate[i](name, obj);
        }
    },
    onUpdate: [],
    update(name, props) {
        for (let i in this.onUpdate) {
            this.onUpdate[i](this, name, props);
        }
    }
})