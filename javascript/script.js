gameboard = (function () {
 
  let board = {
 		"A1": "X", "A2":"X", "A3":"O",
 		"B1": "O", "B2":"O", "B3":"X",
 		"C1": " ", "C2":" ", "C3":"O"
  };

  const markSquare = (square, marker) => board[square] = marker;

  const drawBoard = () => {
  	console.log("-------------------")
  	console.log("|  " + Object.values(board).slice(0, 3).join("  |  ") + "  |")
  	console.log("-------------------")
  	console.log("|  " + Object.values(board).slice(3, 6).join("  |  ") + "  |")
  	console.log("-------------------")
  	console.log("|  " + Object.values(board).slice(6, 9).join("  |  ") + "  |")
  	console.log("-------------------")
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

  const boardNotFull = () => Object.values(board).some((marker) => marker === " " )

  return {
  	markSquare,
  	winner,
  	drawBoard,
  	boardNotFull
  	}
})

function createPlayer (playerName) {
	const name = playerName
	let marker = ""

	const setMarker = function(mark) {
		this.marker = mark
	}

	return {name, marker, setMarker}
}

gamePlay = (function() {

	const game = gameboard()

	let player1 = createPlayer("Billy")
	let player2 = createPlayer("Bob")

	player1.setMarker("X")
	player2.setMarker("O")

	const players = [player1, player2]

	game.drawBoard()

	while (game.winner() || game.boardNotFull()) {
		let currentPlayer = players[0]
		let response = prompt(`${currentPlayer.name}, please select a square:`)
		game.markSquare(response, currentPlayer.marker)
		game.drawBoard()
		players.reverse()

		if (game.winner(player1.marker)) return
	}
})

gamePlay()
