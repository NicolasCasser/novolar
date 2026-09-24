import HeroSection from '../../components/home/HeroSection/HeroSection';
import Header from '../../components/layout/Header/Header';
import AnimalsSection from '../../components/home/AnimalsSection/AnimalsSection';
import HowItWorksSection from '../../components/home/HowItWorksSection/HowItWorksSection';
import OpenSourceSection from '../../components/home/OpenSourceSection/OpenSourceSection';
import Footer from '../../components/layout/Footer/Footer';

function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSection />
        <AnimalsSection />
        <HowItWorksSection />
        <OpenSourceSection />
        <Footer />
      </main>
    </>
  );
}
export default Home;
