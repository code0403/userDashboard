import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "User Dashboard",
  description: "User management dashboard (starter)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
