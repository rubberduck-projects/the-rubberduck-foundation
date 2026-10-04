import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { colorModeInitScript } from "@/theme/ColorModeContext";

const sans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const mono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Rubberduck Foundation — Articles and playbooks for developers. Free, and kept honest.",
    description:
        "The free alternative to the course, the private Slack, and the company with good internal docs. Articles that explain how things work and playbooks that walk you through building them — every claim shipped with a way to reproduce it.",
    openGraph: {
        title: "Rubberduck Foundation",
        description:
            "Articles and playbooks that state what they assume and what you'll be able to do after.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: colorModeInitScript }} />
            </head>
            <body>
                <ThemeRegistry>{children}</ThemeRegistry>
            </body>
        </html>
    );
}
