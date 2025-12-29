import { useEffect, useRef } from "react";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

type BusinessType = {
  name: string;
  icon: string;
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isUserInteracting = useRef<boolean>(false);

  const businessTypes: BusinessType[] = [
    { name: "Maduka ya Rejareja", icon: "🛍️" },
    { name: "Migahawa", icon: "🍽️" },
    { name: "Supermarket", icon: "🛒" },
    { name: "Pharmacy", icon: "💊" },
    { name: "Salooni", icon: "✂️" },
    { name: "Electronics", icon: "💻" },
    { name: "Duka la Mavazi", icon: "👕" },
    { name: "Hardware", icon: "🔨" },
  ];

  // duplicate for infinite scrolling
  const scrollingBusinesses = [...businessTypes, ...businessTypes];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId: number;
    const speed = 0.4;

    const autoScroll = () => {
      if (!isUserInteracting.current) {
        container.scrollLeft += speed;

        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleUserStart = () => {
    isUserInteracting.current = true;
  };

  const handleUserEnd = () => {
    setTimeout(() => {
      isUserInteracting.current = false;
    }, 1500);
  };

  return (
    <div className="animate-slide-down">
      {/* Hero Section */}
      <section className="bg-primary pt-16 pb-20 px-4 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Dhibiti Mauzo Yako kwa Njia Rahisi
          </h1>
          <p className="text-white/90 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            MauzoKidijitali ni mfumo wa kisasa wa POS unaokuwezesha kusimamia
            mauzo, bidhaa, na ripoti za biashara yako kwa ufanisi na haraka.
          </p>

          <div className="flex justify-center">
            <Button
              className="border-2 border-white bg-transparent text-white hover:bg-white/10 px-8 py-3 font-bold"
              onClick={() => navigate("/login")}
            >
              Anza Kutumia
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 mt-4 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Haraka & Rahisi",
              desc: "Fanya mauzo kwa sekunde chache bila usumbufu wowote.",
              icon: "⚡",
            },
            {
              title: "Ripoti Sahihi",
              desc: "Pata taarifa za mauzo, faida na bidhaa papo hapo.",
              icon: "📈",
            },
            {
              title: "Dhibiti Bidhaa",
              desc: "Angalia stock, bei na mauzo yote kwa urahisi.",
              icon: "📦",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border-t-4 border-primary shadow-xl hover:-translate-y-1 transition-all text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business Types Auto Scroll */}
      <section className="bg-gray-50 py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center mb-10 font-bold text-2xl md:text-4xl text-gray-800">
            Inafaa kwa Biashara Zote
          </h2>

          <div
            ref={scrollRef}
            onMouseEnter={handleUserStart}
            onMouseLeave={handleUserEnd}
            onTouchStart={handleUserStart}
            onTouchEnd={handleUserEnd}
            className="
              flex flex-nowrap gap-4 md:gap-6
              overflow-x-auto pb-6
              scrollbar-hide touch-pan-x
              
            "
          >
            {scrollingBusinesses.map((biz, idx) => (
              <div
                key={idx}
                className="
                  flex-shrink-0
                  w-[200px] md:w-[240px]
                  p-6 bg-white rounded-2xl
                  shadow-sm text-center
                  border-t-4 border-primary
                  hover:shadow-md transition-all
                "
              >
                <div className="text-3xl mb-3">{biz.icon}</div>
                <span className="font-bold text-gray-700">
                  {biz.name}
                </span>
              </div>
            ))}
          </div>

          <div className="md:hidden text-center text-xs text-gray-400 mt-2 animate-pulse">
            Teleza kushoto au kulia kuona zaidi ⮕
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
