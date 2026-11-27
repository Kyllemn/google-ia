import React, { useEffect, useMemo, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { copyToClipboard, formatBRL } from '../utils/export';

export const ReceberContatos: React.FC = () => {
  const {
    inboxContacts,
    updateContactStatus,
    updateContactNotes,
    sendContactToLeads,
    setActiveRoute,
    showToast,
  } = useCrm();

  const [statusTab, setStatusTab] = useState<'Todos' | 'Pendentes' | 'Em Atendimento'>('Todos');
  const [originFilter, setOriginFilter] = useState<string>('Todas');
  const [selectedId, setSelectedId] = useState<string>(inboxContacts[0]?.id ?? '');
  const [draftNotes, setDraftNotes] = useState<string>('');

  const origins = useMemo(() => {
    const set = new Set(inboxContacts.map((c) => c.origin));
    return ['Todas', ...Array.from(set)];
  }, [inboxContacts]);

  const filteredContacts = useMemo(() => {
    return inboxContacts.filter((c) => {
      if (statusTab === 'Pendentes' && c.status !== 'Pendente') return false;
      if (statusTab === 'Em Atendimento' && c.status !== 'Em Atendimento') return false;
      if (originFilter !== 'Todas' && c.origin !== originFilter) return false;
      return true;
    });
  }, [inboxContacts, statusTab, originFilter]);

  const selectedContact =
    filteredContacts.find((c) => c.id === selectedId) ?? filteredContacts[0] ?? null;

  useEffect(() => {
    if (selectedContact) {
      setDraftNotes(selectedContact.notes);
    }
  }, [selectedContact?.id]);

  const handleCopyCode = async (code: string) => {
    const ok = await copyToClipboard(code);
    if (ok) {
      showToast('Código copiado', `Código de origem ${code} copiado para a área de transferência.`, 'info');
    }
  };

  const handleSaveDraft = () => {
    if (!selectedContact) return;
    updateContactNotes(selectedContact.id, draftNotes);
    if (selectedContact.status === 'Pendente') {
      updateContactStatus(selectedContact.id, 'Em Atendimento');
    }
    showToast('Rascunho salvo', 'Anotações e status de triagem atualizados.');
  };

  const handleDispatchToLeads = () => {
    if (!selectedContact) return;
    updateContactNotes(selectedContact.id, draftNotes);
    sendContactToLeads(selectedContact.id);
  };

  const pendingCount = inboxContacts.filter((c) => c.status === 'Pendente').length;
  const inProgressCount = inboxContacts.filter((c) => c.status === 'Em Atendimento').length;

  return (
    <div className="space-y-5">
      {/* Top Filter & Status Bar */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(['Todos', 'Pendentes', 'Em Atendimento'] as const).map((tab) => {
            const active = statusTab === tab;
            const count =
              tab === 'Todos'
                ? inboxContacts.length
                : tab === 'Pendentes'
                ? pendingCount
                : inProgressCount;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusTab(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  active
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold tabular-nums ${
                    active ? 'bg-white/20 text-white' : 'bg-white text-on-surface'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-on-surface-variant">Origem:</span>
            <select
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
            >
              {origins.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setActiveRoute('gerenciamento-de-leads')}
            className="h-9 px-3.5 rounded-xl bg-primary-fixed text-primary text-xs font-semibold hover:bg-primary-fixed-dim/50 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">view_kanban</span>
            <span>Ver Kanban de Leads</span>
          </button>
        </div>
      </div>

      {/* Split Triage Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left List */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-outline-variant/40 flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Fila de Entrada ({filteredContacts.length})
            </span>
            <span className="text-[11px] font-medium text-on-surface-variant">
              Ordenado por recebimento
            </span>
          </div>
          <div className="divide-y divide-outline-variant/30 max-h-[600px] overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-3xl text-outline mb-2">
                  mark_email_read
                </span>
                <p className="text-sm font-semibold text-on-surface">Nenhum contato nesta fila</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Ajuste os filtros de status ou origem acima.
                </p>
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const isSelected = selectedContact?.id === contact.id;
                const badgeStyle =
                  contact.status === 'Pendente'
                    ? 'bg-tertiary-fixed text-tertiary'
                    : contact.status === 'Em Atendimento'
                    ? 'bg-primary-fixed text-primary'
                    : 'bg-emerald-50 text-emerald-700';

                return (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => setSelectedId(contact.id)}
                    className={`w-full text-left p-4 transition-colors hover:bg-surface-container-low/70 ${
                      isSelected ? 'bg-primary-fixed/25 border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">
                          {contact.company}
                        </p>
                        <p className="text-xs text-on-surface-variant truncate mt-0.5">
                          {contact.name} • {contact.role}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${badgeStyle}`}
                      >
                        {contact.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-on-surface-variant">
                      <span className="inline-flex items-center gap-1 font-medium text-primary">
                        <span className="material-symbols-outlined text-[14px]">hub</span>
                        {contact.origin}
                      </span>
                      <span className="tabular-nums font-semibold text-on-surface">
                        {formatBRL(contact.estimatedValue)}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail / Triage Panel */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 sm:p-6 flex flex-col justify-between">
          {selectedContact ? (
            <div className="space-y-5">
              {/* Contact Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-outline-variant/40">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-extrabold text-on-surface">
                      {selectedContact.company}
                    </h2>
                    {selectedContact.cnpj && (
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[11px] font-mono text-on-surface-variant">
                        {selectedContact.cnpj}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant mt-1">
                    {selectedContact.name} — {selectedContact.role}
                  </p>
                </div>

                <div className="text-right">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-outline">
                    Potencial Estimado
                  </span>
                  <span className="text-xl font-extrabold text-primary tabular-nums">
                    {formatBRL(selectedContact.estimatedValue)}
                  </span>
                </div>
              </div>

              {/* Metadata Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <span className="block text-[10px] font-bold uppercase text-outline">E-mail</span>
                  <span className="block text-xs font-semibold text-on-surface truncate mt-0.5">
                    {selectedContact.email}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <span className="block text-[10px] font-bold uppercase text-outline">
                    Telefone / WhatsApp
                  </span>
                  <span className="block text-xs font-semibold text-on-surface mt-0.5 tabular-nums">
                    {selectedContact.phone}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase text-outline">
                      Código Origem
                    </span>
                    <span className="block text-xs font-mono font-bold text-primary mt-0.5">
                      {selectedContact.originCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(selectedContact.originCode)}
                    className="p-1.5 rounded-lg bg-white border border-outline-variant/50 text-on-surface-variant hover:text-primary"
                    title="Copiar código de origem"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/30">
                <div>
                  <span className="block text-xs font-bold text-on-surface">
                    Status de Atendimento
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Recebido em {selectedContact.receivedAt} via {selectedContact.origin}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['Pendente', 'Em Atendimento', 'Concluído'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateContactStatus(selectedContact.id, st)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        selectedContact.status === st
                          ? 'bg-primary text-white'
                          : 'bg-white text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes / Brief */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5">
                  Notas de Qualificação & Diagnóstico Preliminar
                </label>
                <textarea
                  rows={4}
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  className="w-full rounded-xl bg-surface-container-low border border-outline-variant/60 p-3 text-xs text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  placeholder="Registre observações fiscais, regime tributário ou próximos passos..."
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="h-10 px-4 rounded-xl border border-outline-variant bg-white text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Salvar Rascunho</span>
                </button>

                <button
                  type="button"
                  onClick={handleDispatchToLeads}
                  disabled={selectedContact.status === 'Concluído'}
                  className={`h-10 px-5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    selectedContact.status === 'Concluído'
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : 'bg-primary text-white hover:bg-primary-container shadow-sm'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {selectedContact.status === 'Concluído' ? 'check_circle' : 'send'}
                  </span>
                  <span>
                    {selectedContact.status === 'Concluído'
                      ? 'Já Enviado para Leads'
                      : 'Concluir e Enviar para Leads'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-on-surface-variant text-sm">
              Selecione um contato na fila para iniciar a triagem.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
