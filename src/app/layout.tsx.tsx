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

**That's it. Nothing else. No instructions, no backticks, just this code.**

Delete everything and paste ONLY the code above.

Then:
```
cd "C:\Users\schne\OneDrive\Desktop\Signls Project\signls"
git add .
git commit -m "Fix layout.tsx"
git push origin main