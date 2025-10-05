import React from 'react';

export default function VerifiedBadge({ verified, trustScore }) {
  const formatTrustScore = (score) => {
    if (!score) return 0;
    if (typeof score === "number") return score;
    if (score && score.$numberDecimal) {
      return parseFloat(score.$numberDecimal);
    }
    if (score && typeof score.toString === "function") {
      return parseFloat(score.toString());
    }
    return 0;
  };

  const trust = formatTrustScore(trustScore);

  if (!verified) return null;

  return (
    <div className="inline-flex items-center space-x-1">
      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
        ✅ Verified
      </span>
      {trust > 0 && (
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
          Trust: {Math.round(trust * 100)}%
        </span>
      )}
    </div>
  );
}