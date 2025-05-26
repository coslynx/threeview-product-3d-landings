import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Twitter } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { three3DHelpersUtil } from 'src/utils/three-helpers';
import 'src/styles/layout/footer.css';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const footerData = useMemo(() => ({
    copyright: `© ${currentYear} SaaS Product. All rights reserved.`,
    links: [
      { label: 'About', to: '/about' },
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Contact', to: '/contact' },
    ],
    social: [
      { icon: Mail, link: 'mailto:contact@example.com', ariaLabel: 'Email us' },
      { icon: Github, link: 'https://github.com/example', ariaLabel: 'Our Github' },
      { icon: Twitter, link: 'https://twitter.com/example', ariaLabel: 'Our Twitter' },
    ],
    reportLink: {
      url: '#',
      text: "Report issue"
    }
  }), [currentYear]);

  const AnimatedBackground = () => {
    const meshRef = React.useRef<THREE.Mesh>(null);

    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.001;
        meshRef.current.rotation.y += 0.002;
      }
    });

    return (
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#2563eb" metalness={0.7} roughness={0.1} />
      </mesh>
    );
  };

  return (
    <footer className="relative py-12 dark:bg-gray-800">
      <div className="absolute inset-0 overflow-hidden">
        <Canvas className="h-full">
          <ambientLight intensity={0.1} />
          <directionalLight position={[0, 5, 5]} intensity={0.3} />
          <AnimatedBackground />
        </Canvas>
      </div>
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
            {footerData.copyright}
          </p>
          <nav className="flex items-center space-x-4">
            {footerData.links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <nav className="flex items-center space-x-4">
            {footerData.social.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </nav>
        </div>
        <div className="text-center mt-4">
            <a href={footerData.reportLink.url} className="text-xs text-gray-500 hover:text-gray-300">{footerData.reportLink.text}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;