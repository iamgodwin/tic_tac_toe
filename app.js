

let GameState = {
    score: [0, 0],
    squares: Array(9).fill(null),
    turn: true,
    winner: false,
    last_winner: null,
    music: false
}

self.onload = () => Start();
let bg_song = new Audio("./assets/audio/189.mp3");
self.document.body.addEventListener("click", () => {
    if (GameState.music === false) {
        bg_song.play();
        bg_song.onended = () => {
            bg_song.play();
        }
    }
});
self.document.body.click();

GameState.music = true;



function checkWinner(squares) {
    const board = document.querySelector(".board");
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

    // check if entries in layout are same from squares
    layout.forEach(e => {
        const [a, b, c] = e;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
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

            // prevent clicks
            board.style.pointerEvents = "none";
            // animateDome
            animateDom(a, b, c);
            return squares[a];
        }
        else {
            return null
        }
    });
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
}

function checkBox() {
    if (!GameState.squares.includes(null) && GameState.winner == false) {
        newState = { ...GameState, "squares": Array(9).fill(null) };
        GameState = newState;
        setTimeout(() => clearSquares(), 500);
    }
}

function Start() {
    // start song
    bg_song.play();
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
                GameState = newState
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


