import { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { Outlet } from "react-router-dom"
import { useSelector } from "react-redux";
import Header from "./HeaderMobile/Header";
import FooterMobile from "./FooterMobile/FooterMobile";
import Footer from "./Footer/Footer";
import Slider from "./MainSlider/Slider";
import Games from "./LobbyContent/Games.jsx";
import SideBarDesktop from "./HeaderMobile/SideBarDesktop";
import InformationPopup from "./Information/InformationPopup";

function HomePage(props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 786);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const currentStep = useSelector((state) => state.paginationData.currentStep)

  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      {/* <Header setLoginHeader={setLoginHeader} /> */}
      <div className="app-container">
        <SideBarDesktop onTransactionClick={() => setShowPopup(true)}/>
        <div className="main-content">
        <Header />
        <Games/>
        <Footer />
        {showPopup && (
          <InformationPopup onClose={() => setShowPopup(false)}/>
        )}
        </div>
      </div>

      <Outlet />

      {/* {isMobile ? <FooterMobile /> : <Footer />} */}

    </>
  );
}
export default withTranslation()(HomePage);
