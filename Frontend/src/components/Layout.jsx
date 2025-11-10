// import Navbar from "./Header";
// import Footer from "./Footer";
// import { Routes } from "react-router";
// const Layout = ({ children }) => {
//     return (
//       <div>
//         <Navbar />
//         <Routes>{children}</Routes>
//         <Footer />
//       </div>
//     );
//   };
//   export default Layout



import { Outlet } from "react-router";
import Navbar from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
