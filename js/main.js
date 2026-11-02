import { gates, buildTruthTable } from "./gates.js";
import { getGateSymbol } from "./symbols.js";

const selector = document.querySelector("#gate-selector");
const gateCount = document.querySelector("#gate-count");
const hint = document.querySelector("#gate-hint");
const panel = document.querySelector("#gate-panel");
const titleBox = document.querySelector("#gate-title");
const symbolBox = document.querySelector("#gate-symbol");
const expressionBox = document.querySelector("#gate-expression");
const inputsBox = document.querySelector("#gate-inputs");
const outputBox = document.querySelector("#gate-output");
const tableToggle = document.querySelector("#table-toggle");
const tableBox = document.querySelector("#truth-table");

// The whole page is drawn from this state.
// gateId = null means "no gate selected yet": only the cards are shown.
const state = {
    gateId: null,
    inputs: [],
    showTable: false
};

renderSelector();
render();

tableToggle.addEventListener("click", () => {
    state.showTable = !state.showTable;
    render();
});

function selectGate(gateId) {
    const isFirstSelection = state.gateId === null;

    state.gateId = gateId;
    state.inputs = Array(gates[gateId].inputs).fill(0);
    render();

    if (isFirstSelection) {
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

function toggleInput(index) {
    state.inputs[index] ^= 1;
    render();
}

function inputName(index) {
    return String.fromCharCode(65 + index); // 0 -> A, 1 -> B, 2 -> C
}

function pad(number) {
    return String(number).padStart(2, "0");
}

// One card per gate (built once).
function renderSelector() {
    selector.replaceChildren();
    gateCount.textContent = `${pad(Object.keys(gates).length)} GATES`;

    Object.entries(gates).forEach(([id, gate], index) => {
        // Gates without a drawn symbol yet show a placeholder.
        const symbol = getGateSymbol(id) || `<span class="card-symbol-empty">…</span>`;

        const card = document.createElement("article");
        card.className = "gate-card";
        card.dataset.gate = id;
        card.innerHTML = `
            <div class="card-top">
                <span class="card-symbol">${symbol}</span>
                <span class="card-number">${pad(index + 1)}</span>
            </div>
            <h2>${gate.name}</h2>
            <p>${gate.description ?? ""}</p>
            <div class="card-formula">${gate.expression}</div>
            <button class="card-button" type="button">
                Open gate <span aria-hidden="true">→</span>
            </button>
        `;

        card.addEventListener("click", () => selectGate(id));
        selector.appendChild(card);
    });
}

// Redraws everything that depends on the state.
function render() {
    const hasGate = state.gateId !== null;

    panel.hidden = !hasGate;
    hint.hidden = hasGate;

    selector.querySelectorAll(".gate-card").forEach(card => {
        const isSelected = card.dataset.gate === state.gateId;
        card.classList.toggle("is-selected", isSelected);
        card.querySelector(".card-button").setAttribute("aria-pressed", String(isSelected));
    });

    if (!hasGate) {
        return;
    }

    const gate = gates[state.gateId];
    const output = gate.fn(...state.inputs);

    titleBox.textContent = gate.name;
    symbolBox.innerHTML = getGateSymbol(state.gateId, { inputs: state.inputs, output });
    expressionBox.textContent = gate.expression;

    renderInputs();

    outputBox.textContent = `Y = ${output}`;
    outputBox.classList.toggle("is-high", output === 1);
    outputBox.classList.toggle("is-low", output === 0);

    tableToggle.textContent = state.showTable ? "Hide truth table" : "Show truth table";
    tableToggle.setAttribute("aria-expanded", String(state.showTable));
    tableBox.hidden = !state.showTable;

    if (state.showTable) {
        renderTruthTable(gate);
    }
}

// Buttons are only rebuilt when the number of inputs changes,
// so the keyboard focus is not lost when you toggle a value.
function renderInputs() {
    if (inputsBox.children.length !== state.inputs.length) {
        inputsBox.replaceChildren();

        state.inputs.forEach((_, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "input-toggle";
            button.addEventListener("click", () => toggleInput(index));
            inputsBox.appendChild(button);
        });
    }

    state.inputs.forEach((value, index) => {
        const button = inputsBox.children[index];
        button.textContent = `${inputName(index)} = ${value}`;
        button.classList.toggle("is-high", value === 1);
        button.classList.toggle("is-low", value === 0);
        button.setAttribute("aria-pressed", String(value === 1));
    });
}

function renderTruthTable(gate) {
    const currentRow = state.inputs.join("");

    const headers = state.inputs
        .map((_, index) => `<th>${inputName(index)}</th>`)
        .join("");

    const rows = buildTruthTable(gate)
        .map(row => {
            const cells = row.inputs.map(value => `<td>${value}</td>`).join("");
            const isCurrent = row.inputs.join("") === currentRow;

            return `<tr class="${isCurrent ? "is-current" : ""}">${cells}<td>${row.output}</td></tr>`;
        })
        .join("");

    tableBox.innerHTML = `
        <table class="truth-table">
            <thead><tr>${headers}<th>Y</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}