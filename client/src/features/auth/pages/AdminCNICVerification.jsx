import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye,
  ArrowLeft,
  Search,
  FileImage,
  User,
  Mail
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Textarea } from '../../../components/ui/input';
import { 
  usePendingCNICVerifications, 
  useVerifyCNIC 
} from '../hooks/useCNICVerification';
import { ButtonLoader } from '../../../components/common/Loader';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function AdminCNICVerification() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, refetch } = usePendingCNICVerifications(page, 10);
  const verifyCNIC = useVerifyCNIC();

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600">You must be an admin to access this page.</p>
              <Button onClick={() => navigate(-1)} className="mt-4">
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const verifications = data?.verifications || [];
  const pagination = data?.pagination || {};

  const handleVerify = async (userId, status) => {
    if (status === 'rejected' && !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await verifyCNIC.mutateAsync({
        userId,
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : null
      });
      setSelectedUser(null);
      setRejectionReason('');
      refetch();
    } catch (error) {
      // Error handled by hook
    }
  };

  const filteredVerifications = verifications.filter(v => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      v.name?.toLowerCase().includes(search) ||
      v.email?.toLowerCase().includes(search) ||
      v.cnicNumber?.toLowerCase().includes(search)
    );
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const serverBaseURL = apiBaseURL.replace('/api', '');
    return `${serverBaseURL}${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-900">CNIC Verification Review</h1>
          </div>
          <p className="text-gray-600">
            Review and verify CNIC submissions from users
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or CNIC number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <ButtonLoader />
          </div>
        ) : filteredVerifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Verifications</h3>
              <p className="text-gray-600">All CNIC verifications have been processed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVerifications.map((verification) => (
              <motion.div
                key={verification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{verification.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3" />
                          {verification.email}
                        </CardDescription>
                      </div>
                      <Badge className="bg-yellow-500 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500">CNIC Number</Label>
                      <p className="font-mono text-sm">{verification.cnicNumber}</p>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500 mb-2 block">CNIC Documents</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {verification.cnicFrontImage && (
                          <div className="relative group">
                            <img
                              src={getImageUrl(verification.cnicFrontImage)}
                              alt="CNIC Front"
                              className="w-full h-32 object-cover rounded-md border border-gray-200 cursor-pointer"
                              onClick={() => {
                                setSelectedUser(verification);
                                window.open(getImageUrl(verification.cnicFrontImage), '_blank');
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md flex items-center justify-center">
                              <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
                            </div>
                            <p className="text-xs text-center mt-1 text-gray-600">Front</p>
                          </div>
                        )}
                        {verification.cnicBackImage && (
                          <div className="relative group">
                            <img
                              src={getImageUrl(verification.cnicBackImage)}
                              alt="CNIC Back"
                              className="w-full h-32 object-cover rounded-md border border-gray-200 cursor-pointer"
                              onClick={() => {
                                setSelectedUser(verification);
                                window.open(getImageUrl(verification.cnicBackImage), '_blank');
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md flex items-center justify-center">
                              <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
                            </div>
                            <p className="text-xs text-center mt-1 text-gray-600">Back</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleVerify(verification.id, 'verified')}
                        disabled={verifyCNIC.isPending}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => setSelectedUser(verification)}
                        disabled={verifyCNIC.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Rejection Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-md w-full p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Reject CNIC Verification</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    rows={4}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This reason will be sent to the user
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(null);
                      setRejectionReason('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleVerify(selectedUser.id, 'rejected')}
                    disabled={!rejectionReason.trim() || verifyCNIC.isPending}
                    className="flex-1"
                  >
                    {verifyCNIC.isPending ? (
                      <>
                        <ButtonLoader />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

