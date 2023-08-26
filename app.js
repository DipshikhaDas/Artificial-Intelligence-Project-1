const gameBoard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#pieces")
const infoDisplay = document.querySelector("#info-display")


const startPieces = [
   king, queen, bishop, knight, rook,
   pawn, pawn, pawn, pawn, pawn,
   '', '', '', '', '',
   '', '', '', '', '',
   pawn, pawn, pawn, pawn, pawn,
   king, queen, bishop, knight, rook
]



// function createBoard(){
//     startPieces.forEach((startPiece, i) =>{
//         const square = document.createElement('div')
//         square.innerHTML = startPiece
//         square.setAttribute('square-id', i)

//         const row = Math.floor((63-i) / 8) + 1
        
//         if(row%2 ===0){
//             square.classList.add(i%2 ===0 ? "green" : "gray")
//         }else{
//             square.classList.add(i%2 ===0 ? "gray" : "green")
//         }
//         square.classList.add('square')
//         gameBoard.append(square)

//         if(i<=15){
//            square.firstChild.firstChild.classList.add('black') 
//         }
        
//         if(i>=48){
//             square.firstChild.firstChild.classList.add('white')
//         }
//     })
// }

function createBoard(){
    startPieces.forEach((startPiece, i) =>{
        const square = document.createElement('div');
        square.innerHTML = startPiece;
        square.setAttribute('square-id', i);

        const row = Math.floor((29-i) / 5);
        const col = i % 5;

        square.setAttribute('row-id', row);
        square.setAttribute('col-id', col);
                        
        if(row%2 === 0){
            square.classList.add(i%2 === 0 ? "gray" : "green");
        }else{
            square.classList.add(i%2 === 0 ? "gray" : "green");
        }
        square.classList.add('square');
        gameBoard.append(square);

        if(i<=9){
           square.firstChild.firstChild.classList.add('black') 
        }
        
        if(i>=20){
            square.firstChild.firstChild.classList.add('white')
        }
    })
}


createBoard();