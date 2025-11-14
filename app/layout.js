import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";

export const metadata = {
  title: "TuCampus",
  description: "Arriendos para estudiantes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
