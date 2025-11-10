import React from "react";
import { FiUsers, FiAward } from "react-icons/fi";
import { CiCalendarDate } from "react-icons/ci";

const WhyDonateComponent = () => {
  return (
    <section className="py-14 bg-gray-200 border-t border-gray-200">
        <div className=" mx-auto px-4 md:px-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Donate Blood?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your blood donation makes a significant impact on healthcare and saves lives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
            <div className="text-center px-6 py-3">
              <div className="bg-red-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FiUsers className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="font-bold text-xl mb-2">Help Others</h3>
              <p className="text-gray-600">
                Every 2 seconds, someone in the world needs blood. Your donation directly saves lives.
              </p>
            </div>
            
            <div className="text-center px-6 py-3">
              <div className="bg-red-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CiCalendarDate className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="font-bold text-xl mb-2">Regular Need</h3>
              <p className="text-gray-600">
                Blood has a limited shelf life and needs constant replenishment to maintain supplies.
              </p>
            </div>
            
            <div className="text-center px-6 py-3">
              <div className="bg-red-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FiAward className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="font-bold text-xl mb-2">Health Benefit</h3>
              <p className="text-gray-600">
                Regular donors receive free health check-ups and may experience health benefits.
              </p>
            </div>
          </div>
        </div>
      </section>
  );
};

export default WhyDonateComponent;