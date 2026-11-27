import React, { useMemo, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { downloadCsv, downloadTextFile, formatBRL } from '../utils/export';

export const RecursosCarf: React.FC = () => {
  const { carfProcesses, addCarfProcess, openManifestacao, setActiveRoute, showToast } = useCrm();

  const [activeTab, setActiveTab] = useState<'all' | 'pautados' | 'distribuicao' | 'acordao' | 'csrf'>('all');
  const [sortBy, setSortBy] = useState<'valor' | 'processo'>('valor');
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [thesisFilter, setThesisFilter] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedEmenta, setSelectedEmenta] = useState<{ title: string; badge: string; text: string } | null>(null);

  const [newCompany, setNewCompany] = useState('Indústria Metalúrgica Ramos Ltda');
  const [newProc, setNewProc] = useState('10830.721009/2024-44');
  const [newThesis, setNewThesis] = useState('Créditos PIS/COFINS Insumos Essenciais');
  const [newAmount, setNewAmount] = useState('920000');

  const filteredProcesses = useMemo(() => {
    const list = carfProcesses.filter((item) => {
      if (activeTab !== 'all' && item.category !== activeTab) return false;
      if (sectionFilter && item.sectionFilter !== sectionFilter) return false;
      if (thesisFilter && item.thesisFilter !== thesisFilter) return false;
      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      return (
        item.company.toLowerCase().includes(q) ||
        item.processNumber.toLowerCase().includes(q) ||
        item.thesis.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) =>
      sortBy === 'valor'
        ? b.litigationAmount - a.litigationAmount
        : a.processNumber.localeCompare(b.processNumber)
    );
  }, [carfProcesses, activeTab, sectionFilter, thesisFilter, searchTerm, sortBy]);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast('Pautas CARF atualizadas', 'Consultadas as sessões da 1ª, 2ª e 3ª Seções de Julgamento e CSRF.');
    }, 900);
  };

  const handleExport = () => {
    downloadCsv(
      'contencioso_carf_drj.csv',
      ['Processo', 'Contribuinte', 'Colegiado', 'Tese', 'Valor em Litígio', 'Situação'],
      filteredProcesses.map((p) => [
        p.processNumber,
        p.company,
        `${p.turma} (${p.court})`,
        p.thesis,
        formatBRL(p.litigationAmount),
        p.statusLabel,
      ])
    );
    showToast('Acórdãos e processos exportados (.CSV)');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addCarfProcess({
      processNumber: newProc,
      badge: 'RECURSO VOLUNTÁRIO',
      badgeTone: 'primary',
      company: newCompany,
      cnpj: '14.892.411/0001-92',
      turma: '2ª Turma / 3ª Seção',
      court: 'CARF Brasília (DF)',
      relator: 'Aguardando Sorteio',
      thesis: newThesis,
      taxPeriod: 'PIS / COFINS 2020-2023',
      litigationAmount: Number(newAmount) || 920000,
      successNote: 'Precedente STJ Favorável',
      statusLabel: 'Protocolado no e-CAC',
      statusSub: 'Aguardando Pauta',
      statusTone: 'primary',
      category: 'distribuicao',
      sectionFilter: '3sec',
      thesisFilter: 'cred_ins',
    });
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
            <span>Financeiro &amp; Fiscal</span>
            <span className="material-symbols-outlined text-[15px] text-outline">chevron_right</span>
            <span>Contencioso Administrativo</span>
            <span className="material-symbols-outlined text-[15px] text-outline">chevron_right</span>
            <span className="text-primary font-semibold">Recursos &amp; CARF</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl lg:text-2xl font-bold text-on-surface tracking-tight">
              Contencioso Administrativo &amp; Recursos CARF / DRJ
            </h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-[11px] font-semibold text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="uppercase tracking-wider">e-CAC / CARF Sincronizado</span>
              <span className="text-outline">• Hoje, 09:42</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="h-9 px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[17px] text-on-surface-variant">download</span>
            <span>Exportar Acórdãos</span>
          </button>
          <button
            type="button"
            onClick={handleSync}
            className="h-9 px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            <span className={`material-symbols-outlined text-[17px] text-primary ${syncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{syncing ? 'Sincronizando...' : 'Sincronizar Pautas CARF'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="h-9 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>+ Novo Recurso Voluntário</span>
          </button>
        </div>
      </div>

      {/* Critical Hearing Alert Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-on-background via-inverse-surface to-on-background text-white p-5 lg:p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-white/10 min-w-[120px] text-center">
              <span className="text-[11px] text-error-container uppercase font-bold tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-error" />
                Pauta Próxima
              </span>
              <span className="text-xl font-bold mt-0.5 tabular-nums">18h 24m</span>
              <span className="text-[11px] text-white/75">Amanhã, 14:00</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-white text-[11px] font-bold">
                  1ª Turma Ordinária / 1ª Seção CARF
                </span>
                <span className="text-xs text-white/80 font-mono">
                  Processo nº 10830.720194/2024-11
                </span>
              </div>
              <h3 className="text-base font-bold tracking-tight">
                Indústria Metalúrgica Ramos Ltda • Glosa de IRPJ/CSLL - Amortização de Ágio
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary-fixed">person</span>
                  Relator: Conselheiro Marcus Aurelio F.
                </span>
                <span className="flex items-center gap-1 text-secondary-fixed font-medium">
                  <span className="material-symbols-outlined text-[15px]">record_voice_over</span>
                  Sustentação Oral Deferida (Dr. Victor Albuquerque)
                </span>
                <span className="flex items-center gap-1 text-white font-semibold tabular-nums">
                  <span className="material-symbols-outlined text-[15px] text-primary-fixed-dim">paid</span>
                  Valor: R$ 3.840.000,00
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                downloadTextFile(
                  'memorial_tecnico_10830_720194.txt',
                  'MEMORIAL TÉCNICO DE JULGAMENTO - CARF 1ª SEÇÃO\nPROCESSO: 10830.720194/2024-11\nCONTRIBUINTE: Indústria Metalúrgica Ramos Ltda\nTESE: Amortização de Ágio Empresa Veículo (Súmula CARF 189)\nVALOR EM LITÍGIO: R$ 3.840.000,00'
                );
                showToast('Memorial Técnico baixado');
              }}
              className="h-9 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-[17px]">description</span>
              <span>Ver Memorial Técnico</span>
            </button>
            <button
              type="button"
              onClick={() =>
                showToast(
                  'Link de transmissão CARF copiado',
                  'Sessão da 1ª Turma Ordinária / 1ª Seção programada para amanhã às 14:00.',
                  'info'
                )
              }
              className="h-9 px-3.5 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-[17px]">live_tv</span>
              <span>Transmissão CARF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Volume Total Contencioso
              </span>
              <div className="text-2xl font-bold text-on-surface mt-1 tabular-nums">R$ 8,94 M</div>
              <span className="text-xs text-on-surface-variant">12 processos ativos em trâmite</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[21px]">account_balance</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold text-on-surface">
              <span className="w-2 h-2 rounded-full bg-primary-container" /> CARF: 60.6%
            </span>
            <span className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-secondary" /> DRJ: 39.4%
            </span>
            <div className="h-2 w-16 rounded-full bg-surface-container overflow-hidden flex">
              <div className="h-full bg-primary-container w-[61%]" />
              <div className="h-full bg-secondary w-[39%]" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Recursos no CARF / CSRF
              </span>
              <div className="text-2xl font-bold text-on-surface mt-1 tabular-nums">R$ 5,42 M</div>
              <span className="text-xs text-on-surface-variant">5 Recursos (2ª Instância e CSRF)</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[21px]">gavel</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px]">
            <span className="text-primary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">schedule</span> 2 em Pauta Iminente
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
              Ticket: R$ 1,08M
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Impugnações na DRJ
              </span>
              <div className="text-2xl font-bold text-on-surface mt-1 tabular-nums">R$ 3,52 M</div>
              <span className="text-xs text-on-surface-variant">7 impugnações de autos e despachos</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[21px]">rule_folder</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px]">
            <span className="text-on-surface-variant">Campinas, SP, BH e RJ</span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
              3 em Perícia
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Taxa de Êxito / Provimento
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-primary tabular-nums">74,2%</span>
                <span className="text-[11px] text-primary font-bold flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +3,8% a.a.
                </span>
              </div>
              <span className="text-xs text-on-surface-variant">Baseado em Súmulas e Temas</span>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="text-surface-container"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <circle
                  className="text-primary-container"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="14"
                  stroke="currentColor"
                  strokeDasharray="88"
                  strokeDashoffset="22.7"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-on-surface tabular-nums">74%</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>8 acórdãos favoráveis (18m)</span>
            <button
              type="button"
              onClick={() => setActiveRoute('laudo-tecnico-memoria-de-calculo')}
              className="text-primary font-semibold hover:underline"
            >
              Ver Memória
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Process List & Filters (8 cols) */}
        <div className="xl:col-span-8 space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'all', label: `Todos os Processos (${carfProcesses.length})` },
                { id: 'pautados', label: 'Pautados CARF' },
                { id: 'distribuicao', label: 'Aguardando Relatoria' },
                { id: 'acordao', label: 'Acórdãos' },
                { id: 'csrf', label: 'CSRF Especial' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as typeof activeTab)}
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shrink-0 transition-colors ${
                    activeTab === t.id
                      ? 'bg-primary text-on-primary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container font-medium'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-outline">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'valor' | 'processo')}
                className="h-8 px-2.5 rounded-lg bg-surface border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="valor">Maior Valor (R$)</option>
                <option value="processo">Nº do Processo</option>
              </select>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-3.5 shadow-xs flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 min-w-[200px]">
              <span className="material-symbols-outlined text-outline text-[18px] absolute left-3 top-2">
                filter_alt
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por Contribuinte, nº do processo ou tese..."
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-surface border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="">Todas as Instâncias / Turmas</option>
              <option value="1sec">1ª Seção CARF (IRPJ/CSLL)</option>
              <option value="3sec">3ª Seção CARF (PIS/COFINS/IPI)</option>
              <option value="csrf">CSRF (Câmara Superior)</option>
              <option value="drj">DRJ (1ª Instância)</option>
            </select>

            <select
              value={thesisFilter}
              onChange={(e) => setThesisFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="">Tese Principal</option>
              <option value="pis">Exclusão ICMS Base PIS/COFINS</option>
              <option value="agio">Amortização de Ágio Interno</option>
              <option value="jcp">JCP Retroativo Extemporâneo</option>
              <option value="cred_ins">Créditos PIS/COFINS Insumos</option>
              <option value="subsidio">Subvenções ICMS (LC 160)</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSectionFilter('');
                setThesisFilter('');
                setActiveTab('all');
              }}
              className="h-9 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Limpar</span>
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Processo Adm. / Contribuinte</th>
                    <th className="py-3 px-4">Colegiado / Instância</th>
                    <th className="py-3 px-4">Tese Objeto da Glosa</th>
                    <th className="py-3 px-4 text-right">Valor em Litígio</th>
                    <th className="py-3 px-4">Situação / Pauta</th>
                    <th className="py-3 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container text-xs text-on-surface">
                  {filteredProcesses.map((proc) => (
                    <tr key={proc.id} className="hover:bg-surface-container-low/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-primary font-mono">{proc.processNumber}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              proc.badgeTone === 'error'
                                ? 'bg-error-container text-on-error-container'
                                : proc.badgeTone === 'primary'
                                ? 'bg-primary-fixed text-on-primary-fixed'
                                : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            {proc.badge}
                          </span>
                        </div>
                        <div className="font-semibold text-on-surface mt-0.5">{proc.company}</div>
                        <div className="text-[11px] text-outline font-mono">CNPJ: {proc.cnpj}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold">{proc.turma}</div>
                        <div className="text-on-surface-variant text-[11px]">{proc.court}</div>
                        <div className="text-outline text-[11px]">{proc.relator}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="font-semibold text-on-surface truncate" title={proc.thesis}>
                          {proc.thesis}
                        </div>
                        <div className="text-[11px] text-outline truncate">{proc.taxPeriod}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-bold text-on-surface tabular-nums">
                          {formatBRL(proc.litigationAmount)}
                        </div>
                        <div className="text-[11px] font-semibold text-primary">{proc.successNote}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              proc.statusTone === 'error'
                                ? 'bg-error'
                                : proc.statusTone === 'primary'
                                ? 'bg-primary'
                                : 'bg-secondary'
                            }`}
                          />
                          <span
                            className={`font-semibold ${
                              proc.statusTone === 'error'
                                ? 'text-error'
                                : proc.statusTone === 'primary'
                                ? 'text-primary'
                                : 'text-on-surface'
                            }`}
                          >
                            {proc.statusLabel}
                          </span>
                        </div>
                        <div className="text-[11px] text-outline mt-0.5">{proc.statusSub}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => openManifestacao(proc.processNumber)}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                            title="Ver Dossiê e Peças"
                          >
                            <span className="material-symbols-outlined text-[18px]">folder_open</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              downloadTextFile(
                                `memorial_${proc.processNumber.replace(/\D/g, '')}.txt`,
                                `MEMORIAL DE JULGAMENTO\nPROCESSO: ${proc.processNumber}\nCONTRIBUINTE: ${proc.company}\nTESE: ${proc.thesis}`
                              );
                              showToast('Memorial de julgamento baixado');
                            }}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                            title="Memorial de Julgamento"
                          >
                            <span className="material-symbols-outlined text-[18px]">article</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 bg-surface-container-low/60 flex items-center justify-between text-xs text-on-surface-variant">
              <span>
                Exibindo <strong>{filteredProcesses.length}</strong> de <strong>{carfProcesses.length}</strong> processos contenciosos
              </span>
            </div>
          </div>
        </div>

        {/* Right: Oral Arguments & Jurisprudence Radar (4 cols) */}
        <div className="xl:col-span-4 space-y-5">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">podium</span>
                Sustentações Orais Requeridas
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                3 Registradas
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-surface-container-low space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface">Metalúrgica Ramos</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary text-[11px] font-bold">
                    Deferida
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>1ª Seção • Presencial</span>
                  <span className="font-semibold text-error">Amanhã, 14:00</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-outline pt-1">
                  <span>Dr. Victor Albuquerque (OAB/DF 41.209)</span>
                  <button
                    type="button"
                    onClick={() => showToast('Sala de áudio/vídeo CARF testada (Latência 18ms)')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Testar Link
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface">Distribuidora Vanguarda</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary text-[11px] font-bold">
                    Em Análise
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>CSRF • Telepresencial (Teams)</span>
                  <span className="font-semibold text-on-surface">Pauta 28/Nov</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-outline pt-1">
                  <span>Dra. Camila Rocha (OAB/SP 289.112)</span>
                  <span>Petição #44192</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface">Agroindústria Cerrado Sul</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                    Minuta Pronta
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>2ª Turma Ordinária / 2ª Seção</span>
                  <span>Previsão Dez/2024</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast('Pedido de sustentação oral gerado', 'Minuta protocolada junto à Secretaria da Câmara.')}
              className="w-full py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Solicitar Nova Sustentação Oral no CARF</span>
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">balance</span>
                Radar Jurisprudencial CARF
              </h3>
            </div>

            {[
              {
                badge: 'SÚMULA CARF Nº 189',
                tag: '100% Aderente',
                title: 'Amortização de Ágio - Relação de Dependência',
                desc: 'É legítima a amortização fiscal de ágio decorrente de operação de incorporação quando comprovada a real existência econômica da adquirente.',
                impact: 'Impacta: Processo 10830.720194',
              },
              {
                badge: 'ACÓRDÃO PARADIGMA CSRF',
                tag: 'CSRF 9303-014.221',
                title: 'PIS/COFINS - Despesas Portuárias como Insumo',
                desc: 'Reconhecimento do direito ao crédito das despesas obrigatórias com capatazia e armazenagem alfandegária como insumos essenciais.',
                impact: 'Impacta: 2 processos na carteira',
              },
              {
                badge: 'TEMA REPETITIVO STJ 1.182',
                tag: 'Votos Empatados',
                title: 'Subvenções de ICMS para Custeio',
                desc: 'Aplicação do critério de desempate pró-contribuinte e cancelamento de multas de ofício nos termos do Art. 24-A.',
                impact: 'Impacta: 3 processos DRJ/CARF',
              },
            ].map((j, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedEmenta({ title: j.title, badge: j.badge, text: j.desc })}
                className="w-full text-left p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                    {j.badge}
                  </span>
                  <span className="text-[11px] font-bold text-primary">{j.tag}</span>
                </div>
                <div className="text-xs font-bold text-on-surface">{j.title}</div>
                <p className="text-[11px] text-on-surface-variant line-clamp-2">{j.desc}</p>
                <div className="flex items-center justify-between text-[11px] text-outline pt-1">
                  <span>{j.impact}</span>
                  <span className="text-primary font-semibold">Ementa →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ementa Modal */}
      {selectedEmenta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                {selectedEmenta.badge}
              </span>
              <button
                type="button"
                onClick={() => setSelectedEmenta(null)}
                className="p-1.5 rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <h3 className="text-base font-bold text-on-surface">{selectedEmenta.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{selectedEmenta.text}</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedEmenta(null);
                  openManifestacao();
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold"
              >
                Citar na Manifestação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New CARF Recurso Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">Novo Recurso Voluntário CARF</h3>
              <button type="button" onClick={() => setShowNewModal(false)} className="p-1.5 rounded-lg hover:bg-surface-container">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Contribuinte</label>
                <input required value={newCompany} onChange={(e) => setNewCompany(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-outline-variant/70" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Número do Processo</label>
                <input required value={newProc} onChange={(e) => setNewProc(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-outline-variant/70 font-mono" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Tese Objeto</label>
                <input required value={newThesis} onChange={(e) => setNewThesis(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-outline-variant/70" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Valor em Litígio (R$)</label>
                <input required type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-outline-variant/70 font-mono" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowNewModal(false)} className="px-4 py-2 rounded-xl bg-surface-container-low text-xs font-semibold">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold">
                Protocolar Recurso
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
