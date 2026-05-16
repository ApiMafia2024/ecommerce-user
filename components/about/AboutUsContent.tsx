"use client";

import { useTranslations } from "next-intl";
import { ShoppingBag, Heart, Users, Clock, Package, Star } from "lucide-react";

export const AboutUsContent = () => {
  const t = useTranslations("AboutUs");

  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden bg-blue-100 dark:bg-slate-900/50 rounded-3xl mx-4 lg:mx-8">
        {/* Background Pattern/Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]"></div>
        </div>

        <div className="max-w-[1100px] mx-auto px-3 lg:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-14 relative z-10">
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left duration-1000">
            <div>
              <span className="inline-block font-bold text-xs bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 tracking-widest uppercase">
                {t("newHero.badge")}
              </span>
              <h1 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                {t.rich("newHero.title", {
                  highlight: (chunks) => <span className="text-primary italic">{chunks}</span>
                })}
              </h1>
              <p className="text-lg lg:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                {t("newHero.subtitle")}
              </p>
            </div>
          
          </div>

          <div className="relative lg:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl group animate-in fade-in slide-in-from-right duration-1000">
            <img 
              alt="Modern Lifestyle Tech" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=2000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
            
            {/* Floating UI Element */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl transition-transform duration-500 group-hover:translate-y-[-10px]">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="text-white w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-white font-bold text-lg leading-tight">Next-Gen Electronics</p>
                    <p className="text-white/70 text-sm">Curated with excellence</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-18 px-5 lg:px-10">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Mission */}
            <div className="group bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-xl shadow-blue-400 dark:shadow-none border border-slate-100 dark:border-slate-700 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="w-10 h-10 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:rotate-6">
                <ShoppingBag className="text-primary w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                {t("missionVision.mission.title")}
              </h2>
              <p className="text-md text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {t("missionVision.mission.description")}
              </p>
            </div>

            {/* Vision */}
            <div className="group bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-10 h-10 bg-white/10 rounded-3xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:-rotate-6">
                <Heart className="text-white w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-white mb-6 tracking-tight">
                {t("missionVision.vision.title")}
              </h2>
              <p className="text-md text-slate-300 leading-relaxed font-medium opacity-90">
                {t("missionVision.vision.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mx-4 lg:mx-8 bg-slate-50 dark:bg-slate-800 rounded-[3rem] py-10 px-6 relative overflow-hidden shadow-xl shadow-blue-500/10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 dark:bg-white/5 skew-x-[-20deg] transform translate-x-1/2"></div>
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: Users, val: "2M+", label: t("statsSection.happyShoppers") },
              { icon: Clock, val: "48h", label: t("statsSection.averageDelivery") },
              { icon: Package, val: "15k+", label: t("statsSection.premiumProducts") },
              { icon: Star, val: "98%", label: t("statsSection.positiveReviews") },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-4 group">
                <div className="w-16 h-16 bg-primary/10 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-2 transition-all duration-500 group-hover:bg-primary/20 dark:group-hover:bg-white/20 group-hover:scale-110">
                  <item.icon className="text-primary dark:text-white w-8 h-8" />
                </div>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{item.val}</p>
                <p className="text-slate-600 dark:text-white/70 font-bold uppercase tracking-widest text-xs">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-[1440px] mx-auto text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-16 tracking-widest uppercase">
            {t("trust.title")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center">
            {[1, 2, 3, 4, 5, 6].map((i) => {
              const brandImages = [
                "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg",
                "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/0/08/Apple_logo_black.svg",
                "https://upload.wikimedia.org/wikipedia/commons/5/51/Sony_logo.svg"
              ];
              return (
                <div key={i} className="flex justify-center transition-all duration-500 filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-110 cursor-pointer p-4">
                  <img 
                    alt={`Brand ${i}`} 
                    className="h-8 md:h-10 object-contain dark:invert transition-all" 
                    src={brandImages[i-1]} 
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
