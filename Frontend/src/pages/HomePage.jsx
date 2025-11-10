import React from "react";
import HeroComponent from "../components/HeroComponent";
import WhyDonateComponent from "../components/WhyDonateComponent";
import ActionComponent from "../components/ActionComponent";
import BloodInfoComponent from "../components/BloodInfoComponent";

const HomePage = () => {
    return(
        <div >
            <HeroComponent/>
            <BloodInfoComponent/>
            <WhyDonateComponent/>
            <ActionComponent/>
        </div>
    )
}

export default HomePage