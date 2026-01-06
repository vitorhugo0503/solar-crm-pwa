'use client';

import { useState, useEffect } from 'react';
import { getProjects, updateProject } from '@/lib/storage';
import { Project, ProjectStatus } from '@/lib/types';
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils';
import { GripVertical, Eye } from 'lucide-react';

interface KanbanBoardProps {
  onUpdate: () => void;
}

const COLUMNS: { status: ProjectStatus; label: string; color: string }[] = [
  { status: 'lead', label: 'Leads', color: 'from-gray-500 to-slate-500' },
  { status: 'proposta', label: 'Proposta', color: 'from-blue-500 to-cyan-500' },
  { status: 'negociacao', label: 'Negociação', color: 'from-yellow-500 to-amber-500' },
  { status: 'aprovado', label: 'Aprovado', color: 'from-green-500 to-emerald-500' },
  { status: 'instalacao', label: 'Instalação', color: 'from-orange-500 to-red-500' },
  { status: 'concluido', label: 'Concluído', color: 'from-emerald-500 to-teal-500' },
];

export default function KanbanBoard({ onUpdate }: KanbanBoardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = getProjects();
    setProjects(allProjects.filter(p => p.status !== 'cancelado'));
  };

  const handleDragStart = (project: Project) => {
    setDraggedProject(project);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: ProjectStatus) => {
    if (draggedProject && draggedProject.status !== status) {
      updateProject(draggedProject.id, { status });
      loadProjects();
      onUpdate();
    }
    setDraggedProject(null);
  };

  const getProjectsByStatus = (status: ProjectStatus) => {
    return projects.filter(p => p.status === status);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {COLUMNS.map((column) => {
          const columnProjects = getProjectsByStatus(column.status);
          return (
            <div
              key={column.status}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.status)}
              className="flex-shrink-0 w-80"
            >
              {/* Column Header */}
              <div className={`bg-gradient-to-r ${column.color} text-white rounded-t-xl p-4 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{column.label}</h3>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                    {columnProjects.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="bg-gray-50 dark:bg-slate-800 rounded-b-xl p-4 min-h-[500px] space-y-3 border-2 border-t-0 border-gray-200 dark:border-slate-700">
                {columnProjects.map((project) => (
                  <div
                    key={project.id}
                    draggable
                    onDragStart={() => handleDragStart(project)}
                    className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-md hover:shadow-xl transition-all cursor-move border border-gray-200 dark:border-slate-700 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">{project.titulo}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{project.clienteNome}</p>
                      </div>
                      <GripVertical className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Potência:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{project.potenciaKwp} kWp</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Valor:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(project.valorProjeto)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Painéis:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{project.numPaineis} un</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{project.inversor}</span>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors">
                          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {columnProjects.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-600 text-sm">
                    Arraste projetos aqui
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
