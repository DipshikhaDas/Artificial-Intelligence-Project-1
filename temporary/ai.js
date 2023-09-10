const MAX_DEPTH = 5;

function evaluate(board, player, maximizingPlayer) {
  if (player === "human") {
    if (maximizingPlayer) {
        return board.aiPoints - board.humanPoints;
    } else {
        return board.humanPoints - board.aiPoints;
    }
  } else {
    if (maximizingPlayer) {
        return board.humanPoints - board.aiPoints;
    } else {
        return board.aiPoints - board.humanPoints;
    }
  }
}
let aiCurrentPlayer = "ai";

function changeAiCurrentPlayer(player) {
  aiCurrentPlayer = player;
}
function getAiCurrentPlayer() {
  return aiCurrentPlayer;
}

function aiMove() {
  changeAiCurrentPlayer(currentPlayer);
  const posisbleMoves = board.allPossibleMoves(aiCurrentPlayer);

  let bestMoves = [];
  let bestScore = -Infinity;

  for (const move of posisbleMoves) {
    const tempBoard = board.clone();
    // console.log(board);
    // console.log("tempboard", tempBoard);
    const ret = tempBoard.movePiece(
      move.fromRow,
      move.fromCol,
      move.toRow,
      move.toCol,
      getAiCurrentPlayer()
    );
    // console.log(ret);
    if (!ret.status) {
      const score = minimax(
        tempBoard,
        MAX_DEPTH - 1,
        -Infinity,
        Infinity,
        false
      );
      // console.log(score);
      if (score >= bestScore) {
        if (score === bestScore) {
          bestMoves.push(move);
        } else if (score > bestScore) {
          bestScore = score;
          bestMoves = [];
          bestMoves.push(move);
        }
      }
    }
  }

  const len = bestMoves.length;
  const idx = Math.floor(Math.random() * len);

  console.log(bestMoves);
  const bestMove = bestMoves[idx];
  console.log(bestMove);
  movePieces(
    bestMove.fromRow,
    bestMove.fromCol,
    bestMove.toRow,
    bestMove.toCol
  );
}

function minimax(board, depth, alpha, beta, maximizingPlayer) {
  if (depth === 0) {
    return evaluate(board, getAiCurrentPlayer(), maximizingPlayer);
  }

  const possibleMoves = board.allPossibleMoves(getAiCurrentPlayer());

  if (maximizingPlayer) {
    let maxScore = -Infinity;

    for (const move of possibleMoves) {
      const tempBoard = board.clone();
      const ret = tempBoard.movePiece(
        move.fromRow,
        move.fromCol,
        move.toRow,
        move.toCol,
        getAiCurrentPlayer()
      );

      if (!ret.status) {
        if (getAiCurrentPlayer() === "human") {
          changeAiCurrentPlayer("ai");
        } else {
          changeAiCurrentPlayer("human");
        }
        const score = minimax(tempBoard, depth - 1, alpha, beta, false);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) {
          break;
        }
      }
    }
    return maxScore;
  } else {
    let minScore = Infinity;

    for (const move of possibleMoves) {
      const tempBoard = board.clone();
      const ret = tempBoard.movePiece(
        move.fromRow,
        move.fromCol,
        move.toRow,
        move.toCol,
        getAiCurrentPlayer()
      );

      if (!ret.status) {
        if (getAiCurrentPlayer() === "human") {
          changeAiCurrentPlayer("ai");
        } else {
          changeAiCurrentPlayer("human");
        }
        const score = minimax(tempBoard, depth - 1, alpha, beta, true);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) {
          break;
        }
      }
    }
    return minScore;
  }
}
