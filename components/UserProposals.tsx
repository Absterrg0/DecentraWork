'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Project {
  title: string;
  description: string;
  budget: number;
  timeExpected: string;
  skillsRequired: string[];
}

interface Application {
  id: string;
  project: Project;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  coverLetter: string
}

type SortOption = 'date' | 'budget';
type FilterStatus = 'all' | 'pending' | 'accepted' | 'rejected';

export default function UserProposalsComponent() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const fetchApplications = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/account/${userId}/proposals`);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      setApplications(data.proposals);
      setFilteredApplications(data.proposals);
    } catch (err) {
      setError('Failed to fetch applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchApplications(session.user.id);
    }
  }, [session, status, fetchApplications]);

  useEffect(() => {
    let result = applications;

    if (filterStatus !== 'all') {
      result = result.filter(app => app.status === filterStatus);
    }

    if (searchTerm) {
      result = result.filter(app => 
        app.project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'budget') {
        return b.project.budget - a.project.budget;
      }
      return 0;
    });

    setFilteredApplications(result);
  }, [applications, filterStatus, sortBy, searchTerm]);

  const getStatusColor = (status: Application['status']): string => {
    switch (status) {
      case 'pending': return 'text-[#FFA500]';
      case 'accepted': return 'text-[#4CAF50]';
      case 'rejected': return 'text-[#F44336]';
      default: return 'text-gray-100';
    }
  };

  const renderSkillsBadges = (skills: string[]) => {
    const skillRows = [];
  
    // Split skills into chunks of 6
    for (let i = 0; i < skills.length; i += 6) {
      skillRows.push(skills.slice(i, i + 6));
    }
  
    return (
      <div>
        {skillRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap mb-2">
            {row.map(skill => (
              <span key={skill} className="inline-block bg-[#86C232] text-[#1A1C1E] text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                {skill}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  };
  

  const handleViewCoverLetter = (application: Application) => {
    setSelectedApplication(application);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedApplication(null);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#222629]">
        <Loader2 className="h-8 w-8 animate-spin text-[#86C232]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#222629] p-4">
        <div className="text-center p-8 bg-[#2F3439] rounded-xl shadow-lg max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => session?.user?.id && fetchApplications(session.user.id)} className="bg-[#86C232] hover:bg-[#61892F] text-white transition-colors duration-200">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#222629] to-[#2F3439] p-8 text-[#C5C6C7]">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-[#86C232] mb-8">Your Proposals</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#2F3439] p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Search className="text-[#86C232]" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-[#2F3439] border-[#86C232] text-[#C5C6C7] focus:border-[#86C232] focus:ring-[#86C232]"
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
              <SelectTrigger className="w-full md:w-40 bg-[#2F3439] border-[#86C232] text-[#C5C6C7]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-[#2F3439] border-[#86C232]">
                <SelectItem value="all" className="text-[#C5C6C7]">All Status</SelectItem>
                <SelectItem value="pending" className="text-[#C5C6C7]">Pending</SelectItem>
                <SelectItem value="accepted" className="text-[#C5C6C7]">Accepted</SelectItem>
                <SelectItem value="rejected" className="text-[#C5C6C7]">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-40 bg-[#2F3439] border-[#86C232] text-[#C5C6C7]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#2F3439] border-[#86C232]">
                <SelectItem value="date" className="text-[#C5C6C7]">Date</SelectItem>
                <SelectItem value="budget" className="text-[#C5C6C7]">Budget</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="text-center p-12 bg-[#2F3439] rounded-xl shadow-lg">
            <p className="text-[#86C232] text-xl">No applications found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-[#2F3439] rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-[#86C232]">
              <thead className="bg-[#1A1C1E]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#C5C6C7] uppercase tracking-wider">Project Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#C5C6C7] uppercase tracking-wider">Skills Required</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#C5C6C7] uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#C5C6C7] uppercase tracking-wider">Applied On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#C5C6C7] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#C5C6C7] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#2F3439] divide-y divide-[#86C232]">
                {filteredApplications.map(application => (
                  <tr key={application.id} className="hover:bg-[#1A1C1E] transition duration-150">
<td className="px-6 py-4 whitespace-nowrap text-sm text-[#C5C6C7]">
  {application.project.title.length > 20 
    ? `${application.project.title.slice(0, 20)}...` 
    : application.project.title}
</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#C5C6C7]">{renderSkillsBadges(application.project.skillsRequired)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#C5C6C7]">${application.project.budget}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#C5C6C7]">{new Date(application.createdAt).toLocaleDateString()}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button onClick={() => handleViewCoverLetter(application)} className="bg-[#86C232] hover:bg-[#61892F] text-white transition-colors duration-200">
                        View Cover Letter
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AnimatePresence>
          {isDialogOpen && selectedApplication && (
            <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
              <DialogContent className="max-w-2xl bg-[#2F3439] rounded-lg shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-[#86C232]">Cover Letter</DialogTitle>
                  <DialogDescription className="text-[#C5C6C7]">{selectedApplication.coverLetter}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={closeDialog} className="bg-[#86C232] hover:bg-[#61892F] text-white transition-colors duration-200">
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
