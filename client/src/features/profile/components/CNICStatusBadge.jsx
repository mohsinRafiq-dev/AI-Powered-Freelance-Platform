import { Link } from 'react-router-dom';
import { Shield, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export const CNICStatusBadge = ({ status, isOwnProfile, className = '' }) => {
  if (!status || status === 'not_submitted') {
    if (!isOwnProfile) return null;
    
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="outline" className="border-gray-300 text-gray-600">
          <AlertCircle className="w-3 h-3 mr-1" />
          CNIC Not Verified
        </Badge>
        <Link to="/verify-cnic">
          <Button size="sm" variant="outline" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Verify Now
          </Button>
        </Link>
      </div>
    );
  }

  if (status === 'verified') {
    return (
      <Badge className="bg-green-500 text-white hover:bg-green-600">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        CNIC Verified
      </Badge>
    );
  }

  if (status === 'pending' || status === 'under_review') {
    return (
      <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
        <Clock className="w-3 h-3 mr-1" />
        {status === 'under_review' ? 'Under Review' : 'CNIC Pending'}
      </Badge>
    );
  }

  if (status === 'reupload_requested') {
    if (!isOwnProfile) {
      return (
        <Badge variant="outline" className="border-orange-300 text-orange-600">
          <AlertCircle className="w-3 h-3 mr-1" />
          Reupload Requested
        </Badge>
      );
    }

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="outline" className="border-orange-300 text-orange-600">
          <AlertCircle className="w-3 h-3 mr-1" />
          Reupload Requested
        </Badge>
        <Link to="/verify-cnic">
          <Button size="sm" variant="outline" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Resubmit
          </Button>
        </Link>
      </div>
    );
  }

  if (status === 'rejected') {
    if (!isOwnProfile) {
      return (
        <Badge variant="outline" className="border-red-300 text-red-600">
          <XCircle className="w-3 h-3 mr-1" />
          CNIC Rejected
        </Badge>
      );
    }

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="outline" className="border-red-300 text-red-600">
          <XCircle className="w-3 h-3 mr-1" />
          CNIC Rejected
        </Badge>
        <Link to="/verify-cnic">
          <Button size="sm" variant="outline" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Resubmit
          </Button>
        </Link>
      </div>
    );
  }

  return null;
};

