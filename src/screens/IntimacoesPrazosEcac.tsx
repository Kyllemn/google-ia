import React, { useMemo, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { downloadCsv, downloadTextFile } from '../utils/export';
import { ManifestacaoInconformidade } from './ManifestacaoInconformidade';

export const IntimacoesPrazosEcac: React.FC = () => {
  const {
    intimacoes,
    acknowledgeIntimacoes,
    addIntimacao,
    showManifestacao,
    openManifestacao,
    openSettingsTab,
    showToast,
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'all' | 'fatal' | 'homologacao' | 'geral'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cnpjScope, setCnpjScope] = useState('Todos os 18 CNPJs Vinculados');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [previewItem, setPreviewItem] = useState<string | null>(null);

  const [newCompany, setNewCompany] = useState('Indústria Metalúrgica Ramos Ltda');
  const [newProcess, setNewProcess] = useState('10830.720912/2024-80');
  const [newAct, setNewAct] = useState('Intimação para Esclarecimento PER/DCOMP');
  const [newDue, setNewDue] = useState('12/11/2024');

  const filteredRows = useMemo(() => {
    return intimacoes.filter((row) => {
      if (activeTab !== 'all' && row.category !== activeTab) return false;
      if (cnpjScope !== 'Todos os 18 CNPJs Vinculados') {
        const keyword = cnpjScope.split('-')[1]?.trim().split(' ')[0]?.toLowerCase() ?? '';
        if (keyword && !row.company.toLowerCase().includes(keyword)) return false;
      }
      if (statusFilter === 'critico' && row.urgencyTone !== 'critical') return false;
      if (statusFilter === 'ciencia' && !row.acknowledged) return false;
      if (statusFilter === 'aberto' && row.urgencyTone === 'done') return false;
      if (statusFilter === 'respondido' && row.urgencyTone !== 'done') return false;

      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      return (
        row.company.toLowerCase().includes(q) ||
        row.cnpj.toLowerCase().includes(q) ||
        row.cnpj.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
        row.processNumber.toLowerCase().includes(q) ||
        row.actType.toLowerCase().includes(q)
      );
    });
  }, [intimacoes, activeTab, cnpjScope, statusFilter, searchTerm]);

  if (showManifestacao) {
    return <ManifestacaoInconformidade />;
  }

  const allChecked =
    filteredRows.length > 0 && filteredRows.every((r) => selectedIds.includes(r.id));

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRows.map((r) => r.id));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast(
        'Varredura e-CAC concluída',
        '18 procurações digitais consultadas via WebService RFB/PGFN. Nenhuma nova glosa detectada.'
      );
    }, 1000);
  };

  const handleBatchAck = () => {
    if (selectedIds.length === 0) {
      showToast(
        'Selecione ao menos uma notificação',
        'Marque as caixas na tabela para registrar ciência digital em lote.',
        'warning'
      );
      return;
    }
    acknowledgeIntimacoes(selectedIds);
    setSelectedIds([]);
  };

  const handleExportDossier = () => {
    downloadCsv(
      'intimacoes_prazos_ecac.csv',
      ['Processo', 'Empresa', 'CNPJ', 'Ato RFB', 'Prazo Restante', 'Ciência'],
      filteredRows.map((r) => [
        r.processNumber,
        r.company,
        r.cnpj,
        r.actType,
        r.urgencyLabel,
        r.scienceStatus,
      ])
    );
    showToast('Dossiê e-CAC exportado (.CSV)');
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    addIntimacao({
      processNumber: newProcess,
      notificationCode: 'Alerta Manual CRM',
      company: newCompany,
      cnpj: '14.892.411/0001-92',
      actType: newAct,
      actSubtitle: 'Monitoramento preventivo cadastrado pela equipe fiscal',
      contextNote: 'Prazo em acompanhamento',
      contextTone: 'neutral',
      urgencyLabel: '10 dias restantes',
      urgencyTone: 'warning',
      expiresNote: `Vencimento: ${newDue}`,
      receivedDate: '24/10/2024',
      receivedTime: '14:45:00',
      scienceStatus: 'Prazo Monitorado',
      scienceDetail: 'Atribuído à Equipe Tributária',
      scienceTone: 'warning',
      category: 'fatal',
      acknowledged: false,
      canManifest: true,
    });
    setShowNewModal(false);
  };

  const inspectedNotification = intimacoes.find((i) => i.id === previewItem);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Gateway Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
          <span>Financeiro &amp; Fiscal</span>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <span>Caixa Postal &amp; Contencioso Administrativo</span>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <span className="text-primary">Intimações &amp; Prazos e-CAC</span>
        </nav>

        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full text-xs text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-on-surface">Gateway e-CAC v4.8</span>
          <span className="text-outline">|</span>
          <span>
            Procurações Digitais Ativas: <strong className="text-on-surface">18/18</strong>
          </span>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-2xl font-bold text-on-surface tracking-tight">
              Intimações &amp; Prazos Processuais e-CAC
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold uppercase tracking-wider">
              RFB / PGFN
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl">
            Monitoramento automatizado por robô de varredura na Caixa Postal da Receita Federal e PGFN com contagem regressiva de prazos fatais e controle de ciência tácita (Lei nº 11.196/05).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-surface-container-lowest border border-outline-variant/40 shadow-xs rounded-xl px-3 py-1.5 gap-2">
            <button
              type="button"
              onClick={handleSync}
              className="flex items-center gap-1.5 text-on-surface hover:text-primary text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <span
                className={`material-symbols-outlined text-[17px] text-primary ${
                  syncing ? 'animate-spin' : ''
                }`}
              >
                sync
              </span>
              <span>{syncing ? 'Consultando e-CAC...' : 'Sincronizar e-CAC Agora'}</span>
            </button>
            <span className="text-[11px] text-on-surface-variant pl-2 border-l border-outline-variant/50 whitespace-nowrap">
              Varredura há 12 min
            </span>
          </div>

          <select
            value={cnpjScope}
            onChange={(e) => setCnpjScope(e.target.value)}
            aria-label="Seletor de Procuração Digital"
            className="h-9 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
          >
            <option>Todos os 18 CNPJs Vinculados</option>
            <option>14.892.411/0001-92 - Ramos Indústria</option>
            <option>22.441.512/0002-80 - Aliança Alimentos</option>
            <option>03.119.827/0001-19 - Vale do Sol Agro</option>
            <option>08.231.902/0003-45 - Farmácias São João</option>
          </select>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">alarm_add</span>
            <span>+ Cadastrar Alerta de Prazo</span>
          </button>
        </div>
      </div>

      {/* Critical Spotlight Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-error-container via-surface-container-lowest to-surface-container-low border border-error/20 shadow-xs p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-error text-on-error flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">fmd_bad</span>
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-error text-on-error text-[11px] font-bold uppercase tracking-wider">
                Urgência Crítica • 4 Dias Restantes
              </span>
              <span className="text-xs text-on-error-container font-mono font-semibold">
                Proc: 10830.720194/2024-11
              </span>
            </div>
            <h3 className="text-base font-bold text-on-surface">
              Despacho Decisório - Termo de Intimação Fiscal nº 49102/2024
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Manifestação de Inconformidade referente à glosa de crédito de PIS/COFINS expira fatalmente em{' '}
              <strong className="text-error">28/10/2024</strong>. Empresa:{' '}
              <strong className="text-on-surface">Indústria Metalúrgica Ramos Ltda</strong> (14.892.411/0001-92). Valor em litígio:{' '}
              <strong className="text-on-surface font-mono tabular-nums">R$ 142.500,00</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              downloadTextFile(
                'despacho_decisorio_49102_2024.txt',
                'DESPACHO DECISÓRIO Nº 49102/2024\nPROCESSO: 10830.720194/2024-11\nEMPRESA: Indústria Metalúrgica Ramos Ltda\nVALOR EM LITÍGIO: R$ 142.500,00'
              );
              showToast('Inteiro Teor (PDF/TXT) baixado');
            }}
            className="h-9 px-3.5 rounded-xl bg-white border border-outline-variant/50 text-on-surface hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[17px] text-tertiary">picture_as_pdf</span>
            <span>Visualizar Inteiro Teor (PDF)</span>
          </button>
          <button
            type="button"
            onClick={() => openManifestacao('10830.720194/2024-11')}
            className="h-9 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">person_check</span>
            <span>Atribuir ao Advogado Tributarista</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-error flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-error" />
              Prazos Críticos (&lt; 5 dias)
            </span>
            <span className="material-symbols-outlined text-error text-[20px]">timer</span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-3xl font-bold text-on-surface tabular-nums">03</span>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
              Ação Imediata
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Intimações em contagem regressiva fatal (defesa de glosa PER/DCOMP).
          </p>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-error h-full rounded-full w-3/4" />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary-container" />
              Pendentes de Ciência
            </span>
            <span className="material-symbols-outlined text-tertiary-container text-[20px]">
              mark_email_unread
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-3xl font-bold text-on-surface tabular-nums">07</span>
            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
              Tácito &lt; 15 dias
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Aguardando abertura manual ou decurso de prazo legal de 15 dias corridos.
          </p>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-tertiary-container h-full rounded-full w-[45%]" />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Comunicações no Mês
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-3xl font-bold text-on-surface tabular-nums">42</span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
              +18% vs Set
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Homologações, notas e intimações auditadas e arquivadas com recibo e-CAC.
          </p>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full rounded-full w-[92%]" />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Robô de Varredura e-CAC
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">smart_toy</span>
            </div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-3xl font-bold text-on-surface tabular-nums">100%</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                ONLINE
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Ciclos a cada 2h via Certificado A1. Próxima varredura em 1h 48m.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 text-[11px] text-on-surface-variant">
            <span className="text-emerald-700 font-semibold">SSL OK</span>
            <span>•</span>
            <span>Token PGFN Válido</span>
          </div>
        </div>
      </div>

      {/* Temporal Distribution & Legal Rule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                Distribuição Temporal dos Prazos Ativos
              </h3>
              <p className="text-xs text-on-surface-variant">
                Janela de risco processual para defesas, impugnações e recursos nas DRJs / CARF.
              </p>
            </div>
            <span className="text-xs font-bold text-primary bg-surface-container-low px-3 py-1 rounded-full">
              Total: 18 Obrigações
            </span>
          </div>

          <div className="w-full py-2">
            <svg
              aria-label="Linha do tempo de vencimentos de intimações"
              className="w-full h-24 overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 600 70"
            >
              <line
                className="text-surface-container-highest"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="4"
                x1="10"
                x2="590"
                y1="45"
                y2="45"
              />
              <rect className="fill-error/20" height="14" rx="7" width="130" x="10" y="38" />
              <circle
                className="fill-error stroke-white"
                cx="60"
                cy="45"
                r="9"
                strokeWidth="3"
              />
              <text className="fill-error font-mono font-bold text-[12px]" textAnchor="middle" x="60" y="24">
                D-4 (142,5k)
              </text>
              <circle className="fill-error stroke-white" cx="110" cy="45" r="7" strokeWidth="2" />
              <text className="fill-error font-mono font-semibold text-[10px]" textAnchor="middle" x="110" y="24">
                D-5
              </text>
              <circle
                className="fill-tertiary-container stroke-white"
                cx="210"
                cy="45"
                r="8"
                strokeWidth="2"
              />
              <text
                className="fill-tertiary-container font-mono font-semibold text-[11px]"
                textAnchor="middle"
                x="210"
                y="24"
              >
                D-8 (Multa)
              </text>
              <circle className="fill-primary stroke-white" cx="310" cy="45" r="8" strokeWidth="2" />
              <text className="fill-primary font-mono font-semibold text-[11px]" textAnchor="middle" x="310" y="24">
                D-12 (DCTF)
              </text>
              <circle className="fill-secondary stroke-white" cx="430" cy="45" r="6" strokeWidth="2" />
              <text className="fill-secondary font-mono text-[10px]" textAnchor="middle" x="430" y="24">
                D-15
              </text>
              <circle className="fill-secondary stroke-white" cx="540" cy="45" r="6" strokeWidth="2" />
              <text className="fill-secondary font-mono text-[10px]" textAnchor="middle" x="540" y="24">
                D-22
              </text>
              <text className="fill-outline text-[10px] uppercase font-bold" x="10" y="65">
                Hoje
              </text>
              <text className="fill-error text-[10px] font-bold" x="140" y="65">
                Janela Fatal (5d)
              </text>
              <text className="fill-outline text-[10px]" x="360" y="65">
                15 Dias (Ciência Tácita)
              </text>
              <text className="fill-outline text-[10px]" x="515" y="65">
                30 Dias (Defesa)
              </text>
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/30">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-error" /> 3 Fatais (R$ 389.200 em risco)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-tertiary-container" /> 4 Em elaboração recursal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-primary" /> 11 Aguardando manifestação fiscal
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              Regulamentação Legal
            </div>
            <h3 className="text-sm font-bold text-on-surface mb-1">Regra da Ciência Tácita RFB</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Conforme a <strong className="text-on-surface">Lei Federal nº 11.196/2005 (Art. 23)</strong> e Portaria RFB nº 2.022, a contagem de <strong>15 dias corridos</strong> para ciência tácita inicia no primeiro dia útil subsequente à disponibilização no e-CAC.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-outline-variant/30">
            <div className="flex items-center justify-between text-xs font-semibold text-on-surface mb-1">
              <span>Início do Prazo Recursal:</span>
              <span className="text-tertiary">D+1 da Ciência Efetiva</span>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              O sistema congela o contador assim que o usuário realiza a leitura assinada ou no 15º dia às 23h59.
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-outline-variant/40 gap-2">
          <div className="flex flex-wrap items-center gap-1 -mb-px">
            {[
              { id: 'all', label: 'Todas as Notificações', count: intimacoes.length },
              {
                id: 'fatal',
                label: 'Prazos Fatais & Intimações',
                count: intimacoes.filter((i) => i.category === 'fatal').length,
                danger: true,
              },
              {
                id: 'homologacao',
                label: 'Termos de Homologação',
                count: intimacoes.filter((i) => i.category === 'homologacao').length,
              },
              {
                id: 'geral',
                label: 'Comunicações Gerais',
                count: intimacoes.filter((i) => i.category === 'geral').length,
              },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3.5 py-2.5 border-b-2 text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-primary text-primary'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                      tab.danger
                        ? 'bg-error-container text-on-error-container'
                        : active
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleExportDossier}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors mb-1 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Exportar Dossiê (.CSV)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-6 relative">
            <span className="material-symbols-outlined text-outline text-[18px] absolute left-3 top-2.5">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por Razão Social, CNPJ, nº de intimação ou processo..."
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-surface border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filtrar por Status da Ciência"
              className="w-full h-9 px-3 rounded-xl bg-surface border border-outline-variant/60 text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="">Status da Ciência: Todos</option>
              <option value="critico">Pendente de Leitura (Urgente)</option>
              <option value="ciencia">Ciência Tomada</option>
              <option value="aberto">Prazo Recursal Aberto</option>
              <option value="respondido">Respondido / Homologado</option>
            </select>
          </div>

          <div className="lg:col-span-3 flex justify-end">
            <button
              type="button"
              onClick={handleBatchAck}
              className="w-full h-9 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">checklist_rtl</span>
              <span>Dar Ciência em Lote ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    aria-label="Selecionar todas"
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Urgência / Prazo</th>
                <th className="py-3 px-4">Empresa / CNPJ</th>
                <th className="py-3 px-4">Tipo de Ato / Mensagem RFB</th>
                <th className="py-3 px-4">Nº Processo</th>
                <th className="py-3 px-3">Recebimento</th>
                <th className="py-3 px-3">Ciência Tácita / Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-xs text-on-surface">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                      aria-label={`Selecionar ${row.company}`}
                      className="w-4 h-4 rounded accent-primary cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        row.urgencyTone === 'critical'
                          ? 'bg-error-container text-on-error-container'
                          : row.urgencyTone === 'done'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.urgencyTone === 'warning'
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : 'bg-secondary-fixed text-on-secondary-fixed'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.urgencyTone === 'critical'
                            ? 'bg-error'
                            : row.urgencyTone === 'done'
                            ? 'bg-emerald-600'
                            : row.urgencyTone === 'warning'
                            ? 'bg-tertiary'
                            : 'bg-secondary'
                        }`}
                      />
                      {row.urgencyLabel}
                    </span>
                    <div className="text-[11px] font-mono text-on-surface-variant mt-1">
                      {row.expiresNote}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 min-w-[200px]">
                    <div className="font-bold text-on-surface">{row.company}</div>
                    <div className="font-mono text-[11px] text-on-surface-variant">{row.cnpj}</div>
                    <div
                      className={`text-[11px] font-medium mt-0.5 ${
                        row.contextTone === 'error'
                          ? 'text-tertiary'
                          : row.contextTone === 'emerald'
                          ? 'text-emerald-700'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      {row.contextNote}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 min-w-[210px]">
                    <div className="font-semibold text-on-surface">{row.actType}</div>
                    <div className="text-[11px] text-on-surface-variant">{row.actSubtitle}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-mono font-semibold text-on-surface">{row.processNumber}</div>
                    <div className="text-[11px] font-mono text-on-surface-variant">
                      {row.notificationCode}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="font-medium">{row.receivedDate}</div>
                    <div className="text-[11px] font-mono text-outline">{row.receivedTime}</div>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold inline-block ${
                        row.scienceTone === 'error'
                          ? 'bg-error-container text-on-error-container'
                          : row.scienceTone === 'emerald'
                          ? 'bg-emerald-50 text-emerald-700'
                          : row.scienceTone === 'warning'
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {row.scienceStatus}
                    </span>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">
                      {row.scienceDetail}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {row.canManifest ? (
                        <button
                          type="button"
                          onClick={() => openManifestacao(row.processNumber)}
                          className="px-2.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-[11px] font-semibold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                        >
                          <span className="material-symbols-outlined text-[15px]">folder_open</span>
                          <span>Abrir Processo</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            downloadTextFile(
                              `despacho_${row.processNumber.replace(/\D/g, '')}.txt`,
                              `Processo: ${row.processNumber}\nEmpresa: ${row.company}\nAto: ${row.actType}\nDetalhes: ${row.actSubtitle}`
                            );
                            showToast('Despacho e-CAC baixado');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-semibold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                        >
                          <span className="material-symbols-outlined text-[15px]">file_download</span>
                          <span>Baixar Despacho</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setPreviewItem(row.id)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                        title="Visualizar Notificação"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-surface-container-low flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant">
          <span>
            Exibindo <strong>{filteredRows.length}</strong> de <strong>{intimacoes.length}</strong> notificações
          </span>
          <span className="text-primary font-semibold">{selectedIds.length} selecionada(s)</span>
        </div>
      </div>

      {/* Bottom: Calendar & RFB Scan Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                Calendário de Vencimentos &amp; Defesas Fatais (Outubro/Novembro 2024)
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Prazos processuais administrativos não suspendem aos fins de semana se o término cair em dia útil bancário.
              </p>
            </div>
            <span className="text-xs font-bold text-on-surface bg-surface-container-low px-2.5 py-1 rounded-lg">
              Out / Nov 2024
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => (
              <span key={d} className="text-[10px] font-bold uppercase text-outline py-1">
                {d}
              </span>
            ))}
            {[
              { day: '21', muted: true },
              { day: '22', muted: true },
              { day: '23', muted: true },
              { day: '24' },
              { day: '25' },
              { day: '26', muted: true },
              { day: '27', muted: true },
              { day: '28', tag: 'Fatal', tone: 'error', tip: 'Defesa Ramos Indústria (R$ 142k)' },
              { day: '29' },
              { day: '30' },
              { day: '31' },
              { day: '01', tag: 'Recurso', tone: 'warning', tip: 'Recurso Farmácias São João' },
              { day: '02', muted: true },
              { day: '03', muted: true },
              { day: '04' },
              { day: '05', tag: 'DCTF', tone: 'primary', tip: 'DCTF Agro Vale do Sol' },
              { day: '06' },
              { day: '07' },
              { day: '08' },
              { day: '09', muted: true },
              { day: '10', muted: true },
            ].map((cell, idx) => (
              <div
                key={idx}
                title={cell.tip}
                className={`p-2 rounded-lg text-xs font-medium ${
                  cell.tone === 'error'
                    ? 'bg-error text-on-error font-bold shadow-xs'
                    : cell.tone === 'warning'
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed font-bold'
                    : cell.tone === 'primary'
                    ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                    : cell.muted
                    ? 'text-outline/50'
                    : 'bg-surface-container-low text-on-surface'
                }`}
              >
                <span>{cell.day}</span>
                {cell.tag && (
                  <span className="block text-[9px] uppercase leading-tight">{cell.tag}</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/30">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-error" /> Prazo Peremptório / Glosa
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-tertiary-fixed" /> Defesa de Auto de Infração
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary-fixed" /> Cumprimento de Intimação
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">terminal</span>
                Log de Auditoria da Varredura RFB
              </h3>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                200 OK
              </span>
            </div>

            <div className="font-mono text-[11px] bg-surface-container-low p-3.5 rounded-xl space-y-1.5 text-on-surface-variant">
              <div className="text-on-surface">
                <span className="text-outline">[14:38:02]</span> Handshake mTLS via ICP-Brasil A1 (Vértice Certs).
              </div>
              <div className="text-emerald-700">
                <span className="text-outline">[14:38:05]</span> Autenticado no e-CAC Portal de Serviços RFB.
              </div>
              <div>
                <span className="text-outline">[14:38:12]</span> Varridos 18 CNPJs ativos vinculados por procuração RFB.
              </div>
              <div className="text-tertiary">
                <span className="text-outline">[14:38:29]</span> Nova comunicação: Indústria Metalúrgica Ramos.
              </div>
              <div>
                <span className="text-outline">[14:38:31]</span> Hash SHA-256 armazenado em cofre pericial.
              </div>
              <div className="text-primary font-semibold">
                <span className="text-outline">[14:38:34]</span> Alerta urgente enviado via WhatsApp &amp; E-mail.
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between gap-2 text-xs">
            <span className="text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[17px] text-outline">verified_user</span>
              Certificado A1 válido até <strong>11/2025</strong>
            </span>
            <button
              type="button"
              onClick={() => openSettingsTab('webhooks')}
              className="text-primary font-semibold hover:underline"
            >
              Configurar Webhooks
            </button>
          </div>
        </div>
      </div>

      {/* Preview Notification Modal */}
      {inspectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase text-primary">
                  Teor da Notificação e-CAC
                </span>
                <h3 className="text-base font-bold text-on-surface">
                  {inspectedNotification.actType}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="rounded-xl bg-surface-container-low p-4 text-xs space-y-1.5">
              <p>
                <strong>Contribuinte:</strong> {inspectedNotification.company} ({inspectedNotification.cnpj})
              </p>
              <p>
                <strong>Processo Administrativo:</strong>{' '}
                <span className="font-mono">{inspectedNotification.processNumber}</span>
              </p>
              <p>
                <strong>Descrição:</strong> {inspectedNotification.actSubtitle}
              </p>
              <p>
                <strong>Situação:</strong> {inspectedNotification.contextNote} • {inspectedNotification.expiresNote}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              {!inspectedNotification.acknowledged && (
                <button
                  type="button"
                  onClick={() => {
                    acknowledgeIntimacoes([inspectedNotification.id]);
                    setPreviewItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface text-xs font-semibold"
                >
                  Registrar Ciência Digital
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const p = inspectedNotification.processNumber;
                  setPreviewItem(null);
                  openManifestacao(p);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold"
              >
                Elaborar Manifestação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Alert Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateAlert}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">
                Cadastrar Alerta de Prazo e-CAC
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Empresa</label>
                <input
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-outline-variant/70 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">Nº do Processo</label>
                <input
                  required
                  value={newProcess}
                  onChange={(e) => setNewProcess(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-outline-variant/70 font-mono focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">Objeto / Ato Fiscal</label>
                <input
                  required
                  value={newAct}
                  onChange={(e) => setNewAct(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-outline-variant/70 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">Data Limite</label>
                <input
                  required
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-outline-variant/70 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 rounded-xl bg-surface-container-low text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold"
              >
                Salvar Alerta
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
