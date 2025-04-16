import { Header } from "./components/Header";
import BenefitsSection from "./components/homepage/BenefitsSection";
import CTASection from "./components/homepage/CTASection";
import DemoSection from "./components/homepage/DemoSection";
import FeaturesSection from "./components/homepage/FeaturesSection";
import Footer from "./components/homepage/Footer";
import HeroSection from "./components/homepage/HeroSection";
import HowItWorksSection from "./components/homepage/HowItWorksSection";

export default function Home() {
  return (
    <div className="font-[family-name: Nunito]">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <DemoSection />
      <CTASection />
      <Footer />
    </div>
  );
}
