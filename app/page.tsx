'use client';
import HeroSection from '../components/HeroSection';
import CTA from '../components/CTA';
import Layout from '../components/Layout';
import { HeroUIProvider } from '@heroui/system';
import IntroSection from '@/components/IntroSection';
import ClassesSection from '@/components/ClassesSection';
import ContactInfoSection from '@/components/ContactInfoSection';

export default function Home() {
  return (
    <HeroUIProvider>
      <Layout>
        <HeroSection />
        <ClassesSection />
        <IntroSection />
        <CTA />
        <ContactInfoSection />
      </Layout>
    </HeroUIProvider>
  );
}
