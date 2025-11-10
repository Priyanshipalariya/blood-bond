import React from "react";
import { FaRegHeart } from "react-icons/fa";

const MissionComponent = () => {
  return (
    <section >
      <div className="pt-8 md:py-14 px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:gap-10 items-center max-w-6xl mx-auto">
          <div className="md:w-2/3 mb-10 md:mb-0">
            <h2 className="text-3xl font-bold text-center md:text-start text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 md:mb-4 mb-2">
              At Blood Bond, our mission is to ensure that every patient in need has access to safe, lifesaving blood products whenever and wherever they're needed.
            </p>
            <p className="text-gray-600 md:mb-4 mb-2">
              We serve as the vital link between generous blood donors and patients in hospitals, emergency rooms, and medical facilities across the country.
            </p>
            <p className="text-gray-600">
              Through education, advocacy, and coordination, we're building a community of lifesavers who understand the critical importance of regular blood donation.
            </p>
          </div>

          <FaRegHeart className="hidden md:block md:ml-10 h-30 w-40 md:h-40 md:w-40 text-red-700" />
        </div>
      </div>
    </section>

  )

}

export default MissionComponent;