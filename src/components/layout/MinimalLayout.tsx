import React from 'react';
import Header from 'src/components/layout/Header';
import Footer from 'src/components/layout/Footer';
import 'src/styles/layout/minimal-layout.css';

interface MinimalLayoutProps {
  children: React.ReactNode;
}

const MinimalLayout: React.FC<MinimalLayoutProps> = ({ children }) => {
  return (
    <>
      <title>3D Landing Page</title>
      <Header />
      <main className="container mx-auto py-8 flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MinimalLayout;