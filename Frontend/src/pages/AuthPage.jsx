const AuthPage = ({children}) => {
  return (
    <div className="md:flex min-h-screen bg-red-100">

      <div className="hidden px-5 md:flex h-screen flex-col text-center  items-center justify-center w-1/2 bg-gray-200 sticky top-0">
        <h1 className="text-red-700 md:text-4xl lg:text-6xl font-bold"> Blood Bond</h1>
        <p className="text-red-700 mt-2">- where hope begins and lives are saved</p>
        <p className="mt-8 text-gray-500 text-lg">Empowering humanity one drop at a time — your journey starts here.</p>
        <img className="max-w-md" src="https://res.cloudinary.com/dfelqef5x/image/upload/v1744085333/km3mzvg8kgp6du0sxfk0.png " />
      </div>

      <div className="md:w-1/2 md:flex items-center justify-center overflow-y-auto">
        <div className="w-full">
          {children}
        </div>
      </div>



    </div>




  );
};

export default AuthPage;
