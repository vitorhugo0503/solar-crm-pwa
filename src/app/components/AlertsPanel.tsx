'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getAlerts, resolveAlert, getProjects } from '@/lib/storage';
import { Alert } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';

interface AlertsPanelProps {
  onUpdate: () => void;
}

export default function AlertsPanel({ onUpdate }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = () => {
    const allAlerts = getAlerts();
    const projects = getProjects();
    
    // Enrich alerts with project info
    const enrichedAlerts = allAlerts.map(alert => {
      const project = projects.find(p => p.id === alert.projectId);
      return {
        ...alert,
        projectName: project?.titulo || 'Projeto não encontrado',
        clientName: project?.clienteNome || '',
      };
    });

    let filtered = enrichedAlerts;
    if (filter === 'active') {
      filtered = enrichedAlerts.filter(a => !a.resolvido);
    } else if (filter === 'resolved') {
      filtered = enrichedAlerts.filter(a => a.resolvido);
    }

    setAlerts(filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleResolve = (alertId: string) => {
    resolveAlert(alertId);
    loadAlerts();
    onUpdate();
  };

  const getSeverityIcon = (severidade: string) => {
    switch (severidade) {
      case 'alta':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'media':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severidade: string) => {
    switch (severidade) {
      case 'alta':
        return 'from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 border-red-300 dark:border-red-800';
      case 'media':
        return 'from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-300 dark:border-yellow-800';
      default:
        return 'from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-300 dark:border-blue-800';
    }
  };

  const getTypeLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      baixa_geracao: 'Baixa Geração',
      consumo_alto: 'Consumo Alto',
      falha_sistema: 'Falha no Sistema',
      manutencao: 'Manutenção',
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['active', 'all', 'resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800'
            }`}
          >
            {f === 'active' ? 'Ativos' : f === 'all' ? 'Todos' : 'Resolvidos'}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 rounded-xl p-6 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">Alta Severidade</h3>
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {getAlerts().filter(a => !a.resolvido && a.severidade === 'alta').length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">Média Severidade</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {getAlerts().filter(a => !a.resolvido && a.severidade === 'media').length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">Resolvidos</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {getAlerts().filter(a => a.resolvido).length}
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert: Alert & { projectName?: string; clientName?: string }) => (
          <div
            key={alert.id}
            className={`bg-gradient-to-r ${getSeverityColor(alert.severidade)} rounded-xl p-6 border-2 shadow-lg`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {getSeverityIcon(alert.severidade)}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-gray-900 dark:text-white">{getTypeLabel(alert.tipo)}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      alert.severidade === 'alta' ? 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      alert.severidade === 'media' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {alert.severidade}
                    </span>
                    {alert.resolvido && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Resolvido
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-900 dark:text-white mb-3">{alert.mensagem}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>📋 {alert.projectName}</span>
                    {alert.clientName && <span>👤 {alert.clientName}</span>}
                    <span>🕐 {formatDateTime(alert.createdAt)}</span>
                    {alert.resolvidoAt && <span>✅ Resolvido em {formatDateTime(alert.resolvidoAt)}</span>}
                  </div>
                </div>
              </div>

              {!alert.resolvido && (
                <button
                  onClick={() => handleResolve(alert.id)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all shadow-lg whitespace-nowrap"
                >
                  Resolver
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum alerta encontrado</p>
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'active' ? 'Todos os alertas foram resolvidos!' : 'Não há alertas no momento.'}
          </p>
        </div>
      )}
    </div>
  );
}
