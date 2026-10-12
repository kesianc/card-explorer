import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/castoro/400.css";
import "@fontsource/castoro/400-italic.css";
import "@fontsource/castoro-titling/400.css";
import "@fontsource-variable/mona-sans";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Card Explorer",
  description: "Created by Késia Coelho",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <FavoritesProvider>
          <NavBar />
          {children}
        </FavoritesProvider>
      </body>
    </html>
  );
}
