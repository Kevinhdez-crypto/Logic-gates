# Logic Gates

An interactive web page to learn how digital logic gates work. Pick a gate, flip its inputs and watch the output change in real time, then open its truth table.

**Live demo:** https://kevinhdez-crypto.github.io/Logic-gates/

## Features

- **Gate cards** showing the gate symbol, a short description and its Boolean expression.
- **Interactive inputs:** toggle each input between 0 and 1 and see the output instantly.
- **Live symbol:** the wires of the gate light up green when the signal is 1.
- **Truth table** that can be shown or hidden, with the row matching the current inputs highlighted.
- **Responsive layout** that works on desktop, tablet and mobile.

Gates available so far: **NOT**, **AND** and **NAND**.

## Built with

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- Inline SVG for the gate symbols

## Project structure

```
Logic-gates/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── main.js      # state and rendering: cards, inputs, output and truth table
    ├── gates.js     # gate definitions and truth table generator
    └── symbols.js   # SVG symbols
```

## How it works

- **`gates.js`** describes every gate as data: name, description, number of inputs, Boolean expression and a function that computes the output. The truth table is generated automatically from that function, so adding a new gate only takes a few lines.
- **`symbols.js`** builds each symbol from small SVG pieces (wires, body and bubble) and adds an `is-high` or `is-low` class to the wires, so CSS can light them up.
- **`main.js`** keeps the state (selected gate and input values) and redraws the page every time it changes.

## Run it locally

The project uses ES modules, so it has to be served over HTTP (opening `index.html` directly from the disk will not work).

**Option 1: VS Code**

1. Install the **Live Server** extension.
2. Right-click `index.html` and choose **Open with Live Server**.

**Option 2: Python**

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Roadmap

- [x] NOT gate with SVG symbol
- [x] AND and NAND logic and truth tables
- [ ] SVG symbols for AND and NAND
- [ ] Buffer, OR, NOR, XOR and XNOR
- [ ] Gates with three inputs
- [ ] Timing diagram
- [ ] Quiz mode

## Related project

[ElectroCalc](https://kevinhdez-crypto.github.io/Electric-Calc/): electrical engineering calculators (Ohm's law, resistors, power, voltage and current dividers).

---

Built as a learning project to practice HTML, CSS and JavaScript.