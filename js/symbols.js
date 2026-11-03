// Each symbol is built from small pieces: wires, a body and (optionally) a bubble.
// `state` is optional: { inputs: [1, 0], output: 1 }.
// When it is given, the wires get the class is-high / is-low so CSS can light them up.

const VIEWBOX = "0 0 200 100";

function level(value) {
    if (value === undefined) {
        return "";
    }

    return value ? "is-high" : "is-low";
}

function wire(x1, y1, x2, y2, value) {
    return `<line class="wire ${level(value)}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
}

function svg(content) {
    return `<svg class="gate-symbol" viewBox="${VIEWBOX}" aria-hidden="true">${content}</svg>`;
}

// There are only four body shapes. Every gate is one of them,
// with or without a bubble (the little circle that means "inverted").
//
//   path   -> the SVG of the body
//   tip    -> x where the body ends on the right (the output wire starts here)
//   inputY -> y of each input wire
//   inputX -> x where each input wire touches the body
//
// The OR curve on the left is a bit hollow, so its inputs touch it at x = 57;
// the extra curve of the XOR is 10 units further left, so they touch it at x = 47.
const OR_PATH = "M 50 15 Q 100 15 130 50 Q 100 85 50 85 Q 72 50 50 15 Z";

const BODIES = {
    triangle: {
        path: `<polygon class="body" points="60,20 60,80 130,50" />`,
        tip: 130,
        inputY: [50],
        inputX: [60]
    },
    and: {
        path: `<path class="body" d="M 50 15 H 95 A 35 35 0 0 1 95 85 H 50 Z" />`,
        tip: 130,
        inputY: [30, 70],
        inputX: [50, 50]
    },
    or: {
        path: `<path class="body" d="${OR_PATH}" />`,
        tip: 130,
        inputY: [30, 70],
        inputX: [57, 57]
    },
    xor: {
        path: `<path class="body" d="${OR_PATH}" /><path class="curve" d="M 40 15 Q 62 50 40 85" />`,
        tip: 130,
        inputY: [30, 70],
        inputX: [47, 47]
    }
};

// Returns a function that draws the symbol of a gate.
function makeSymbol(bodyName, negated) {
    const body = BODIES[bodyName];

    return ({ inputs = [], output } = {}) => {
        // Wires are drawn first so the body is on top of them.
        const inputWires = body.inputY
            .map((y, index) => wire(0, y, body.inputX[index], y, inputs[index]))
            .join("");

        // With a bubble, the output wire starts after it.
        const outputStart = negated ? body.tip + 10 : body.tip;
        const outputWire = wire(outputStart, 50, 200, 50, output);
        const bubble = negated
            ? `<circle class="bubble" cx="${body.tip + 5}" cy="50" r="5" />`
            : "";

        return svg(`${inputWires}${outputWire}${body.path}${bubble}`);
    };
}

const symbols = {
    buffer: makeSymbol("triangle", false),
    not:    makeSymbol("triangle", true),
    and:    makeSymbol("and", false),
    nand:   makeSymbol("and", true),
    or:     makeSymbol("or", false),
    nor:    makeSymbol("or", true),
    xor:    makeSymbol("xor", false),
    xnor:   makeSymbol("xor", true)
};

// Returns the SVG markup of a gate, or "" if that gate has no symbol yet.
export function getGateSymbol(id, state) {
    const draw = symbols[id];

    return draw ? draw(state) : "";
}