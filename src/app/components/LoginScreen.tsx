'use client';

import { useState } from 'react';
import { Sun, Building2, User as UserIcon } from 'lucide-react';
import { User } from '@/lib/types';
import { saveUser, generateId } from '@/lib/storage';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<'empresa' | 'cliente'>('empresa');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user: User = {
      id: generateId(),
      name: name || (selectedRole === 'empresa' ? 'Solar Tech Ltda' : 'Cliente Demo'),
      email: email || (selectedRole === 'empresa' ? 'empresa@demo.com' : 'cliente@demo.com'),
      role: selectedRole,
      companyId: selectedRole === 'empresa' ? 'company-1' : undefined,
      createdAt: new Date().toISOString(),
    };
    
    saveUser(user);
    onLogin(user);
  };

  const handleDemoLogin = (role: 'empresa' | 'cliente') => {
    const user: User = {
      id: generateId(),
      name: role === 'empresa' ? 'Solar Tech Ltda' : 'João Silva',
      email: role === 'empresa' ? 'contato@solartech.com' : 'joao@email.com',
      role,
      companyId: role === 'empresa' ? 'company-1' : undefined,
      createdAt: new Date().toISOString(),
    };
    
    saveUser(user);
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl shadow-2xl mb-4">
            <Sun className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">SolarSync</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestão Inteligente de Energia Solar</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Acesse sua conta</h2>
          
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setSelectedRole('empresa')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                selectedRole === 'empresa'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-950'
                  : 'border-gray-200 dark:border-slate-700 hover:border-orange-300'
              }`}
            >
              <Building2 className={`w-8 h-8 ${selectedRole === 'empresa' ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${selectedRole === 'empresa' ? 'text-orange-700 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
                Empresa
              </span>
            </button>
            
            <button
              onClick={() => setSelectedRole('cliente')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                selectedRole === 'cliente'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-950'
                  : 'border-gray-200 dark:border-slate-700 hover:border-orange-300'
              }`}
            >
              <UserIcon className={`w-8 h-8 ${selectedRole === 'cliente' ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${selectedRole === 'cliente' ? 'text-orange-700 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
                Cliente
              </span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedRole === 'empresa' ? 'Nome da empresa' : 'Seu nome'}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Entrar
            </button>
          </form>

          {/* Demo Access */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">Acesso rápido demo:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('empresa')}
                className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Demo Empresa
              </button>
              <button
                onClick={() => handleDemoLogin('cliente')}
                className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Demo Cliente
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-orange-500 mb-1">CRM</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Gestão Completa</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-500 mb-1">24/7</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Monitoramento</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-500 mb-1">PWA</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">App Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}
