'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from "@/components/ui/skeleton";
import { FaBriefcase, FaClock, FaDollarSign, FaEthereum, FaTools } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';

interface ProjectDetails {
  id: number;
  title: string;
  description: string;
  budget: number;
  timeExpected: string;
  experienceReq: string;
  skillsRequired: string[];
}

const PaymentPage = () => {
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  const handleSolana = () => {
    router.push(`/projects/${id}/payments/solana`);
  };

  const handleEth = () => {
    router.push(`/projects/${id}/payments/ethereum`);
  };

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}/info`);
      if (response.data.project && response.data.project.length > 0) {
        setProjectDetails(response.data.project[0]);
      } else {
        console.error('Project not found');
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#222629]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[#86C232] text-2xl font-light"
        >
          <Skeleton className="w-[300px] h-[20px] bg-[#2F3439]" />
        </motion.div>
      </div>
    );
  }

  if (!projectDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#222629]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-[#86C232] text-xl"
        >
          Project not found.
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-[#222629] to-[#2F3439] text-[#C5C6C7]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full mb-8"
      >
        <Card className="bg-[#2F3439] border-[#86C232] border-opacity-50 shadow-lg mb-4">
          <CardHeader>
            <CardTitle className="text-xl text-[#86C232]">{projectDetails.title}</CardTitle>
            <p className="text-[#C5C6C7]">{projectDetails.description}</p>
          </CardHeader>
          <CardContent>
            <motion.p className="mb-3 flex items-center text-[#C5C6C7]" >
              <FaDollarSign className="mr-3 text-[#86C232]" /> Budget: 
              <span className="ml-2 text-[#86C232] font-semibold">${projectDetails.budget}</span>
            </motion.p>
            <motion.p className="mb-3 flex items-center text-[#C5C6C7]" >
              <FaClock className="mr-3 text-[#86C232]" /> Time Expected: 
              <span className="ml-2 text-[#86C232] font-semibold">{projectDetails.timeExpected}</span>
            </motion.p>
            <motion.p className="mb-3 flex items-center text-[#C5C6C7]" >
              <FaBriefcase className="mr-3 text-[#86C232]" /> Experience Required: 
              <span className="ml-2 text-[#86C232] font-semibold">{projectDetails.experienceReq}</span>
            </motion.p>
            <motion.p className="mb-3 flex items-center text-[#C5C6C7]" >
              <FaTools className="mr-3 text-[#86C232]" /> Skills Required: 
              <span className="ml-2 text-[#86C232] font-semibold">{projectDetails.skillsRequired.join(', ')}</span>
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl mb-6 text-[#86C232]"
      >
        Payment Options
      </motion.h1>

      <motion.div  className="w-full max-w-3xl mb-6">
        <Alert className="bg-[#2F3439] border-[#86C232] border-opacity-50 text-[#C5C6C7]">
          <AlertTitle className="font-semibold text-lg text-[#86C232]">Platform Fees</AlertTitle>
          <AlertDescription className="text-sm">
            A 5% platform fee will be charged, and the money will be transferred to a safe bank account used as escrow.
          </AlertDescription>
        </Alert>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl"
        initial="initial"
        animate="animate"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={handleSolana} className="w-full bg-[#61892F] hover:bg-[#86C232] text-[#222629] font-bold py-4 px-6 rounded-lg flex items-center justify-center shadow-lg transition-colors duration-200">
            <SiSolana className="mr-3" size={28} /> Pay with Solana
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={handleEth} className="w-full bg-[#61892F] hover:bg-[#86C232] text-[#222629] font-bold py-4 px-6 rounded-lg flex items-center justify-center shadow-lg transition-colors duration-200">
            <FaEthereum className="mr-3" size={28} /> Pay with Ethereum
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;