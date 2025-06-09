import React, { useState, useEffect, useRef } from "react";
import type { GameState } from "../../../types";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;

export const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    ball: { x: 400, y: 200, dx: 4, dy: 3 },
    playerPaddle: { y: 150 },
    aiPaddle: { y: 150 },
    score: { player: 0, ai: 0 },
    gameRunning: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const gameLoop = () => {
      if (!gameState.gameRunning) return;

      setGameState((prevState) => {
        let newState = { ...prevState };

        // Mouvement de la balle
        newState.ball.x += newState.ball.dx;
        newState.ball.y += newState.ball.dy;

        // Rebond sur les murs haut/bas
        if (
          newState.ball.y <= 0 ||
          newState.ball.y >= CANVAS_HEIGHT - BALL_SIZE
        ) {
          newState.ball.dy = -newState.ball.dy;
        }

        // Collision avec la raquette du joueur
        if (
          newState.ball.x <= PADDLE_WIDTH &&
          newState.ball.y >= newState.playerPaddle.y &&
          newState.ball.y <= newState.playerPaddle.y + PADDLE_HEIGHT
        ) {
          newState.ball.dx = -newState.ball.dx;
        }

        // Collision avec la raquette de l'IA
        if (
          newState.ball.x >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
          newState.ball.y >= newState.aiPaddle.y &&
          newState.ball.y <= newState.aiPaddle.y + PADDLE_HEIGHT
        ) {
          newState.ball.dx = -newState.ball.dx;
        }

        // IA simple - suit la balle
        const aiCenter = newState.aiPaddle.y + PADDLE_HEIGHT / 2;
        const ballCenter = newState.ball.y + BALL_SIZE / 2;
        if (aiCenter < ballCenter - 5) {
          newState.aiPaddle.y = Math.min(
            newState.aiPaddle.y + 3,
            CANVAS_HEIGHT - PADDLE_HEIGHT
          );
        } else if (aiCenter > ballCenter + 5) {
          newState.aiPaddle.y = Math.max(newState.aiPaddle.y - 3, 0);
        }

        // Point marqué
        if (newState.ball.x < 0) {
          newState.score.ai++;
          newState.ball = {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            dx: 4,
            dy: 3,
          };
        } else if (newState.ball.x > CANVAS_WIDTH) {
          newState.score.player++;
          newState.ball = {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            dx: -4,
            dy: 3,
          };
        }

        return newState;
      });

      animationId = requestAnimationFrame(gameLoop);
    };

    if (gameState.gameRunning) {
      gameLoop();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameState.gameRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Effacer le canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Ligne centrale
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.setLineDash([]);

    // Raquette joueur
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(0, gameState.playerPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Raquette IA
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(
      CANVAS_WIDTH - PADDLE_WIDTH,
      gameState.aiPaddle.y,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );

    // Balle
    ctx.fillStyle = "#fff";
    ctx.fillRect(gameState.ball.x, gameState.ball.y, BALL_SIZE, BALL_SIZE);

    // Score
    ctx.font = "24px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(gameState.score.player.toString(), CANVAS_WIDTH / 4, 50);
    ctx.fillText(gameState.score.ai.toString(), (3 * CANVAS_WIDTH) / 4, 50);
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameState.gameRunning) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    setGameState((prev) => ({
      ...prev,
      playerPaddle: {
        y: Math.max(
          0,
          Math.min(mouseY - PADDLE_HEIGHT / 2, CANVAS_HEIGHT - PADDLE_HEIGHT)
        ),
      },
    }));
  };

  const startGame = () => {
    setGameState((prev) => ({ ...prev, gameRunning: true }));
  };

  const stopGame = () => {
    setGameState((prev) => ({ ...prev, gameRunning: false }));
  };

  const resetGame = () => {
    setGameState({
      ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 4, dy: 3 },
      playerPaddle: { y: 150 },
      aiPaddle: { y: 150 },
      score: { player: 0, ai: 0 },
      gameRunning: false,
    });
  };

  return (
    <div className="text-center">
      <div className="mb-4 space-x-4">
        <button
          onClick={startGame}
          disabled={gameState.gameRunning}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg"
        >
          Démarrer
        </button>
        <button
          onClick={stopGame}
          disabled={!gameState.gameRunning}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-2 rounded-lg"
        >
          Pause
        </button>
        <button
          onClick={resetGame}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Reset
        </button>
      </div>

      <div className="inline-block border-2 border-gray-600 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseMove={handleMouseMove}
          className="block cursor-none"
        />
      </div>

      <p className="mt-4 text-gray-400">
        Déplacez votre souris pour contrôler la raquette bleue
      </p>
    </div>
  );
};
