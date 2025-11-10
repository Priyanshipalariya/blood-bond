import React from "react";
import {Card, CardContent} from "./Card"
import { FaRegHeart } from "react-icons/fa";
import {FiAward, FiUsers, FiTarget} from "react-icons/fi";

const ValuesComponent = () => {
    return(
        <section className="py-14 bg-gray-100">
        <div className=" px-4 md:px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="overflow-hidden  hover:border-red-600 mx-10 sm:mx-0">
              <CardContent className="p-6 text-center">
                <div className="bg-red-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FaRegHeart className="h-8 w-8 text-red-700" />
                </div>
                <h3 className="font-bold text-xl mb-2">Compassion</h3>
                <p className="text-gray-600">
                  We care deeply about donors, recipients, and the communities we serve.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:border-red-600 mx-10 sm:mx-0">
              <CardContent className="p-6 text-center">
                <div className="bg-red-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FiAward className="h-8 w-8 text-red-700" />
                </div>
                <h3 className="font-bold text-xl mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We strive for the highest standards of safety, quality, and service.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:border-red-600 mx-10 sm:mx-0">
              <CardContent className="p-6 text-center">
                <div className="bg-red-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FiUsers className="h-8 w-8 text-red-700" />
                </div>
                <h3 className="font-bold text-xl mb-2">Community</h3>
                <p className="text-gray-600">
                  We foster a sense of belonging and shared purpose among donors and volunteers.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:border-red-600 mx-10 sm:mx-0">
              <CardContent className="p-6 text-center">
                <div className="bg-red-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FiTarget className="h-8 w-8 text-red-700" />
                </div>
                <h3 className="font-bold text-xl mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We continuously improve our processes and embrace new technologies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
}

export default ValuesComponent;