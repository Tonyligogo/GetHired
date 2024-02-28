import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
// import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/components/Provider";
// import UserProvider from "./context/UserProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "GetHired",
    template: "%s | GetHired"
  },
  description: "A platform to find skilled people, and the right jobs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
          <body className={inter.className}>
              <Provider>
                  <Navbar/>
                  {children}
                  <Footer/>
              </Provider>
            {/* <ClerkProvider>
          </ClerkProvider> */}
          </body>
    </html>
  );
}
