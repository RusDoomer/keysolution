export const STANDARD = [
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    5, 5, 5
]

export const ANGLE = [
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    1, 2, 3, 3, 3, 6, 6, 7, 8, 9,
    5, 5, 5
]

export let FINGER_MAP = STANDARD

export function angle(bool) {
    if (bool) {
        FINGER_MAP = ANGLE
    } else {
        FINGER_MAP = STANDARD
    }

    console.log(`angle: ${bool}`)
}

function finger(idx) {
    return FINGER_MAP[idx]
}

function column(idx) {
    if (idx >= 30) {
        return 0
    } 
    
    return idx % 10
}

function hand(idx) {
    if (idx >= 30) {
        return 1
    } 

    if (idx % 10 < 5) {
        return 0
    } else {
        return 1
    }
}

function row(idx) {
    return Math.floor(idx / 10)
}

function ordered(idx) {
    return (
        (
            finger(idx[0]) < finger(idx[1]) &&
            finger(idx[1]) < finger(idx[2])
        ) ||
        (
            finger(idx[0]) > finger(idx[1]) &&
            finger(idx[1]) > finger(idx[2])
        )
    )
}

export function classify(key) {
    switch(key.length) {
        case 2:
            return bigrams(key)
        case 3:
            return trigrams(key)
    }
}

function bigrams(key) {
    const buckets = []

    if (
        finger(key[0]) == finger(key[1]) &&
        key[0] != key[1]
    ) {
        buckets.push('SF')
        return buckets
    }
    
    if (
        hand(key[0]) == hand(key[1]) &&
        (
            [4, 5].includes(column(key[0])) ||
            [4, 5].includes(column(key[1]))
        ) &&
        (
            [2, 7].includes(column(key[0])) ||
            [2, 7].includes(column(key[1]))
        )
    ) {
        buckets.push('LS')
    }

    if (
        (
            row(key[0]) - row(key[1]) == -1 &&
            hand(key[0]) == hand(key[1]) &&
            (
                [1, 2, 7, 8].includes(finger(key[1])) ||
                [1, 2, 7, 8].includes(finger(key[0]))
            )
        ) ||
        (
            row(key[0]) - row(key[1]) == 1 &&
            hand(key[0]) == hand(key[1]) &&
            (
                [1, 2, 7, 8].includes(finger(key[1])) ||
                [1, 2, 7, 8].includes(finger(key[0]))
            )
        )
    ) {
        buckets.push('HR')
    }

    if (
        (
            row(key[0]) - row(key[1]) == -2 &&
            hand(key[0]) == hand(key[1]) &&
            (
                [1, 2, 7, 8].includes(finger(key[1])) ||
                [1, 2, 7, 8].includes(finger(key[0]))
            )
        ) ||
        (
            row(key[0]) - row(key[1]) == 2 &&
            hand(key[0]) == hand(key[1]) &&
            (
                [1, 2, 7, 8].includes(finger(key[1])) ||
                [1, 2, 7, 8].includes(finger(key[0]))
            )
        )
    ) {
        buckets.push('FR')
    }

    return buckets
}

function trigrams(key) {
    const buckets = []

    if (
        hand(key[0]) == hand(key[2]) &&
        hand(key[0]) != hand(key[1])
    ) {
        buckets.push('ALT')
    }

    if (
        new Set(key.map(x => hand(x))).size == 2 &&
        new Set(key.map(x => finger(x))).size == 3 &&
        (
            (hand(key[0]) == hand(key[1]) && row(key[0]) == row(key[1])) ||
            (hand(key[1]) == hand(key[2]) && row(key[1]) == row(key[2]))
        ) &&
        hand(key[0]) != hand(key[2])
    ) {
        buckets.push('SRR')
    }

    if (
        new Set(key.map(x => hand(x))).size == 1 &&
        new Set(key.map(x => row(x))).size == 1 &&
        ordered(key)
    ) {
        buckets.push('SRO')
    }

    if (
        new Set(key.map(x => hand(x))).size == 1 &&
        new Set(key.map(x => finger(x))).size == 3 &&
        !ordered(key)
    ) {
        buckets.push('RED')
    }

    return buckets
}
