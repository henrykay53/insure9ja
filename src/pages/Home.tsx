import { useState } from 'react';
import { Hero } from '@/components/insure9ja/Hero';
import { SimpleSection } from '@/components/insure9ja/SimpleSection';
import { OurPlans } from '@/components/insure9ja/OurPlans';
import { HowItWorks } from '@/components/insure9ja/HowItWorks';
import { TrustedSection } from '@/components/insure9ja/TrustedSection';
import { ObjectionSection } from '@/components/insure9ja/ObjectionSection';
import { FinalCTA } from '@/components/insure9ja/FinalCTA';
import { ApplicationFlow } from '@/components/application/ApplicationFlow';


const Home = ()=> {

    const [showApplication, setShowApplication] = useState(false);

    if (showApplication) {
        return <ApplicationFlow onClose={() => setShowApplication(false)} />
    }
    return (
        <>

        {/* <Header onStartApplication={() => setShowApplication(true)} /> */}
              <Hero onStartApplication={() => setShowApplication(true)} />
              <SimpleSection />
              <OurPlans onStartApplication={() => setShowApplication(true)} />
              <HowItWorks />
              <TrustedSection />
              <ObjectionSection />
              <FinalCTA onStartApplication={() => setShowApplication(true)} />
              
        
        </>
    )
}

export default Home