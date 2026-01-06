'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Zap, DollarSign, MapPin } from 'lucide-react';
import { getProjects, getClientes, addProject, updateProject } from '@/lib/storage';
import { Project, Cliente, ProjectStatus } from '@/lib/types';
import { generateId, formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils';

interface ProjectsManagerProps {
  onUpdate: () => void;
}

export default function ProjectsManager({ onUpdate }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    clienteId: '',
    titulo: '',
    status: 'lead' as ProjectStatus,
    potenciaKwp: '',
    valorProjeto: '',
    dataInicio: '',
    dataConclusao: '',
    inversor: 'Growatt',
    numPaineis: '',
    endereco: '',
    observacoes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProjects(getProjects());
    setClientes(getClientes());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cliente = clientes.find(c => c.id === formData.clienteId);
    if (!cliente) return;

    if (editingProject) {
      updateProject(editingProject.id, {
        ...formData,
        clienteNome: cliente.nome,
        potenciaKwp: parseFloat(formData.potenciaKwp),
        valorProjeto: parseFloat(formData.valorProjeto),
        numPaineis: parseInt(formData.numPaineis),
      });
    } else {
      const newProject: Project = {
        id: generateId(),
        ...formData,
        clienteNome: cliente.nome,
        potenciaKwp: parseFloat(formData.potenciaKwp),
        valorProjeto: parseFloat(formData.valorProjeto),
        numPaineis: parseInt(formData.numPaineis),
        companyId: 'company-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addProject(newProject);
    }
    
    resetForm();
    loadData();
    onUpdate();
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      clienteId: project.clienteId,
      titulo: project.titulo,
      status: project.status,
      potenciaKwp: project.potenciaKwp.toString(),
      valorProjeto: project.valorProjeto.toString(),
      dataInicio: project.dataInicio || '',
      dataConclusao: project.dataConclusao || '',
      inversor: project.inversor,
      numPaineis: project.numPaineis.toString(),
      endereco: project.endereco,
      observacoes: project.observacoes || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      clienteId: '',
      titulo: '',
      status: 'lead',
      potenciaKwp: '',
      valorProjeto: '',
      dataInicio: '',
      dataConclusao: '',
      inversor: 'Growatt',
      numPaineis: '',
      endereco: '',
      observacoes: '',
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const filteredProjects = projects.filter(p =>
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.clienteNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Novo Projeto
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cliente *</label>
              <select
                required
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Selecione um cliente</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título *</label>
              <input
                type="text"
                required
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              >
                <option value="lead">Lead</option>
                <option value="proposta">Proposta</option>
                <option value="negociacao">Negociação</option>
                <option value="aprovado">Aprovado</option>
                <option value="instalacao">Instalação</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Potência (kWp) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.potenciaKwp}
                onChange={(e) => setFormData({ ...formData, potenciaKwp: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor do Projeto (R$) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.valorProjeto}
                onChange={(e) => setFormData({ ...formData, valorProjeto: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de Painéis *</label>
              <input
                type="number"
                required
                value={formData.numPaineis}
                onChange={(e) => setFormData({ ...formData, numPaineis: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Inversor *</label>
              <select
                required
                value={formData.inversor}
                onChange={(e) => setFormData({ ...formData, inversor: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              >
                <option value="Growatt">Growatt</option>
                <option value="Fronius">Fronius</option>
                <option value="GoodWe">GoodWe</option>
                <option value="Solis">Solis</option>
                <option value="Huawei">Huawei</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data de Início</label>
              <input
                type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Endereço *</label>
              <input
                type="text"
                required
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações</label>
              <textarea
                rows={3}
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                {editingProject ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-800 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{project.titulo}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.clienteNome}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                {getStatusLabel(project.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Potência</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{project.potenciaKwp} kWp</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Valor</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(project.valorProjeto)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{project.endereco}</span>
              </div>
              {project.dataInicio && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Início: {new Date(project.dataInicio).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {project.numPaineis} painéis • {project.inversor}
              </span>
              <button
                onClick={() => handleEdit(project)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-medium rounded-lg transition-all"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Nenhum projeto encontrado</p>
        </div>
      )}
    </div>
  );
}
