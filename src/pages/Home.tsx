import { Hero } from '@/components/insure9ja/Hero';
import { SimpleSection } from '@/components/insure9ja/SimpleSection';
import { OurPlans } from '@/components/insure9ja/OurPlans';
import { HowItWorks } from '@/components/insure9ja/HowItWorks';
import { TrustedSection } from '@/components/insure9ja/TrustedSection';
import { ObjectionSection } from '@/components/insure9ja/ObjectionSection';
import { FinalCTA } from '@/components/insure9ja/FinalCTA';

interface HomeProps {
  onStartApplication: () => void;
}

const Home = ({ onStartApplication }: HomeProps) => {
  return (
    <>
      <Hero onStartApplication={onStartApplication} />
      <SimpleSection />
      <OurPlans onStartApplication={onStartApplication} />
      <HowItWorks />
      <TrustedSection />
      <ObjectionSection />
      <FinalCTA onStartApplication={onStartApplication} />
    </>
  );
};

export default Home;
