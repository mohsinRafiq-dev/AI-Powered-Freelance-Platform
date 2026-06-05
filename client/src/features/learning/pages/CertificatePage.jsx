import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Award, Download, Share2, ArrowLeft, CheckCircle } from 'lucide-react';
import { getMyProgress } from '@/api/learningApi';
import { InlineLoader } from '../../../components/common/Loader';

const CertificatePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const printRef = useRef(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProgress();
        const data = res?.data || res;
        const cert = (data?.certificates || []).find(
          (c) => String(c.course?._id) === String(courseId)
        );
        if (cert) {
          setCertificate(cert);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `I just earned a certificate in "${certificate?.course?.title}" on Linkify! Certificate Code: ${certificate?.certificateCode}`;
    if (navigator.share) {
      navigator.share({ title: 'My Linkify Certificate', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Certificate details copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <InlineLoader text="Loading certificate" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Certificate not found</h2>
          <p className="text-gray-500 mb-6">Complete the course assessment with 70%+ to earn your certificate.</p>
          <button
            onClick={() => navigate(`/learning/courses/${courseId}`)}
            className="px-6 py-2 bg-brand text-white rounded-lg"
          >
            Go to Course
          </button>
        </div>
      </div>
    );
  }

  const issueDate = certificate?.certifiedAt
    ? new Date(certificate.certifiedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 pt-20 pb-16 print:bg-white print:pt-0">
      {/* Action buttons — hidden when printing */}
      <div className="print:hidden container mx-auto px-4 max-w-4xl mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/learning/my')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Learning
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm hover:bg-brand/90"
          >
            <Download className="w-4 h-4" /> Download / Print
          </button>
        </div>
      </div>

      {/* Certificate Card */}
      <div ref={printRef} className="container mx-auto px-4 max-w-4xl print:max-w-none print:px-0">
        <div
          className="bg-white relative overflow-hidden shadow-2xl print:shadow-none"
          style={{ aspectRatio: '1.414 / 1', minHeight: '560px' }}
        >
          {/* Gold border frame */}
          <div className="absolute inset-0 border-[16px] border-yellow-400 pointer-events-none z-10" />
          <div className="absolute inset-4 border-2 border-yellow-300 pointer-events-none z-10" />

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: i % 2 === 0 ? '10%' : '60%',
                  left: (i * 13) + '%',
                  transform: 'rotate(15deg)',
                }}
              >
                <Award className="w-24 h-24 text-yellow-600" />
              </div>
            ))}
          </div>

          {/* Certificate content */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full px-16 py-12 text-center">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-10 h-10 text-yellow-500" />
              <div className="text-left">
                <div className="text-2xl font-black tracking-widest text-gray-900 uppercase">Linkify</div>
                <div className="text-xs tracking-[0.3em] text-gray-500 uppercase">Learning Platform</div>
              </div>
            </div>

            {/* Title */}
            <div className="text-sm tracking-[0.4em] uppercase text-yellow-600 font-semibold mb-2">
              Certificate of Completion
            </div>

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-6" />

            {/* Body */}
            <p className="text-gray-500 text-base mb-3">This is to certify that</p>

            <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              {user?.name || 'Student Name'}
            </h1>

            <div className="w-48 h-0.5 bg-gray-300 mb-4" />

            <p className="text-gray-500 text-base mb-3">has successfully completed</p>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 max-w-lg leading-tight">
              {certificate?.course?.title}
            </h2>

            {/* Stats row */}
            <div className="flex items-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{certificate?.bestScore}%</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Final Score</div>
              </div>
              <div className="w-px h-10 bg-gray-300" />
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">Verified</span>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Status</div>
              </div>
              <div className="w-px h-10 bg-gray-300" />
              <div className="text-center">
                <div className="text-sm font-bold text-gray-700">{issueDate}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Issue Date</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between w-full mt-auto">
              <div className="text-center">
                <div className="w-40 h-px bg-gray-400 mb-1" />
                <div className="text-xs text-gray-500">Platform Director</div>
                <div className="text-sm font-semibold text-gray-700">Linkify Learning</div>
              </div>

              <div className="text-center">
                <div className="text-xs font-mono bg-gray-100 px-3 py-1 rounded text-gray-600 border border-gray-200">
                  {certificate?.certificateCode}
                </div>
                <div className="text-xs text-gray-400 mt-1">Certificate ID</div>
              </div>

              <div className="text-center">
                <div className="w-40 h-px bg-gray-400 mb-1" />
                <div className="text-xs text-gray-500">Course Instructor</div>
                <div className="text-sm font-semibold text-gray-700">Expert Faculty</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:block, .print\\:block * { visibility: visible; }
          [ref="printRef"], [ref="printRef"] * { visibility: visible; }
          .container { visibility: visible !important; }
          .container * { visibility: visible !important; }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default CertificatePage;
