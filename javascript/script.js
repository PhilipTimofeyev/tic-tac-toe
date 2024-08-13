gameboard = (function () {

  let board = {
 		"A1": " ", "A2":" ", "A3":" ",
 		"B1": " ", "B2":" ", "B3":" ",
 		"C1": " ", "C2":" ", "C3":" "
  };

  const drawBoard = () => {
  	console.log("-------------------")
  	console.log("|  " + Object.values(board).slice(0, 3).join("  |  ") + "  |")
  	console.log("-------------------")
  	console.log("|  " + Object.values(board).slice(3, 6).join("  |  ") + "  |")
  	console.log("-------------------")
  	console.log("|  " + Object.values(board).slice(6, 9).join("  |  ") + "  |")
  	console.log("-------------------")
  }

  const markSquare = (square, marker) => {
  	let squareID = square.id
  	board[squareID].innerText = marker;
  }

  const checkSquare = (square) => {
  	let squareID = square.id
  	return board[squareID].innerText === "";
  }

  // Select specific row/column with specific marker.

  // const row = (letter, marker) => Object.entries(board).filter(([key, value]) => key[0] === (letter) && value === marker);

  const row = (letter, marker) => Object.entries(board).filter(([key, value]) => (key[0] === letter) && (value.innerText === marker));

  const column = (number, marker) => Object.entries(board).filter(([key, value]) => key[1] === (number) && (value.innerText === marker));

  // Iterate through each row/column and check if there are 3 of the same marker.

  const rowWinner = function(marker) {
    let rowLetter = ["A", "B", "C"]
    return rowLetter.some((letter) => row(letter, marker).length === 3)
  };

  const columnWinner = function(marker) {
    let colNumber = ["1", "2", "3"]
    return colNumber.some((number) => column(number, marker).length === 3)
  };

  const diagWinner = function(marker) {
  	return ((board["A1"].innerText == marker) && (board["B2"].innerText == marker) && (board["C3"].innerText == marker)) ||
  	((board["A3"].innerText == marker) && (board["B2"].innerText == marker) && (board["C1"].innerText == marker))
  }

  const winner = function(marker) {
  	return rowWinner(marker) || columnWinner(marker) || diagWinner(marker)
  }

  const boardFull = () => {
  	return !Object.values(board).some((marker) => { return marker.innerText === ""})
	}

  // Assign DOM elements

  const domBoard = document.querySelectorAll("span")

  function resetBoard() {
  	Object.entries(board).forEach(function(key, idx) {
  		board[key[0]] = domBoard[idx]
  		domBoard[idx].innerText = ""
  	})
  }

  return {markSquare, checkSquare, winner, drawBoard, boardFull, board, resetBoard}
})

function createPlayer (playerName) {
	const name = playerName
	let domScore
	let marker = ""
	let score = 0

	const win = function() {
		this.score ++;
		this.domScore.innerText = this.score
	}

	const setMarker = function(mark) {
		this.marker = mark
	}

	const resetScore = function() {
		this.score = 0;
		this.domScore.innerText = this.score
	}

	return {name, marker, setMarker, win, score, domScore, resetScore}
}

gamePlay = (function() {

	let rounds = 2
	let currentRound = 1;
	let player1 = createPlayer("Billy")
	let player2 = createPlayer("Bob")

	let dom = domElements()

	player1.setMarker("X")
	player2.setMarker("O")
	player1.domScore = dom.player1Score
	player2.domScore = dom.player2Score

	const players = [player1, player2]

	const addRound = (function () {
	 return function () {
	   currentRound += 1;
	   dom.round.innerText = `Round: ${currentRound}`
	 };
	})();

	function resetPlayerScore() {
		players.forEach((player) => {
			player.resetScore()
		})
	}

	function reversePlayers() {
		players.reverse()
	}

	function playerTurn(game, square, marker) {
		if (game.checkSquare(square)) {
			game.markSquare(square, marker);
			reversePlayers();
		}
	}

	function setDraw() {
		dom.displayWinner.innerText = "Draw";
	}

	const addClick = (game) => {
		Object.values(game.board).forEach(function (square, idx) {
  		square.addEventListener("click", handleClick)
  	});
	}

	const removeClick = (game) => {
		Object.values(game.board).forEach(function (square, idx) {
  		square.removeEventListener("click", handleClick)
  	});
	}

	const game = gameboard()

	const resetBtn = document.getElementById("reset-board")

	resetBtn.addEventListener('click', function() {
		game.resetBoard();
		addClick(game)
		resetPlayerScore()
		resetDisplayWinner()
		resetRound()
	})

	dom.nextRoundBtn.addEventListener('click', function() {
		game.resetBoard();
		addClick(game)
		addRound()
		resetDisplayWinner()
		player1.domScore.innerText = player1.score
		player2.domScore.innerText = player2.score
	})

	function handleClick() {
		playerTurn(game, this, players[0].marker);

		if (currentRound >= rounds && (game.winner(players[1].marker) || game.boardFull())) {
			removeClick(game);
			if (game.winner(players[1].marker)) updateScore(players[1])
			dom.displayWinner.innerText = gameWinner()
		} else if (game.winner(players[1].marker)) {
			removeClick(game)
			updateScore(players[1])
		} else if (game.boardFull()) {
			setDraw()
		}
	}

	function resetRound() {
		currentRound = 1;
		dom.round.innerText = `Round: ${currentRound}`
	}

	function updateScore(player) {
		player.win();
		dom.displayWinner.innerText = `${player.name} wins the round!`
	}

	const gameWinner = () => {
		let winner

		if (player1.score > player2.score) {
			winner = `${player1.name} wins the game!`
		} else if (player1.score < player2.score) {
			winner = `${player2.name} wins the game!`
		} else {
			winner = "The game is a draw!"
		}
		return winner
	}

	function resetDisplayWinner() {
		dom.displayWinner.innerText = ""
	}

	const playRound = () => {
		game.resetBoard()
		addClick(game)
	}
})

domElements = (function () {

	// Round Info
	const round = document.getElementById("round")

	// Player Info
	const player1Score = document.getElementById("p1-score")
	const player2Score = document.getElementById("p2-score")

	// Winner Display
	const displayWinner = document.getElementById("display-winner")

	// Reset Buttons
	const nextRoundBtn = document.getElementById("next-round-btn")

	return {
		player1Score, player2Score, round, nextRoundBtn, displayWinner
	}
})

gamePlay()








