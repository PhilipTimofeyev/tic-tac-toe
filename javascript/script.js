gameboard = (function () {
 
  let board = {
 		"A1": "X", "A2":"X", "A3":"X",
 		"B1": "X", "B2":"", "B3":"",
 		"C1": "O", "C2":"", "C3":""
  };

  const setMarker = function(square, marker) {
  	board[square] = marker
  }

  let color = "black";

  const changeColor = () => {
    color = "white"
  };


  // let showBoard = () => board

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



 
  return {
  	rows: (marker) => rowWinner(marker),
  	columns: (marker) => columnWinner(marker),
  	setMarker,
  	board
  	}
})

const game = gameboard()

console.log(game.board)
game.setMarker("C1", "X")
console.log(game.board)
console.log(game.columns("X"))



