import React from 'react';

/**
 * Skeleton loader for card-like components
 */
export const CardSkeleton = ({ count = 1 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white/40 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20 animate-pulse"
                >
                    <div className="h-4 bg-gray-300/50 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-300/50 rounded w-1/2 mb-3"></div>
                    <div className="h-6 bg-gray-300/50 rounded w-full"></div>
                </div>
            ))}
        </>
    );
};

/**
 * Skeleton loader for chart components
 */
export const ChartSkeleton = () => {
    return (
        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 animate-pulse">
            <div className="h-6 bg-gray-300/50 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-300/50 rounded w-full"></div>
        </div>
    );
};

/**
 * Skeleton loader for list items
 */
export const ListSkeleton = ({ count = 5 }) => {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white/40 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20 animate-pulse"
                >
                    <div className="flex justify-between items-center">
                        <div className="flex-1">
                            <div className="h-4 bg-gray-300/50 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-300/50 rounded w-1/3"></div>
                        </div>
                        <div className="h-6 bg-gray-300/50 rounded w-20"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * Skeleton loader for stats/metrics
 */
export const StatsSkeleton = ({ count = 3 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white/40 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20 animate-pulse"
                >
                    <div className="h-4 bg-gray-300/50 rounded w-1/2 mb-3"></div>
                    <div className="h-8 bg-gray-300/50 rounded w-3/4"></div>
                </div>
            ))}
        </div>
    );
};

/**
 * Generic skeleton loader
 */
export const Skeleton = ({ width = 'w-full', height = 'h-4', className = '' }) => {
    return (
        <div className={`bg-gray-300/50 rounded animate-pulse ${width} ${height} ${className}`}></div>
    );
};
