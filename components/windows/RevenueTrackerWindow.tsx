"use client";

import { DollarSign, TrendingUp, FileText, Eye } from 'lucide-react';

export function RevenueTrackerWindow() {
  const metrics = {
    postsPublished: 247,
    estimatedReach: 1240000,
    throughputToday: 12,
    revenue30d: 8450,
    avgRevenuePerPost: 34.21
  };

  const recentPosts = [
    { title: 'The Future of AI Agents', reach: 45000, revenue: 187, published: '2h ago' },
    { title: 'Building Scalable Pipelines', reach: 32000, revenue: 134, published: '5h ago' },
    { title: 'Redis Streams Deep Dive', reach: 28000, revenue: 98, published: '8h ago' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Revenue Tracker</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-green-400/30 to-green-600/30 backdrop-blur-sm rounded-lg p-4 border border-white/60">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-700" />
            <div className="text-xs text-green-700 font-semibold">Revenue (30d)</div>
          </div>
          <div className="text-2xl font-bold text-gray-800">${metrics.revenue30d.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-400/30 to-blue-600/30 backdrop-blur-sm rounded-lg p-4 border border-white/60">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-blue-700" />
            <div className="text-xs text-blue-700 font-semibold">Posts Published</div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{metrics.postsPublished}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-400/30 to-purple-600/30 backdrop-blur-sm rounded-lg p-4 border border-white/60">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-purple-700" />
            <div className="text-xs text-purple-700 font-semibold">Est. Reach</div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{(metrics.estimatedReach / 1000000).toFixed(2)}M</div>
        </div>

        <div className="bg-gradient-to-br from-orange-400/30 to-orange-600/30 backdrop-blur-sm rounded-lg p-4 border border-white/60">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-orange-700" />
            <div className="text-xs text-orange-700 font-semibold">Avg per Post</div>
          </div>
          <div className="text-2xl font-bold text-gray-800">${metrics.avgRevenuePerPost}</div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/60">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Pipeline Throughput</h3>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-gray-800">{metrics.throughputToday}</div>
          <div className="text-sm text-gray-600">posts today</div>
        </div>
        <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          +23% vs yesterday
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/60">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Posts</h3>
        <div className="space-y-3">
          {recentPosts.map((post, i) => (
            <div key={i} className="flex items-start justify-between gap-3 pb-3 border-b border-white/40 last:border-0 last:pb-0">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{post.title}</div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="text-xs text-gray-600">{post.reach.toLocaleString()} reach</div>
                  <div className="text-xs text-gray-500">{post.published}</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-green-600">${post.revenue}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
