import { Header } from "./components/commons/Header";
import Footer from "./components/homepage/Footer";
import HeroSection from "./components/homepage/Hero";

export default function Home() {
  return (
    <div className="font-[family-name: Nunito]">
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
}
