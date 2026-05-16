import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileImage, 
  AlertCircle,
  ArrowLeft,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useCNICStatus, useSubmitCNIC } from '../hooks/useCNICVerification';
import { ButtonLoader } from '../../../components/common/Loader';
import toast from 'react-hot-toast';

// CNIC format validation
const validateCNIC = (cnic) => {
  // Remove spaces
  const cleaned = cnic.trim().replace(/\s/g, '');
  
  // Check format: XXXXX-XXXXXXX-X
  const pattern = /^\d{5}-\d{7}-\d{1}$/;
  
  // If no dashes, try to add them
  if (/^\d{13}$/.test(cleaned)) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12)}`;
  }
  
  return pattern.test(cleaned) ? cleaned : null;
};

export default function CNICVerification() {
  const navigate = useNavigate();
  const { data: cnicStatus, isLoading: statusLoading } = useCNICStatus();
  const submitCNIC = useSubmitCNIC();

  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const status = cnicStatus?.cnic?.status || cnicStatus?.status || 'not_submitted';
  const hasFrontImage = cnicStatus?.cnic?.frontImage || frontPreview;
  const hasBackImage = cnicStatus?.cnic?.backImage || backPreview;

  const handleFrontUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setFrontFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFrontPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBackUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setBackFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setBackPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both images are uploaded
    if (!frontFile || !backFile) {
      toast.error('Please upload both CNIC front and back images');
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('frontImage', frontFile);
    formData.append('backImage', backFile);

    try {
      await submitCNIC.mutateAsync(formData);
      
      // Show success message and redirect to profile after a short delay
      toast.success('CNIC submitted successfully! Redirecting to your profile...', {
        duration: 2000,
      });
      
      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile/me');
      }, 2000);
    } catch (error) {
      // Error handled by hook
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500 text-white">
            <Clock className="w-4 h-4 mr-1" />
            Pending Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500 text-white">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 text-white">
            <AlertCircle className="w-4 h-4 mr-1" />
            Not Submitted
          </Badge>
        );
    }
  };

  if (statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ButtonLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">CNIC Verification</h1>
          </div>
          <p className="text-gray-600">
            Verify your identity by submitting your CNIC. This helps us maintain a secure platform.
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Current status of your CNIC verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge()}
                  </div>
                  {status === 'verified' && cnicStatus?.verifiedAt && (
                    <p className="text-sm text-gray-600">
                      Verified on {new Date(cnicStatus.verifiedAt).toLocaleDateString()}
                    </p>
                  )}
                  {status === 'rejected' && cnicStatus?.rejectionReason && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800 font-medium">Rejection Reason:</p>
                      <p className="text-sm text-red-700">{cnicStatus.rejectionReason}</p>
                    </div>
                  )}
                  {status === 'pending' && (
                    <p className="text-sm text-gray-600 mt-2">
                      Your CNIC is under review. We'll notify you once the verification is complete.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Verification Form - Only show if not verified */}
        {status !== 'verified' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Submit CNIC for Verification</CardTitle>
                <CardDescription>
                  Upload clear images of your CNIC front and back, then enter your CNIC number
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* CNIC Front Upload */}
                  <div>
                    <Label htmlFor="cnicFront" className="mb-2 block">
                      CNIC Front Image <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-2">
                      <input
                        ref={frontInputRef}
                        type="file"
                        id="cnicFront"
                        accept="image/*,application/pdf"
                        onChange={handleFrontUpload}
                        className="hidden"
                        disabled={status === 'pending'}
                      />
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => frontInputRef.current?.click()}
                          disabled={status === 'pending'}
                          className="flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {hasFrontImage ? 'Change Front Image' : 'Upload Front Image'}
                        </Button>

                      </div>
                      {frontPreview && (
                        <div className="mt-4">
                          {frontPreview === 'pdf' ? (
                            <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-md">
                              <FileImage className="w-5 h-5 text-gray-600" />
                              <span className="text-sm text-gray-700">PDF Document</span>
                            </div>
                          ) : (
                            <img
                              src={frontPreview}
                              alt="CNIC Front Preview"
                              className="max-w-xs rounded-md border border-gray-300"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CNIC Back Upload */}
                  <div>
                    <Label htmlFor="cnicBack" className="mb-2 block">
                      CNIC Back Image <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-2">
                      <input
                        ref={backInputRef}
                        type="file"
                        id="cnicBack"
                        accept="image/*,application/pdf"
                        onChange={handleBackUpload}
                        className="hidden"
                        disabled={status === 'pending'}
                      />
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => backInputRef.current?.click()}
                          disabled={status === 'pending'}
                          className="flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {hasBackImage ? 'Change Back Image' : 'Upload Back Image'}
                        </Button>

                      </div>
                      {backPreview && (
                        <div className="mt-4">
                          {backPreview === 'pdf' ? (
                            <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-md">
                              <FileImage className="w-5 h-5 text-gray-600" />
                              <span className="text-sm text-gray-700">PDF Document</span>
                            </div>
                          ) : (
                            <img
                              src={backPreview}
                              alt="CNIC Back Preview"
                              className="max-w-xs rounded-md border border-gray-300"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={
                      !frontFile ||
                      !backFile ||
                      status === 'pending' ||
                      submitCNIC.isPending
                    }
                    className="w-full"
                  >
                    {submitCNIC.isPending ? (
                      <>
                        <ButtonLoader />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Submit for Verification
                      </>
                    )}
                  </Button>

                  {status === 'rejected' && (
                    <p className="text-sm text-gray-600 text-center">
                      You can resubmit your CNIC after addressing the rejection reason above.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ensure images are clear and all details are visible</li>
                    <li>• CNIC number must match the document exactly</li>
                    <li>• Verification typically takes 24-48 hours</li>
                    <li>• Your CNIC information is kept secure and confidential</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

