import React, { useMemo, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { downloadTextFile, formatBRL, formatBRLCompact } from '../utils/export';

interface ThesisOption {
  id: string;
  title: string;
  legalBasis: string;
  multiplier: number; // fraction of 60-month base
  risk: 'Baixo' | 'Médio';
}

const THESES: ThesisOption[] = [
  {
    id: 'th-1',
    title: 'Tema 69 STF — Exclusão do ICMS da base do PIS/COFINS',
    legalBasis: 'RE 574.706 / IN RFB 2.121/2022',
    multiplier: 1.4588235,
    risk: 'Baixo',
  },
  {
    id: 'th-2',
    title: 'Insumos Essenciais e Relevantes (PIS/COFINS)',
    legalBasis: 'REsp 1.221.170 STJ',
    multiplier: 0.78,
    risk: 'Baixo',
  },
  {
    id: 'th-3',
    title: 'Verbas Indenizatórias na Folha (INSS Patronal)',
    legalBasis: 'Tema 478 / 985 STJ',
    multiplier: 0.56,
    risk: 'Baixo',
  },
  {
    id: 'th-4',
    title: 'Exclusão de Subvenções ICMS (IRPJ/CSLL)',
    legalBasis: 'Lei 14.789/2023 • Precedente EREsp',
    multiplier: 0.4835294,
    risk: 'Médio',
  },
];

export const RecuperacaoTributaria: React.FC = () => {
  const { taxProcesses, addTaxProcess, setActiveRoute, showToast } = useCrm();

  const [regime, setRegime] = useState<'Lucro Real' | 'Lucro Presumido' | 'Simples Nacional'>('Lucro Real');
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(850000);
  const [selectedTheses, setSelectedTheses] = useState<string[]>(THESES.map((t) => t.id));
  const [simCompany, setSimCompany] = useState('Indústria Metalúrgica Ramos Ltda.');

  const toggleThesis = (id: string) => {
    setSelectedTheses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // At default 850.000,00 + Lucro Real + all 4 theses -> ~ R$ 2.790.000,00
  const simulatedTotal = useMemo(() => {
    const regimeFactor =
      regime === 'Lucro Real' ? 1 : regime === 'Lucro Presumido' ? 0.62 : 0.28;
    const sumMult = THESES.filter((t) => selectedTheses.includes(t.id)).reduce(
      (acc, t) => acc + t.multiplier,
      0
    );
    return Math.round(monthlyRevenue * sumMult * regimeFactor);
  }, [monthlyRevenue, regime, selectedTheses]);

  const handleSaveSimulation = () => {
    if (selectedTheses.length === 0) {
      showToast('Selecione ao menos uma tese', 'Marque uma ou mais teses no simulador.', 'warning');
      return;
    }
    addTaxProcess({
      company: simCompany.trim() || 'Nova Empresa Simulada',
      cnpj: '38.114.902/0001-33',
      regime,
      thesis: `${selectedTheses.length} teses selecionadas (${regime})`,
      estimatedCredit: simulatedTotal,
      status: 'Em Análise',
      risk: selectedTheses.includes('th-4') ? 'Médio' : 'Baixo',
    });

    downloadTextFile(
      `parecer-tecnico-${simCompany.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`,
      `PARECER TÉCNICO PRELIMINAR — VÉRTICE INTELIGÊNCIA TRIBUTÁRIA\n` +
        `Empresa: ${simCompany}\nRegime: ${regime}\n` +
        `Faturamento Mensal Base: ${formatBRL(monthlyRevenue)}\n` +
        `Crédito Total Estimado (60 meses + SELIC): ${formatBRL(simulatedTotal)}\n` +
        `Teses: ${THESES.filter((t) => selectedTheses.includes(t.id))
          .map((t) => t.title)
          .join('; ')}\n`
    );
  };

  const tributeBars = [
    { label: 'PIS / COFINS', pct: 48, color: 'bg-primary' },
    { label: 'Previdenciário (INSS)', pct: 26, color: 'bg-secondary' },
    { label: 'ICMS / ICMS-ST', pct: 16, color: 'bg-primary-container' },
    { label: 'IRPJ / CSLL', pct: 10, color: 'bg-tertiary' },
  ];

  const ecacSteps = [
    { label: 'Procuração e-CAC', status: 'Concluído', icon: 'verified_user' },
    { label: 'Auditoria SPED', status: 'Validado', icon: 'fact_check' },
    { label: 'Retificação EFD', status: 'Em Execução', icon: 'edit_document' },
    { label: 'PER/DCOMP Web', status: 'Pronto', icon: 'send' },
  ];

  return (
    <div className="space-y-5">
      {/* 4 Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">
            Créditos Mapeados (Total)
          </span>
          <p className="text-2xl font-extrabold text-on-surface tabular-nums mt-1.5">
            R$ 3.428.950,00
          </p>
          <span className="text-[11px] font-bold text-emerald-700">+12,4% este trimestre</span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">
            Em Protocolo / PER/DCOMP
          </span>
          <p className="text-2xl font-extrabold text-primary tabular-nums mt-1.5">
            R$ 1.890.400,00
          </p>
          <span className="text-[11px] font-semibold text-on-surface-variant">
            4 processos ativos
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">
            Homologado / Compensado
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 tabular-nums mt-1.5">
            R$ 1.120.350,00
          </p>
          <span className="text-[11px] font-semibold text-on-surface-variant">
            Atualizado pela SELIC
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">
            Índice de Segurança Jurídica
          </span>
          <p className="text-2xl font-extrabold text-on-surface tabular-nums mt-1.5">
            Baixo Risco 98.2%
          </p>
          <span className="text-[11px] font-bold text-primary">Jurisprudência Pacífica</span>
        </div>
      </div>

      {/* Quinquennial Prescription Alert Banner */}
      <div className="rounded-2xl border border-tertiary/40 bg-tertiary-fixed/40 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-[24px] text-tertiary mt-0.5">
            warning
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-on-tertiary-fixed">
              Alerta de Prescrição Quinquenal — Competência 10/2019 (R$ 38.420,00)
            </h3>
            <p className="text-xs text-on-tertiary-fixed-variant mt-0.5">
              Restam 14 dias antes do prazo decadencial de 5 anos para aproveitamento via compensação
              federal.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setActiveRoute('transmissao-perdcomp-web')}
          className="h-9 px-4 rounded-xl bg-tertiary text-white text-xs font-bold hover:bg-tertiary-container transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">bolt</span>
          <span>Protocolar PER/DCOMP Imediatamente</span>
        </button>
      </div>

      {/* Simulator + Side Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Interactive Thesis Simulator */}
        <div className="xl:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/40">
            <div>
              <h2 className="text-base font-extrabold text-on-surface">
                Simulador Rápido de Teses Tributárias (60 Meses)
              </h2>
              <p className="text-xs text-on-surface-variant">
                Selecione o regime e as teses aplicáveis para projeção imediata com SELIC
              </p>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
              {(['Lucro Real', 'Lucro Presumido', 'Simples Nacional'] as const).map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setRegime(reg)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap shrink-0 ${
                    regime === reg ? 'bg-primary text-white' : 'text-on-surface-variant'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Empresa Analisada
              </label>
              <input
                type="text"
                value={simCompany}
                onChange={(e) => setSimCompany(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Faturamento Mensal Médio (R$)
              </label>
              <input
                type="number"
                step={10000}
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Math.max(0, Number(e.target.value)))}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-mono font-bold tabular-nums"
              />
            </div>
          </div>

          <div className="space-y-2">
            {THESES.map((t) => {
              const checked = selectedTheses.includes(t.id);
              return (
                <label
                  key={t.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    checked
                      ? 'border-primary/50 bg-primary-fixed/20'
                      : 'border-outline-variant/40 bg-surface-container-low/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleThesis(t.id)}
                      className="mt-0.5 rounded border-outline-variant text-primary"
                    />
                    <div>
                      <p className="text-xs font-bold text-on-surface">{t.title}</p>
                      <p className="text-[11px] text-on-surface-variant">{t.legalBasis}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      t.risk === 'Baixo'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-tertiary-fixed text-tertiary'
                    }`}
                  >
                    Risco {t.risk}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="block text-[11px] font-semibold uppercase text-primary-fixed">
                Crédito Potencial Estimado (60M)
              </span>
              <span className="text-2xl font-extrabold tabular-nums">
                {formatBRL(simulatedTotal)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSaveSimulation}
              className="h-10 px-4 rounded-xl bg-white text-primary text-xs font-extrabold hover:bg-primary-fixed transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-[17px]">description</span>
              <span>Salvar Simulação &amp; Gerar Parecer</span>
            </button>
          </div>
        </div>

        {/* Right Side: Tribute Distribution + e-CAC Pipeline */}
        <div className="xl:col-span-5 space-y-5">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-on-surface">
              Distribuição por Esfera Tributária
            </h3>
            <div className="space-y-3">
              {tributeBars.map((bar) => (
                <div key={bar.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-on-surface">{bar.label}</span>
                    <span className="tabular-nums text-primary">{bar.pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-surface-container overflow-hidden">
                    <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-on-surface">Esteira e-CAC / Receita Federal</h3>
              <button
                type="button"
                onClick={() => setActiveRoute('importacao-sped-xml')}
                className="text-xs font-bold text-primary hover:underline"
              >
                Auditar SPED &rarr;
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ecacSteps.map((step, i) => (
                <div
                  key={step.label}
                  className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1"
                >
                  <div className="flex items-center justify-between text-primary">
                    <span className="text-[10px] font-extrabold uppercase">Etapa {i + 1}</span>
                    <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
                  </div>
                  <p className="text-xs font-bold text-on-surface">{step.label}</p>
                  <p className="text-[11px] font-semibold text-emerald-700">{step.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Processes Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold text-on-surface">
            Processos de Recuperação Ativos ({taxProcesses.length})
          </h3>
          <button
            type="button"
            onClick={() => setActiveRoute('laudo-tecnico-memoria-de-calculo')}
            className="text-xs font-bold text-primary hover:underline"
          >
            Abrir Memória de Cálculo 60M &rarr;
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-bold uppercase text-on-surface-variant">
                <th className="py-3 px-4">Empresa / CNPJ</th>
                <th className="py-3 px-4">Regime</th>
                <th className="py-3 px-4">Tese Principal</th>
                <th className="py-3 px-4 text-right">Crédito Estimado</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-xs">
              {taxProcesses.map((proc) => (
                <tr key={proc.id} className="hover:bg-surface-container-low/50">
                  <td className="py-3 px-4">
                    <p className="font-bold text-on-surface">{proc.company}</p>
                    <p className="text-[11px] font-mono text-on-surface-variant">{proc.cnpj}</p>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">{proc.regime}</td>
                  <td className="py-3 px-4 font-medium text-on-surface">{proc.thesis}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-primary tabular-nums">
                    {formatBRLCompact(proc.estimatedCredit)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        proc.status === 'Deferido'
                          ? 'bg-emerald-50 text-emerald-700'
                          : proc.status === 'Protocolado'
                          ? 'bg-primary-fixed text-primary'
                          : proc.status === 'Auditado'
                          ? 'bg-secondary-fixed text-secondary'
                          : 'bg-tertiary-fixed text-tertiary'
                      }`}
                    >
                      {proc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveRoute('laudo-tecnico-memoria-de-calculo')}
                      className="px-2.5 py-1 rounded-lg bg-primary-fixed text-primary font-semibold text-[11px]"
                    >
                      Ver Laudo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
