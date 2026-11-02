// Each gate is described as data: name, short description, number of inputs,
// Boolean expression (text) and the function that computes the output.
export const gates = {
    and: {
        name: "AND",
        description: "The output is 1 only when all the inputs are 1.",
        inputs: 2,
        expression: "Y = A · B",
        fn: (a, b) => a & b
    },
    nand: {
        name: "NAND",
        description: "The opposite of AND: the output is 0 only when all the inputs are 1.",
        inputs: 2,
        expression: "Y = (A · B)'",
        fn: (a, b) => (a & b) ^ 1
    },
    not: {
        name: "NOT",
        description: "Inverts the input: a 1 becomes a 0 and a 0 becomes a 1.",
        inputs: 1,
        expression: "Y = A'",
        fn: (a) => a ^ 1
    },

    // TODO: add buffer, or, nor, xor and xnor following the same pattern
    // (don't forget the description: it is shown on the card).
};

// Returns one row per input combination: { inputs: [A, B], output: Y }
export function buildTruthTable(gate) {
    const rows = [];

    for (let i = 0; i < 2 ** gate.inputs; i++) {
        const inputs = Array.from(
            { length: gate.inputs },
            (_, k) => (i >> (gate.inputs - 1 - k)) & 1
        );

        rows.push({ inputs, output: gate.fn(...inputs) });
    }

    return rows;
}