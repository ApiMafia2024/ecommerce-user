'use client';

import React from 'react';

interface AnimatedCheckmarkProps {
  size?: number;
  className?: string;
}

export function AnimatedCheckmark({ size = 80, className = '' }: AnimatedCheckmarkProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const checkmarkSize = size * 0.4;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Circle background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-green-100 dark:text-green-900/30"
        />
        
        {/* Animated circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-green-500 dark:text-green-400"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{
            animation: 'drawCircle 0.6s ease-out forwards',
          }}
        />
        
        {/* Animated checkmark */}
        <path
          d={`M ${size * 0.3} ${size / 2} L ${size * 0.45} ${size * 0.65} L ${size * 0.7} ${size * 0.35}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-500 dark:text-green-400"
          strokeDasharray={checkmarkSize}
          strokeDashoffset={checkmarkSize}
          style={{
            animation: 'drawCheckmark 0.4s ease-out 0.6s forwards',
          }}
        />
      </svg>
    </div>
  );
}

