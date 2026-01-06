'use client';

import { useState, useEffect } from 'react';
import { Zap, TrendingUp, TrendingDown, Calendar, AlertCircle, BarChart3 } from 'lucide-react';
import { getSolarData, getAlerts, getProjects } from '@/lib/storage';
import { SolarData, Alert } from '@/lib/types';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';

export default function ClientDashboard() {
  const [solarData, setSolarData] = useState<SolarData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = () => {
    const allData = getSolarData();
    const allAlerts = getAlerts();
    
    // Filter by period
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const filtered = allData.filter(d => new Date(d.data) >= cutoffDate);
    setSolarData(filtered.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()));
    setAlerts(allAlerts.filter(a => !a.resolvido));
  };

  const totalGeneration = solarData.reduce((sum, d) => sum + d.geracaoKwh, 0);
  const totalConsumption = solarData.reduce((sum, d) => sum + d.consumoKwh, 0);
  const totalSavings = solarData.reduce((sum, d) => sum + d.economiaReais, 0);
  const avgDailyGeneration = solarData.length > 0 ? totalGeneration / solarData.length : 0;
  const estimatedMonthly = avgDailyGeneration * 30 * 0.75; // R$ 0.75/kWh

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-end gap-2">
        {(['7d', '30d', '90d'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedPeriod === period
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800'
            }`}
          >
            {period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : '90 dias'}
          </button>
        ))}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-xl">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Geração Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(totalGeneration)} kWh</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">Média: {formatNumber(avgDailyGeneration)} kWh/dia</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-xl">
              <TrendingDown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Consumo Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(totalConsumption)} kWh</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">Média: {formatNumber(totalConsumption / (solarData.length || 1))} kWh/dia</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 rounded-xl">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Economia Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalSavings)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">Previsão mensal: {formatCurrency(estimatedMonthly)}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Eficiência</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber((totalGeneration / (totalConsumption || 1)) * 100)}%
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">Geração vs Consumo</p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-xl shadow-lg p-6 border-2 border-yellow-300 dark:border-yellow-800">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Alertas Ativos</h3>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{alert.mensagem}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(alert.createdAt)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    alert.severidade === 'alta' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    alert.severidade === 'media' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {alert.severidade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily History */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Histórico Diário</h3>
        <div className="space-y-3">
          {solarData.slice(0, 10).map((data) => (
            <div key={data.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(data.data)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(data.data).toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </p>
                </div>
                <div className="h-12 w-px bg-gray-300 dark:bg-slate-700" />
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Geração</p>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">{formatNumber(data.geracaoKwh)} kWh</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Consumo</p>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatNumber(data.consumoKwh)} kWh</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Economia</p>
                    <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{formatCurrency(data.economiaReais)}</p>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                data.statusSistema === 'normal' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                data.statusSistema === 'alerta' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {data.statusSistema}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
