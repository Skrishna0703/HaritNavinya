import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface LoadingScreenProps {
  isVisible: boolean;
}

// Loading animation data - using a simple spinner
const loadingAnimation = {
  v: "5.7.1",
  meta: { g: "getDefaultName", data: { duration: 60, tb: 0 } },
  fr: 24,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Loading",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Oval 1 Outlines",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0] }, { t: 59, s: [360] }] },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [80, 80] },
              p: { a: 0, k: [0, 0] },
              nm: "Ellipse Path 1"
            },
            {
              ty: "st",
              c: { a: 0, k: [0.2, 0.6, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 8 },
              lc: 2,
              lj: 2,
              nm: "Stroke 1"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
              nm: "Transform"
            }
          ],
          nm: "Oval 1",
          np: 3,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }
  ]
};

export function LoadingScreen({ isVisible }: LoadingScreenProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-40 h-40 mx-auto mb-8">
          <Lottie 
            animationData={loadingAnimation} 
            loop={true}
            autoplay={true}
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">HaritNavinya</h1>
        <p className="text-lg text-gray-600 mb-2">Agricultural Intelligence Platform</p>
        <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
        
        {/* Optional: Add progress bar */}
        <div className="mt-8 w-full max-w-xs mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse" style={{
              width: '100%',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
