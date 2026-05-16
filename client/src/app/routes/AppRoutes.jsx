import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../../pages/Home.jsx";
import Login from "../../features/auth/pages/Login.jsx";
import Register from "../../features/auth/pages/Register.jsx";
import ForgotPassword from "../../features/auth/pages/ForgotPassword.jsx";
import VerifyOTP from "../../features/auth/pages/VerifyOTP.jsx";
import ResetPassword from "../../features/auth/pages/ResetPassword.jsx";
import Dashboard from "../../features/dashboard/Dashboard.jsx";
import GoogleCallback from "../../features/auth/pages/GoogleCallback.jsx";
import CompleteProfile from "../../features/auth/pages/CompleteProfile.jsx";
import CNICVerification from "../../features/auth/pages/CNICVerification.jsx";
import AdminCNICVerification from "../../features/auth/pages/AdminCNICVerification.jsx";
import PrivateRoute from "./PrivateRoutes";
import AdminRoute from "./AdminRoute";

// Job pages
import { 
  JobList, 
  JobDetails, 
  RecommendedJobs, 
  CreateJob, 
  MyJobs 
} from "../../features/jobs/pages";
import ClientJobProposals from "../../features/proposals/pages/ClientJobProposals.jsx";
import RecommendedFreelancersPage from "../../features/jobs/pages/RecommendedFreelancers.jsx";

// Proposal pages
import { SubmitProposal, MyProposals, ProposalDetails, ClientProposalDetails } from "../../features/proposals/pages";

// Profile pages
import { Profile } from "../../features/profile/pages";

// Contracts pages
import ContractsPage from "../../features/contracts/pages/ContractsPage.jsx";
import ContractDetailPage from "../../features/contracts/pages/ContractDetailPage.jsx";

// Messages pages
import MessagesPage from "../../features/messages/pages/MessagesPage.jsx";

// Notifications pages
import NotificationsPage from "../../features/notifications/pages/NotificationsPage.jsx";

// Payment pages
import WalletPage from "../../features/payments/pages/WalletPage.jsx";
import TransactionHistoryPage from "../../features/payments/pages/TransactionHistoryPage.jsx";
import WithdrawalPage from "../../features/payments/pages/WithdrawalPage.jsx";

// Admin pages
import AdminLayout from "../../features/admin/layout/AdminLayout.jsx";
import AdminDashboard from "../../features/admin/dashboard/AdminDashboard.jsx";
import UserManagement from "../../features/admin/users/UserManagement.jsx";
import JobChecker from "../../features/admin/jobs/JobChecker.jsx";
import AdminCNICVerificationPanel from "../../features/admin/cnic/CNICVerification.jsx";
import Analytics from "../../features/admin/analytics/AnalyticsPro.jsx";
import AuditLogs from "../../features/admin/audit-logs/AuditLogs.jsx";
import AdminSettings from "../../features/admin/settings/AdminSettings.jsx";
import SystemHealthMonitoring from "../../features/admin/health/SystemHealthMonitoring.jsx";
import DisputesList from "../../features/admin/disputes/DisputesList.jsx";
import DisputeDetails from "../../features/admin/disputes/DisputeDetails.jsx";
import AdminPaymentsPage from "../../features/admin/payments/AdminPaymentsPage.jsx";
import WithdrawalQueue from "../../features/admin/payments/WithdrawalQueue.jsx";
import EscrowManagement from "../../features/admin/payments/EscrowManagement.jsx";
import AdminReviews from "../../features/admin/reviews/AdminReviews.jsx";

// Learning Hub pages
import LearningHub from "../../features/learning/pages/LearningHub.jsx";
import CourseDetails from "../../features/learning/pages/CourseDetails.jsx";
import MyLearning from "../../features/learning/pages/MyLearning.jsx";

// Resource pages
import HelpCenter from "../../pages/HelpCenter.jsx";
import PaymentGuide from "../../pages/PaymentGuide.jsx";
import TermsOfService from "../../pages/TermsOfService.jsx";
import PrivacyPolicy from "../../pages/PrivacyPolicy.jsx";
import CookiePolicy from "../../pages/CookiePolicy.jsx";

// Company pages
import About from "../../pages/About.jsx";
import Blog from "../../pages/Blog.jsx";
import Careers from "../../pages/Careers.jsx";
import Contact from "../../pages/Contact.jsx";
import NotFound from "../../pages/NotFound.jsx";
import TestFeedback from "../../pages/TestFeedback.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Resource pages - Public */}
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/payment-guide" element={<PaymentGuide />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/cookies" element={<CookiePolicy />} />
      
      {/* Company pages - Public */}
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />
      
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      
      {/* Public job routes - Anyone can browse */}
      <Route path="/jobs" element={<JobList />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      
      {/* Semi-protected route - Requires auth but not complete profile */}
      <Route 
        path="/complete-profile" 
        element={
          <PrivateRoute requireCompleteProfile={false}>
            <CompleteProfile />
          </PrivateRoute>
        } 
      />

      {/* CNIC Verification route */}
      <Route 
        path="/verify-cnic" 
        element={
          <PrivateRoute requireCompleteProfile={false}>
            <CNICVerification />
          </PrivateRoute>
        } 
      />

      {/* Admin CNIC Verification route */}
      <Route 
        path="/admin/cnic-verifications" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <AdminCNICVerification />
          </PrivateRoute>
        } 
      />
      
      {/* Protected routes - Requires auth AND complete profile */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <Dashboard />
          </PrivateRoute>
        } 
      />

      {/* Freelancer-only job routes */}
      <Route 
        path="/jobs/recommended" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <RecommendedJobs />
          </PrivateRoute>
        } 
      />

      {/* Freelancer-only proposal routes */}
      <Route 
        path="/freelancer/proposals" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <MyProposals />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/freelancer/proposals/:id" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <ProposalDetails />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/freelancer/proposals/submit/:jobId" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <SubmitProposal />
          </PrivateRoute>
        } 
      />

      {/* Client proposal routes */}
      <Route 
        path="/client/proposals/:id" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <ClientProposalDetails />
          </PrivateRoute>
        } 
      />

      {/* Client-only job routes */}
      <Route 
        path="/jobs/create" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <CreateJob />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/jobs/my-jobs" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <MyJobs />
          </PrivateRoute>
        } 
      />

      {/* Recommended freelancers route - Client only */}
      <Route 
        path="/jobs/:jobId/recommended-freelancers" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <RecommendedFreelancersPage />
          </PrivateRoute>
        } 
      />

      {/* Client view: all proposals for a job */}
      <Route 
        path="/client/jobs/:id/proposals"
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <ClientJobProposals />
          </PrivateRoute>
        }
      />

      {/* Profile routes - Protected */}
      <Route 
        path="/profile" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            {/* Redirect to role-specific profile */}
            <Navigate to="/profile/me" replace />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/profile/me" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <Profile />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/profile/:userId" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <Profile />
          </PrivateRoute>
        } 
      />

      {/* Contracts routes - Protected */}
      <Route 
        path="/contracts" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <ContractsPage />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/contracts/:id" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <ContractDetailPage />
          </PrivateRoute>
        } 
      />

      {/* Messages routes - Protected */}
      <Route 
        path="/messages"
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <MessagesPage />
          </PrivateRoute>
        }
      />

      {/* Notifications route - Protected */}
      <Route 
        path="/notifications"
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <NotificationsPage />
          </PrivateRoute>
        }
      />

      <Route 
        path="/messages/:conversationId" 
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <MessagesPage />
          </PrivateRoute>
        } 
      />

      {/* Payment routes - Protected */}
      <Route 
        path="/wallet"
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <WalletPage />
          </PrivateRoute>
        }
      />

      <Route 
        path="/transactions"
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <TransactionHistoryPage />
          </PrivateRoute>
        }
      />

      <Route 
        path="/withdrawals"
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <WithdrawalPage />
          </PrivateRoute>
        }
      />

      {/* Admin routes - Protected */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="jobs" element={<JobChecker />} />
        <Route path="cnic" element={<AdminCNICVerificationPanel />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="disputes" element={<DisputesList />} />
        <Route path="disputes/:disputeId" element={<DisputeDetails />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="health" element={<SystemHealthMonitoring />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="payments/withdrawals" element={<WithdrawalQueue />} />
        <Route path="payments/escrows" element={<EscrowManagement />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>
      
      {/* Learning Hub routes */}
      <Route
        path="/learning"
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <LearningHub />
          </PrivateRoute>
        }
      />
      <Route
        path="/learning/my"
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <MyLearning />
          </PrivateRoute>
        }
      />
      <Route
        path="/learning/courses/:id"
        element={
          <PrivateRoute requireCompleteProfile={true}>
            <CourseDetails />
          </PrivateRoute>
        }
      />

      {/* Test Feedback Route - For verification */}
      <Route path="/test-feedback" element={<TestFeedback />} />

      {/* Catch all - 404 Not Found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
