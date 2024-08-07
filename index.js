document.addEventListener("DOMContentLoaded", () => {
    // Initialize the handwriting canvas object
    var can1 = new handwriting.Canvas(document.getElementById("can"));
    
    // Set options for recognition
    can1.setOptions({
        language: "en", // Set language for recognition
        numOfReturn: 5, // Maximum number of results to return
    });
    
    // Set callback function to handle recognition results
    can1.setCallBack(function (data, err) {
        if (err) { console.error(err) } 
        else { calculatorNumber(data) }
    });
    
    // Add event listeners to buttons
    document.querySelector("#recognize-btn").addEventListener('click', () => { can1.recognize() });
    document.querySelector("#clear-btn").addEventListener('click', () => { can1.erase() });
    document.querySelector("#undo-btn").addEventListener('click', () => { can1.undo() });
    document.querySelector("#redo-btn").addEventListener('click', () => { can1.redo() });
    document.querySelector('#history-btn').addEventListener('click', () => {
        const divHistory = document.querySelector('.divHistory');
        const divHistory_list = document.querySelector('.divHistory-list');
        divHistory.style.display = divHistory.style.display === 'none' || divHistory.style.display === '' ? 'block' : 'none';
        divHistory_list.scrollTop = divHistory_list.scrollHeight;
    });
    document.querySelector('#clear-history-btn').addEventListener('click', () => { eraseCookie() });

    getCookie();
    // autoCalculator(can1);
    
    // Optional: Enable undo and redo
    can1.set_Undo_Redo(true, true);
})



function calculatorNumber(data) {
    const resultBoard = document.querySelector('.result');

    try {
        const strCal = data[0];
        console.log('num:', strCal);
        let result = calculate(strCal);
        result = JSON.stringify(result).split('');
        
        resultBoard.innerHTML = '';
        result.forEach(char => {
            const imgCreate = document.createElement('img');
            imgCreate.src = char != '.' ? `./img/${char}.jpg` : `./img/dot.jpg`;
            resultBoard.appendChild(imgCreate);
        });
    }
    catch {
        resultBoard.innerHTML = '';
        const imgCreate = document.createElement('img');
        const spanCreate = document.createElement('span');
        imgCreate.src = './img/not_solved.jpg';
        spanCreate.innerText = 'huh';
        imgCreate.className = 'not_solved';
        spanCreate.className = 'not_solved';

        resultBoard.appendChild(imgCreate);
        resultBoard.appendChild(spanCreate);
    }
}

function calculate(expression) {
    expression = expression.replace(/x/g, '*').replace(/:/g, '/');

    let operators = expression.match(/[\%\+\-\*\/]/g);
    let numbers = expression.split(/[\%\+\-\*\/]/).map(Number);
    console.log(123, (operators), (numbers))
    
    if (!operators || operators.length !== numbers.length - 1) {
        throw new Error('Invalid expression');
    }
    
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        switch (operators[i]) {
            case '+':
                result += numbers[i + 1];
                break;
            case '-':
                result -= numbers[i + 1];
                break;
            case '*':
                result *= numbers[i + 1];
                break;
            case '/':
                result /= numbers[i + 1];
                break;
            case '%':
                result /= 100;
                break;
        }
    }
    // result = Number(result) === result && result % 1 === 0 ? result : JSON.stringify(Number(result).toFixed(3))
    setCookie({expression: expression, result: result});
    getCookie();

    return result;
}

function currentTime() {
    let now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let day = String(now.getDate()).padStart(2, '0');
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let seconds = String(now.getSeconds()).padStart(2, '0');
    let milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
}

function autoCalculator(can1) {
    let isDrawing = false;
    let stopDrawTimeout = null;

    const canvasElement = document.getElementById("can");

    // Add event listeners to detect drawing state
    canvasElement.addEventListener("mousedown", handleMouseDown);
    canvasElement.addEventListener("mousemove", handleMouseMove);
    canvasElement.addEventListener("mouseup", handleMouseUp);
    canvasElement.addEventListener("pointerdown", handleMouseDown);
    canvasElement.addEventListener("pointermove", handleMouseMove);
    canvasElement.addEventListener("pointerup", handleMouseUp);

    function handleMouseDown(event) {
        isDrawing = true;
        clearTimeout(stopDrawTimeout);
    }

    function handleMouseMove(event) {
        if (isDrawing) {
            clearTimeout(stopDrawTimeout);
        }
    }

    function handleMouseUp(event) {
        isDrawing = false;
        stopDrawTimeout = setTimeout(() => {
            if (!isDrawing) {
                console.log("User stopped drawing on the canvas");
                can1.recognize();
            }
        }, 3000); // Dừng 2.5s xem có vẽ tiếp không 🤔
    }
}


// Set up cookie to save data history 🤔
function setCookie(value) {
    document.cookie = `${currentTime()}=${JSON.stringify(value)}`;
}

function getCookie() {
    const cookie = document.cookie.split(';');
    const divHistory_list = document.querySelector('.divHistory-list');

    if (cookie != '') {
        divHistory_list.innerHTML = '';
        cookie.forEach(cooki => {
            let data = cooki.split('=');
            data = JSON.parse(data[1]);
            divHistory_list.innerHTML += `
                <div>${data.expression.replaceAll('*', 'x')}</div>
                <div>=${data.result}</div>
                <hr>
            `
        })
    }
    
}

function eraseCookie() {
    const cookie = document.cookie.split(';');
    document.querySelector(".divHistory-list").innerHTML = '';
    cookie.forEach(cooki => {
        const data = cooki.split('=');
        document.cookie = data[0] + '=; Max-Age=-99999999;';
    })
}