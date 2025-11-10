import React from "react";
import { GiHeartDrop } from "react-icons/gi"
import { Link } from "react-router";
import { Button,  ButtonContrast } from "./Button";

const HeroComponent = () =>{
    return(
        <section className="relative bg-red-100">
        <div className=" py-14 px-5 md:px-10 lg:px-20">
          <div className="flex flex-col md:flex-row mx-auto items-center max-w-6xl md:gap-5 ">
            <div className="md:w-2/3 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Donate Blood, <span className="text-red-700">Save Lives</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-lg">
                Your one donation can save up to three lives. Join our community of donors and help those in need with the gift of life.
              </p>
              <div className="flex items-start flex-row gap-4">
                <Link to="/donate">
                  <Button>
                    Register as Donor
                  </Button>
                </Link>
                <Link to="/request">
                  <ButtonContrast>
                    Request Blood
                  </ButtonContrast>
                </Link>
              </div>
            </div>
                  <GiHeartDrop className="h-56 w-56 text-red-700 animate-pulse" />
          </div>
        </div>
      </section>
    )
}

export default HeroComponent