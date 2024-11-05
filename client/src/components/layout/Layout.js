import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="content">{children}</main> {/* Use <main> for the main content */}
      <Footer />
    </>
  );
};

export default Layout;
