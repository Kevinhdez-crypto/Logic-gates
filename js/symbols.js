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

const symbols = {
    // Triangle + bubble on the output.
    not: ({ inputs = [], output } = {}) => svg(`
        ${wire(0, 50, 60, 50, inputs[0])}
        ${wire(140, 50, 200, 50, output)}
        <polygon class="body" points="60,20 60,80 130,50" />
        <circle class="bubble" cx="135" cy="50" r="5" />
    `)
};

// Returns the SVG markup of a gate, or "" if that gate has no symbol yet.
export function getGateSymbol(id, state) {
    const draw = symbols[id];

    return draw ? draw(state) : "";
}