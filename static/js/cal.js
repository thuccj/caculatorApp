document.addEventListener('DOMContentLoaded', () => {
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
        history: '',  // To keep track of the expression
    };

    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    function inputDecimal(dot) {
        if (calculator.waitingForSecondOperand === true) return;

        if (!calculator.displayValue.includes(dot)) {
            calculator.displayValue += dot;
        }
    }

    function handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator, history } = calculator;
        const inputValue = parseFloat(displayValue);

        if (operator && calculator.waitingForSecondOperand) {
            calculator.operator = nextOperator;
            calculator.history = history.slice(0, -1) + nextOperator;
            updateDisplay();
            return;
        }

        if (firstOperand == null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            calculator.displayValue = String(result);
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;

        // Replace * with × in history
        calculator.history += ` ${displayValue} ${nextOperator === '*' ? '×' : nextOperator}`;
        updateDisplay();
    }

    const performCalculation = {
        '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
        '*': (firstOperand, secondOperand) => firstOperand * secondOperand, // This will stay as * for calculation
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
        '=': (firstOperand, secondOperand) => secondOperand,
    };

    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
        calculator.history = '';
        updateDisplay();
    }

    function delCalculator() {
        const display = document.querySelector('.calculator-screen#screen');
        calculator.displayValue = display.value.slice(0, -1);
        updateDisplay();
    }

    function updateDisplay() {
        const display = document.querySelector('.calculator-screen#screen');
        const historyDisplay = document.querySelector('.calculator-screen#screen2');
        display.value = calculator.displayValue;
        historyDisplay.value = calculator.history;
    }

    updateDisplay();

    const keys = document.querySelector('.calculator-keys');
    keys.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) {
            return;
        }

        if (target.classList.contains('operator')) {
            handleOperator(target.value);
            return;
        }

        if (target.classList.contains('all-clear')) {
            resetCalculator();
            return;
        }

        if (target.classList.contains('del')) {
            delCalculator();
            return;
        }

        if (target.classList.contains('equal-sign')) {
            handleOperator(target.value);
            calculator.history = ''; // Clear history after evaluation
            return;
        }

        if (target.value === '.') {
            inputDecimal(target.value);
        } else {
            inputDigit(target.value);
        }
        updateDisplay();
    });

    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');

    const darkTheme = {
        '--color': 'black',
        '--toolcolor': '#808080',
        '--backgroundcolor': '#26282c',
        '--shadow-dark': '#18191b',
        '--shadow-light': '#34373d',
        '--gradient-dark': '#292b2f',
        '--gradient-light': '#222428',
        '--color-accent': '#fffff'
    };

    const lightTheme = {
        '--color': 'white',
        '--toolcolor': '#7f7f7f',
        '--backgroundcolor': '#e0e0e0',
        '--shadow-dark': '#bebebe',
        '--shadow-light': '#d9d9d9',
        '--gradient-dark': '#f0f0f0',
        '--gradient-light': '#d9d9d9',
        '--color-accent': 'black'
    };

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            setTheme(lightTheme);
        } else {
            setTheme(darkTheme);
        }
    });

    function setTheme(theme) {
        for (let key in theme) {
            root.style.setProperty(key, theme[key]);
        }
    }
});
