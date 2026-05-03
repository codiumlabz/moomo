import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import DealsSection from './components/DealsSection';
import FloatingButtons from './components/FloatingButtons';

export const metadata = {
  title: 'BudgetBuy - Your Premium Shopping Destination',
  description: 'Discover the latest trends and best deals at BudgetBuy.',
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
