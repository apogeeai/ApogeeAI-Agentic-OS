"use client";

import { Activity, Zap, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from 'lucide-react';

export function DirectorStatusWindow() {
  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-20 animate-pulse" />
        </div>
        <div className="relative bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/60 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Activity className="w-8 h-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Director Agent</h2>
              <p className="text-sm text-gray-600">Central Orchestration System</p>
            </div>
          </div>

          <div className="grid grid-cols-1 @xs:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">12</div>
              <div className="text-xs text-gray-600">Active Tasks</div>
            </div>
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">847</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">3</div>
              <div className="text-xs text-gray-600">Pending Approval</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/60">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Stream Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Briefs Queue</span>
            <span className="text-sm font-semibold text-blue-600">3 pending</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Assembled Queue</span>
            <span className="text-sm font-semibold text-purple-600">1 pending</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Delivered Queue</span>
            <span className="text-sm font-semibold text-green-600">0 pending</span>
          </div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/60">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <div className="text-gray-700">Assigned task to Writer Agent</div>
            <div className="text-gray-500 text-xs ml-auto">2m ago</div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <div className="text-gray-700">Processed brief from Research Agent</div>
            <div className="text-gray-500 text-xs ml-auto">5m ago</div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
            <div className="text-gray-700">Approval request sent</div>
            <div className="text-gray-500 text-xs ml-auto">8m ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}
