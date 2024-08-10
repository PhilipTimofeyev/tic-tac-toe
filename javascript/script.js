gameboard = (function () {
 
  let board = {
 		"A1": "X", "A2":" ", "A3":"O",
 		"B1": "X", "B2":" ", "B3":"X",
 		"C1": " ", "C2":" ", "C3":"O"
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
  	board[square] = marker;
  }

  const checkSquare = (square) => {
  	return board[square] === " ";
  }


  // Select specific row/column with specific marker.

  const row = (letter, marker) => Object.entries(board).filter(([key, value]) => key[0] === (letter) && value === marker);
  const column = (number, marker) => Object.entries(board).filter(([key, value]) => key[1] === (number) && value === marker);

  // Iterate through each row/column and check if there are 3 of the same marker.

  const rowWinner = function(marker) {
    let rowLetter = ["A", "B", "C"]
    return rowLetter.some((letter) => row(letter, marker).length === 3)
  };

  const columnWinner = function(marker) {
    let colNumber = ["1", "2", "3"]
    return colNumber.some((number) => column(number, marker).length === 3)
  };

  const winner = function(marker) {
  	return rowWinner(marker) || columnWinner(marker)
  }

  const boardFull = () => !Object.values(board).some((marker) => marker === " " )

  return {markSquare, checkSquare, winner, drawBoard, boardFull}
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

	let rounds = 3

	let player1 = createPlayer("Billy")
	let player2 = createPlayer("Bob")
	let currentPlayer

	player1.setMarker("X")
	player2.setMarker("O")

	const players = [player1, player2]

	const playerResponse = (game) => {
		let response

		while (true) {
			response = prompt(`${currentPlayer.name}, please select a square:`)
			if (game.checkSquare(response)) break
			console.log("please enter valid square")
		}

		game.markSquare(response, currentPlayer.marker)
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
		// return

		game.drawBoard()

		while (!game.boardFull()) {
			currentPlayer = players[0]
			playerResponse(game)
			game.drawBoard()
			if (game.winner(player1.marker)) break
			players.reverse()
		}

		if (game.boardFull()) {
			console.log("Draw!")
		} else {
			currentPlayer.win()
			console.log(`${currentPlayer.name} is the winner with a score of ${currentPlayer.score}!`)
		}
	}


	for (let i = 0; i < rounds; i++) {
		playRound()
	}

	console.log(gameWinner())

})

gamePlay()
