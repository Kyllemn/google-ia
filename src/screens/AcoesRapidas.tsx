import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';

const CLIENT_CHIPS = [
  'Todos os Clientes (18)',
  'Metalúrgica Ramos',
  'Aliança Alimentos',
  'Farmácias São João',
  'Vale do Sol Agro',
];

export const AcoesRapidas: React.FC = () => {
  const {
    quickApprovals,
    resolveQuickApproval,
    ecacMailbox,
    openManifestacao,
    setActiveRoute,
    openNfseSplit,
    showToast,
  } = useCrm();

  const [selectedClient, setSelectedClient] = useState(CLIENT_CHIPS[0]);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('Última varredura completa: há 14 minutos • 18 CNPJs auditados');
  const [inspectDraftId, setInspectDraftId] = useState<string | null>(null);

  const pendingApprovals = quickApprovals.filter((a) => a.status === 'pending');

  const filteredMailbox =
    selectedClient === CLIENT_CHIPS[0]
      ? ecacMailbox
      : ecacMailbox.filter((item) =>
          item.company.toLowerCase().includes(selectedClient.split(' ')[0].toLowerCase())
        );

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSyncText('Varredura completa agora • 18 CNPJs auditados via ICP-Brasil A1');
      showToast('Varredura e-CAC concluída', 'Todas as procurações RFB/PGFN verificadas com sucesso.');
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Greeting & Connection Status Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-on-surface-variant">Bom dia, Dr. Roberto</p>
          <div className="flex flex-wrap items-center gap-3 mt-0.5">
            <h2 className="text-2xl font-bold text-on-surface tracking-tight">
              Painel de Ações Rápidas
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-xs font-bold whitespace-nowrap shrink-0">
              <span className="material-symbols-outlined text-[15px]">priority_high</span>
              3 Críticos
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs text-xs">
            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
            <span className="font-semibold text-on-surface">e-CAC Conectado</span>
            <span className="text-outline">•</span>
            <span className="text-on-surface-variant">A1 Válido (142d)</span>
            <span className="inline-flex items-center gap-1 text-primary font-semibold ml-1">
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              Auditado
            </span>
          </div>

          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-semibold text-xs shadow-sm transition-colors whitespace-nowrap shrink-0 disabled:opacity-70"
          >
            <span className={`material-symbols-outlined text-[17px] ${syncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{syncing ? 'Sincronizando e-CAC...' : 'Sincronizar Varredura e-CAC'}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Client Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {CLIENT_CHIPS.map((chip) => {
          const active = selectedClient === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setSelectedClient(chip)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container'
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Fatal Deadline Spotlight & Quick Approvals (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Prazo Fatal Card */}
          <div className="rounded-2xl bg-surface-container-lowest border border-error/25 shadow-sm p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">hourglass_top</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary">
                    PRAZO FATAL E-CAC
                  </span>
                  <h3 className="text-lg font-bold text-on-surface">
                    4 dias restantes <span className="text-sm font-normal text-on-surface-variant">(05/Nov)</span>
                  </h3>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-primary-fixed text-on-primary-fixed text-xs font-bold whitespace-nowrap shrink-0">
                CARF 3ª Sec.
              </span>
            </div>

            <div className="rounded-xl bg-surface-container-low p-4 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-on-surface font-mono">
                  Proc. 10830.720194/2024-11
                </span>
                <span className="text-sm font-bold text-error tabular-nums">
                  R$ 142.500,00
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Risco iminente de glosa e exclusão indevida de créditos presumidos de ICMS. Exige juntada de manifestação de inconformidade com assinatura ICP-Brasil.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openManifestacao('10830.720194/2024-11')}
                className="flex-1 min-w-[240px] h-11 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">fingerprint</span>
                <span>Revisar &amp; Aprovar Manifestação</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveRoute('intimacoes-prazos-e-cac')}
                className="h-11 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-xs transition-colors whitespace-nowrap shrink-0"
              >
                Ver Caixa e-CAC
              </button>
            </div>
          </div>

          {/* Aprovações Rápidas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-on-surface">Aprovações Rápidas</h3>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold tabular-nums">
                  {pendingApprovals.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveRoute('auditoria-dctfweb-efd')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Histórico
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickApprovals.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs p-4 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px]">
                            {item.type === 'dctf' ? 'receipt_long' : 'payments'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-on-surface truncate">{item.title}</h4>
                          <p className="text-xs text-on-surface-variant truncate">{item.company}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold shrink-0">
                        {item.badge}
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl bg-surface-container-low p-3 flex items-center justify-between gap-2">
                      <div>
                        <span className="block text-[11px] text-on-surface-variant">
                          {item.metricLabel}
                        </span>
                        <span
                          className={`text-base font-bold tabular-nums ${
                            item.type === 'dctf' ? 'text-primary' : 'text-on-surface'
                          }`}
                        >
                          {item.metricValue}
                        </span>
                      </div>

                      {item.pillNote && (
                        <span className="px-2.5 py-1 rounded-lg bg-white text-primary text-[11px] font-semibold shadow-xs">
                          {item.pillNote}
                        </span>
                      )}

                      {item.secondaryLabel && (
                        <div className="text-right">
                          <span className="block text-[11px] text-on-surface-variant">
                            {item.secondaryLabel}
                          </span>
                          <span className="text-xs font-bold text-tertiary tabular-nums">
                            {item.secondaryValue}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {item.status === 'pending' ? (
                    <div className="grid grid-cols-2 gap-2">
                      {item.type === 'dctf' ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setInspectDraftId(inspectDraftId === item.id ? null : item.id)
                            }
                            className="h-9 px-3 rounded-xl bg-primary-fixed/50 hover:bg-primary-fixed text-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            <span>Ver Minuta</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => resolveQuickApproval(item.id, 'approved')}
                            className="h-9 px-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                          >
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span>Aprovar Envio</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => resolveQuickApproval(item.id, 'rejected')}
                            className="h-9 px-3 rounded-xl bg-error-container hover:bg-error/20 text-on-error-container font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                            <span>Recusar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => resolveQuickApproval(item.id, 'approved')}
                            className="h-9 px-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                          >
                            <span className="material-symbols-outlined text-[16px]">send</span>
                            <span>Autorizar NFSe</span>
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`h-9 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                        item.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {item.status === 'approved' ? 'verified' : 'block'}
                      </span>
                      <span>
                        {item.status === 'approved' ? 'Autorizado & Transmitido' : 'Solicitação Recusada'}
                      </span>
                    </div>
                  )}

                  {inspectDraftId === item.id && (
                    <div className="rounded-xl bg-surface-container-low p-3 text-[11px] text-on-surface-variant border border-outline-variant/40 space-y-1">
                      <p className="font-bold text-on-surface">Resumo da Minuta DCTFWeb 12/2023</p>
                      <p>PIS (8109): R$ 36.525,60 → R$ 33.210,00 (-R$ 3.315,60)</p>
                      <p>COFINS (2172): R$ 166.394,40 → R$ 151.290,00 (-R$ 15.104,40)</p>
                      <button
                        type="button"
                        onClick={() => setActiveRoute('auditoria-dctfweb-efd')}
                        className="text-primary font-semibold hover:underline pt-1"
                      >
                        Abrir Auditoria Completa →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Caixa Postal Fiscal (e-CAC) & Shortcuts (5 cols) */}
        <div className="xl:col-span-5 space-y-5">
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                <h3 className="text-base font-bold text-on-surface">
                  Caixa Postal Fiscal (e-CAC)
                </h3>
              </div>
              <span className="text-xs font-medium text-outline">Hoje 11:20</span>
            </div>

            <div className="divide-y divide-outline-variant/30">
              {filteredMailbox.map((mail) => (
                <button
                  key={mail.id}
                  type="button"
                  onClick={() => setActiveRoute('intimacoes-prazos-e-cac')}
                  className="w-full py-3 first:pt-1 last:pb-1 flex items-start gap-3 text-left hover:bg-surface-container-low/60 rounded-xl px-2 -mx-2 transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      mail.tone === 'error'
                        ? 'bg-error-container text-on-error-container'
                        : mail.tone === 'primary'
                        ? 'bg-primary-fixed text-primary'
                        : 'bg-surface-container text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {mail.tone === 'error'
                        ? 'gavel'
                        : mail.tone === 'primary'
                        ? 'verified'
                        : 'task_alt'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-on-surface truncate">
                        {mail.title}
                      </span>
                      <span className="text-[11px] text-outline shrink-0">{mail.time}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant truncate mt-0.5">
                      {mail.description}
                    </p>
                    <span
                      className={`text-[11px] font-semibold mt-0.5 inline-block ${
                        mail.tone === 'error' ? 'text-tertiary' : 'text-primary'
                      }`}
                    >
                      {mail.company}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {lastSyncText}
              </span>
            </div>
          </div>

          {/* Quick Navigation Grid */}
          <div className="rounded-2xl bg-surface-container-low p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Atalhos de Decisão Executiva
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setActiveRoute('recursos-carf')}
                className="p-3 rounded-xl bg-white hover:bg-surface-container text-left shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">balance</span>
                <p className="text-xs font-bold text-on-surface mt-1">Pautas CARF</p>
                <p className="text-[11px] text-on-surface-variant">1ª Seção • Amanhã 14h</p>
              </button>
              <button
                type="button"
                onClick={() => openNfseSplit()}
                className="p-3 rounded-xl bg-white hover:bg-surface-container text-left shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">call_split</span>
                <p className="text-xs font-bold text-on-surface mt-1">Faturar NFSe + Split</p>
                <p className="text-[11px] text-on-surface-variant">Fatura #FAT-2024-089</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
