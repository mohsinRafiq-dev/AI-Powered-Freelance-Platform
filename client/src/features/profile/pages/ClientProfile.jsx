/**
 * ClientProfile Page
 * Complete client profile with stats, company info, and posted jobs
 * Following Linkify architecture and UI/UX principles
 */

import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Globe, Phone, Mail, Edit2, Camera,
  Briefcase, DollarSign, Building2, Users, CheckCircle2,
  User, Calendar, TrendingUp, FileText, Sparkles, X
} from 'lucide-react';
import { useProfile, useUpdateProfile, useUploadAvatar } from '../hooks';
import { CNICStatusBadge } from '../components/CNICStatusBadge';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input, Textarea } from '../../../components/ui/input';
import { useSelector } from 'react-redux';
import { formatCurrency } from '@/utils/formatters';

export const ClientProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useProfile(userId);
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const profile = data?.data?.user;
  const isOwnProfile = !userId || currentUser?.id === profile?._id;

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        website: profile.website || '',
        companyName: profile.companyName || '',
        companySize: profile.companySize || '',
        industry: profile.industry || '',
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
      // Remove empty/undefined values before sending
      const dataToSave = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== '') {
          dataToSave[key] = formData[key];
        }
      });
      
      await updateProfile.mutateAsync(dataToSave);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
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

  const statsData = [
    { label: 'Posted Jobs', value: profile.postedJobsCount || 0, icon: FileText },
    { label: 'Active Jobs', value: profile.activeJobsCount || 0, icon: Briefcase },
    { label: 'Completed Projects', value: profile.completedJobsCount || 0, icon: CheckCircle2 },
    { label: 'Total Spent', value: formatCurrency(profile.totalSpent || 0, 'PKR'), icon: DollarSign },
  ];

  const companySizeOptions = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '500+', label: '501+ employees' },
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {profile.name}
                    </h1>
                    <CNICStatusBadge 
                      status={profile.cnicVerificationStatus} 
                      isOwnProfile={isOwnProfile}
                    />
                  </div>
                  {profile.companyName && (
                    <p className="text-xl text-brand dark:text-brand-light font-semibold mb-2 flex items-center justify-center md:justify-start gap-2">
                      <Building2 className="w-5 h-5" />
                      {profile.companyName}
                    </p>
                  )}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl">
                    {profile.bio || 'No bio available'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {profile.industry && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {profile.industry}
                      </span>
                    )}
                    {profile.companySize && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {profile.companySize}
                      </span>
                    )}
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
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Company Name"
                  />
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Bio - Tell us about your company and what you're looking for"
                    rows={3}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="Industry (e.g., Technology, Healthcare)"
                    />
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand dark:focus:border-brand-light transition-all"
                    >
                      <option value="">Select Company Size</option>
                      {companySizeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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
                      className="md:col-span-2"
                    />
                  </div>
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
                              companyName: profile.companyName || '',
                              companySize: profile.companySize || '',
                              industry: profile.industry || '',
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

        {/* Company Information */}
        {(profile.industry || profile.companySize) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-white to-brand-light/10 dark:from-gray-800 dark:to-brand-dark/10 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light shadow-lg hover:shadow-xl transition-all duration-300 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.industry && (
                <div className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Industry</p>
                  <p className="text-gray-900 dark:text-white font-semibold text-lg">{profile.industry}</p>
                </div>
              )}
              {profile.companySize && (
                <div className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Company Size</p>
                  <p className="text-gray-900 dark:text-white font-semibold text-lg">
                    {companySizeOptions.find(opt => opt.value === profile.companySize)?.label || profile.companySize}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        {isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-white to-brand-light/10 dark:from-gray-800 dark:to-brand-dark/10 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/jobs/create" className="group">
                <motion.div whileHover={{ y: -2 }} className="h-full">
                  <Button className="w-full h-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-6 h-6" />
                      <span className="font-semibold">Post New Job</span>
                    </div>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/jobs/my-jobs" className="group">
                <motion.div whileHover={{ y: -2 }} className="h-full">
                  <Button variant="outline" className="w-full h-full border-2 border-brand text-brand hover:bg-brand hover:text-white dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light dark:hover:text-white shadow-md hover:shadow-lg transition-all duration-300 py-6">
                    <div className="flex flex-col items-center gap-2">
                      <Briefcase className="w-6 h-6" />
                      <span className="font-semibold">View My Jobs</span>
                    </div>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/dashboard" className="group">
                <motion.div whileHover={{ y: -2 }} className="h-full">
                  <Button variant="outline" className="w-full h-full border-2 border-brand text-brand hover:bg-brand hover:text-white dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light dark:hover:text-white shadow-md hover:shadow-lg transition-all duration-300 py-6">
                    <div className="flex flex-col items-center gap-2">
                      <TrendingUp className="w-6 h-6" />
                      <span className="font-semibold">Go to Dashboard</span>
                    </div>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
