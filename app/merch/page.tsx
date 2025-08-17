import Merchandise from '@/components/Merch';
import MerchHeroSection from '@/components/MerchHeroSection';
import React from 'react';

const MerchPage = props => {
  return (
    <>
      <MerchHeroSection />
      <Merchandise />;
    </>
  );
};

export default MerchPage;
