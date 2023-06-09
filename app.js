document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const linesDisplay = document.querySelector('#lines');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId = null;
    let score = 0;
    let lines = 0
    const colors = ['SaddleBrown', 'darkred', 'rebeccapurple', 'darkolivegreen', 'midnightblue'];


    //Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];
    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width, width+1, 1, 2],
        [1, width, width+1, width*2],
        [0, 1, width+1, width+2]
    ];
    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ];
    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ];
    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    //select tetromino randomly
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    //draw the Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random]; 
        })
    };

    //undraw random tetromino 
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })
    };

    

    //assign functions to keyCodes
    function control(e)  {
        if(e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
        
    };

    document.addEventListener('keyup', control) 

    //move down function 
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        frezze();
    };

    //frezze function 
    function frezze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));

        //start a new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        gaveOver();
        }
    };

    // move the tetrominos to the left, unless edge or blockage
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0
        )

        if (!isAtLeftEdge) {
            currentPosition -= 1
        } 
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw();
    };


    // move the tetrominos to the right, unless edge or blockage

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

        if (!isAtRightEdge) {
            currentPosition +=1;
        }
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    };

    //rotate tetromino 
    function rotate() {
        undraw();
        currentRotation++
        if (currentRotation === current.length) {
            currentRotation = 0
        } 
        current = theTetrominoes[random][currentRotation]

        draw();
    };

    //displaying an upcoming tetramino in mini-gird

    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 6;

    let displayIndex = 0;

    // the tetrominos with out rotations
    const upNextTetrominoes = [
        [displayWidth+2, displayWidth*2+2, displayWidth*3+2, displayWidth*3+3], //lTetromino

        [displayWidth+2, displayWidth*2+2, displayWidth*2+3, displayWidth*3+3], //zTetromino

        [displayWidth+2, displayWidth*2+2, displayWidth*3+2, displayWidth*2+3], //tTetromino

        [displayWidth*2+2, displayWidth*2+3, displayWidth*3+2, displayWidth*3+3], //oTetromino

        [displayWidth*3+1, displayWidth*3+2, displayWidth*3+3, displayWidth*3+4] //iTetromino
    ];

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        });
    };

    //add functionality to the button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape();
        }
    });


    //add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                lines += 1;
                linesDisplay.innerHTML = lines;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            };
        };
    };

    //game over
    function gaveOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    };
    



});