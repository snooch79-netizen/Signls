import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signls",
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
```

**Save it** (Ctrl + S) and close.

Then git push:
```
cd "C:\Users\schne\OneDrive\Desktop\Signls Project\signls"
git add .
git commit -m "Update layout.tsx and page.tsx"
git push origin main