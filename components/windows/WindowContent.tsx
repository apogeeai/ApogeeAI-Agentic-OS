import { useState, useEffect } from 'react';
import { KanbanWindow } from './KanbanWindow';
import { WorkflowsWindow } from './WorkflowsWindow';
import { AIModelsWindow } from './AIModelsWindow';
import { TerminalWindow } from './TerminalWindow';
import { CodeEditorWindow } from './CodeEditorWindow';
import { DatabaseWindow } from './DatabaseWindow';
import { CloudServicesWindow } from './CloudServicesWindow';
import { VersionControlWindow } from './VersionControlWindow';
import { AnalyticsWindow } from './AnalyticsWindow';
import { ChatWindow } from './ChatWindow';
import { ScheduleWindow } from './ScheduleWindow';
import { FilesWindow } from './FilesWindow';
import { HistoryWindow } from './HistoryWindow';
import { AutomationsWindow } from './AutomationsWindow';
import { DirectorStatusWindow } from './DirectorStatusWindow';
import { NotificationsWindow } from './NotificationsWindow';
import { TaskLedgerWindow } from './TaskLedgerWindow';
import { ApprovalInboxWindow } from './ApprovalInboxWindow';
import { PipelineFlowWindow } from './PipelineFlowWindow';
import { WiggumLoopWindow } from './WiggumLoopWindow';
import { GPUMonitorWindow } from './GPUMonitorWindow';
import { RevenueTrackerWindow } from './RevenueTrackerWindow';
import { RevenueTicker } from './money/RevenueTicker';
import { EmpirePnL } from './money/EmpirePnL';
import { CostProfitLedger } from './money/CostProfitLedger';
import { MakeMoneyButtons } from './money/MakeMoneyButtons';
import { OvernightReel } from './production/OvernightReel';
import { DigitalGoodsGallery } from './production/DigitalGoodsGallery';
import { PipelineHeatmap } from './production/PipelineHeatmap';
import { DeadLetterInbox } from './production/DeadLetterInbox';
import { ApprovalQueue } from './quality/ApprovalQueue';
import { TastemakerHistogram } from './quality/TastemakerHistogram';
import { BrandDriftMonitor } from './quality/BrandDriftMonitor';
import { TrendRadar } from './intelligence/TrendRadar';
import { RevenueSimulator } from './intelligence/RevenueSimulator';
import { BestTimeHeatmap } from './intelligence/BestTimeHeatmap';
import { ChurnForecast } from './intelligence/ChurnForecast';
import { LoraTrainerConsole } from './creative/LoraTrainerConsole';
import { VideoMotionLab } from './creative/VideoMotionLab';
import { AgentSwarmGrid } from './system/AgentSwarmGrid';
import { GpuTelemetry } from './system/GpuTelemetry';
import { CSuiteStandup } from './system/CSuiteStandup';

interface WindowContentProps {
  content: string;
  title: string;
}

export function WindowContent({ content, title }: WindowContentProps) {
  const renderContent = () => {
    switch (content) {
      case 'director-status':
        return <DirectorStatusWindow />;
      case 'notifications':
        return <NotificationsWindow />;
      case 'task-ledger':
        return <TaskLedgerWindow />;
      case 'approval-inbox':
        return <ApprovalInboxWindow />;
      case 'pipeline-flow':
        return <PipelineFlowWindow />;
      case 'wiggum-loop':
        return <WiggumLoopWindow />;
      case 'gpu-monitor':
        return <GPUMonitorWindow />;
      case 'revenue-tracker':
        return <RevenueTrackerWindow />;
      case 'revenue-ticker':
        return <RevenueTicker />;
      case 'empire-pnl':
        return <EmpirePnL />;
      case 'cost-profit':
        return <CostProfitLedger />;
      case 'make-money':
        return <MakeMoneyButtons />;
      case 'overnight-reel':
        return <OvernightReel />;
      case 'digital-goods':
        return <DigitalGoodsGallery />;
      case 'pipeline-heatmap':
        return <PipelineHeatmap />;
      case 'dead-letter':
        return <DeadLetterInbox />;
      case 'approval-queue':
        return <ApprovalQueue />;
      case 'tastemaker-histogram':
        return <TastemakerHistogram />;
      case 'brand-drift':
        return <BrandDriftMonitor />;
      case 'trend-radar':
        return <TrendRadar />;
      case 'revenue-simulator':
        return <RevenueSimulator />;
      case 'best-time-heatmap':
        return <BestTimeHeatmap />;
      case 'churn-forecast':
        return <ChurnForecast />;
      case 'lora-trainer':
        return <LoraTrainerConsole />;
      case 'video-motion-lab':
        return <VideoMotionLab />;
      case 'agent-swarm-grid':
        return <AgentSwarmGrid />;
      case 'gpu-telemetry':
        return <GpuTelemetry />;
      case 'c-suite-standup':
        return <CSuiteStandup />;
      case 'kanban':
        return <KanbanWindow />;
      case 'workflows':
        return <WorkflowsWindow />;
      case 'ai-models':
        return <AIModelsWindow />;
      case 'terminal':
        return <TerminalWindow />;
      case 'code-editor':
        return <CodeEditorWindow />;
      case 'database':
        return <DatabaseWindow />;
      case 'cloud-services':
        return <CloudServicesWindow />;
      case 'version-control':
        return <VersionControlWindow />;
      case 'analytics':
        return <AnalyticsWindow />;
      case 'chat':
        return <ChatWindow />;
      case 'schedule':
        return <ScheduleWindow />;
      case 'files':
        return <FilesWindow />;
      case 'history':
        return <HistoryWindow />;
      case 'automations':
        return <AutomationsWindow />;
      default:
        return (
          <div className="text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 header-font">{title}</h2>
            <p>This is the {title} window. Content can be customized for each application.</p>
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
}
