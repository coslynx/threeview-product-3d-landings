import { useCallback, useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';

export interface ScrollAnimationContext {
  scrollY: number;
  scrollX: number;
  scrollDelta: number;
  sceneProgress: number;
  visible: boolean;
  sceneRef: React.RefObject<THREE.Scene>;
}

export interface UseScrollAnimationProps {
  sceneRef: React.RefObject<THREE.Scene>;
}

export function useScrollAnimation(sceneRef: React.RefObject<THREE.Scene>): ScrollAnimationContext {
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [scrollDelta, setScrollDelta] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const lastScrollTop = useRef(0);
  const observer = useRef<IntersectionObserver | null>(null);

  const { camera, scene } = useThree();

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

    setScrollY(scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight));
    setScrollX(scrollLeft / (document.documentElement.scrollWidth - document.documentElement.clientWidth));

    setScrollDelta(scrollTop - lastScrollTop.current);
    lastScrollTop.current = scrollTop;
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    const currentRef = sceneRef.current;

    observer.current = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const observerRefCurrent = observer.current;
    const sceneRefCurrent = sceneRef.current;

    observerRefCurrent.observe(currentRef.children[0] as any);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observerRefCurrent.disconnect();
    };
  }, [handleScroll, sceneRef]);

  return {
    scrollY,
    scrollX,
    scrollDelta,
    sceneProgress,
    visible,
    sceneRef,
  };
}