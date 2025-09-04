"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./Coin.module.css";

type Side = "chog" | "molandak";

type CoinProps = {
  side: Side;
  flipping: boolean;
  chogImage?: string;      // ruta imagen chog
  molandakImage?: string;  // ruta imagen molandak
};

export default function Coin({ side, flipping, chogImage, molandakImage }: CoinProps) {
  return (
    <motion.div
      className={styles.coin}
      animate={flipping ? { rotateY: 1800 } : { rotateY: side === "chog" ? 0 : 180 }}
      transition={{ duration: flipping ? 2 : 0.6, ease: "easeInOut" }}
    >
      <div className={styles.front}>
        {chogImage ? (
          <Image
            src={chogImage}
            alt="Chog"
            width={120}
            height={120}
            className={styles.img}
          />
        ) : (
          "Chog"
        )}
      </div>

      <div className={styles.back}>
        {molandakImage ? (
          <Image
            src={molandakImage}
            alt="Molandak"
            width={120}
            height={120}
            className={styles.img}
          />
        ) : (
          "Molandak"
        )}
      </div>
    </motion.div>
  );
}
