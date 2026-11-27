import React, { useMemo, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { ActivePortfolio } from '../types/crm';
import { downloadCsv, formatBRL, formatBRLCompact } from '../utils/export';

export const CarteirasAtivas: React.FC = () => {
  const { activePortfolios, addActivePortfolio, updateActivePortfolio, showToast } = useCrm();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | ActivePortfolio['status']>('Todos');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ActivePortfolio | null>(null);

  const [company, setCompany] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [segment, setSegment] = useState('Indústria & Manufatura');
  const [mrr, setMrr] = useState('19500');
  const [owner, setOwner] = useState('Mariana Silva');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activePortfolios.filter((p) => {
      if (statusFilter !== 'Todos' && p.status !== statusFilter) return false;
      if (!q) return true;
      return (
        p.company.toLowerCase().includes(q) ||
        p.cnpj.includes(q) ||
        p.owner.toLowerCase().includes(q)
      );
    });
  }, [activePortfolios, search, statusFilter]);

  const totalMrr = activePortfolios.reduce((acc, p) => acc + p.mrr, 0);
  const totalContacts = activePortfolios.reduce((acc, p) => acc + p.contactsCount, 0);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((p) => p.id));
    }
  };

  const handleExportCsv = () => {
    downloadCsv(
      'carteiras-ativas-vertice.csv',
      ['Empresa', 'CNPJ', 'Segmento', 'MRR', 'Responsável', 'Contatos', 'Health Score', 'Status'],
      filtered.map((p) => [
        p.company,
        p.cnpj,
        p.segment,
        formatBRL(p.mrr),
        p.owner,
        p.contactsCount,
        `${p.healthScore}%`,
        p.status,
      ])
    );
    showToast('CSV exportado', `${filtered.length} carteiras exportadas com sucesso.`);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;
    addActivePortfolio({
      company: company.trim(),
      cnpj: cnpj.trim() || '51.203.994/0001-12',
      segment,
      mrr: Number(mrr) || 15000,
      owner,
      contactsCount: 12,
      healthScore: 95,
      status: 'Em Dia',
    });
    setCompany('');
    setCnpj('');
    setNewModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* 3 KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant">Carteiras Ativas</span>
            <p className="text-3xl font-extrabold text-on-surface tabular-nums mt-1">
              {58 + activePortfolios.length}
            </p>
            <span className="text-[11px] font-bold text-emerald-700">+4 novas este mês</span>
          </div>
          <svg viewBox="0 0 110 42" className="w-24 h-10 shrink-0" aria-hidden="true">
            <polyline
              fill="none"
              stroke="#004ac6"
              strokeWidth="2.5"
              strokeLinecap="round"
              points="4,32 24,29 44,24 64,26 84,15 106,8"
            />
          </svg>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant">
              MRR Recorrente Mensal
            </span>
            <p className="text-3xl font-extrabold text-primary tabular-nums mt-1">
              {formatBRLCompact(totalMrr)}
            </p>
            <span className="text-[11px] font-semibold text-on-surface-variant">
              Ticket médio {formatBRLCompact(totalMrr / Math.max(activePortfolios.length, 1))}
            </span>
          </div>
          <svg viewBox="0 0 88 42" className="w-20 h-10 shrink-0" aria-hidden="true">
            <rect x="4" y="22" width="10" height="18" rx="3" fill="#dbe1ff" />
            <rect x="20" y="16" width="10" height="24" rx="3" fill="#b4c5ff" />
            <rect x="36" y="19" width="10" height="21" rx="3" fill="#708cfd" />
            <rect x="52" y="10" width="10" height="30" rx="3" fill="#2563eb" />
            <rect x="68" y="4" width="10" height="36" rx="3" fill="#004ac6" />
          </svg>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">
              Contatos Mapeados
            </span>
            <span className="text-xs font-bold text-primary tabular-nums">94,5%</span>
          </div>
          <p className="text-3xl font-extrabold text-on-surface tabular-nums mt-1">
            {totalContacts} / 200
          </p>
          <div className="mt-3 h-2 rounded-full bg-surface-container overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${Math.min(100, (totalContacts / 200) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-xs">
            <span className="material-symbols-outlined text-[18px] text-outline absolute left-3 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar empresa, CNPJ ou gestor..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'Todos' | ActivePortfolio['status'])}
            className="h-9 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-medium text-on-surface"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Em Dia">Em Dia</option>
            <option value="Atenção">Atenção</option>
            <option value="Renovação">Renovação</option>
          </select>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="h-9 px-3.5 rounded-xl border border-outline-variant bg-white text-xs font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Exportar CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>+ Nova Carteira</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-bold uppercase text-on-surface-variant">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleAll}
                    aria-label="Selecionar todas as carteiras"
                    className="rounded border-outline-variant"
                  />
                </th>
                <th className="py-3 px-4">Empresa / CNPJ</th>
                <th className="py-3 px-4">Segmento</th>
                <th className="py-3 px-4">Gestor</th>
                <th className="py-3 px-4 text-right">MRR</th>
                <th className="py-3 px-4 text-center">Health</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      aria-label={`Selecionar ${item.company}`}
                      className="rounded border-outline-variant"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-on-surface">{item.company}</p>
                    <p className="text-[11px] font-mono text-on-surface-variant">{item.cnpj}</p>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">{item.segment}</td>
                  <td className="py-3 px-4 text-on-surface">{item.owner}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-primary tabular-nums">
                    {formatBRL(item.mrr)}
                  </td>
                  <td className="py-3 px-4 text-center tabular-nums font-bold">
                    <span
                      className={
                        item.healthScore >= 90
                          ? 'text-emerald-700'
                          : item.healthScore >= 80
                          ? 'text-primary'
                          : 'text-tertiary'
                      }
                    >
                      {item.healthScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.status === 'Em Dia'
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.status === 'Atenção'
                          ? 'bg-tertiary-fixed text-tertiary'
                          : 'bg-primary-fixed text-primary'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setEditTarget(item)}
                      className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-primary-fixed text-primary font-semibold text-[11px]"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant">
          <span>
            Mostrando 1 a {filtered.length} de {58 + activePortfolios.length} carteiras
            {selectedIds.length > 0 ? ` (${selectedIds.length} selecionadas)` : ''}
          </span>
          <div className="flex items-center gap-1">
            <span className="px-2.5 py-1 rounded-lg bg-primary text-white font-bold">1</span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-container-low font-medium">2</span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-container-low font-medium">3</span>
          </div>
        </div>
      </div>

      {/* New Portfolio Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-on-surface">Nova Carteira Ativa</h3>
              <button type="button" onClick={() => setNewModalOpen(false)} className="p-1 text-outline">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Empresa *</label>
                <input
                  required
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs"
                  placeholder="Razão Social"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">CNPJ</label>
                  <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs font-mono"
                    placeholder="00.000.000/0001-00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">MRR (R$)</label>
                  <input
                    type="number"
                    value={mrr}
                    onChange={(e) => setMrr(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs tabular-nums"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Segmento</label>
                  <input
                    type="text"
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Gestor</label>
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs bg-white"
                  >
                    <option>Mariana Silva</option>
                    <option>Rafael Mendes</option>
                    <option>Camila Torres</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="h-9 px-4 rounded-xl border border-outline-variant text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button type="submit" className="h-9 px-5 rounded-xl bg-primary text-white text-xs font-bold">
                  Cadastrar Carteira
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Portfolio Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-on-surface">{editTarget.company}</h3>
              <button type="button" onClick={() => setEditTarget(null)} className="p-1 text-outline">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Status da Carteira</label>
                <select
                  value={editTarget.status}
                  onChange={(e) =>
                    setEditTarget({ ...editTarget, status: e.target.value as ActivePortfolio['status'] })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs bg-white"
                >
                  <option value="Em Dia">Em Dia</option>
                  <option value="Atenção">Atenção</option>
                  <option value="Renovação">Renovação</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">MRR Mensal (R$)</label>
                <input
                  type="number"
                  value={editTarget.mrr}
                  onChange={(e) => setEditTarget({ ...editTarget, mrr: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs tabular-nums"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="h-9 px-4 rounded-xl border border-outline-variant text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  updateActivePortfolio(editTarget.id, {
                    status: editTarget.status,
                    mrr: editTarget.mrr,
                  });
                  setEditTarget(null);
                }}
                className="h-9 px-5 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
