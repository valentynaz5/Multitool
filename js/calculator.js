class Calculator {
	constructor(previousOperandTextElement, currentOperandTextElement) {
		this.previousOperandTextElement = previousOperandTextElement;
		this.currentOperandTextElement = currentOperandTextElement;
		this.readyToReset = false;
		this.clear();
	}

	clear() {
		this.currentOperand = '';
		this.previousOperand = '';
		this.operation = undefined;
	}

	delete() {
		this.currentOperand = this.currentOperand.toString().slice(0, -1);
	}

	appendNumber(number) {
		if (number === '.' && this.currentOperand.includes('.')) return;
		this.currentOperand = this.currentOperand.toString() + number.toString();
	}

	chooseOperation(operation) {
		if (this.currentOperand === '') return;
		if (this.previousOperand !== '') {
			this.compute();
		}
		if (operation === 'Xn') {
			this.operation = '^';
		} else {
			this.operation = operation;
		}
		this.previousOperand = this.currentOperand;
		this.currentOperand = '';
	}

	compute() {
		let computation;
		const prev = parseFloat(this.previousOperand);
		const current = parseFloat(this.currentOperand);
		if (isNaN(prev) || isNaN(current)) return;
		switch (this.operation) {
			case '+':
				computation = prev + current;
				if (prev % 1 !== 0 && current % 1 !== 0) {
					const prevLength = (prev % 1).toString().length - 2;
					const currentLength = (current % 1).toString().length - 2;
					computation = computation.toFixed(Math.max(prevLength, currentLength));
				}
				break;
			case '-':
				computation = prev - current;
				break;
			case '*':
				computation = prev * current;
				if (prev % 1 !== 0 && current % 1 !== 0) {
					const prevLength = (prev % 1).toString().length - 2;
					const currentLength = (current % 1).toString().length - 2;
					computation = computation.toFixed(prevLength + currentLength);
				}
				break;
			case '÷':
				computation = prev / current;
				break;
			case '^':
				computation = prev ** current;
				if (prev % 1 !== 0) {
					const prevLength = (prev % 1).toString().length - 2;
					const currentLength = (current % 1).toString().length - 2;
					computation = computation.toFixed(prevLength * current);
				}
				break;
			default:
				return;
		}
		this.readyToReset = true;
		this.currentOperand = computation;
		this.operation = undefined;
		this.previousOperand = '';
	}

	getDisplayNumber(number) {
		const stringNumber = number.toString();
		const integerDigits = parseFloat(stringNumber.split('.')[0]);
		const decimalDigits = stringNumber.split('.')[1];
		let integerDisplay;
		if (isNaN(integerDigits)) {
			integerDisplay = '';
		} else {
			integerDisplay = integerDigits.toLocaleString('en', {
				maximumFractionDigits: 0
			})
		}
		if (decimalDigits != null) {
			return `${integerDisplay}.${decimalDigits}`
		} else {
			return integerDisplay;
		}
	}

	updateDisplay() {
		this.currentOperandTextElement.innerText =
			this.getDisplayNumber(this.currentOperand);
		if (this.operation != null) {
			this.previousOperandTextElement.innerText =
				`${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
		} else {
			this.previousOperandTextElement.innerText = '';
		}
	}

	changeNegative() {
		this.currentOperand *= -1;
	}

	sqrt() {
		const current = parseFloat(this.currentOperand);
		if (isNaN(current)) return;
		if (current < 0) {
			alert("Не стоит извлекать корень квадратный из отрицательного числа");
			return;
		} else {
			this.currentOperand = Math.sqrt(current);
			this.readyToReset = true;
			this.operation = undefined;
		}
	}
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const negativeButton = document.querySelector('[data-change-negative]');
const sqrtButton = document.querySelector('[data-sqrt');
const powButton = document.querySelector('[data-pow');


const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
	button.addEventListener('click', () => {
		if (calculator.previousOperand === "" &&
			calculator.currentOperand !== "" &&
			calculator.readyToReset) {
			calculator.currentOperand = "";
			calculator.readyToReset = false;
		}
		calculator.appendNumber(button.innerText);
		calculator.updateDisplay();
	})
})

operationButtons.forEach(button => {
	button.addEventListener('click', () => {
		calculator.chooseOperation(button.innerText);
		calculator.updateDisplay();
	})
})

equalsButton.addEventListener('click', button => {
	calculator.compute();
	calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
	calculator.clear();
	calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
	calculator.delete();
	calculator.updateDisplay();
})

negativeButton.addEventListener('click', button => {
	calculator.changeNegative();
	calculator.updateDisplay();
})

sqrtButton.addEventListener('click', button => {
	calculator.sqrt();
	calculator.updateDisplay();
}) 