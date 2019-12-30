// single player with cpu

let GameState = {
    score: [0, 0],
    squares: Array(9).fill(null),
    turn: true,
    winner: false,
    last_winner: null,
    music: true,
}

// dom layout
let layout = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

self.onload = () => {
    Start();
    self.document.body.click();
};

let bg_song = new Audio("./assets/audio/189.mp3");
self.document.body.addEventListener("click", () => {
    if (GameState.music === true) {
        bg_song.play();
        GameState = { ...GameState, "music": false };
        bg_song.onended = () => {
            GameState = { ...GameState, "music": true };
            self.document.body.click();
        }
    }
});

// checks if there is a winner
function checkWinner(squares) {
    const board = document.querySelector(".board");
    // check if entries in layout are same from squares
    layout.forEach(e => {
        const [a, b, c] = e;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            // prevent clicks
            board.style.pointerEvents = "none";

            const oldScore = GameState.score;
            switch (squares[a]) {
                case "X":
                    newState = { ...GameState, "last_winner": 1, "squares": Array(9).fill(null), "score": [oldScore[0] + 1, oldScore[1]], "winner": true };
                    GameState = newState;
                    break;
                default:
                    newState = { ...GameState, "last_winner": 2, "squares": Array(9).fill(null), "score": [oldScore[0], oldScore[1] + 1], "winner": true };
                    GameState = newState;
                    break;
            }
            // animateDome
            animateDom(a, b, c);
            return squares[a];
        }
        else {
            return null
        }
    });
}


// cpu play function
function cpuPlay(pos) {

    const dom_squares = document.querySelectorAll(".board div");
    // checks if human has possible chance of winning
    let targets = [];

    // first check for all null squares
    let nullSquares = [];
    GameState.squares.forEach((e, i) => {
        if (e === null) {
            nullSquares.push(i);
        }
    });

    let cpuChoice = null;

    // loop through dom layout
    layout.forEach((row, index) => {
        const [a, b, c] = row;
        const { squares } = GameState;
        // checks if X is in squares in GameState
        const canWin = [squares[a], squares[b], squares[c]].join("").match(/X/g)
        // if there is possibiilty of human winning
        if (canWin !== null) {
            if (canWin.length === 2) {
                row.forEach(e => {
                    // adds possiblities to targets
                    if (squares[e] === null) {
                        targets.push(e);
                    }
                })
            }
        }
    });


    setTimeout(() => {

        // checks if there is possibility of human winnig and 
        // try to prevent it
        if (targets.length > 0) {
            cpuChoice = targets[Math.floor(Math.random() * (targets.length))];
            if (GameState.winner === false && GameState.turn === false) {
                dom_squares[cpuChoice].click();
            }

        } else {
            cpuChoice = Math.floor(Math.random() * (nullSquares.length));
            if (GameState.winner === false && GameState.turn === false) {
                dom_squares[nullSquares[cpuChoice]].click();
            }
        }

    }, 500);
}

// update dom
function updateDom(target, pos) {
    const playerTurn = document.querySelector(".game-info .turn");
    playerTurn.innerText = `Player ${GameState.turn ? 1 : 2} turn`;
    target.innerText = GameState.squares[pos];
}

// animate dom
function animateDom(a, b, c) {
    const score = document.querySelector(".result-won .score h1");
    const result = document.querySelector(".result-won");
    const winner = document.querySelector(".result-won .player");
    const html_score = document.querySelector(".game-info .score");
    const dom_squares = document.querySelectorAll(".board div");

    score.innerText = `Score: ${GameState.score[0]}-${GameState.score[1]} `;
    dom_squares.forEach(e => {
        if ([a, b, c].includes(parseInt(e.getAttribute("pos")))) {
            e.classList.add("won");
        }
        setTimeout(() => {
            html_score.innerText = `Score: ${GameState.score[0]}-${GameState.score[1]}`;
            winner.innerText = `${GameState.last_winner}`;
            result.style.top = "20%";
        }, 3000);
    });
}

// reset square value
function clearSquares() {
    const dom_squares = document.querySelectorAll(".board div");
    const board = document.querySelector(".board");
    newState = { ...GameState, "winner": false };
    GameState = newState;
    dom_squares.forEach(e => {
        e.classList.remove("won");
        e.innerText = GameState.squares[e.getAttribute("pos")];
    });
    board.style.pointerEvents = "all";
    if (GameState.turn == false) {
        cpuPlay();
    }
}

function checkBox() {
    if (!GameState.squares.includes(null) && GameState.winner == false) {
        newState = { ...GameState, "squares": Array(9).fill(null) };
        GameState = newState;
        setTimeout(() => clearSquares(), 500);
    }
}

function Start() {
    const cont_btn = document.querySelector(".action-btn");
    const dom_squares = document.querySelectorAll(".board div");
    // add click method to all squares
    dom_squares.forEach(e => e.addEventListener("click", e => {
        const { target } = e;
        const pos = target.getAttribute("pos");
        if (!GameState.squares[pos]) {
            GameState.turn ? (
                newState = { ...GameState, "turn": !GameState.turn },
                newState.squares[pos] = "X",
                GameState = newState,
                setTimeout(() => cpuPlay())
            )
                :
                (
                    newState = { ...GameState, "turn": !GameState.turn },
                    newState.squares[pos] = "O",
                    GameState = newState

                );
            // update the dom
            updateDom(target, pos)
            // check for winner
            checkWinner(GameState.squares);
            // check if all boxes are used
            checkBox()
        }
    }));

    // add event listener tp the continue btn
    cont_btn.addEventListener("click", () => {
        document.querySelector(".result-won").style.top = "-100em";
        clearSquares();
    })
}


