
const AppLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <div className="text-center">
        
        {/* Mduara Mkuu wa Kupakia - Umeboreshwa na kivuli */}
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full mx-auto" />
          <div className="w-20 h-20 border-4 border-primary border-t-transparent border-b-transparent rounded-full absolute top-0 left-0 animate-spin" />
        </div>

        {/* Jina la Biashara lenye Rangi Sahihi */}
        <h1 className="text-3xl font-black text-gray-800 tracking-wider">
          Mauzo<span className="text-primary font-extrabold">Kidijitali</span>
        </h1>

        {/* Ujumbe Mfupi */}
        <p className="mt-3 text-gray-500 text-sm font-medium animate-pulse">
          Mfumo unapakia, subiri kidogo...
        </p>
      </div>
    </div>
  );
};

export default AppLoader;
