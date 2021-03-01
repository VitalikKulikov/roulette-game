import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import { PI2, TICK } from "../services/consts";
import { getRandomItem } from "../services/getRandomItem";
import styles from "../styles/Home.module.css";
import {
  getLeftTransition,
  getTopTransition,
} from "../services/getTransitions";

export default function Home({ winWheelItems }) {
  const [loading, setLoading] = useState(false);
  const [gameResults, setGameResults] = useState([]);

  const ball = useRef(null);

  const startGame = useCallback((color) => {
    setLoading(true);

    const item = getRandomItem(winWheelItems);
    const block = ball.current;
    let currentAngle = -1.3;
    let ms = 0;
    const completedLaps = Math.floor(Math.random() * (5 - 3) + 3);

    stopGame(block, currentAngle, ms, completedLaps, item, color);
  }, []);

  const stopGame = useCallback(
    (block, currentAngle, ms, completedLaps, item, color) => {
      const time = setInterval(() => {
        block.style.left = getTopTransition(currentAngle);
        block.style.top = getLeftTransition(currentAngle);
        currentAngle += TICK;

        if (currentAngle >= PI2) {
          currentAngle -= PI2;
        } else if (currentAngle < 0) {
          currentAngle += PI2;
        }
        ms += 20;

        if (ms >= 20 * 37 * completedLaps + item.time) {
          clearInterval(time);
          const status = item.color === color ? "You Won" : "You Lose";
          // setGameResults((state) => [status, ...state]);
          setGameResults((state) => [status, ...state].slice(0, 10));
          setLoading(false);
        }
      }, 20);
    },
    []
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Roulette Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.wrapper}>
          <div className={styles.winWheelWrapper}>
            <Image
              src="/roulette.png"
              alt="roulette"
              width={500}
              height={500}
            />
            <div className={styles.ball} ref={ball} />
          </div>
          <div className={styles.bottomPart}>
            <h2>What color are you betting on?</h2>
            <div className={styles.buttonsWrapper}>
              <button
                onClick={() => startGame("red")}
                disabled={loading}
                className={styles.buttonRed}
              >
                Red
              </button>
              <button
                onClick={() => startGame("black")}
                disabled={loading}
                className={styles.buttonBlack}
              >
                Black
              </button>
            </div>
            <div className={styles.resultsWrapper}>
              <p>10 Last Results</p>
              {!!gameResults.length &&
                gameResults.map((result, index) => (
                  <div key={index} className={styles.resultItem}>
                    {result}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const res = await fetch("http://localhost:3000/api/win_whell_items");
  const data = await res.json();

  return {
    props: {
      winWheelItems: data,
    },
  };
}
