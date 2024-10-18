'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Search, X } from 'lucide-react';

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
  coverLetter: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
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
      case 'pending': return 'bg-yellow-600 text-yellow-100';
      case 'accepted': return 'bg-green-600 text-green-100';
      case 'rejected': return 'bg-red-600 text-red-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-green-900 p-4">
        <div className="text-center p-8 bg-gray-800 rounded-xl shadow-lg max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => session?.user?.id && fetchApplications(session.user.id)} className="bg-amber-600 hover:bg-amber-700 text-white transition-colors duration-200">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-700 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-amber-100 mb-8">Your Proposals</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Search className="text-amber-500" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-gray-700 border-gray-600 text-amber-100 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
              <SelectTrigger className="w-full md:w-40 bg-gray-700 border-gray-600 text-amber-100">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-amber-100">All Status</SelectItem>
                <SelectItem value="pending" className="text-amber-100">Pending</SelectItem>
                <SelectItem value="accepted" className="text-amber-100">Accepted</SelectItem>
                <SelectItem value="rejected" className="text-amber-100">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-40 bg-gray-700 border-gray-600 text-amber-100">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="date" className="text-amber-100">Date</SelectItem>
                <SelectItem value="budget" className="text-amber-100">Budget</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="text-center p-12 bg-gray-800 rounded-xl shadow-lg">
            <p className="text-amber-100 text-xl">No applications found.</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div 
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredApplications.map((application) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200 border-amber-700">
                    <CardHeader className="bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100 rounded-t-xl">
                      <CardTitle className="text-2xl">{application.project.title}</CardTitle>
                      <CardDescription className="text-amber-200 opacity-90">
                        {application.project.description.slice(0, 100)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow p-6 text-amber-100">
                      <p><strong>Budget:</strong> ${application.project.budget}</p>
                      <p><strong>Time Expected:</strong> {application.project.timeExpected}</p>
                      <div className="mt-4">
                        <strong>Skills Required:</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {application.project.skillsRequired.map((skill, index) => (
                            <Badge key={index} className="bg-amber-800 text-amber-100">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center p-6 bg-gray-700 rounded-b-xl">
                      <Badge className={`${getStatusColor(application.status)} text-sm font-medium px-3 py-1`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        onClick={() => setSelectedApplication(application)}
                        className="text-amber-400 border-amber-400 hover:bg-amber-900"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

<AnimatePresence>
  {selectedApplication && (
    <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <DialogContent className="bg-gray-900 border-amber-600 max-w-4xl shadow-lg rounded-lg">
          <DialogHeader className="bg-gradient-to-r from-amber-800 to-amber-600 text-amber-200 p-6 rounded-t-lg">
            <DialogTitle className="text-3xl font-bold">{selectedApplication?.project.title}</DialogTitle>
            <DialogDescription className="text-amber-300 opacity-80">{selectedApplication?.project.description}</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-6 text-amber-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Budget:</strong> ${selectedApplication?.project.budget}</p>
                <p><strong>Time Expected:</strong> {selectedApplication?.project.timeExpected}</p>
                <p>
                  <strong>Status:</strong> 
                  <span className={`${getStatusColor(selectedApplication?.status || 'pending')} px-2 py-1 rounded text-sm`}>
                    {selectedApplication?.status.charAt(0).toUpperCase() + selectedApplication?.status.slice(1)}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <strong>Skills Required:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedApplication?.project.skillsRequired.map((skill, index) => (
                    <Badge key={index} className="bg-amber-800 text-amber-100">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <strong className="text-xl mb-2 block">Cover Letter</strong>
              <div className="bg-gray-800 p-4 rounded-lg shadow-inner text-amber-100 max-h-60 overflow-y-auto">
                <p className="whitespace-pre-wrap">{selectedApplication?.coverLetter}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </motion.div>
    </Dialog>
  )}
</AnimatePresence>

      </div>
    </div>
  );
}