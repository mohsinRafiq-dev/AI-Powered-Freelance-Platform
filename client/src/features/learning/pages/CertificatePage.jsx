import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Award, Download, Share2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { getMyProgress } from '@/api/learningApi';
import { Button } from '../../../components/ui/button';
import { InlineLoader } from '../../../components/common/Loader';

const CertificatePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const certRef = useRef(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProgress();
        const certs = res?.data?.certificates || [];
        const cert = certs.find((c) => String(c.course?._id) === String(courseId));
        if (cert) { setCertificate(cert); }
        else { setNotFound(true); }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  const handlePrint = () => {
    const PRINT_ID = '__cert_print_root';
    const el = certRef.current;
    if (!el) {
      window.print();
      return;
    }

    // Hide everything, then reveal only the certificate subtree. Using
    // visibility (not display:none) keeps the certificate's ancestors laid out
    // so the element still renders; the earlier approach hid all of <body>'s
    // children and printed a blank page.
    const style = document.createElement('style');
    style.id = '__cert_print_style';
    style.innerHTML = `
      @media print {
        body * { visibility: hidden !important; }
        #${PRINT_ID}, #${PRINT_ID} * { visibility: visible !important; }
        #${PRINT_ID} {
          position: absolute !important;
          left: 0; top: 0;
          width: 100%; height: auto;
          margin: 0 !important;
          box-shadow: none !important;
        }
        @page { size: A4 landscape; margin: 8mm; }
      }
    `;
    document.head.appendChild(style);
    el.id = PRINT_ID;

    window.print();

    setTimeout(() => {
      style.remove();
      el.removeAttribute('id');
    }, 500);
  };

  const handleShare = () => {
    const text = `I just earned the "${certificate?.course?.title}" certificate on Linkify! Certificate ID: ${certificate?.certificateCode}`;
    if (navigator.share) {
      navigator.share({ title: 'My Linkify Certificate', text });
    } else {
      navigator.clipboard?.writeText(text).then(() => {
        alert('Certificate details copied to clipboard!');
      }).catch(() => alert(text));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <InlineLoader text="Loading certificate" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center max-w-sm">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Certificate not found</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Complete the course assessment with {'>'}70% to earn your certificate.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate('/learning/my')}>My Learning</Button>
          <Button onClick={() => navigate(`/learning/courses/${courseId}`)}>Go to Course</Button>
        </div>
      </div>
    </div>
  );

  const issueDate = certificate?.certifiedAt
    ? new Date(certificate.certifiedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 pt-20 pb-16">

      {/* Action bar */}
      <div className="container mx-auto px-4 max-w-4xl mb-6 flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => navigate('/learning/my')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Learning
        </button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button size="sm" onClick={handlePrint} className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Download / Print
          </Button>
        </div>
      </div>

      {/* Certificate */}
      <div className="container mx-auto px-4 max-w-4xl">
        <div
          ref={certRef}
          className="bg-white shadow-2xl relative overflow-hidden select-none"
          style={{ aspectRatio: '1.414 / 1', minHeight: 480 }}
        >
          {/* Outer gold border */}
          <div className="absolute inset-0 border-[14px] border-yellow-400 pointer-events-none z-10" />
          {/* Inner thin border */}
          <div className="absolute inset-[18px] border border-yellow-300/60 pointer-events-none z-10" />

          {/* Watermark pattern */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.04] pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <Award
                key={i}
                style={{
                  position: 'absolute',
                  width: 96, height: 96,
                  top: `${(i % 2) * 55 + 5}%`,
                  left: `${i * 17}%`,
                  transform: 'rotate(12deg)',
                  color: '#92400E',
                }}
              />
            ))}
          </div>

          {/* Corner ornaments */}
          <div className="absolute top-6 left-6 w-10 h-10 border-l-2 border-t-2 border-yellow-400/50 z-10" />
          <div className="absolute top-6 right-6 w-10 h-10 border-r-2 border-t-2 border-yellow-400/50 z-10" />
          <div className="absolute bottom-6 left-6 w-10 h-10 border-l-2 border-b-2 border-yellow-400/50 z-10" />
          <div className="absolute bottom-6 right-6 w-10 h-10 border-r-2 border-b-2 border-yellow-400/50 z-10" />

          {/* Content */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full px-12 py-10 text-center">

            {/* Brand + medal */}
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-9 h-9 text-yellow-500" />
              <div className="text-left">
                <div className="text-xl font-black tracking-[0.2em] text-gray-900 uppercase">Linkify</div>
                <div className="text-[10px] tracking-[0.35em] text-gray-400 uppercase">Learning Platform</div>
              </div>
            </div>

            {/* Certificate label */}
            <div className="text-xs tracking-[0.45em] uppercase text-yellow-600 font-bold mb-2">
              Certificate of Completion
            </div>

            {/* Decorative line */}
            <div className="flex items-center gap-3 mb-4 w-40">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-400" />
            </div>

            <p className="text-gray-500 text-sm mb-2">This is to certify that</p>

            <h1
              className="text-4xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {user?.name || 'Student'}
            </h1>

            <div className="w-52 h-px bg-gray-300 mb-3" />

            <p className="text-gray-500 text-sm mb-2">has successfully completed</p>

            <h2 className="text-xl font-bold text-gray-800 mb-1 max-w-md leading-snug">
              {certificate?.course?.title}
            </h2>

            <p className="text-xs text-gray-400 mb-5">{certificate?.course?.level && `${certificate.course.level} level`}</p>

            {/* Score + verified + date row */}
            <div className="flex items-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{certificate?.bestScore}%</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Final Score</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">Verified</span>
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Status</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div className="text-sm font-bold text-gray-700">{issueDate}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Issued</div>
              </div>
            </div>

            {/* Footer row */}
            <div className="flex items-end justify-between w-full">
              <div className="text-center">
                <div className="w-36 h-px bg-gray-400 mb-1" />
                <div className="text-xs text-gray-400">Platform Director</div>
                <div className="text-sm font-semibold text-gray-700">Linkify Learning</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-xs bg-gray-100 border border-gray-200 px-3 py-1 rounded text-gray-600">
                  {certificate?.certificateCode}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">Certificate ID</div>
              </div>
              <div className="text-center">
                <div className="w-36 h-px bg-gray-400 mb-1" />
                <div className="text-xs text-gray-400">Course Instructor</div>
                <div className="text-sm font-semibold text-gray-700">Expert Faculty</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info below certificate */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Certificate ID: <span className="font-mono">{certificate?.certificateCode}</span> ·
          Use the Print button above to save as PDF
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
