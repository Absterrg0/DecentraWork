'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; 
import { Button } from './ui/button';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react'; 

interface Application {
  id: number;
  coverLetter: string;
  createdAt: string;
  applicant: {
    id: number;
    name: string;
    email: string;
  };
}

export default function ProposalComponent() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchApplications();
    }
  }, [id]);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(`/api/projects/${id}/applications`);
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load applications.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoose = (applicationId: number, applicantId: number) => {
    // Redirect to the payment page with the project ID and applicant ID
    router.push(`/projects/${id}/payments?applicantId=${applicantId}`);
  };

  const handleViewProfile = (applicantId: number) => {
    router.push(`/user/${applicantId}/view`); 
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-b from-[#222629] to-[#2F3439] text-[#C5C6C7]">
      <Loader2 className="animate-spin h-10 w-10 text-[#86C232]" />
      <span className="ml-2 text-lg">Loading...</span>
    </div>
  );

  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (applications.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-[#222629] to-[#2F3439] text-[#C5C6C7]">
      <h2 className="text-2xl mb-4 text-[#86C232]">No Applications Found</h2>
      <p className="text-lg text-gray-300 mb-4">It seems there are currently no applications for this project.</p>
      <p className="text-gray-400">Encourage potential applicants to apply!</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-[#222629] to-[#2F3439] text-[#C5C6C7]">
      <h1 className="text-4xl mb-6 text-[#86C232]">Applications for the Project</h1>
      <div className="space-y-4 w-full max-w-3xl">
        {applications.map((application) => (
          <Card key={application.id} className="bg-[#2F3439] border border-[#86C232] shadow-lg transition-transform hover:scale-105 transform-gpu">
            <CardHeader>
              <CardTitle className="text-xl text-[#C5C6C7]">{application.applicant.name}</CardTitle>
              <p className="text-sm text-gray-400">{new Date(application.createdAt).toLocaleDateString()}</p>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-gray-300">Email: <span className="font-semibold">{application.applicant.email}</span></p>
              <p className="mb-2 text-gray-300">Cover Letter:</p>
              <p className="text-gray-200">{application.coverLetter}</p>
              <div className="mt-4 flex space-x-4">
                <Button 
                  onClick={() => handleChoose(application.id, application.applicant.id)} 
                  className="bg-[#86C232] hover:bg-[#61892F] text-[#222629] transition duration-200">
                  Choose
                </Button>
                <Button 
                  onClick={() => handleViewProfile(application.applicant.id)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white transition duration-200">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
