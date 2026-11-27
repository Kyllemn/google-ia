import React, { useMemo, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { downloadCsv, downloadTextFile, formatBRL } from '../utils/export';
import { FaturamentoNfseSplit } from './FaturamentoNfseSplit';
import { SplitRepassesModal } from './SplitRepassesModal';

export const ContratosHonorariosExito: React.FC = () => {
  const {
    honorarioContracts,
    addHonorarioContract,
    showNfseSplit,
    openNfseSplit,
    setActiveRoute,
    showToast,
  } = useCrm();

  const [statusFilter, setStatusFilter] = useState('');
  const [thesisFilter, setThesisFilter] = useState('');
  const [showSimulator, setShowSimulator] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showNewContract, setShowNewContract] = useState(false);

  // Simulator state
  const [simCredit, setSimCredit] = useState(500000);
  const [simRate, setSimRate] = useState(20);

  // New Contract form
  const [newCode, setNewCode] = useState('CTR-2024-088');
  const [newCompany, setNewCompany] = useState('Grupo Horizonte Logística S.A.');
  const [newThesis, setNewThesis] = useState('Exclusão ICMS PIS/COFINS');
  const [newCredit, setNewCredit] = useState('680000');
  const [newRate, setNewRate] = useState('20');

  const filteredContracts = useMemo(() => {
    return honorarioContracts.filter((c) => {
      if (statusFilter && !c.billingStatus.toLowerCase().includes(statusFilter)) return false;
      if (thesisFilter && c.thesisCategory !== thesisFilter) return false;
      return true;
    });
  }, [honorarioContracts, statusFilter, thesisFilter]);

  if (showNfseSplit) {
    return <FaturamentoNfseSplit />;
  }

  const simFee = (simCredit * simRate) / 100;
  const simVertice = simFee * 0.85;
  const simPerito = simFee * 0.15;

  const handleExport = () => {
    downloadCsv(
      'contratos_honorarios_exito.csv',
      ['Contrato', 'Cliente', 'Tese', 'Crédito Tributário', '% Êxito', 'Honorários', 'Status', 'Vencimento'],
      filteredContracts.map((c) => [
        c.contractCode,
        c.company,
        c.thesisTitle,
        formatBRL(c.taxCredit),
        `${c.successRate}%`,
        formatBRL(c.feeAmount),
        c.billingStatus,
        c.dueDate,
      ])
    );
    showToast('Relatório de contratos exportado (.CSV)');
  };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const credit = Number(newCredit) || 680000;
    const rate = Number(newRate) || 20;
    const fee = (credit * rate) / 100;
    addHonorarioContract({
      contractCode: newCode,
      company: newCompany,
      thesisTitle: newThesis,
      thesisSubtitle: 'Cláusula Quota Litis • Auditoria SPED',
      thesisCategory: 'tema69',
      taxCredit: credit,
      creditStatusLabel: 'Homologado RFB',
      successRate: rate,
      feeAmount: fee,
      feeInstallmentNote: `4x DCTFWeb (${formatBRL(fee / 4)})`,
      billingStatus: 'Apto Faturamento (Parc. 1/4)',
      dueDate: '20/11/2024',
      dueNote: 'Imediato',
    });
    setShowNewContract(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Top Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            <span>Financeiro &amp; Fiscal</span>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <span>Gestão Contratual</span>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <span className="text-primary">Contratos &amp; Honorários no Êxito</span>
            <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface normal-case font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Split Automático &amp; PER/DCOMP Sincronizados
            </span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[26px]">balance</span>
            Contratos de Honorários &amp; Cobrança no Êxito
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Gestão de percentuais contratuais pactuados, faturamento vinculado a despachos homologatórios de PER/DCOMP e emissão de notas fiscais com split de honorários.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowSimulator(true)}
            className="h-9 px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-on-surface hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[17px] text-primary">calculate</span>
            <span>Simulador de Honorários</span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="h-9 px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-on-surface hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>Exportar Relatório</span>
          </button>
          <button
            type="button"
            onClick={() => setShowNewContract(true)}
            className="h-9 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>+ Novo Contrato de Honorários</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Homologados RFB
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
          </div>
          <div className="mt-2">
            <span className="block text-xs font-semibold text-on-surface-variant">Honorários a Faturar</span>
            <span className="block text-2xl font-bold text-primary tabular-nums mt-0.5">
              R$ 248.016,00
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Disponíveis após RFB</span>
            <span className="font-bold text-primary">1 CTR apto</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Receita Realizada 2024
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
          </div>
          <div className="mt-2">
            <span className="block text-xs font-semibold text-on-surface-variant">Faturado / Recebido no Ano</span>
            <span className="block text-2xl font-bold text-on-surface tabular-nums mt-0.5">
              R$ 684.500,00
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Receita líquida consultoria</span>
            <span className="font-bold text-primary">+14.2% a.a.</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Em Análise Fiscal
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">hourglass_top</span>
          </div>
          <div className="mt-2">
            <span className="block text-xs font-semibold text-on-surface-variant">Honorários Projetados</span>
            <span className="block text-2xl font-bold text-on-surface tabular-nums mt-0.5">
              R$ 619.000,00
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Base: R$ 3,1M</span>
            <span className="font-semibold text-on-surface">5 processos</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Benchmark Comercial
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">percent</span>
          </div>
          <div className="mt-2">
            <span className="block text-xs font-semibold text-on-surface-variant">Percentual Médio de Êxito</span>
            <span className="block text-2xl font-bold text-on-surface tabular-nums mt-0.5">
              20,0%
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Faixa pactuada: 15% a 25%</span>
            <span className="font-semibold text-primary">Quota Litis</span>
          </div>
        </div>
      </div>

      {/* Quota Litis Rules + Split Automático Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: Quota Litis Clauses (7 cols) */}
        <div className="xl:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">assignment_turned_in</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">
                  Diretrizes &amp; Cláusulas de Êxito (Ad Exitum)
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Padronização do nexo causal e gatilhos de faturamento tributário
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-surface-container-low text-xs font-semibold text-on-surface">
              Vigência 2024
            </span>
          </div>

          <div className="p-4 rounded-xl bg-primary-fixed/30 border border-primary/15 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
              Cláusula Quota Litis Padrão:
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Cobrança estritamente no êxito (<em>ad exitum</em>) mediante publicação do despacho decisório de homologação/deferimento emitido pela Receita Federal ou compensação efetiva averbada na DCTFWeb contra débitos correntes da empresa contratante.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-primary">Gatilho A: DCTFWeb Mensal</span>
                <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-on-surface-variant">
                  Recorrente
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Pagamento fracionado e proporcional ao valor do crédito aproveitado a cada apuração mensal, mitigando impacto no fluxo de caixa do cliente.
              </p>
              <span className="text-[11px] font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">sync_alt</span>
                Conciliação via Darf e Extrato DCTFWeb
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-primary">Gatilho B: Homologação RFB</span>
                <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-on-surface-variant">
                  À Vista / 30d
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Faturamento integral emitido imediatamente após expedição formal do Despacho Decisório Homologatório ou decurso de prazo decadencial.
              </p>
              <span className="text-[11px] font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">verified_user</span>
                Garantia do Título Executivo Contratual
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/30 text-xs text-on-surface-variant">
            <span>Minutas auditadas em conformidade com o Provimento OAB nº 161/2014</span>
            <button
              type="button"
              onClick={() => {
                downloadTextFile(
                  'minuta_padrao_quota_litis_vertice.txt',
                  'CONTRATO DE PRESTAÇÃO DE SERVIÇOS TÉCNICOS TRIBUTÁRIOS (AD EXITUM)\nCLÁUSULA 4ª — HONORÁRIOS SOBRE ÊXITO: 20% sobre créditos homologados via PER/DCOMP Web ou compensados em DCTFWeb.\nRATEIO SPLIT: 85% Vértice Fiscal / 15% Perito Contábil.'
                );
                showToast('Minuta modelo baixada');
              }}
              className="text-primary font-semibold hover:underline"
            >
              Ver Minuta Modelo
            </button>
          </div>
        </div>

        {/* Right: Split Automático (5 cols) */}
        <div className="xl:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[19px]">call_split</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Split Automático de Honorários</h3>
                  <p className="text-xs text-on-surface-variant">
                    Repasse a pareceristas e peritos homologados
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-surface-container-low text-[11px] font-semibold text-on-surface-variant">
                Subconta Bancária
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-on-surface-variant">
                <span>Regra de Rateio Contratual</span>
                <span className="text-primary">100% dos Recebíveis</span>
              </div>
              <div className="h-2.5 rounded-full bg-surface-container overflow-hidden flex">
                <div className="h-full bg-primary w-[85%]" />
                <div className="h-full bg-secondary w-[15%]" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl">
                  <span className="block font-semibold text-primary">Vértice Fiscal</span>
                  <span className="block text-xl font-bold text-on-surface tabular-nums">85,0%</span>
                  <span className="block text-[11px] text-on-surface-variant">
                    Operação e laudos técnicos
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl">
                  <span className="block font-semibold text-secondary">Perito / Parecerista</span>
                  <span className="block text-xl font-bold text-on-surface tabular-nums">15,0%</span>
                  <span className="block text-[11px] text-on-surface-variant">
                    Assinatura ART / OAB Externa
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
                <span className="font-medium text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-primary">receipt</span>
                  Emissão Automática NFSe Municipal
                </span>
                <span className="font-bold text-primary">Ativo</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
                <span className="font-medium text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-primary">qr_code</span>
                  Boleto Registrado &amp; Pix Dinâmico
                </span>
                <span className="font-bold text-primary">Conta Custódia</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSplitModal(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">history</span>
            <span>Ver Extrato &amp; Histórico de Repasses de Split</span>
          </button>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-on-surface">Contratos de Honorários em Execução</h3>
            <p className="text-xs text-on-surface-variant">
              Relação analítica de teses, créditos apurados e situação das faturas vinculadas à compensação
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="">Todos os Status</option>
              <option value="apto">Apto Faturamento</option>
              <option value="quitado">Totalmente Quitado</option>
              <option value="aguardando">Aguardando Homologação</option>
              <option value="emitida">NF Emitida</option>
            </select>
            <select
              value={thesisFilter}
              onChange={(e) => setThesisFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="">Todas as Teses Tributárias</option>
              <option value="tema69">Tema 69 STF (ICMS PIS/COFINS)</option>
              <option value="funrural">Funrural / INSS Folha</option>
              <option value="monofasico">PIS/COFINS Monofásico</option>
              <option value="frete">PIS/COFINS Frete e Insumos</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3 px-4">Contrato / Cliente</th>
                <th className="py-3 px-4">Objeto da Recuperação / Tese</th>
                <th className="py-3 px-4 text-right">Crédito Tributário</th>
                <th className="py-3 px-4 text-center">% Êxito</th>
                <th className="py-3 px-4 text-right">Honorários Calculados</th>
                <th className="py-3 px-4">Status Faturamento</th>
                <th className="py-3 px-4">Vencimento / Próx.</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-xs text-on-surface">
              {filteredContracts.map((ctr) => (
                <tr key={ctr.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-on-surface">{ctr.company}</div>
                    <div className="text-[11px] text-primary font-mono font-semibold mt-0.5">
                      {ctr.contractCode}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold">{ctr.thesisTitle}</div>
                    <div className="text-[11px] text-on-surface-variant">{ctr.thesisSubtitle}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="font-bold tabular-nums">{formatBRL(ctr.taxCredit)}</div>
                    <div className="text-[11px] text-primary font-medium">{ctr.creditStatusLabel}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold tabular-nums">
                      {ctr.successRate.toFixed(1).replace('.', ',')}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="font-bold text-primary tabular-nums">{formatBRL(ctr.feeAmount)}</div>
                    <div className="text-[11px] text-on-surface-variant">{ctr.feeInstallmentNote}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        ctr.billingStatus.includes('Apto')
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : ctr.billingStatus.includes('Quitado')
                          ? 'bg-emerald-100 text-emerald-800'
                          : ctr.billingStatus.includes('NF Emitida')
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {ctr.billingStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold">{ctr.dueDate}</div>
                    <div className="text-[11px] text-primary">{ctr.dueNote}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {ctr.billingStatus.includes('Apto') ? (
                      <button
                        type="button"
                        onClick={() => openNfseSplit(ctr)}
                        className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                      >
                        <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                        <span>Emitir NFSe &amp; Boleto</span>
                      </button>
                    ) : ctr.billingStatus.includes('Quitado') ? (
                      <button
                        type="button"
                        onClick={() => setShowSplitModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                      >
                        <span className="material-symbols-outlined text-[15px]">check_circle</span>
                        <span>Ver Recibo &amp; Split</span>
                      </button>
                    ) : ctr.billingStatus.includes('NF Emitida') ? (
                      <button
                        type="button"
                        onClick={() => openNfseSplit(ctr)}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                      >
                        <span className="material-symbols-outlined text-[15px]">description</span>
                        <span>Visualizar NFSe</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveRoute('transmissao-perdcomp-web')}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                      >
                        <span className="material-symbols-outlined text-[15px]">visibility</span>
                        <span>Acompanhar</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-surface-container-low/60 text-xs text-on-surface-variant">
          Exibindo <strong>{filteredContracts.length}</strong> de <strong>{honorarioContracts.length}</strong> contratos ativos com cláusula quota litis
        </div>
      </div>

      {/* Fee Simulator Modal */}
      {showSimulator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">calculate</span>
                <h3 className="text-base font-bold text-on-surface">
                  Simulador de Honorários no Êxito (Quota Litis)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSimulator(false)}
                className="p-1.5 rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">
                  Crédito Tributário Homologado (R$)
                </label>
                <input
                  type="number"
                  step={10000}
                  value={simCredit}
                  onChange={(e) => setSimCredit(Number(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 font-mono text-sm font-bold text-on-surface"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-on-surface">Percentual de Êxito</label>
                  <span className="font-bold text-primary text-sm tabular-nums">{simRate}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={30}
                  step={1}
                  value={simRate}
                  onChange={(e) => setSimRate(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-outline">
                  <span>10%</span>
                  <span>20% (Padrão)</span>
                  <span>30%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Honorários Brutos Totais:</span>
                  <span className="text-lg font-bold text-primary tabular-nums">
                    {formatBRL(simFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                  <span className="text-on-surface-variant">Cota Vértice Fiscal (85%):</span>
                  <span className="font-bold text-on-surface tabular-nums">
                    {formatBRL(simVertice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Split Perito / Parecerista (15%):</span>
                  <span className="font-bold text-secondary tabular-nums">
                    {formatBRL(simPerito)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSimulator(false)}
                className="px-4 py-2 rounded-xl bg-surface-container-low text-xs font-semibold"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewCredit(String(simCredit));
                  setNewRate(String(simRate));
                  setShowSimulator(false);
                  setShowNewContract(true);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold"
              >
                Converter em Contrato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Contract Modal */}
      {showNewContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateContract}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">
                Novo Contrato de Honorários (Ad Exitum)
              </h3>
              <button
                type="button"
                onClick={() => setShowNewContract(false)}
                className="p-1.5 rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Código do Contrato</label>
                <input
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-outline-variant/60 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Razão Social</label>
                <input
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-outline-variant/60"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Tese Tributária</label>
                <input
                  required
                  value={newThesis}
                  onChange={(e) => setNewThesis(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-outline-variant/60"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Crédito Base (R$)</label>
                  <input
                    required
                    type="number"
                    value={newCredit}
                    onChange={(e) => setNewCredit(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-outline-variant/60 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">% Êxito</label>
                  <input
                    required
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-outline-variant/60 font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewContract(false)}
                className="px-4 py-2 rounded-xl bg-surface-container-low text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold"
              >
                Cadastrar Contrato
              </button>
            </div>
          </form>
        </div>
      )}

      {showSplitModal && <SplitRepassesModal onClose={() => setShowSplitModal(false)} />}
    </div>
  );
};
