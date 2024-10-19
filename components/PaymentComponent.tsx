import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { FaBriefcase, FaClock, FaDollarSign, FaEthereum, FaTools } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectDetails {
  id: number;
  title: string;
  description: string;
  budget: number;
  timeExpected: string;
  experienceReq: string;
  skillsRequired: string[];
}

const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-4/6 mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-3/6 mb-2"></div>
  </div>
);

const PaymentPage = () => {
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
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

  const checkUserLoggedIn = async () => {
    const session = await getSession();
    if (!session) {
      router.push('/auth/signin');
    } else {
      setUserLoggedIn(true);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
      checkUserLoggedIn();
    }
  }, [id]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
          {...fadeInUp}
        >
          Payment Options
        </motion.h1>

        <AnimatePresence>
          {loading ? (
            <motion.div key="skeleton" {...fadeInUp}>
              <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-8">
                <CardContent className="pt-6">
                  <SkeletonLoader />
                </CardContent>
              </Card>
            </motion.div>
          ) : projectDetails && (
            <motion.div key="details" {...fadeInUp}>
              <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 mb-8 transform hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center text-3xl font-semibold text-gray-200">
                    <FaBriefcase className="mr-3 text-yellow-400" /> Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h2 className="text-2xl font-semibold text-gray-300 mb-4">{projectDetails.title}</h2>
                  <motion.p className="mb-3 flex items-center text-gray-400" {...fadeInUp}>
                    <FaDollarSign className="mr-3 text-green-400" /> Budget: 
                    <span className="ml-2 text-green-300 font-semibold">${projectDetails.budget}</span>
                  </motion.p>
                  <motion.p className="mb-3 flex items-center text-gray-400" {...fadeInUp}>
                    <FaClock className="mr-3 text-blue-400" /> Time Expected: 
                    <span className="ml-2 text-blue-300 font-semibold">{projectDetails.timeExpected}</span>
                  </motion.p>
                  <motion.p className="mb-3 flex items-center text-gray-400" {...fadeInUp}>
                    <FaBriefcase className="mr-3 text-yellow-400" /> Experience Required: 
                    <span className="ml-2 text-yellow-300 font-semibold">{projectDetails.experienceReq}</span>
                  </motion.p>
                  <motion.p className="mb-3 flex items-center text-gray-400" {...fadeInUp}>
                    <FaTools className="mr-3 text-red-400" /> Skills Required: 
                    <span className="ml-2 text-red-300 font-semibold">{projectDetails.skillsRequired.join(', ')}</span>
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div {...fadeInUp}>
          <Alert className="mb-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg shadow-md">
            <AlertTitle className="font-semibold text-lg">Platform Fees</AlertTitle>
            <AlertDescription className="text-sm">
              A 5% platform fee will be charged, and the money will be transferred to a safe bank account used as escrow.
            </AlertDescription>
          </Alert>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleSolana} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center shadow-lg">
              <SiSolana className="mr-3" size={28} /> Pay with Solana
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleEth} className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center shadow-lg">
              <FaEthereum className="mr-3" size={28} /> Pay with Ethereum
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;