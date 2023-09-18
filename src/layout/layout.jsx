import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";
import { AppContext } from "../utils/appcontext";
import useData from "../hooks/use-data";

export default function Layout() {
  return (
    <AppContext.Provider value={{ ...useData() }}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </AppContext.Provider>
  );
}
