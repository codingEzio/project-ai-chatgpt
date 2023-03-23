import "./globals.css";

export const metadata = {
  title: "Code Explainer",
  description: "No more shitty code, I could read it all",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
