import MissionComponent from "../components/MissionComponent";
import ValuesComponent from "../components/ValuesComponent";
import { ButtonLink } from "../components/Button";
import { Link } from "react-router";

const AboutPage = () => {
  return (
    <>
      <section className="bg-red-100 py-14">
        <div className=" px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About <span className="text-red-700">Blood Bond</span></h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connecting donors with recipients since 2025. Learn more about our mission .
          </p>
        </div>
      </section>

      <MissionComponent />
      <ValuesComponent />

      <div className="text-center mb-10">
        <p className="text-lg text-gray-900 font-semibold">
          Have any questions? Explore our{" "}
          <Link to="/faq">
            <ButtonLink className="inline-block text-red-600 hover:underline font-semibold">
              Frequently Asked Questions
            </ButtonLink>
          </Link>
          {" "}for quick answers.
        </p>
      </div>



    </>
  );
};

export default AboutPage;