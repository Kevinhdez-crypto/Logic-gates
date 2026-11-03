// Each gate is described as data: name, short description, number of inputs,
// Boolean expression (text) and the function that computes the output.
export const gates = {
    buffer: {
        name: "BUFFER",
        description: "Copies the input to the output without changing it.",
        inputs: 1,
        expression: "Y = A",
        fn: (a) => a
    },
    not: {
        name: "NOT",
        description: "Inverts the input: a 1 becomes a 0 and a 0 becomes a 1.",
        inputs: 1,
        expression: "Y = A'",
        fn: (a) => a ^ 1
    },
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
    or: {
        name: "OR",
        description: "The output is 1 when at least one input is 1.",
        inputs: 2,
        expression: "Y = A + B",
        fn: (a, b) => a | b
    },
    nor: {
        name: "NOR",
        description: "The opposite of OR: the output is 1 only when all the inputs are 0.",
        inputs: 2,
        expression: "Y = (A + B)'",
        fn: (a, b) => (a | b) ^ 1
    },
    xor: {
        name: "XOR",
        description: "The output is 1 when the inputs are different.",
        inputs: 2,
        expression: "Y = A ⊕ B",
        fn: (a, b) => a ^ b
    },
    xnor: {
        name: "XNOR",
        description: "The output is 1 when the inputs are equal.",
        inputs: 2,
        expression: "Y = (A ⊕ B)'",
        fn: (a, b) => (a ^ b) ^ 1
    }
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