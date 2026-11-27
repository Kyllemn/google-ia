import React, { useMemo, useState } from 'react';
import { SafeImage } from '../components/SafeImage';
import { useCrm } from '../context/CrmContext';
import { CrmUser } from '../types/crm';

export const CadastroUsuarios: React.FC = () => {
  const { users, addUser, toggleUserStatus, updateUserRole, showToast } = useCrm();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'Todas' | CrmUser['role']>('Todas');
  const [permTarget, setPermTarget] = useState<CrmUser | null>(null);

  // Quick form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<CrmUser['role']>('Analista Fiscal');
  const [department, setDepartment] = useState('Engenharia Fiscal & SPED');
  const [password, setPassword] = useState('Vrt#2024!98');

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== 'Todas' && u.role !== roleFilter) return false;
      if (!q) return true;
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [users, search, roleFilter]);

  const activeUsersCount = users.filter((u) => u.status === 'Ativo').length;
  const totalPortfoliosManaged = users.reduce((acc, u) => acc + u.portfoliosCount, 0);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let out = '';
    for (let i = 0; i < 12; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(out);
    showToast('Senha provisória gerada', 'Copie ou envie por e-mail ao cadastrar.', 'info');
  };

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    addUser({
      name: name.trim(),
      email: email.trim(),
      role,
      department,
      status: 'Ativo',
    });
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-5">
      {/* 3 Live KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5">
          <span className="text-xs font-semibold text-on-surface-variant">Total de Usuários</span>
          <p className="text-3xl font-extrabold text-on-surface tabular-nums mt-1">
            {19 + users.length}
          </p>
          <span className="text-[11px] text-on-surface-variant">Licenças corporativas ativas</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5">
          <span className="text-xs font-semibold text-on-surface-variant">Usuários Ativos</span>
          <p className="text-3xl font-extrabold text-emerald-600 tabular-nums mt-1">
            {17 + activeUsersCount}
          </p>
          <span className="text-[11px] font-bold text-primary">Autenticação 2FA habilitada</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5">
          <span className="text-xs font-semibold text-on-surface-variant">
            Carteiras Distribuídas
          </span>
          <p className="text-3xl font-extrabold text-primary tabular-nums mt-1">
            {totalPortfoliosManaged}
          </p>
          <span className="text-[11px] text-on-surface-variant">Vínculos ativos no CRM</span>
        </div>
      </div>

      {/* Main Split: Table + Quick Form */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
          <div className="p-4 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <span className="material-symbols-outlined text-[18px] text-outline absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar usuário ou e-mail..."
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'Todas' | CrmUser['role'])}
              className="h-9 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-medium"
            >
              <option value="Todas">Todas as Funções</option>
              <option value="Administrador">Administrador</option>
              <option value="Gestor Tributário">Gestor Tributário</option>
              <option value="Perito Contábil">Perito Contábil</option>
              <option value="Consultor Comercial">Consultor Comercial</option>
              <option value="Analista Fiscal">Analista Fiscal</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-bold uppercase text-on-surface-variant">
                  <th className="py-3 px-4">Colaborador</th>
                  <th className="py-3 px-4">Função RBAC</th>
                  <th className="py-3 px-4 text-center">Carteiras</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <SafeImage
                          src={u.avatar}
                          alt={u.name}
                          fallbackName={u.name}
                          className="w-9 h-9 rounded-full object-cover"
                          fallbackClassName="w-9 h-9 rounded-full bg-primary-fixed text-primary font-bold text-xs flex items-center justify-center shrink-0"
                        />
                        <div>
                          <p className="font-bold text-on-surface">{u.name}</p>
                          <p className="text-[11px] text-on-surface-variant">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-on-surface">{u.role}</p>
                      <p className="text-[11px] text-on-surface-variant">{u.department}</p>
                    </td>
                    <td className="py-3 px-4 text-center font-bold tabular-nums">
                      {u.portfoliosCount}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          u.status === 'Ativo'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-dim'
                        }`}
                      >
                        {u.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setPermTarget(u)}
                        className="px-2.5 py-1 rounded-lg bg-primary-fixed text-primary text-[11px] font-semibold"
                      >
                        Permissões
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Registration Form */}
        <div className="xl:col-span-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-4 h-fit">
          <div>
            <h3 className="text-sm font-extrabold text-on-surface">Novo Cadastro Rápido</h3>
            <p className="text-xs text-on-surface-variant">
              Envie acesso imediato com senha provisória e perfil RBAC
            </p>
          </div>

          <form onSubmit={handleQuickCreate} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Nome Completo *</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Juliana Carvalho"
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                E-mail Corporativo *
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@verticecrm.com.br"
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Função / Perfil</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as CrmUser['role'])}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-medium"
              >
                <option value="Administrador">Administrador</option>
                <option value="Gestor Tributário">Gestor Tributário</option>
                <option value="Perito Contábil">Perito Contábil</option>
                <option value="Consultor Comercial">Consultor Comercial</option>
                <option value="Analista Fiscal">Analista Fiscal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Departamento</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Senha Provisória
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="h-10 px-3 rounded-xl border border-outline-variant bg-white text-xs font-bold text-primary hover:bg-primary-fixed/30 shrink-0"
                >
                  Gerar
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full h-10 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors"
            >
              Cadastrar e Enviar Convite
            </button>
          </form>
        </div>
      </div>

      {/* Permissions Modal */}
      {permTarget && (
        <div className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-on-surface">
                Permissões — {permTarget.name}
              </h3>
              <button type="button" onClick={() => setPermTarget(null)} className="p-1 text-outline">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Perfil de Acesso RBAC</label>
              <select
                value={permTarget.role}
                onChange={(e) =>
                  setPermTarget({ ...permTarget, role: e.target.value as CrmUser['role'] })
                }
                className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs bg-white"
              >
                <option value="Administrador">Administrador</option>
                <option value="Gestor Tributário">Gestor Tributário</option>
                <option value="Perito Contábil">Perito Contábil</option>
                <option value="Consultor Comercial">Consultor Comercial</option>
                <option value="Analista Fiscal">Analista Fiscal</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPermTarget(null)}
                className="h-9 px-4 rounded-xl border border-outline-variant text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  updateUserRole(permTarget.id, permTarget.role);
                  setPermTarget(null);
                }}
                className="h-9 px-5 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Salvar Permissões
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
