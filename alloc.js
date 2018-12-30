"use strict";

const createAlloc = ({arr, splitThresh = 32} = {}) => {
    let useList = [];
    let freeList = [[0, arr.length]];

    function findBlock(idx, list) {
        for (let i in list) {
            if (list[i][0] === idx) {
                return i;
            }
        }
        return -1;
    }
    function insertBlock(block, list) {
        let i = 0;
        while (i < list.length && list[i][0] < block[0]) {
            i ++;
        }
        list.splice(i, 0, block);
        return i;
    }
    function mergeFree() {
        for (let i = 1; i < freeList.length; i ++) {
            if (freeList[i-1][0] + freeList[i-1][1] < freeList[i][0]) {
                continue;
            }
            freeList[i-1][1] += freeList[i][1];
            freeList.splice(i, 1);
            i --;
        }
    }

    function alloc(size) {
        let i = 0;
        while (freeList[i][1] < size) {
            i ++;
            if (i > freeList.length) {
                return -1;
            }
        }
        let block = freeList.splice(i, 1)[0];
        let excess = block[1] - size;
        if (splitThresh >= 0 && excess > splitThresh) {
            block[1] = size;
            insertBlock([block[0] + size, excess], freeList);
            mergeFree();
        }
        insertBlock(block, useList);
        return block[0];
    }

    function free(idx) {
        let blockid = findBlock(idx, useList);
        if (blockid < 0) {
            return -1;
        }
        let block = useList.splice(blockid, 1)[0];
        insertBlock(block, freeList);
        mergeFree();
        return 0;
    }

    function realloc(idx, size) {
        let blockid = findBlock(idx, useList);
        if (blockid < 0) {
            return -1;
        }
        let currblock = useList[blockid];
        let nextblockid = findBlock(currblock[0] + currblock[1], freeList);
        if (nextblockid >= 0) {
            let nextblock = freeList[nextblockid];
            let mergeSize = nextblock[1] + currblock[1];
            if (mergeSize > size) {
                let excess = mergeSize - size;
                if (excess > 0) {
                    let diff = size - currblock[1];
                    nextblock[0] += diff;
                    nextblock[1] -= diff;
                } else {
                    freeList.splice(nextblockid, 1);
                }
                currblock[1] = size;
                return currblock[0];
            }
        }

        let newalloc = alloc(size);
        if (newalloc < 0) {
            return newalloc;
        }
        memcpy(idx, newalloc, currblock[1]);
        free(idx);
        return newalloc;
    }

    function memset(idx, val, size) {
        for (let i = 0; i < size; i ++) {
            arr[idx + i] = val;
        }
    }
    function memcpy(src, dest, size) {
        if (src < dest) {
            for (let i = size - 1; i >= 0; i --) {
                arr[dest + i] = arr[src + i];
            }
        } else if (src > dest) {
            for (let i = 0; i < size; i ++) {
                arr[dest + i] = arr[src + i];
            }
        }
    }

    return {
        alloc,
        free,
        realloc,
        memset,
    }
}