import React from "react";
import { Link } from "react-router";
import { ButtonLink } from "../components/Button";

const NotFound = () => {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="  px-5 lg:px-20 flex items-center justify-center gap-8">
                <div className="hidden sm:flex flex-1 self-center">
                    <img
                        src={'https://res.cloudinary.com/dfm2w0hov/image/upload/v1743427225/image_dzvbne.png'}
                        alt="Broken Robot"
                        className=" w-full max-w-xs " />
                </div>

                <div className="flex-2 flex flex-col items-center text-center sm:items-start">
                    <h1 className="text-4xl lg:text-5xl font-bold text-red-700 mb-4">ERROR 404</h1>
                    <p className="text-2xl lg:text-3xl font-mono font-bold text-gray-700 mb-3">Page Not Found</p>
                    <p className="text-gray-600 lg:text-[20px] mb-6 text-[15px] font-mono">
                        The page you're looking for doesn't exist.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;