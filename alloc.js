/* Simple "allocator" that works off an array/buffer
 */
"use strict";

/* arr- array to allocate from
 * splitThresh- size threshold at which to bother splitting a free block
 */
const createAlloc = ({arr, splitThresh = 32} = {}) => {
    // Sorted list of used and free blocks in format
    // [ptr, size]
    // ptr- index in memory where block starts
    // size- number of elements in block
    let useList = [];
    let freeList = [[0, arr.length]];

    /* Determine if there is a block starting at ptr in list
     * return- index in list if found, else -1
     */
    function findBlock(ptr, list) {
        for (let i = 0; i < list.length; i ++) {
            if (list[i][0] === ptr) {
                return i;
            }
        }
        return -1;
    }

    /* Insert new block into specified list
     * return- index at which block was inserted.
     * note- copies block before inserting.
     */
    function insertBlock(block, list) {
        let i = 0;
        while (i < list.length && list[i][0] < block[0]) {
            i ++;
        }
        list.splice(i, 0, block.slice());
        return i;
    }

    /* Sweeps freeList and combines adjacent blocks into one
    */
    function mergeFree() {
        for (let i = 1; i < freeList.length; i ++) {
            // If previous block does not reach start of current,
            if (freeList[i-1][0] + freeList[i-1][1] < freeList[i][0]) {
                continue;
            }
            freeList[i-1][1] += freeList[i][1];
            freeList.splice(i, 1);
            i --;
        }
    }

    /* Allocates new block from array.
     * return- ptr to new block if success, else -1
     * note- simple first-fit alloc.
     */
    function alloc(size) {
        // Find suitable free block
        let i = 0;
        while (freeList[i][1] < size) {
            i ++;
            if (i > freeList.length) {
                return -1;
            }
        }
        let block = freeList.splice(i, 1)[0];
        // See if can split
        let excess = block[1] - size;
        if (excess > splitThresh) {
            block[1] = size;
            insertBlock([block[0] + size, excess], freeList);
        }
        insertBlock(block, useList);
        return block[0];
    }

    /* Returns block to array
     * return- 0 if success, -1 if block not found
     * note- zeroes out freed block
     */
    function free(ptr) {
        let blockid = findBlock(ptr, useList);
        if (blockid < 0) {
            return -1;
        }
        let block = useList.splice(blockid, 1)[0];
        memset(block[0], 0, block[1]);
        insertBlock(block, freeList);
        mergeFree();
        return 0;
    }

    /* Ensure block starting at ptr is at least size
     * return- ptr to block if success, else -1.
     */
    function realloc(ptr, size) {
        let currId = findBlock(ptr, useList);
        if (currId < 0) {
            return -1;
        }
        let curr = useList[currId];
        if (curr[1] > size) {
            return curr[0];
        }

        // Fine, actually need to do something
        // See if we can just expand the block
        let nextId = findBlock(curr[0] + curr[1], freeList);
        if (nextId >= 0) {
            // Next bock is indeed free
            let next = freeList[nextId];
            let mergeSize = next[1] + curr[1];
            if (mergeSize > size) {
                // Large enough to do merge
                let excess = mergeSize - size;
                if (excess > 0) {
                    let diff = size - curr[1];
                    next[0] += diff;
                    next[1] -= diff;
                } else {
                    freeList.splice(nextId, 1);
                }
                curr[1] = size;
                return ptr;
            }
        }

        // Failing that, just alloc again, copy, and free old
        let newalloc = alloc(size);
        if (newalloc < 0) {
            return -1;
        }
        memcpy(ptr, newalloc, curr[1]);
        free(ptr);
        return newalloc;
    }

    /* Set range starting at idx, of length size, to val
     */
    function memset(ptr, val, size) {
        for (let i = 0; i < size; i ++) {
            arr[ptr + i] = val;
        }
    }

    /* Copy range starting at src to range starting at dest,
     * of length size
     */
    function memcpy(src, dest, size) {
        // If copying to higher ptr,
        // start copying from end of range
        if (src < dest) {
            for (let i = size - 1; i >= 0; i --) {
                arr[dest + i] = arr[src + i];
            }
        // Otherwise, start from beginning of range.
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