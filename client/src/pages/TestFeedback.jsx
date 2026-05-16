import React, { useState } from 'react';
import ReviewForm from '../features/reviews/components/ReviewForm';

export default function TestFeedback() {
  const [result, setResult] = useState(null);

  // We use dummy valid MongoDB ObjectIDs just for testing the API
  const dummyJobId = "60d5ec9af682fbd39c1b8b9a";
  const dummyContractId = "60d5ec9af682fbd39c1b8b9b";
  const dummyRevieweeId = "60d5ec9af682fbd39c1b8b9c";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4 pb-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Feedback System Test</h1>
        
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-8 border border-blue-100 dark:border-blue-800">
          <h2 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">How to test the AI Moderation:</h2>
          <ul className="list-disc pl-5 text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li><strong>Test 1:</strong> Write a normal review (e.g., "Great freelancer, delivered the work on time and was very communicative.")</li>
            <li><strong>Test 2:</strong> Refresh the page and try writing a fake/spam review (e.g., "CLICK HERE TO WIN $100000 DOLLARS VERY CHEAP BITCOIN SPAM SPAM TERRIBLE VIRUS").</li>
          </ul>
        </div>
        
        <ReviewForm 
          jobId={dummyJobId}
          contractId={dummyContractId}
          revieweeId={dummyRevieweeId}
          onSuccess={(data) => setResult(data)}
        />

        {result && (
          <div className="mt-8 p-6 bg-gray-900 rounded-xl shadow-xl border border-gray-700 overflow-auto">
            <h3 className="text-white font-bold mb-4 text-lg">Backend Database Record Created:</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Rating Given</span>
                  <p className="text-xl text-yellow-400 font-bold">{result.rating} Stars</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <span className="text-gray-400 text-xs uppercase tracking-wider">AI Fake Detection</span>
                  <p className={`text-xl font-bold ${result.aiVerification?.isFake ? 'text-red-500' : 'text-green-500'}`}>
                    {result.aiVerification?.isFake ? 'FLAGGED AS FAKE' : 'PASSED (Legitimate)'}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <span className="text-gray-400 text-xs uppercase tracking-wider block mb-2">AI Confidence Score</span>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${result.aiVerification?.isFake ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${result.aiVerification?.confidenceScore || 0}%` }}></div>
                </div>
                <p className="text-right text-xs text-gray-400 mt-1">{result.aiVerification?.confidenceScore || 0}% Certainty</p>
              </div>

              {result.aiVerification?.flagReason && (
                <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg">
                  <span className="text-red-400 text-xs uppercase tracking-wider block mb-1">AI Flag Reason</span>
                  <p className="text-red-200 text-sm">{result.aiVerification.flagReason}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
