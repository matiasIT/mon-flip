import styles from "./Button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
};

export default function Button({ children, onClick, disabled, variant = "primary" }: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${variant === "primary" ? styles.primary : styles.ghost}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}