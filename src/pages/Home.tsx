import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const businessTypes = [
    { name: "Maduka ya Rejareja", icon: "🛍️" },
    { name: "Migahawa", icon: "🍽️" },
    { name: "Supermarket", icon: "🛒" },
    { name: "Pharmacy", icon: "💊" },
    { name: "Salooni", icon: "✂️" },
    { name: "Electronics", icon: "💻" },
    { name: "Duka la Mavazi", icon: "👕" },
    { name: "Hardware", icon: "🔨" },
  ];

  return (
    <div className="animate-slide-down">
      {/* Hero Section - Responsive Padding & Text */}
      <section className="bg-primary pt-16 pb-20 px-4 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Dhibiti Mauzo Yako kwa Njia Rahisi
          </h1>
          <p className="text-white/90 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            MauzoKidijitali ni mfumo wa kisasa wa POS unaokuwezesha kusimamia mauzo, 
            bidhaa, na ripoti za biashara yako kwa ufanisi na haraka.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0">
            <Button 
              className="border-2 border-white bg-transparent text-white hover:bg-white/10 px-8 py-3 font-bold w-full sm:w-auto"
              onClick={() => navigate("/login")}
            >
              Anza Kutumia
            </Button>

          </div>
        </div>
      </section>

      {/* Benefits Section - Responsive Grid */}
      <section className="max-w-7xl mx-auto px-4 mt-4 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Haraka & Rahisi", desc: "Fanya mauzo kwa sekunde chache bila usumbufu wowote.", icon: "⚡" },
            { title: "Ripoti Sahihi", desc: "Pata taarifa za mauzo, faida na bidhaa papo hapo.", icon: "📈" },
            { title: "Dhibiti Bidhaa", desc: "Angalia stock, bei na mauzo yote kwa urahisi.", icon: "📦" }
          ].map((feature, idx) => (
            <div key={idx} className="p-6 md:p-8 rounded-2xl bg-white border-t-4 border-primary shadow-xl hover:translate-y-[-5px] transition-all text-center">
              <div className="text-4xl mb-4 text-primary">{feature.icon}</div>
              <h3 className="mb-2 !text-gray-800 font-bold">{feature.title}</h3>
              <p className="!text-gray-600 text-sm md:text-base">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business Types Section - Infinite/Manual Responsive Scroll */}
      <section className="bg-gray-50 py-5 md:py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center mb-10 md:mb-16 !text-gray-800 font-bold text-2xl md:text-4xl">
            Inafaa kwa Biashara Zote
          </h2>
          
          {/* Horizontal Scroll Wrapper */}
          <div className="relative">
            <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 scrollbar-hide snap-x touch-pan-x">
              {businessTypes.map((biz, idx) => (
                <div 
                  key={idx} 
                  className="flex-shrink-0 w-[200px] md:w-[240px] p-6 bg-white rounded-2xl shadow-sm text-center border-t-4 border-primary snap-center hover:shadow-md transition-all"
                >
                  <div className="text-3xl mb-3">{biz.icon}</div>
                  <span className="font-bold text-gray-700 block">{biz.name}</span>
                </div>
              ))}
            </div>
            
            {/* Mobile Visual Hint */}
            <div className="md:hidden text-center text-xs text-gray-400 mt-2 animate-pulse">
              Tanguliza kushoto kuona zaidi ⮕
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
