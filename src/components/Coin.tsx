"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./Coin.module.css";

type CoinProps = {
side: "heads" | "tails";
flipping: boolean;
headsImage?: string; // ruta imagen heads
tailsImage?: string; // ruta imagen tails
};

export default function Coin({ side, flipping, headsImage, tailsImage }: CoinProps) {
return (
<motion.div
className={styles.coin}
animate={flipping ? { rotateY: 1800 } : { rotateY: side === "heads" ? 0 : 180 }}
transition={{ duration: flipping ? 2 : 0.6, ease: "easeInOut" }}
>
<div className={styles.front}>
{headsImage ? (
<Image
src={headsImage}
alt="Heads"
width={120} // ancho de la moneda
height={120} // alto de la moneda
className={styles.img}
/>
) : (
"Heads"
)}

</div> <div className={styles.back}> {tailsImage ? ( <Image src={tailsImage} alt="Tails" width={120} height={120} className={styles.img} /> ) : ( "Tails" )} </div> </motion.div> ); }
