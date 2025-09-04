"use client";
import { usePublicClient } from "wagmi";
import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { decodeEventLog } from "viem";
import Coin from "../../components/Coin";
import Button from "../../components/Button";
import hubStyles from "../../components/hub.module.css";
import { coinflipAbi } from "../../utils/coinflipAbi";

const COINFLIP_ADDRESS = "0xd360f5632f9727cd7bd00a0e35563b25c6ff2326";
const BETS = [0.1, 0.25, 0.5, 1, 3, 5] as const;

type Side = "chog" | "molandak";

type PlayedEventArgs = {
  player: `0x${string}`;
  amount: bigint;
  win: boolean;
  choice: boolean;   // true = heads elegido
  outcome: boolean;  // true = heads resultado
};

export default function CoinflipPage() {
  const client = usePublicClient();
  const { address } = useAccount();
  const currentChainId = useChainId();

  const [localBalance, setLocalBalance] = useState<number>(0);
  const [selection, setSelection] = useState<Side>("chog");
  const [coinSide, setCoinSide] = useState<Side>("chog");
  const [flipping, setFlipping] = useState(false);
  const [bet, setBet] = useState<number>(0.1);
  const [depositAmount, setDepositAmount] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [flipMessage, setFlipMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  // --------- Balance on-chain ----------
  const { data: gameBalance, refetch: refetchBalance } = useReadContract({
    address: COINFLIP_ADDRESS,
    abi: coinflipAbi,
    functionName: "getBalance",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  useEffect(() => {
    if (gameBalance !== undefined && gameBalance !== null) {
      setLocalBalance(Number(gameBalance) / 1e18);
    }
  }, [gameBalance]);

  // --------- Contract functions ----------
  const { writeContract: deposit, isPending: isDepositing } = useWriteContract();
  const { writeContract: claim, isPending: isClaiming } = useWriteContract();
  const { writeContractAsync: playAsync, isPending: isPlaying } = useWriteContract();

  // --------- Esperar receipt ----------
  const { data: receipt, isLoading: waitingReceipt } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 0,
  });

  useEffect(() => {
    console.log("=== DEBUG COINFLIP ===");
    console.log("ChainId (from wallet):", currentChainId);
    console.log("TxHash:", txHash);
    console.log("waitingReceipt:", waitingReceipt);
    console.log("Receipt object:", receipt);
  }, [currentChainId, txHash, waitingReceipt, receipt]);

  // --------- Depósito ----------
  const handleDeposit = async () => {
    if (!depositAmount || isNaN(Number(depositAmount))) return;
    const amountInWei = BigInt(Math.floor(Number(depositAmount) * 1e18));
    await deposit({
      address: COINFLIP_ADDRESS,
      abi: coinflipAbi,
      functionName: "deposit",
      args: [amountInWei],
    });
    setDepositAmount("");
    await refetchBalance();
  };

  // --------- Claim ----------
  const handleClaim = async () => {
    if (!claimAmount || isNaN(Number(claimAmount))) return;
    const amountInWei = BigInt(Math.floor(Number(claimAmount) * 1e18));
    await claim({
      address: COINFLIP_ADDRESS,
      abi: coinflipAbi,
      functionName: "withdraw",
      args: [amountInWei],
    });
    setClaimAmount("");
    await refetchBalance();
  };

  // --------- Flip ----------
  const handleFlip = async () => {
    if (flipping || isPlaying || waitingReceipt) return;
    setFlipMessage(null);

    try {
      const hash = await playAsync({
        address: COINFLIP_ADDRESS,
        abi: coinflipAbi,
        functionName: "play",
        args: [BigInt(Math.floor(bet * 1e18)), selection === "chog"],
      });
      setTxHash(hash as `0x${string}`);
    } catch {
      setTxHash(undefined);
      setFlipMessage("❌ Transaction failed or cancelled.");
    }
  };

  // --------- Procesar receipt ----------
  useEffect(() => {
    if (!receipt) return;

    if (receipt.status !== "success") {
      setFlipMessage("❌ Transaction reverted.");
      setFlipping(false);
      setTxHash(undefined);
      refetchBalance();
      return;
    }

    let playedArgs: PlayedEventArgs | null = null;
    for (const log of receipt.logs) {
      if (log.address.toLowerCase() !== COINFLIP_ADDRESS.toLowerCase()) continue;
      try {
        const decoded = decodeEventLog({
          abi: coinflipAbi,
          eventName: "Played",
          topics: log.topics,
          data: log.data,
        }) as { eventName: string; args: unknown };
        playedArgs = decoded.args as PlayedEventArgs;
        break;
      } catch {}
    }

    if (playedArgs) {
      const outcomeSide: Side = playedArgs.outcome ? "chog" : "molandak";
      setCoinSide(outcomeSide);
      setFlipping(true);

      setTimeout(() => {
        setFlipMessage(
          playedArgs.win
            ? `🎉 You chose ${selection.toUpperCase()} and WON!`
            : `😢 You chose ${selection.toUpperCase()} but result was ${outcomeSide.toUpperCase()}`
        );
        setFlipping(false);
        setTxHash(undefined);
        refetchBalance();
      }, 2000);
    } else {
      setFlipMessage("❌ Could not decode event.");
      setFlipping(false);
      setTxHash(undefined);
      refetchBalance();
    }
  }, [receipt, selection, refetchBalance]);

  const isBusy = isPlaying || waitingReceipt || flipping;
  const flipButtonLabel = isPlaying
    ? "Confirm in wallet..."
    : waitingReceipt
    ? "Waiting for confirmation..."
    : flipping
    ? "Flipping..."
    : "Flip Coin";

  // --------- JSX ----------
  return (
    <main className={hubStyles.page}>
      <h1>Monflip</h1>

      <div className={hubStyles.hub}>
        {/* Header con balance y depósitos */}
        <div className={hubStyles.hubHeader}>
          <div className={hubStyles.depositClaim}>
            <div className={hubStyles.formRow}>
              <input
                type="number"
                min="0"
                placeholder="Amount to deposit"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
              />
              <button
                onClick={handleDeposit}
                disabled={isDepositing || !depositAmount}
              >
                {isDepositing ? "Depositing..." : "Deposit"}
              </button>
            </div>

            <div className={hubStyles.formRow}>
              <input
                type="number"
                min="0"
                placeholder="Amount to claim"
                value={claimAmount}
                onChange={e => setClaimAmount(e.target.value)}
              />
              <button
                onClick={handleClaim}
                disabled={isClaiming || !claimAmount}
              >
                {isClaiming ? "Claiming..." : "Claim"}
              </button>
              <button
                onClick={() => setClaimAmount(localBalance.toString())}
                disabled={!localBalance}
              >
                Max
              </button>
            </div>
          </div>

          <div className={hubStyles.balanceBox}>
            BALANCE: {localBalance} wMON
          </div>
        </div>

        {/* Coin */}
        <Coin
          side={coinSide}
          flipping={flipping}
          chogImage="/heads.png"
          molandakImage="/tails.png"
        />

        {/* Heads / Tails */}
        <div className={hubStyles.sideSelector}>
          <Button
            variant={selection === "chog" ? "primary" : "ghost"}
            onClick={() => {
              setSelection("chog");
              setCoinSide("chog");
            }}
            disabled={isBusy}
          >
            Chog
          </Button>
          <Button
            variant={selection === "molandak" ? "primary" : "ghost"}
            onClick={() => {
              setSelection("molandak");
              setCoinSide("molandak");
            }}
            disabled={isBusy}
          >
            Molandak
          </Button>
        </div>

        {/* Apuestas */}
        <div className={hubStyles.betSelector}>
          {BETS.map(b => (
            <Button
              key={b}
              variant={bet === b ? "primary" : "ghost"}
              onClick={() => setBet(b)}
              disabled={isBusy}
            >
              {b} MON
            </Button>
          ))}
        </div>

        {/* Flip */}
        <Button onClick={handleFlip} disabled={isBusy}>
          {flipButtonLabel}
        </Button>

        {/* Resultado */}
        <div className={hubStyles.resultBox}>
          {flipMessage && (
            <span className={flipMessage.includes("WON") ? hubStyles.won : hubStyles.lost}>
              {flipMessage}
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
