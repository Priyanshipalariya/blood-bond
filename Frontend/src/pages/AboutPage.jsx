import MissionComponent from "../components/MissionComponent";
import ValuesComponent from "../components/ValuesComponent";

const AboutPage= () => {
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

  <MissionComponent/>
  <ValuesComponent/>

 
  </>
  );
};

export default AboutPage;