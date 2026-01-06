'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, Users, FolderKanban, Calendar, Settings, Plus } from 'lucide-react';
import { DashboardStats } from '@/lib/types';
import KanbanBoard from './KanbanBoard';
import ClientesManager from './ClientesManager';
import ProjectsManager from './ProjectsManager';
import AlertsPanel from './AlertsPanel';

interface CompanyDashboardProps {
  stats: DashboardStats;
  onStatsUpdate: () => void;
}

type TabType = 'overview' | 'kanban' | 'clientes' | 'projetos' | 'alertas';

export default function CompanyDashboard({ stats, onStatsUpdate }: CompanyDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Visão Geral', icon: LayoutGrid },
    { id: 'kanban' as TabType, label: 'Pipeline', icon: FolderKanban },
    { id: 'clientes' as TabType, label: 'Clientes', icon: Users },
    { id: 'projetos' as TabType, label: 'Projetos', icon: Calendar },
    { id: 'alertas' as TabType, label: 'Alertas', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Resumo de Projetos</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Total de Projetos</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalProjetos}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Projetos Ativos</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.projetosAtivos}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Clientes Ativos</span>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.clientesAtivos}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('clientes')}
                  className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-900 dark:hover:to-amber-900 rounded-xl border-2 border-orange-200 dark:border-orange-800 transition-all"
                >
                  <Plus className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Novo Cliente</span>
                </button>
                <button
                  onClick={() => setActiveTab('projetos')}
                  className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900 dark:hover:to-cyan-900 rounded-xl border-2 border-blue-200 dark:border-blue-800 transition-all"
                >
                  <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Novo Projeto</span>
                </button>
                <button
                  onClick={() => setActiveTab('kanban')}
                  className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900 dark:hover:to-emerald-900 rounded-xl border-2 border-green-200 dark:border-green-800 transition-all"
                >
                  <FolderKanban className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Ver Pipeline</span>
                </button>
                <button
                  onClick={() => setActiveTab('alertas')}
                  className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900 dark:hover:to-pink-900 rounded-xl border-2 border-red-200 dark:border-red-800 transition-all"
                >
                  <Settings className="w-8 h-8 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Ver Alertas</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kanban' && <KanbanBoard onUpdate={onStatsUpdate} />}
        {activeTab === 'clientes' && <ClientesManager onUpdate={onStatsUpdate} />}
        {activeTab === 'projetos' && <ProjectsManager onUpdate={onStatsUpdate} />}
        {activeTab === 'alertas' && <AlertsPanel onUpdate={onStatsUpdate} />}
      </div>
    </div>
  );
}
