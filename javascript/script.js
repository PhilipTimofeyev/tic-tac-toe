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

	const game = gameboard()

	let rounds = 3
	let currentRound = 1;
	let player1 = createPlayer("Player 1")
	let player2 = createPlayer("Player 2")

	let dom = domElements()

	player1.setMarker("X")
	player2.setMarker("O")
	player1.domScore = dom.player1Score
	player2.domScore = dom.player2Score

	dom.player1Name.addEventListener("input", updateName);
	dom.player2Name.addEventListener("input", updateName);

	const resetBtn = document.getElementById("reset-board")

	function updateName(e) {
		if (e.target.id === "player1-name") {
			player1.name = e.target.value;
		} else {
			player2.name = e.target.value;
		}
	}

	let players = [player1, player2]

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
		if (players[0].marker === 'X') {
			dom.score.childNodes[1].style.background="green"
			dom.score.childNodes[3].style.background="none"
		} else {
			dom.score.childNodes[3].style.background="green"
			dom.score.childNodes[1].style.background="none"
		}
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

	resetBtn.addEventListener('click', function() {
		game.resetBoard();
		addClick(game)
		resetPlayerScore()
		resetDisplayWinner()
		resetRound()
		players = [player1, player2]
		dom.score.childNodes[1].style.background="green"
		dom.score.childNodes[3].style.background="none"
		dom.nextRoundBtn.style.visibility = "hidden"
	})

	dom.nextRoundBtn.addEventListener('click', function() {
		game.resetBoard();
		dom.score;
		addClick(game);
		addRound();
		resetDisplayWinner();
		player1.domScore.innerText = player1.score;
		player2.domScore.innerText = player2.score;
		this.style.visibility="hidden"
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
			dom.nextRoundBtn.style.visibility = "visible"
		} else if (game.boardFull()) {
			setDraw()
			dom.nextRoundBtn.style.visibility = "visible"
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
		dom.score.childNodes[1].style.background="green"
		addClick(game)
	}

	playRound()
})

domElements = (function () {

	// Round Info
	const round = document.getElementById("round")

	// Player Info
	const player1Score = document.getElementById("p1-score")
	const player2Score = document.getElementById("p2-score")
	const player1Name = document.getElementById("player1-name")
	const player2Name = document.getElementById("player2-name")

	// Winner Display
	const displayWinner = document.getElementById("display-winner")

	// Reset Buttons
	const nextRoundBtn = document.getElementById("next-round-btn")

	// Score
	const score = document.getElementById("score")

	return {
		player1Score, player2Score, round, nextRoundBtn, displayWinner, player1Name, player2Name, score
	}
})

gamePlay()








