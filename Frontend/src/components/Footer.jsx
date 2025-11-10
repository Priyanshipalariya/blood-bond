import { GiHeartDrop } from "react-icons/gi";

const Footer = () => {

  return (
    <footer className="bg-gray-300 px-8 ">
      <div className="mx-auto ">
        <div className="grid grid-cols-1 lg:gap-6">

          <div className="col-span-1">
            <div className="flex items-center md:justify-center gap-2 font-bold text-2xl text-red-600 mb-2 mt-5">
              <GiHeartDrop className="text-4xl" />
              <span className="text-2xl md:hidden">Blood Bond</span>
            </div>
            <p className="text-gray-600 text-sm lg:text-md font-mono md:text-center">
              Connecting blood donors with recipients. Every donation saves lives.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-5 py-4 text-center text-sm md:text-md text-gray-600">
          <p>&#169; 2025 Blood_Bond. All rights reserved.</p>
        </div>


      </div>

    </footer>
  )
};

export default Footer;