gameboard = (function () {
 
  let board = {
 		"A1": "X", "A2":"X", "A3":"O",
 		"B1": "X", "B2":" ", "B3":" ",
 		"C1": " ", "C2":" ", "C3":" "
  };

  const setMarker = (square, marker) => board[square] = marker;

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

  return {
  	setMarker,
  	winner,
  	drawBoard
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

const game = gameboard()

// game.drawBoard()
// console.log(game.winner("X"))
// game.setMarker("C1", "X")
// game.drawBoard()
// console.log(game.winner("X"))

player1 = createPlayer("Billy")
console.log(player1.name)
console.log(player1.marker)
player1.setMarker("Y")
console.log(player1.marker)


player2 = createPlayer("Lol")
console.log(player2.name)
console.log(player2.marker)
player2.setMarker("X")
console.log(player2.marker)