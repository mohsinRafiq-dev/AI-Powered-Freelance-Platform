/**
 * Profile Component
 * Dynamically renders FreelancerProfile or ClientProfile based on user role
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FreelancerProfile } from './FreelancerProfile';
import { ClientProfile } from './ClientProfile';
import { useProfile } from '../hooks';

export const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { data, isLoading } = useProfile(userId);

  const profile = data?.data?.user;

  // Determine which profile to show
  // If viewing own profile, use currentUser.role
  // If viewing someone else's profile, use profile.role from fetched data
  const userRole = userId ? profile?.role : currentUser?.role;

  if (isLoading && userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 pt-24 lg:pt-28">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  // Render appropriate profile based on role
  if (userRole === 'client') {
    return <ClientProfile />;
  }

  return <FreelancerProfile />;
};
