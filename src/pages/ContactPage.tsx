import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useThreeScene } from '../3d/ThreeScene';
import { useAdaptiveQuality } from '../hooks/useAdaptiveQuality';
import { three3DHelpersUtil } from '../utils/three-helpers';
import { Html } from '@react-three/drei';
import MinimalLayout from 'src/components/layout/MinimalLayout';
import 'src/styles/pages/contact.css';

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const contactSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  message: yup.string().required('Message is required'),
});

const ContactPage = () => {
  const [success, setSuccess] = useState(false);
  const { quality } = useAdaptiveQuality(30);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    // In a real application, you would send this data to a backend service
    console.log('Form data:', data);
    setSuccess(true);
    formRef.current?.reset();
  };

  const GlobeScene = () => {
    const { scene } = useThree();
    const meshRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
      if (!scene) return;

      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.7, roughness: 0.1 });
      const globeMesh = new THREE.Mesh(geometry, material);
      globeMesh.name = 'globeMesh';
      globeMesh.position.set(0, 0, 0);
      globeMesh.scale.set(0.7, 0.7, 0.7);
      scene.add(globeMesh);
      meshRef.current = globeMesh;

      return () => {
        scene.remove(globeMesh);
        geometry.dispose();
        material.dispose();
      };
    }, [scene]);

    useFrame((state) => {
      if (!meshRef.current) return;
      meshRef.current.rotation.x = state.clock.getElapsedTime() / 2000;
      meshRef.current.rotation.y = state.clock.getElapsedTime() / 1000;
    });

    return null;
  };

  const ContactForm = () => {
    return (
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="contact-form"
        ref={formRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" {...register('name')} />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" {...register('email')} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea id="message" {...register('message')}></textarea>
          {errors.message && <span>{errors.message.message}</span>}
        </div>
        <button type="submit">Submit</button>
      </motion.form>
    );
  };

  return (
    <MinimalLayout>
      <div className="contact-page">
        <h1>Contact Us</h1>
        {success ? (
          <div className="success-message">Thank you for your message! We'll be in touch soon.</div>
        ) : (
          <>
            <div className="form-container">
              <ContactForm />
            </div>
            <div className="globe-container">
              <Canvas style={{ width: '100%', height: '400px' }}>
                <ambientLight intensity={0.3} />
                <directionalLight position={[0, 0, 5]} intensity={0.6} />
                <GlobeScene />
              </Canvas>
            </div>
          </>
        )}
      </div>
    </MinimalLayout>
  );
};

export default ContactPage;