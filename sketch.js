"use strict";

const createSketch = () => ({
    data: {},
    onCreate: [],
    create(name, obj) {
        this.data[name] = obj;
        for (let i in this.onCreate) {
            this.onCreate[i](this, name);
        }
    },
    onUpdate: [],
    update(name, props) {
        for (let i in this.onUpdate) {
            this.onUpdate[i](this, name, props);
        }
    },
    onRemove: [],
    remove(name) {
        for (let i in this.onRemove) {
            this.onRemove[i](this, name);
        }
        delete this.data[name];
    }
})