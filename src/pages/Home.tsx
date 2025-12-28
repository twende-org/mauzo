import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-20">
      {/* Intro Section */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Dhibiti Mauzo Yako kwa Njia Rahisi
        </h2>
        <p className="text-gray-600 text-lg">
          <span className="font-semibold text-primary">MauzoPlus</span> ni mfumo
          wa kisasa wa POS unaokuwezesha kusimamia mauzo, bidhaa, na ripoti za
          biashara yako kwa ufanisi.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={() => navigate("/login")}>
            Anza Kutumia
          </Button>
          <Button variant="secondary">
            Jifunze Zaidi
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl shadow-sm border bg-white text-center">
          <h3 className="text-xl font-semibold mb-2">Haraka & Rahisi</h3>
          <p className="text-gray-600">
            Fanya mauzo kwa sekunde chache bila usumbufu wowote.
          </p>
        </div>

        <div className="p-6 rounded-xl shadow-sm border bg-white text-center">
          <h3 className="text-xl font-semibold mb-2">Ripoti Sahihi</h3>
          <p className="text-gray-600">
            Pata taarifa za mauzo, faida na bidhaa papo hapo.
          </p>
        </div>

        <div className="p-6 rounded-xl shadow-sm border bg-white text-center">
          <h3 className="text-xl font-semibold mb-2">Dhibiti Bidhaa</h3>
          <p className="text-gray-600">
            Angalia stock, bei na mauzo yote kwa urahisi.
          </p>
        </div>
      </section>

      {/* Business Types */}
      <section className="bg-gray-50 p-10 rounded-2xl">
        <h3 className="text-2xl font-bold text-center mb-8">
          Inafaa kwa Biashara Zote
        </h3>

        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-white rounded-lg shadow-sm">Maduka ya Rejareja</div>
          <div className="p-4 bg-white rounded-lg shadow-sm">Migahawa</div>
          <div className="p-4 bg-white rounded-lg shadow-sm">Supermarket</div>
          <div className="p-4 bg-white rounded-lg shadow-sm">Pharmacy</div>
        </div>
      </section>

    </div>
  );
};

export default Home;
