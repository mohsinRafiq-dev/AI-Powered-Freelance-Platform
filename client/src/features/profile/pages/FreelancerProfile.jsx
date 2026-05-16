/**
 * FreelancerProfile Page
 * Complete freelancer profile with stats, skills, portfolio, and experience
 * Following Linkify architecture and UI/UX principles
 */

import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Globe, Phone, Mail, Edit2, Camera,
  Briefcase, DollarSign, Clock, Award, Star, ExternalLink,
  Plus, X, CheckCircle2, User, Languages, Calendar, Sparkles, Trash2, Edit
} from 'lucide-react';
import { useProfile, useUpdateProfile, useUploadAvatar } from '../hooks';
import { useAddPortfolio, useUpdatePortfolio, useDeletePortfolio } from '../hooks/usePortfolio';
import { PortfolioModal } from '../components/PortfolioModal';
import { CNICStatusBadge } from '../components/CNICStatusBadge';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input, Textarea } from '../../../components/ui/input';
import { useSelector } from 'react-redux';
import { formatNumber, formatCurrency } from '@/utils/formatters';
import { useProposalStats } from '@/hooks/api';

export const FreelancerProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { data, isLoading, isError, refetch } = useProfile(userId);
  const { data: proposalStatsResponse } = useProposalStats();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const addPortfolio = useAddPortfolio();
  const updatePortfolioMutation = useUpdatePortfolio();
  const deletePortfolioMutation = useDeletePortfolio();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);

  const profile = data?.data?.user;
  const isOwnProfile = !userId || currentUser?.id === profile?._id;

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      console.log('Profile loaded:', {
        portfolioCount: profile.portfolio?.length || 0,
        portfolio: profile.portfolio
      });
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        website: profile.website || '',
        hourlyRate: profile.hourlyRate || '',
        availability: profile.availability || 'available',
        skills: profile.skills || [],
        languages: profile.languages || [],
      });
    }
  }, [profile]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadAvatar.mutateAsync(file);
      } catch (error) {
        console.error('Failed to upload avatar:', error);
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Filter out empty skills and ensure array has at least 1 item if skills exist
      const filteredSkills = formData.skills?.filter(skill => skill && skill.trim()) || [];
      const dataToSave = {
        ...formData,
        skills: filteredSkills.length > 0 ? filteredSkills : undefined,
      };
      
      // Remove undefined values
      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] === undefined || dataToSave[key] === '') {
          delete dataToSave[key];
        }
      });
      
      await updateProfile.mutateAsync(dataToSave);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleAddPortfolioItem = async (portfolioData) => {
    try {
      console.log('Adding portfolio item:', portfolioData);
      await addPortfolio.mutateAsync(portfolioData);
      setIsPortfolioModalOpen(false);
      // Force refetch profile data
      await refetch();
      console.log('Portfolio added and profile refetched');
    } catch (error) {
      console.error('Failed to add portfolio item:', error);
    }
  };

  const handleUpdatePortfolioItem = async (portfolioData) => {
    if (editingPortfolio) {
      try {
        console.log('Updating portfolio item:', portfolioData);
        await updatePortfolioMutation.mutateAsync({
          portfolioId: editingPortfolio._id,
          data: portfolioData,
        });
        setIsPortfolioModalOpen(false);
        setEditingPortfolio(null);
        // Force refetch profile data
        await refetch();
        console.log('Portfolio updated and profile refetched');
      } catch (error) {
        console.error('Failed to update portfolio item:', error);
      }
    }
  };

  const handleDeletePortfolioItem = async (portfolioId) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        console.log('Deleting portfolio item:', portfolioId);
        await deletePortfolioMutation.mutateAsync(portfolioId);
        // Force refetch profile data
        await refetch();
        console.log('Portfolio deleted and profile refetched');
      } catch (error) {
        console.error('Failed to delete portfolio item:', error);
      }
    }
  };

  const handleEditPortfolio = (item) => {
    setEditingPortfolio(item);
    setIsPortfolioModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPortfolioModalOpen(false);
    setEditingPortfolio(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 pt-24 lg:pt-28">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 pt-24 lg:pt-28">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile not found</h2>
          <Button onClick={() => navigate(-1)} className="bg-brand hover:bg-brand-dark text-white">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const proposalStats = proposalStatsResponse?.data?.stats;
  const activeProposalsCount = proposalStats?.pending ?? profile.activeProposalsCount ?? 0;

  const statsData = [
    { label: 'Completed Jobs', value: profile.completedJobsCount || 0, icon: CheckCircle2 },
    { label: 'Active Proposals', value: formatNumber(activeProposalsCount), icon: Briefcase },
    { label: 'Total Earnings', value: formatCurrency(profile.totalEarnings || 0, 'PKR'), icon: DollarSign },
    { label: 'Hourly Rate', value: `${formatCurrency(profile.hourlyRate || 0, 'PKR')}/hr`, icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-brand/20 via-brand-light/20 to-brand/20 dark:from-brand/30 dark:via-brand-light/20 dark:to-brand/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-brand/20 dark:border-brand/30 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-light to-brand dark:from-brand-dark dark:to-brand-deepest flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white dark:ring-gray-900">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              {isOwnProfile && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white p-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-110"
                    disabled={uploadAvatar.isPending}
                  >
                    {uploadAvatar.isPending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {!isEditing ? (
                <>
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-2">
                    <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {profile.name}
                      </h1>
                      <Badge
                        className={
                          profile.availability === 'available'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : profile.availability === 'busy'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }
                      >
                        {profile.availability === 'not-available' ? 'Not Available' : 
                         profile.availability === 'available' ? 'Available' : 'Busy'}
                      </Badge>
                      <CNICStatusBadge 
                        status={profile.cnicVerificationStatus} 
                        isOwnProfile={isOwnProfile}
                      />
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl">
                    {profile.bio || 'No bio available'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {profile.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </span>
                    )}
                    {profile.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {profile.email}
                      </span>
                    )}
                    {profile.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {profile.phone}
                      </span>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-brand hover:text-brand-dark"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-4 w-full">
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                  />
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Bio - Tell us about yourself and your expertise"
                    rows={3}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Location"
                    />
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone"
                    />
                    <Input
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="Website"
                    />
                    <Input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      placeholder="Hourly Rate (PKR)"
                    />
                  </div>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand dark:focus:border-brand-light transition-all"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="not-available">Not Available</option>
                  </select>
                </div>
              )}
              
              {isOwnProfile && (
                <div className="mt-6 flex gap-3 justify-center md:justify-start">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={updateProfile.isPending}
                        className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {updateProfile.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </div>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form data
                          if (profile) {
                            setFormData({
                              name: profile.name || '',
                              bio: profile.bio || '',
                              location: profile.location || '',
                              phone: profile.phone || '',
                              website: profile.website || '',
                              hourlyRate: profile.hourlyRate || '',
                              availability: profile.availability || 'available',
                              skills: profile.skills || [],
                              languages: profile.languages || [],
                            });
                          }
                        }}
                        variant="outline"
                        className="border-2 border-brand text-brand hover:bg-brand hover:text-white dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light dark:hover:text-white transition-all duration-300"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative bg-gradient-to-br from-white to-brand-light/10 dark:from-gray-800 dark:to-brand-dark/10 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand/5 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-brand-dark dark:from-brand-light dark:to-brand flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-white to-brand-light/10 dark:from-gray-800 dark:to-brand-dark/10 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light shadow-lg hover:shadow-xl transition-all duration-300 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              Skills & Expertise
            </h2>
            {isEditing && (
              <Badge className="bg-gradient-to-r from-brand to-brand-dark text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                Editing
              </Badge>
            )}
          </div>
          
          {isEditing && (
            <div className="mb-6">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a skill (e.g., React, Node.js, UI/UX Design)"
                  className="flex-1"
                />
                <Button
                  onClick={handleAddSkill}
                  className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white"
                  disabled={!newSkill.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Press Enter or click + to add</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            {(isEditing ? formData.skills : profile.skills || []).length > 0 ? (
              (isEditing ? formData.skills : profile.skills || []).map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge
                    className="bg-gradient-to-r from-brand/10 to-brand-dark/10 text-brand dark:text-brand-light border-2 border-brand/20 dark:border-brand-light/20 hover:border-brand dark:hover:border-brand-light px-4 py-2 text-sm font-medium transition-all duration-300 hover:shadow-md"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </Badge>
                </motion.div>
              ))
            ) : (
              <div className="w-full text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No skills added yet</p>
                {isOwnProfile && !isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="mt-4 border-brand text-brand hover:bg-brand hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skills
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Portfolio Section */}
        {(profile.portfolio && profile.portfolio.length > 0) || isOwnProfile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-white to-brand-light/10 dark:from-gray-800 dark:to-brand-dark/10 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                Portfolio
              </h2>
              <div className="flex items-center gap-3">
                {profile.portfolio && profile.portfolio.length > 0 && (
                  <Badge className="bg-gradient-to-r from-brand/10 to-brand-dark/10 text-brand border-brand/20">
                    {profile.portfolio.length} {profile.portfolio.length === 1 ? 'Project' : 'Projects'}
                  </Badge>
                )}
                {isOwnProfile && (
                  <Button
                    onClick={() => {
                      setEditingPortfolio(null);
                      setIsPortfolioModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                )}
              </div>
            </div>

            {profile.portfolio && profile.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.portfolio.map((item, index) => (
                  <motion.div
                    key={item._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="group relative bg-white dark:bg-gray-700 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-brand dark:hover:border-brand-light shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand/10 to-transparent rounded-bl-full" />
                    
                    {/* Action buttons for own profile */}
                    {isOwnProfile && (
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={() => handleEditPortfolio(item)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePortfolioItem(item._id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="relative">
                      {item.image && (
                        <div className="w-full h-40 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-brand-light/20 to-brand/20 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              // Show placeholder if image fails to load
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                            }}
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {item.description}
                      </p>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand font-medium text-sm group-hover:gap-3 transition-all"
                        >
                          View Project
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="w-full text-center py-12">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">No portfolio items yet</p>
                {isOwnProfile && (
                  <Button
                    onClick={() => {
                      setEditingPortfolio(null);
                      setIsPortfolioModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Project
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        ) : null}

        {/* Portfolio Modal */}
        <PortfolioModal
          isOpen={isPortfolioModalOpen}
          onClose={handleCloseModal}
          onSave={editingPortfolio ? handleUpdatePortfolioItem : handleAddPortfolioItem}
          initialData={editingPortfolio}
        />
      </div>
    </div>
  );
};
