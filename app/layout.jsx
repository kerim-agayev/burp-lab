export const metadata = {
  title: "Burp Lab",
  description: "Qəsdən zəif təlim saytı — yalnız öz testimiz üçün",
};

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: 760,
          margin: "0 auto",
          padding: "24px 16px",
          lineHeight: 1.6,
        }}
      >
        {children}
      </body>
    </html>
  );
}
