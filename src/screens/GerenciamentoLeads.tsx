import React, { useMemo, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { LeadCard, LeadStage } from '../types/crm';
import { formatBRL, formatBRLCompact } from '../utils/export';

const STAGES: { key: LeadStage; color: string; dotColor: string }[] = [
  { key: 'Novo Lead', color: 'bg-primary-fixed text-primary', dotColor: 'bg-primary' },
  { key: 'Contato Iniciado', color: 'bg-secondary-fixed text-secondary', dotColor: 'bg-secondary' },
  { key: 'Proposta Enviada', color: 'bg-tertiary-fixed text-tertiary', dotColor: 'bg-tertiary' },
  { key: 'Fechamento', color: 'bg-emerald-100 text-emerald-800', dotColor: 'bg-emerald-600' },
];

export const GerenciamentoLeads: React.FC = () => {
  const { leads, addLead, moveLeadStage, setActiveRoute } = useCrm();

  const [viewMode, setViewMode] = useState<'kanban' | 'lista'>('kanban');
  const [ownerFilter, setOwnerFilter] = useState('Todos');
  const [sourceFilter, setSourceFilter] = useState('Todas');
  const [periodFilter, setPeriodFilter] = useState('Outubro 2024');
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [activeLead, setActiveLead] = useState<LeadCard | null>(null);

  const [formCompany, setFormCompany] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formValue, setFormValue] = useState('85000');
  const [formOwner, setFormOwner] = useState('Mariana Silva');
  const [formSource, setFormSource] = useState('RD Station');

  const owners = useMemo(() => ['Todos', ...Array.from(new Set(leads.map((l) => l.owner)))], [leads]);
  const sources = useMemo(() => ['Todas', ...Array.from(new Set(leads.map((l) => l.source)))], [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (ownerFilter !== 'Todos' && l.owner !== ownerFilter) return false;
      if (sourceFilter !== 'Todas' && l.source !== sourceFilter) return false;
      return true;
    });
  }, [leads, ownerFilter, sourceFilter]);

  const totalPipelineValue = useMemo(
    () => filteredLeads.reduce((acc, l) => acc + l.value, 0),
    [filteredLeads]
  );

  const qualifiedCount = filteredLeads.filter((l) => l.stage !== 'Novo Lead').length;

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim() || !formContact.trim()) return;
    addLead({
      company: formCompany.trim(),
      contactName: formContact.trim(),
      email: formEmail.trim() || 'contato@empresa.com.br',
      phone: formPhone.trim() || '(11) 99000-0000',
      value: Number(formValue) || 45000,
      stage: 'Novo Lead',
      owner: formOwner,
      source: formSource,
      tags: ['Novo Negócio', 'Diagnóstico'],
      priority: 'Alta',
    });
    setFormCompany('');
    setFormContact('');
    setFormEmail('');
    setFormPhone('');
    setNewModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">Total de Leads</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-on-surface tabular-nums">
              {138 + leads.length}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              +14,2% mês
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">Em Negociação Ativa</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-primary tabular-nums">
              {35 + qualifiedCount}
            </span>
            <span className="text-[11px] font-semibold text-on-surface-variant">
              {filteredLeads.length} no quadro
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">Taxa de Conversão</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-on-surface tabular-nums">24,5%</span>
            <span className="text-[11px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-md">
              Meta 22%
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">Pipeline em Aberto</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-on-surface tabular-nums">
              {formatBRLCompact(totalPipelineValue)}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700">Atualizado agora</span>
          </div>
        </div>
      </div>

      {/* Filters & View Switcher */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-medium text-on-surface"
          >
            {owners.map((o) => (
              <option key={o} value={o}>
                Responsável: {o}
              </option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-medium text-on-surface"
          >
            {sources.map((s) => (
              <option key={s} value={s}>
                Origem: {s}
              </option>
            ))}
          </select>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-medium text-on-surface"
          >
            <option>Outubro 2024</option>
            <option>Setembro 2024</option>
            <option>Últimos 90 dias</option>
          </select>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex p-1 rounded-xl bg-surface-container-low border border-outline-variant/40">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                viewMode === 'kanban' ? 'bg-white text-primary shadow-xs' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_kanban</span>
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('lista')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                viewMode === 'lista' ? 'bg-white text-primary shadow-xs' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
              <span>Lista</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>+ Novo Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage.key);
            const stageSum = stageLeads.reduce((acc, l) => acc + l.value, 0);

            return (
              <div
                key={stage.key}
                className="bg-surface-container-low/70 rounded-2xl border border-outline-variant/40 p-3 space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.dotColor}`} />
                    <h3 className="text-xs font-extrabold text-on-surface">{stage.key}</h3>
                    <span className="px-1.5 py-0.5 rounded-md bg-white text-[10px] font-bold text-on-surface-variant tabular-nums">
                      {stageLeads.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-on-surface-variant tabular-nums">
                    {formatBRLCompact(stageSum)}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white rounded-xl border border-outline-variant/40 p-3.5 shadow-2xs hover:border-primary/50 transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveLead(lead)}
                          className="text-left min-w-0 flex-1"
                        >
                          <p className="text-xs font-bold text-on-surface hover:text-primary truncate">
                            {lead.company}
                          </p>
                          <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                            {lead.contactName}
                          </p>
                        </button>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            lead.priority === 'Alta'
                              ? 'bg-error-container text-error'
                              : lead.priority === 'Média'
                              ? 'bg-tertiary-fixed text-tertiary'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {lead.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-surface-container-low text-[10px] font-semibold text-on-surface-variant"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-primary tabular-nums">
                          {formatBRL(lead.value)}
                        </span>
                        <select
                          value={lead.stage}
                          onChange={(e) => moveLeadStage(lead.id, e.target.value as LeadStage)}
                          aria-label={`Mover etapa de ${lead.company}`}
                          className="h-7 px-2 rounded-lg bg-surface-container-low border border-outline-variant/40 text-[10px] font-semibold text-on-surface-variant focus:outline-none focus:border-primary"
                        >
                          {STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.key}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-bold uppercase text-on-surface-variant">
                  <th className="py-3 px-4">Empresa / Contato</th>
                  <th className="py-3 px-4">Etapa</th>
                  <th className="py-3 px-4">Responsável</th>
                  <th className="py-3 px-4">Origem</th>
                  <th className="py-3 px-4 text-right">Valor Estimado</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-xs">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-on-surface">{lead.company}</p>
                      <p className="text-[11px] text-on-surface-variant">{lead.contactName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.stage}
                        onChange={(e) => moveLeadStage(lead.id, e.target.value as LeadStage)}
                        className="h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-xs font-semibold text-on-surface"
                      >
                        {STAGES.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.key}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">{lead.owner}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{lead.source}</td>
                    <td className="py-3 px-4 text-right font-bold text-primary tabular-nums">
                      {formatBRL(lead.value)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveLead(lead)}
                        className="px-2.5 py-1 rounded-lg bg-primary-fixed text-primary font-semibold text-[11px] hover:bg-primary-fixed-dim/50"
                      >
                        Inspecionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Lead Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-on-surface">Novo Lead Comercial</h3>
              <button
                type="button"
                onClick={() => setNewModalOpen(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Razão Social / Empresa *</label>
                <input
                  required
                  type="text"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  placeholder="Ex: Metalúrgica Nova Era Ltda."
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Nome do Contato *</label>
                  <input
                    required
                    type="text"
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    placeholder="Ex: Juliana Martins"
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs tabular-nums focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">E-mail</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="contato@empresa.com.br"
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Telefone</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="(11) 99999-0000"
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Responsável</label>
                  <select
                    value={formOwner}
                    onChange={(e) => setFormOwner(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs bg-white"
                  >
                    <option>Mariana Silva</option>
                    <option>Rafael Mendes</option>
                    <option>Camila Torres</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Origem</label>
                  <select
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs bg-white"
                  >
                    <option>RD Station</option>
                    <option>Meta Ads</option>
                    <option>Webhook Site</option>
                    <option>Indicação</option>
                  </select>
                </div>
              </div>
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="h-9 px-4 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface-variant"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container"
                >
                  Criar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Lead Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-on-surface">{activeLead.company}</h3>
                <p className="text-xs text-on-surface-variant">{activeLead.contactName}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="p-1 rounded-lg text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2 text-xs bg-surface-container-low p-4 rounded-xl">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Valor Estimado:</span>
                <span className="font-bold text-primary tabular-nums">{formatBRL(activeLead.value)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Responsável:</span>
                <span className="font-semibold text-on-surface">{activeLead.owner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Origem:</span>
                <span className="font-semibold text-on-surface">{activeLead.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">E-mail:</span>
                <span className="font-semibold text-on-surface">{activeLead.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Telefone:</span>
                <span className="font-semibold text-on-surface">{activeLead.phone}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveLead(null);
                  setActiveRoute('recuperacao-tributaria');
                }}
                className="h-9 px-3.5 rounded-xl bg-primary-fixed text-primary text-xs font-bold hover:bg-primary-fixed-dim/50"
              >
                Abrir Estudo Tributário
              </button>
              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
