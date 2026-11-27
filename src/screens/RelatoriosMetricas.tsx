import React, { useMemo, useState } from 'react';
import { SafeImage } from '../components/SafeImage';
import { useCrm } from '../context/CrmContext';
import { ASSETS } from '../data/assets';
import { downloadCsv, formatBRL } from '../utils/export';

type PeriodKey = '30d' | 'month' | '2024' | 'quarter';

export const RelatoriosMetricas: React.FC = () => {
  const { showToast } = useCrm();
  const [period, setPeriod] = useState<PeriodKey>('month');
  const [showFilters, setShowFilters] = useState(false);
  const [teamFilter, setTeamFilter] = useState('Todas');

  const metricsByPeriod: Record<
    PeriodKey,
    {
      conversion: string;
      recovered: string;
      sla: string;
      retention: string;
      funnel: [number, number, number, number];
      churn: string;
    }
  > = {
    month: {
      conversion: '26.8%',
      recovered: 'R$ 1.840.500',
      sla: '14 min',
      retention: '97.4%',
      funnel: [340, 248, 112, 42],
      churn: '2.6%',
    },
    '30d': {
      conversion: '25.4%',
      recovered: 'R$ 1.620.000',
      sla: '16 min',
      retention: '96.9%',
      funnel: [312, 226, 98, 38],
      churn: '3.1%',
    },
    quarter: {
      conversion: '27.9%',
      recovered: 'R$ 5.180.400',
      sla: '13 min',
      retention: '97.8%',
      funnel: [980, 710, 340, 126],
      churn: '2.2%',
    },
    '2024': {
      conversion: '28.5%',
      recovered: 'R$ 14.920.000',
      sla: '12 min',
      retention: '98.1%',
      funnel: [3420, 2480, 1190, 418],
      churn: '1.9%',
    },
  };

  const current = metricsByPeriod[period];

  const channels = [
    { name: 'RD Station Inbound', leads: 118, closed: 19, revenue: 720000, roas: '8.4x' },
    { name: 'Webhook Site Institucional', leads: 86, closed: 14, revenue: 540500, roas: '11.2x' },
    { name: 'Meta Ads (Lead Form)', leads: 74, closed: 5, revenue: 310000, roas: '4.6x' },
    { name: 'Indicação Parceiros Jurídicos', leads: 38, closed: 3, revenue: 195000, roas: '14.0x' },
    { name: 'Planilha Prospecção Ativa', leads: 24, closed: 1, revenue: 75000, roas: '3.2x' },
  ];

  const consultants = [
    {
      name: 'Mariana Silva',
      role: 'Consultora Sênior',
      goalPct: 118,
      revenue: 840000,
      avatar: ASSETS.relatoriosMarianaSilva,
    },
    {
      name: 'Rafael Mendes',
      role: 'Executivo de Contas',
      goalPct: 104,
      revenue: 560500,
      avatar: ASSETS.relatoriosRafaelMendes,
    },
    {
      name: 'Camila Torres',
      role: 'Especialista Tributária',
      goalPct: 95,
      revenue: 440000,
      avatar: ASSETS.relatoriosCamilaTorres,
    },
  ];

  const filteredConsultants = useMemo(() => {
    if (teamFilter === 'Todas') return consultants;
    return consultants.filter((c) => c.name.includes(teamFilter));
  }, [teamFilter]);

  const handleExportReport = () => {
    downloadCsv(
      `relatorio-executivo-${period}.csv`,
      ['Canal de Origem', 'Leads', 'Fechamentos', 'Receita Gerada', 'ROAS'],
      channels.map((ch) => [ch.name, ch.leads, ch.closed, formatBRL(ch.revenue), ch.roas])
    );
    showToast('Relatório XLS/CSV exportado', 'Dados do período selecionados salvos.');
  };

  const funnelLabels = ['Leads Captados', 'Qualificados', 'Proposta / Diagnóstico', 'Contratos Fechados'];

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodKey)}
            className="h-9 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-bold text-on-surface"
          >
            <option value="month">Este Mês (Atual)</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="quarter">Último Trimestre</option>
            <option value="2024">Ano 2024</option>
          </select>

          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="h-9 px-3.5 rounded-xl border border-outline-variant bg-white text-xs font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Filtros Avançados</span>
          </button>

          {showFilters && (
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-primary-fixed/40 border border-primary/40 text-xs font-bold text-primary"
            >
              <option value="Todas">Consultor: Todos</option>
              <option value="Mariana">Mariana Silva</option>
              <option value="Rafael">Rafael Mendes</option>
              <option value="Camila">Camila Torres</option>
            </select>
          )}
        </div>

        <button
          type="button"
          onClick={handleExportReport}
          className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <span className="material-symbols-outlined text-[17px]">download</span>
          <span>Exportar Relatório (XLS/PDF)</span>
        </button>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">Conversão Comercial</span>
          <p className="text-2xl font-extrabold text-primary tabular-nums mt-1.5">
            {current.conversion}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">
            Receita / Créditos Contratados
          </span>
          <p className="text-2xl font-extrabold text-on-surface tabular-nums mt-1.5">
            {current.recovered}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">
            Tempo Médio 1º Contato (SLA)
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 tabular-nums mt-1.5">
            {current.sla}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">Retenção de Carteira</span>
          <p className="text-2xl font-extrabold text-on-surface tabular-nums mt-1.5">
            {current.retention}
          </p>
        </div>
      </div>

      {/* Funnel + Churn Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-on-surface">
            Funil de Conversão Comercial (4 Estágios)
          </h3>
          <div className="space-y-3">
            {current.funnel.map((val, idx) => {
              const pct = Math.round((val / current.funnel[0]) * 100);
              return (
                <div key={funnelLabels[idx]} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-on-surface">{funnelLabels[idx]}</span>
                    <span className="tabular-nums text-primary">
                      {val} ({pct}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 flex flex-col items-center justify-center text-center space-y-3">
          <h3 className="text-sm font-extrabold text-on-surface">Taxa de Churn Mensal</h3>
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90" aria-hidden="true">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e5eeff" strokeWidth="12" />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#004ac6"
                strokeWidth="12"
                strokeDasharray="232 240"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#ba1a1a"
                strokeWidth="12"
                strokeDasharray="10 240"
                strokeDashoffset="-228"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-on-surface tabular-nums">
                {current.churn}
              </span>
              <span className="text-[10px] font-bold uppercase text-outline">Churn</span>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant">
            Abaixo do teto operacional de 4,0% para carteiras recorrentes.
          </p>
        </div>
      </div>

      {/* Origin ROAS + Consultant Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-outline-variant/40">
            <h3 className="text-sm font-extrabold text-on-surface">Desempenho por Origem &amp; ROAS</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-bold uppercase text-on-surface-variant">
                  <th className="py-2.5 px-4">Canal</th>
                  <th className="py-2.5 px-4 text-right">Leads</th>
                  <th className="py-2.5 px-4 text-right">Fechados</th>
                  <th className="py-2.5 px-4 text-right">Receita</th>
                  <th className="py-2.5 px-4 text-right">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-xs">
                {channels.map((ch) => (
                  <tr key={ch.name} className="hover:bg-surface-container-low/50">
                    <td className="py-2.5 px-4 font-bold text-on-surface">{ch.name}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">{ch.leads}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-semibold">
                      {ch.closed}
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-primary tabular-nums">
                      {formatBRL(ch.revenue)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-700 tabular-nums">
                      {ch.roas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-3">
          <h3 className="text-sm font-extrabold text-on-surface">
            Ranking de Consultores (Meta Mensal)
          </h3>
          <div className="space-y-3">
            {filteredConsultants.map((c, idx) => (
              <div
                key={c.name}
                className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <SafeImage
                    src={c.avatar}
                    alt={c.name}
                    fallbackName={c.name}
                    className="w-9 h-9 rounded-full object-cover"
                    fallbackClassName="w-9 h-9 rounded-full bg-primary-fixed text-primary font-bold text-xs flex items-center justify-center shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-on-surface truncate">{c.name}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{c.role}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-sm font-extrabold text-primary tabular-nums">
                    {c.goalPct}% meta
                  </span>
                  <span className="text-[11px] font-semibold text-on-surface-variant tabular-nums">
                    {formatBRL(c.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
