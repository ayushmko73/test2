import React, { useState, useCallback, useEffect } from 'react';
import { Delete, Calculator } from 'lucide-react';

type Operator = '+' | '-' | '*' | '/' | null;

function App() {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleBackspace = () => {
    if (waitingForSecondOperand) return;
    
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const performOperation = (nextOperator: Operator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(display);
    } else if (operator) {
      const currentValue = firstOperand || '0';
      const result = calculate(parseFloat(currentValue), inputValue, operator);
      const formattedResult = String(parseFloat(result.toFixed(8))); // Avoid long decimals

      setDisplay(formattedResult);
      setFirstOperand(formattedResult);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (first: number, second: number, op: string) => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '*': return first * second;
      case '/': return second !== 0 ? first / second : 0;
      default: return second;
    }
  };

  const handleEquals = () => {
    if (!operator || firstOperand === null) return;
    
    const inputValue = parseFloat(display);
    const result = calculate(parseFloat(firstOperand), inputValue, operator);
    const formattedResult = String(parseFloat(result.toFixed(8)));
    
    setDisplay(formattedResult);
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(true);
  };

  const handlePercent = () => {
    const currentValue = parseFloat(display);
    if (currentValue === 0) return;
    setDisplay(String(currentValue / 100));
  };

  const handleKeyboard = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    
    if (/\d/.test(key)) {
      inputDigit(key);
    } else if (key === '.') {
      inputDecimal();
    } else if (key === 'Backspace') {
      handleBackspace();
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      handleEquals();
    } else if (key === 'Escape') {
      clear();
    } else if (['+', '-', '*', '/'].includes(key)) {
      performOperation(key as Operator);
    }
  }, [display, waitingForSecondOperand, operator, firstOperand]); // Dependencies for closure state

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboard);
    return () => {
      window.removeEventListener('keydown', handleKeyboard);
    };
  });

  // Helper to determine button styling
  const getButtonClass = (type: 'number' | 'operator' | 'action' | 'equals') => {
    const base = "h-16 text-xl font-medium rounded-2xl transition-all duration-150 active:scale-95 flex items-center justify-center select-none shadow-sm";
    switch(type) {
      case 'number':
        return `${base} bg-white text-gray-800 hover:bg-gray-50 border border-gray-200`;
      case 'operator':
        return `${base} bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200`;
      case 'action':
        return `${base} bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300`;
      case 'equals':
        return `${base} bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[360px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header/Display Area */}
        <div className="bg-gray-900 p-6 pb-2">
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-400 text-sm flex items-center gap-2">
               <Calculator size={16} />
               <span>Standard</span>
            </div>
            {/* Status indicators like operator can go here if needed */}
          </div>
          
          <div className="h-24 flex flex-col items-end justify-end">
             <div className="text-gray-400 text-sm h-6">
               {firstOperand !== null && operator ? `${firstOperand} ${operator}` : ''}
             </div>
             <div className="text-white text-5xl font-light tracking-tight truncate w-full text-right">
               {display}
             </div>
          </div>
        </div>

        {/* Keypad */}
        <div className="p-4 bg-gray-50 grid grid-cols-4 gap-3">
          <button onClick={clear} className={getButtonClass('action')}>AC</button>
          <button onClick={handleBackspace} className={getButtonClass('action')}>
            <Delete size={20} />
          </button>
          <button onClick={handlePercent} className={getButtonClass('action')}>%</button>
          <button onClick={() => performOperation('/')} className={getButtonClass('operator')}>÷</button>

          <button onClick={() => inputDigit('7')} className={getButtonClass('number')}>7</button>
          <button onClick={() => inputDigit('8')} className={getButtonClass('number')}>8</button>
          <button onClick={() => inputDigit('9')} className={getButtonClass('number')}>9</button>
          <button onClick={() => performOperation('*')} className={getButtonClass('operator')}>×</button>

          <button onClick={() => inputDigit('4')} className={getButtonClass('number')}>4</button>
          <button onClick={() => inputDigit('5')} className={getButtonClass('number')}>5</button>
          <button onClick={() => inputDigit('6')} className={getButtonClass('number')}>6</button>
          <button onClick={() => performOperation('-')} className={getButtonClass('operator')}>−</button>

          <button onClick={() => inputDigit('1')} className={getButtonClass('number')}>1</button>
          <button onClick={() => inputDigit('2')} className={getButtonClass('number')}>2</button>
          <button onClick={() => inputDigit('3')} className={getButtonClass('number')}>3</button>
          <button onClick={() => performOperation('+')} className={getButtonClass('operator')}>+</button>

          <button onClick={() => inputDigit('0')} className={`${getButtonClass('number')} col-span-2`}>0</button>
          <button onClick={inputDecimal} className={getButtonClass('number')}>.</button>
          <button onClick={handleEquals} className={getButtonClass('equals')}>=</button>
        </div>
      </div>
    </div>
  );
}

export default App;