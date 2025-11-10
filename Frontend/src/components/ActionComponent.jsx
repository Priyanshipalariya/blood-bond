import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { Button, ButtonContrast, ButtonLink } from "./Button";
import { Link } from "react-router"; 

const ActionComponent = (props) => {
    return (
        <section className="py-14 bg-red-500 text-white">
            <div className="mx-auto px-4 md:px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <FaRegHeart className="h-16 w-16 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
                    <p className=" mb-8">
                        Whether you're a first-time donor or a regular contributor, your donation matters.
                        Register today and join our community of lifesavers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/register">
                            <ButtonContrast >
                                Register as Donor
                            </ButtonContrast>
                        </Link>
                        <Link to="/information">
                            <ButtonLink className="text-white hover:text-white">
                                Learn More
                            </ButtonLink>
                        </Link>
                    </div>
                </div>
            </div>
        </section>

    );
};

export default ActionComponent;