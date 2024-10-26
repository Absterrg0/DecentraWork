'use client';

import React, { useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Spotlight } from "./ui/spotlight";
import { Button } from "./ui/button";
import NavBar from "./Navbar";
import { motion, Variants } from "framer-motion";
import { Shield, Globe, DollarSign } from "lucide-react";
import DynamicBackground from "./ui/background";

const fadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerChildren: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <motion.div 
    className="p-6 rounded-xl bg-[#1F2833]/80 backdrop-blur-sm shadow-lg hover:shadow-[#66FCF1]/20 transition-all duration-300"
    whileHover={{ scale: 1.05 }}
    variants={fadeIn}
  >
    <Icon className="w-12 h-12 text-[#66FCF1] mb-4" />
    <h3 className="text-xl font-semibold text-[#66FCF1]">{title}</h3>
    <p className="text-sm text-[#C5C6C7] mt-2">{description}</p>
  </motion.div>
);

const LandingPage: React.FC = () => {
  const {status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if the user is authenticated
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Render loading state while checking session status
  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen bg-[0x0B0C10] "></div>; // You can replace this with a spinner or loading animation
  }

  return (
    <div className="min-h-screen w-full flex md:items-center md:justify-center antialiased relative overflow-hidden">
      <DynamicBackground /> {/* Dynamic background with color */}
      <Spotlight />
      <NavBar />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="space-y-10"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-br from-[#66FCF1] to-[#C5C6C7]"
            variants={fadeIn}
          >
            Welcome to DecentraWork
          </motion.h1>
          <motion.h2
            className="text-3xl md:text-4xl font-semibold text-center text-[#66FCF1]"
            variants={fadeIn}
          >
            Empowering Decentralized Freelancing
          </motion.h2>
          <motion.p
            className="font-normal text-lg text-[#C5C6C7] max-w-lg text-center mx-auto"
            variants={fadeIn}
          >
            Discover a new way to connect and collaborate with freelancers around the globe. 
            With blockchain technology, experience secure transactions and build trust effortlessly.
          </motion.p>
          <motion.div 
            className="flex justify-center"
            variants={fadeIn}
          >
            <Button 
              variant="default" 
              size="lg" 
              className="bg-[#66FCF1] text-[#1F2833] hover:bg-[#45A29E] transition duration-300 ease-in-out rounded-full shadow-lg transform hover:scale-105"
              onClick={() => router.push('/api/auth/signin')} // Redirect to sign in
            >
              Get Started
            </Button>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
          >
            <FeatureCard 
              icon={Shield}
              title="Secure Transactions"
              description="Experience peace of mind with smart contracts, ensuring safe and transparent transactions."
            />
            <FeatureCard 
              icon={Globe}
              title="Global Talent Pool"
              description="Connect with skilled professionals from around the world, expanding your network globally."
            />
            <FeatureCard 
              icon={DollarSign}
              title="Minimal Fees"
              description="Maximize your earnings with our low-fee structure, putting more money in your pocket."
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
