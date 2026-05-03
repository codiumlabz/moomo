import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import DealsSection from './components/DealsSection';
import FloatingButtons from './components/FloatingButtons';

export const metadata = {
  title: 'Shinshan - E-commerce',
  description: 'A premium e-commerce platform',
};

export default function Home() {
  return (
    <main className="animate-fade-in">
      <Header />
      <HeroBanner />
      <DealsSection />
      <FloatingButtons />
    </main>
  );
}
