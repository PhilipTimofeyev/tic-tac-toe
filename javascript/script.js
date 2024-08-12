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
  	console.log(board["A1"].innerText)
  	return ((board["A1"].innerText == marker) && (board["B2"].innerText == marker) && (board["C3"].innerText == marker)) ||
  	((board["A3"].innerText == marker) && (board["B2"].innerText == marker) && (board["C1"].innerText == marker))
  }

  const winner = function(marker) {
  	console.log(rowWinner(marker))
  	return rowWinner(marker) || columnWinner(marker) || diagWinner(marker)
  }

  const boardFull = () => {
  	return !Object.values(board).some((marker) => { return marker.innerText === ""})
	}

  // Assign DOM elements to board object

  const domBoard = document.querySelectorAll("span")

  Object.entries(board).forEach(function(key, idx) {
  	board[key[0]] = domBoard[idx]
  })

  return {markSquare, checkSquare, winner, drawBoard, boardFull, board}
})

function createPlayer (playerName) {
	const name = playerName
	let marker = ""
	let score = 0

	const win = function() {
		this.score ++;
	}

	const setMarker = function(mark) {
		this.marker = mark
	}

	return {name, marker, setMarker, win, score}
}

gamePlay = (function() {

	let rounds = 1

	let player1 = createPlayer("Billy")
	let player2 = createPlayer("Bob")
	let currentPlayer

	player1.setMarker("X")
	player2.setMarker("O")

	const players = [player1, player2]

	// const playerResponse = (game) => {
		// let response

		// while (true) {
			// response = prompt(`${currentPlayer.name}, please select a square:`)
			// if (game.checkSquare(response)) break
			// console.log("please enter valid square")
		// }

		// game.markSquare(response, currentPlayer.marker)
	// }

	function reversePlayers() {
		players.reverse()
	}

	function playerTurn(game, square, marker) {
		if (game.checkSquare(square)) {
			game.markSquare(square, marker);
			reversePlayers();
		}
	}


	const playerResponse = (game) => {
		Object.values(game.board).forEach(function (square, idx) {
  		square.addEventListener("click", function() {
    		playerTurn(game, square, players[0].marker);
    		if (game.boardFull()) {
    			alert("board Full");
    		} else if (game.winner(players[0].marker)) {
    			alert("winner")
    		};
			});
  	});
	}

	const gameWinner = () => {
		let winner

		if (player1.score > player2.score) {
			winner = player1
		} else if (player1.score < player2.score) {
			winner = player2
		}
		return winner
	}

	const playRound = () => {
		const game = gameboard()

		// game.drawBoard()
		// while (!game.boardFull()) {

			playerResponse(game)
			// console.log(game.boardFull())
		// 	playerResponse(game)
		// 	game.drawBoard()
		// 	if (game.winner(currentPlayer.marker)) break
			// players.reverse()
		// }

		// if (game.boardFull()) {
		// 	console.log("Draw!")
		// } else {
		// 	currentPlayer.win()
		// 	console.log(`${currentPlayer.name} is the winner with a score of ${currentPlayer.score}!`)
		// }
	}


	for (let i = 0; i < rounds; i++) {
		playRound()
	}

	// console.log(gameWinner())

})

gamePlay()








