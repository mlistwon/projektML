var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const huPlayer2 = 'X';
var p1Turn = true;
var modeID = 0;
var whoWon = null;
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    modeID = null;
    whoWon = null;
    document.querySelector(".endgame").innerText= '';
    if(document.getElementById('single').checked){
        modeID=0;
    } else {
        modeID=1;
    }
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, huPlayer)
        if (modeID==0) {
            if (!checkTie()) turn(bestSpot(), aiPlayer);
        } else {
            if(p1Turn){
                p1Turn=false;
                if (!checkTie()) turn(square.target.id, huPlayer2)
            } else {
                p1Turn=true;
                if (!checkTie()) turn(square.target.id, huPlayer)
            }

        }
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
    }
        declareWinner(gameWon.player == huPlayer ? "Kółko" : "Krzyżyk");
	
}

function declareWinner(who) {
    whoWon = who
    document.querySelector(".endgame").innerText = who + " Wygrywa!";
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return emptySquares()[0];
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Remis!, nikt nie")
		return true;
	}
	return false;
}