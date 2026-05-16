import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import {
  useCNICDetails,
  useApproveCNIC,
  useRejectCNIC,
  useRequestReupload,
} from '../../../hooks/admin/useCNICVerification';
import { Button } from '../../../components/ui/button';
import { formatDate } from '../../../utils/formatters';
import { useHasPermission } from '../../../hooks/admin/usePermissions';
import { PERMISSIONS } from '../../../utils/permissions';

const CNICDetailsModal = ({ userId, onClose }) => {
  const { data, isLoading } = useCNICDetails(userId);
  const approveMutation = useApproveCNIC();
  const rejectMutation = useRejectCNIC();
  const reuploadMutation = useRequestReupload();

  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showReuploadForm, setShowReuploadForm] = useState(false);

  // Permission checks
  const canVerifyCNIC = useHasPermission(PERMISSIONS.VERIFY_CNIC);
  const canRejectCNIC = useHasPermission(PERMISSIONS.REJECT_CNIC);

  const user = data?.data;
  const cnic = user?.cnic;

  // Debug: Log CNIC image paths
  if (cnic) {
    const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    console.log('🖼️ CNIC Image Paths:', {
      frontImage: cnic.frontImage,
      backImage: cnic.backImage,
      fullFrontURL: cnic.frontImage ? `${baseURL}${cnic.frontImage.startsWith('/') ? cnic.frontImage : '/' + cnic.frontImage}` : null,
      fullBackURL: cnic.backImage ? `${baseURL}${cnic.backImage.startsWith('/') ? cnic.backImage : '/' + cnic.backImage}` : null
    });
  }

  // Pre-fill form with OCR data if available
  const [formData, setFormData] = useState(() => {
    if (cnic?.ocrData) {
      return {
        number: cnic.ocrData.extractedCnicNumber || '',
        fullName: cnic.ocrData.extractedName || '',
        dateOfBirth: cnic.ocrData.extractedDateOfBirth 
          ? new Date(cnic.ocrData.extractedDateOfBirth).toISOString().split('T')[0]
          : '',
        issueDate: '',
        expiryDate: '',
      };
    }
    return {
      number: '',
      fullName: '',
      dateOfBirth: '',
      issueDate: '',
      expiryDate: '',
    };
  });

  const [reason, setReason] = useState('');

  const handleApprove = (e) => {
    e.preventDefault();
    approveMutation.mutate(
      { userId, cnicData: formData },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (reason.length < 10) {
      return;
    }
    rejectMutation.mutate(
      { userId, reason },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleReupload = (e) => {
    e.preventDefault();
    if (reason.length < 10) {
      return;
    }
    reuploadMutation.mutate(
      { userId, reason },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-brand-deepest dark:text-white">
                CNIC Verification
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {user?.name} - {user?.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* User Profile Details Section */}
            <div className="bg-gradient-to-r from-brand/10 to-brand-light/10 border border-brand/20 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-brand-deepest dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                User Profile Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Profile Picture */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center gap-4 pb-4 border-b border-brand/10">
                  <div className="w-20 h-20 rounded-full bg-brand/20 flex items-center justify-center overflow-hidden">
                    {user?.profilePicture ? (
                      <img 
                        src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.profilePicture}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-brand">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user?.role === 'freelancer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        user?.role === 'client' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}>
                        {user?.role?.toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user?.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {user?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.location || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date Joined</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </p>
                </div>

                {/* Freelancer-specific details */}
                {user?.role === 'freelancer' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hourly Rate</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.hourlyRate ? `PKR ${user.hourlyRate}/hr` : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Experience</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.experience || 'Not provided'}
                      </p>
                    </div>
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {user?.skills && user.skills.length > 0 ? (
                          user.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-brand/10 text-brand-deepest dark:bg-brand-light/10 dark:text-brand-light"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No skills listed</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Client-specific details */}
                {user?.role === 'client' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Company Name</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.companyName || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Company Size</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.companySize || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Industry</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.industry || 'Not provided'}
                      </p>
                    </div>
                  </>
                )}

                {/* Bio */}
                {user?.bio && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bio</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {user.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* OCR Extracted Data Section (always show if OCR was attempted) */}
            {cnic?.ocrData && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-400 dark:border-blue-600 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>🤖 OCR Suggestions (Template-Based)</span>
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    cnic.ocrData.confidence === 0 ? 'bg-red-500 text-white' :
                    cnic.ocrData.confidence >= 70 ? 'bg-green-500 text-white' :
                    cnic.ocrData.confidence >= 40 ? 'bg-yellow-500 text-white' :
                    'bg-orange-500 text-white'
                  }`}>
                    {cnic.ocrData.confidence === 0 ? 'Failed' : `${cnic.ocrData.confidence?.toFixed(0)}%`}
                  </span>
                </div>
                
                {cnic.ocrData.confidence >= 70 && (
                  <div className="mb-4 flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-blue-800 dark:text-blue-300">✓ High Confidence Suggestion</p>
                      <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                        OCR successfully extracted data from CNIC template. Click "Auto-fill" below to use these suggestions, then verify against the images.
                      </p>
                    </div>
                  </div>
                )}
                
                {cnic.ocrData.confidence >= 40 && cnic.ocrData.confidence < 70 && (
                  <div className="mb-4 flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300">⚠️ Medium Confidence Suggestion</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                        OCR extracted some data but verify carefully against the images before approving.
                      </p>
                    </div>
                  </div>
                )}
                
                {cnic.ocrData.confidence === 0 && (
                  <div className="mb-4 flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-red-800 dark:text-red-300">❌ OCR Extraction Failed</p>
                      <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                        Could not detect CNIC number from images. Please manually enter all details from the images below.
                      </p>
                      {cnic.ocrData.error && (
                        <p className="text-xs text-red-600 dark:text-red-500 mt-1 font-mono">
                          Debug: {cnic.ocrData.error}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {cnic.ocrData.confidence > 0 && cnic.ocrData.confidence < 40 && (
                  <div className="mb-4 flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/20 border-l-4 border-gray-500 rounded">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-300">ℹ️ Low Confidence</p>
                      <p className="text-xs text-gray-700 dark:text-gray-400 mt-1">
                        OCR detected something but not confident. Please verify carefully against images.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">CNIC Number</label>
                    <p className="text-base font-mono font-bold text-gray-900 dark:text-white mt-1">
                      {cnic.ocrData.extractedCnicNumber || <span className="text-gray-400 italic">Not detected</span>}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Name</label>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                      {cnic.ocrData.extractedName || <span className="text-gray-400 italic">Not detected</span>}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Father's Name</label>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                      {cnic.ocrData.extractedFatherName || <span className="text-gray-400 italic">Not detected</span>}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date of Birth</label>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                      {cnic.ocrData.extractedDateOfBirth 
                        ? new Date(cnic.ocrData.extractedDateOfBirth).toLocaleDateString('en-PK', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : <span className="text-gray-400 italic">Not detected</span>}
                    </p>
                  </div>
                </div>
                
                {/* Validation Warnings */}
                {cnic.ocrData.extractedName && user && (
                  <div className="mt-4 space-y-2">
                    {cnic.ocrData.extractedName.toLowerCase().trim() !== user.name.toLowerCase().trim() && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded">
                        <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300">Name Mismatch Detected</p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                            Profile Name: <strong className="font-mono">{user.name}</strong>
                            <br />
                            CNIC Name: <strong className="font-mono">{cnic.ocrData.extractedName}</strong>
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {cnic.ocrData.confidence < 70 && (
                      <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded">
                        <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-orange-800 dark:text-orange-300">Low OCR Confidence</p>
                          <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
                            The extracted data may not be accurate. Please verify manually with the images.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* CNIC Images */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-brand-deepest dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                CNIC Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Front Image */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Front Image
                  </h4>
                  {cnic?.frontImage ? (
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-2 relative">
                      <img
                        src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${cnic.frontImage.startsWith('/') ? cnic.frontImage : '/' + cnic.frontImage}`}
                        alt="CNIC Front"
                        className="w-full h-auto object-contain rounded cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={(e) => {
                          if (!e.target.src.includes('data:image/svg')) {
                            window.open(e.target.src, '_blank');
                          }
                        }}
                        onError={(e) => {
                          console.error('❌ Failed to load front image:', cnic.frontImage);
                          console.error('📍 Attempted URL:', e.target.src);
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          if (!parent.querySelector('.error-message')) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'error-message w-full h-48 flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 rounded border-2 border-red-200 dark:border-red-800';
                            errorDiv.innerHTML = `
                              <svg class="w-12 h-12 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              <p class="text-sm font-semibold text-red-600 dark:text-red-400">Image Not Found</p>
                              <p class="text-xs text-red-500 dark:text-red-500 mt-1 px-4 text-center">The file may have been deleted or moved.</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">${cnic.frontImage.split('/').pop()}</p>
                            `;
                            parent.appendChild(errorDiv);
                          }
                        }}
                        title="Click to view full size"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No image uploaded</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Back Image */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Back Image
                  </h4>
                  {cnic?.backImage ? (
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-2 relative">
                      <img
                        src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${cnic.backImage.startsWith('/') ? cnic.backImage : '/' + cnic.backImage}`}
                        alt="CNIC Back"
                        className="w-full h-auto object-contain rounded cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={(e) => {
                          if (!e.target.src.includes('data:image/svg')) {
                            window.open(e.target.src, '_blank');
                          }
                        }}
                        onError={(e) => {
                          console.error('❌ Failed to load back image:', cnic.backImage);
                          console.error('📍 Attempted URL:', e.target.src);
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          if (!parent.querySelector('.error-message')) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'error-message w-full h-48 flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 rounded border-2 border-red-200 dark:border-red-800';
                            errorDiv.innerHTML = `
                              <svg class="w-12 h-12 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              <p class="text-sm font-semibold text-red-600 dark:text-red-400">Image Not Found</p>
                              <p class="text-xs text-red-500 dark:text-red-500 mt-1 px-4 text-center">The file may have been deleted or moved.</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">${cnic.backImage.split('/').pop()}</p>
                            `;
                            parent.appendChild(errorDiv);
                          }
                        }}
                        title="Click to view full size"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No image uploaded</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Current CNIC Data (if exists) */}
            {cnic?.number && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Current CNIC Data
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-blue-700 dark:text-blue-300">CNIC:</span>
                    <span className="ml-2 text-blue-900 dark:text-blue-100 font-medium">
                      {cnic.number}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-300">Name:</span>
                    <span className="ml-2 text-blue-900 dark:text-blue-100 font-medium">
                      {cnic.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-300">DOB:</span>
                    <span className="ml-2 text-blue-900 dark:text-blue-100 font-medium">
                      {cnic.dateOfBirth ? formatDate(cnic.dateOfBirth) : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-300">Expiry:</span>
                    <span className="ml-2 text-blue-900 dark:text-blue-100 font-medium">
                      {cnic.expiryDate ? formatDate(cnic.expiryDate) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Approve Form */}
            {showApproveForm && (
              <form onSubmit={handleApprove} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
                    Enter CNIC Details
                  </h3>
                  {cnic?.ocrData && cnic.ocrData.extractedCnicNumber && (
                    <button
                      type="button"
                      onClick={() => {
                        setApproveData({
                          number: cnic.ocrData.extractedCnicNumber || '',
                          fullName: cnic.ocrData.extractedName || '',
                          fatherName: cnic.ocrData.extractedFatherName || '',
                          dateOfBirth: cnic.ocrData.extractedDateOfBirth 
                            ? new Date(cnic.ocrData.extractedDateOfBirth).toISOString().split('T')[0] 
                            : '',
                          expiryDate: '',
                          adminNotes: `Auto-filled from OCR (${cnic.ocrData.confidence?.toFixed(0)}% confidence) - Verified by admin`
                        });
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Auto-fill from OCR
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CNIC Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="XXXXX-XXXXXXX-X"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Issue Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button type="submit" disabled={approveMutation.isLoading}>
                    {approveMutation.isLoading ? 'Approving...' : 'Confirm Approval'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowApproveForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Reject Form */}
            {showRejectForm && (
              <form onSubmit={handleReject} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-4">
                  Rejection Reason
                </h3>
                <textarea
                  required
                  minLength={10}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for rejection (min 10 characters)..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-24"
                />
                <div className="flex gap-2 mt-4">
                  <Button type="submit" variant="outline" disabled={rejectMutation.isLoading || reason.length < 10}>
                    {rejectMutation.isLoading ? 'Rejecting...' : 'Confirm Rejection'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowRejectForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Reupload Form */}
            {showReuploadForm && (
              <form onSubmit={handleReupload} className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-4">
                  Request Re-upload Reason
                </h3>
                <textarea
                  required
                  minLength={10}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for requesting re-upload (min 10 characters)..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-24"
                />
                <div className="flex gap-2 mt-4">
                  <Button type="submit" variant="outline" disabled={reuploadMutation.isLoading || reason.length < 10}>
                    {reuploadMutation.isLoading ? 'Requesting...' : 'Request Re-upload'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowReuploadForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Actions */}
          {!showApproveForm && !showRejectForm && !showReuploadForm && cnic?.status === 'pending' && (canVerifyCNIC || canRejectCNIC) && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              {canVerifyCNIC && (
                <Button
                  onClick={() => setShowApproveForm(true)}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
              )}
              {canRejectCNIC && (
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(true)}
                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
              )}
              {canRejectCNIC && (
                <Button
                  variant="outline"
                  onClick={() => setShowReuploadForm(true)}
                  className="flex items-center gap-2 text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  Request Re-upload
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CNICDetailsModal;
