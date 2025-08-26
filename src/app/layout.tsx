import Providers from "../providers/Providers";
import "../styles/globals.css";

export const metadata = {
  title: "Monad Coinflip",
  description: "Connect your wallet and play the coinflip game",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}