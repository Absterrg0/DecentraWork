'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Import your custom UI components
import { Button } from './ui/button';
import { useParams, useRouter } from 'next/navigation';

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

  const handleChoose = async (applicationId: number) => {
    try {
      await axios.post(`/api/applications/choose`, { applicationId });
      alert('Applicant chosen successfully!');
    } catch (error) {
      alert('Failed to choose applicant. Please try again.');
    }
  };

  const handleViewProfile = (applicantId: number) => {
    router.push(`/user/${applicantId}/view`); // Redirect to the applicant's profile page
  };

  if (isLoading) return <div className="text-center text-gray-400">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (applications.length === 0) return <div className="text-center">No applications found.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <h1 className="text-4xl mb-6 text-yellow-400">Applications for the Project</h1>
      <div className="space-y-4 w-full max-w-3xl">
        {applications.map((application) => (
          <Card key={application.id} className="bg-gray-800 border-gray-700 shadow-lg transition-transform hover:scale-105">
            <CardHeader>
              <CardTitle className="text-xl">{application.applicant.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-gray-300">Email: {application.applicant.email}</p>
              <p className="mb-2 text-gray-300">Cover Letter:</p>
              <p className="text-gray-200">{application.coverLetter}</p>
              <div className="mt-4 flex space-x-4">
                <Button 
                  onClick={() => handleChoose(application.id)} 
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                  Choose
                </Button>
                <Button 
                  onClick={() => handleViewProfile(application.applicant.id)} 
                  className="bg-blue-500 hover:bg-blue-600 text-gray-900">
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
