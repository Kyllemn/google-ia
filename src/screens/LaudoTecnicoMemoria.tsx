import React, { useMemo, useState } from 'react';
import { SafeImage } from '../components/SafeImage';
import { useCrm } from '../context/CrmContext';
import { ASSETS } from '../data/assets';
import { downloadCsv, downloadTextFile, formatBRL } from '../utils/export';
import { DetalhesCompetenciaModal } from './DetalhesCompetenciaModal';
import { ExportacaoIcpBrasil } from './ExportacaoIcpBrasil';

const PAGE_SIZE = 6;

export const LaudoTecnicoMemoria: React.FC = () => {
  const {
    competencies,
    selectedCompetency,
    setSelectedCompetency,
    showIcpExport,
    setShowIcpExport,
    setActiveRoute,
    showToast,
  } = useCrm();

  const [yearFilter, setYearFilter] = useState<'Todos' | number>('Todos');
  const [searchMonth, setSearchMonth] = useState('');
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const q = searchMonth.trim().toLowerCase();
    return competencies.filter((row) => {
      if (yearFilter !== 'Todos' && row.year !== yearFilter) return false;
      if (!q) return true;
      return row.month.includes(q) || row.cfops.some((c) => c.includes(q));
    });
  }, [competencies, yearFilter, searchMonth]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const totals = useMemo(() => {
    return competencies.reduce(
      (acc, r) => ({
        revenue: acc.revenue + r.revenue,
        icms: acc.icms + r.icmsHighlight,
        principal: acc.principal + r.principalCredit,
        selic: acc.selic + r.selicValue,
        total: acc.total + r.totalUpdated,
      }),
      { revenue: 0, icms: 0, principal: 0, selic: 0, total: 0 }
    );
  }, [competencies]);

  if (showIcpExport) {
    return <ExportacaoIcpBrasil onBack={() => setShowIcpExport(false)} />;
  }

  const handleDownloadXlsxCsv = () => {
    downloadCsv(
      'memoria-de-calculo-60m-tema69-ramos.csv',
      ['Competência', 'NF-e', 'Faturamento Bruto', 'ICMS Destacado', 'Crédito Principal', 'SELIC (%)', 'SELIC (R$)', 'Total Atualizado'],
      competencies.map((r) => [
        r.month,
        r.nfCount,
        formatBRL(r.revenue, false),
        formatBRL(r.icmsHighlight, false),
        formatBRL(r.principalCredit, false),
        `${r.selicRate.toFixed(2).replace('.', ',')}%`,
        formatBRL(r.selicValue, false),
        formatBRL(r.totalUpdated, false),
      ])
    );
    showToast('Memória de Cálculo exportada', 'Planilha completa com 60 competências baixada.');
  };

  const handleExportPdf = () => {
    downloadTextFile(
      'laudo-tecnico-tema69-ramos.txt',
      `LAUDO TÉCNICO CONTÁBIL — TEMA 69 STF\nEmpresa: Indústria Metalúrgica Ramos Ltda.\nPeríodo: 01/2019 a 12/2023 (60 Meses)\nTotal Crédito Atualizado: ${formatBRL(totals.total)}\nPrincipal: ${formatBRL(totals.principal)} | SELIC: ${formatBRL(totals.selic)}\nSHA-256: 8f9b2d77c04e91a5d21a4c8e\n`
    );
    showToast('Laudo Técnico gerado', 'Resumo executivo pronto para assinatura digital.');
  };

  // Annual summary for SVG bar+SELIC chart
  const annualBars = [2019, 2020, 2021, 2022, 2023].map((yr) => {
    const yrRows = competencies.filter((r) => r.year === yr);
    const total = yrRows.reduce((a, r) => a + r.totalUpdated, 0);
    return { year: yr, total };
  });
  const maxYearTotal = Math.max(...annualBars.map((b) => b.total), 1);

  return (
    <div className="space-y-5">
      {/* Context Ribbon */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-xl bg-primary-fixed text-primary text-xs font-extrabold">
            Indústria Metalúrgica Ramos Ltda.
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface">
            Tema 69 STF
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-container-low text-xs font-semibold text-on-surface-variant tabular-nums">
            60 Meses (01/2019 a 12/2023)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportPdf}
            className="h-9 px-3 rounded-xl border border-outline-variant bg-white text-xs font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            <span>Exportar PDF</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadXlsxCsv}
            className="h-9 px-3 rounded-xl border border-outline-variant bg-white text-xs font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">table_view</span>
            <span>Memória XLSX</span>
          </button>
          <button
            type="button"
            onClick={() => setShowIcpExport(true)}
            className="h-9 px-3.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Assinar Digitalmente (e-CPF)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRoute('transmissao-perdcomp-web')}
            className="h-9 px-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>Transmitir para o Fiscal</span>
          </button>
        </div>
      </div>

      {/* Top Hero + Normative + Perito Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white p-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary-fixed">
              Crédito Total Apurado (Principal + SELIC)
            </span>
            <p className="text-3xl font-extrabold tabular-nums mt-1.5">
              {formatBRL(totals.total)}
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-primary-fixed">Valor Principal</span>
              <span className="font-extrabold text-sm tabular-nums">{formatBRL(totals.principal)}</span>
            </div>
            <div>
              <span className="block text-primary-fixed">Correção SELIC</span>
              <span className="font-extrabold text-sm tabular-nums">{formatBRL(totals.selic)}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
            Enquadramento Normativo
          </span>
          <h3 className="text-sm font-extrabold text-on-surface">RE 574.706 / IN RFB 2.121/2022</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Exclusão do ICMS destacado nas notas fiscais de saída da base de cálculo do PIS e da
            COFINS, com atualização pela taxa SELIC acumulada até o mês anterior ao protocolo.
          </p>
        </div>

        <div className="lg:col-span-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
              Responsável Técnico
            </span>
            <h3 className="text-sm font-extrabold text-on-surface mt-1.5">
              Carlos Eduardo Silveira
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">CRC/SP 1SP298.411/O-4</p>
            <p className="text-xs text-on-surface-variant">CNPC Nº 4.819</p>
          </div>
          <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px]">
            <span className="text-outline font-mono">SHA-256: 8f9b2d...1a4c8e</span>
            <span className="text-emerald-700 font-bold">CRC Ativo</span>
          </div>
        </div>
      </div>

      {/* 60-Month Ledger Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['Todos', 2023, 2022, 2021, 2020, 2019] as const).map((yr) => (
              <button
                key={String(yr)}
                type="button"
                onClick={() => {
                  setYearFilter(yr);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  yearFilter === yr
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {yr === 'Todos' ? 'Todos (60M)' : yr}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-56">
              <span className="material-symbols-outlined text-[17px] text-outline absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                value={searchMonth}
                onChange={(e) => {
                  setSearchMonth(e.target.value);
                  setPage(1);
                }}
                placeholder="Competência (ex: 12/2023)..."
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-bold uppercase text-on-surface-variant">
                <th className="py-3 px-4">Competência</th>
                <th className="py-3 px-4 text-center">NF-e</th>
                <th className="py-3 px-4 text-right">Faturamento Bruto</th>
                <th className="py-3 px-4 text-right">ICMS Destacado</th>
                <th className="py-3 px-4 text-right">Crédito Principal</th>
                <th className="py-3 px-4 text-right">SELIC (%)</th>
                <th className="py-3 px-4 text-right">SELIC (R$)</th>
                <th className="py-3 px-4 text-right">Total Atualizado</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-xs">
              {pageRows.map((row) => (
                <tr
                  key={row.month}
                  onClick={() => setSelectedCompetency(row)}
                  className="hover:bg-primary-fixed/20 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-primary">{row.month}</td>
                  <td className="py-3 px-4 text-center tabular-nums text-on-surface-variant">
                    {row.nfCount}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {formatBRL(row.revenue, false)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-on-surface-variant">
                    {formatBRL(row.icmsHighlight, false)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold tabular-nums">
                    {formatBRL(row.principalCredit, false)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-on-surface-variant">
                    {row.selicRate.toFixed(2).replace('.', ',')}%
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-on-surface-variant">
                    {formatBRL(row.selicValue, false)}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-primary tabular-nums">
                    {formatBRL(row.totalUpdated)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-1 rounded-lg bg-primary-fixed text-primary text-[10px] font-bold">
                      Detalhes
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-surface-container-low border-t-2 border-outline-variant/60 text-xs font-extrabold text-on-surface">
                <td className="py-3 px-4">TOTAL CONSOLIDADO (60M)</td>
                <td className="py-3 px-4 text-center tabular-nums">
                  {competencies.reduce((a, r) => a + r.nfCount, 0)}
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  {formatBRL(totals.revenue, false)}
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  {formatBRL(totals.icms, false)}
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  {formatBRL(totals.principal, false)}
                </td>
                <td className="py-3 px-4 text-right">—</td>
                <td className="py-3 px-4 text-right tabular-nums">
                  {formatBRL(totals.selic, false)}
                </td>
                <td className="py-3 px-4 text-right text-primary tabular-nums">
                  {formatBRL(totals.total)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-on-surface-variant">
            Clique em qualquer competência para abrir os XMLs/NF-e • Página {safePage} de {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 px-3 rounded-lg border border-outline-variant/60 font-semibold disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-3 rounded-lg border border-outline-variant/60 font-semibold disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Chart + Guidelines + Seal Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-on-surface">
              Evolução Anual do Crédito + Curva SELIC
            </h3>
            <span className="text-[11px] font-semibold text-primary">2019 — 2023</span>
          </div>
          <div className="grid grid-cols-5 gap-3 items-end h-40 pt-4">
            {annualBars.map((b) => {
              const pct = Math.round((b.total / maxYearTotal) * 100);
              return (
                <div key={b.year} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-bold text-primary tabular-nums">
                    {formatBRL(b.total).replace(',00', '')}
                  </span>
                  <div className="w-full max-w-[46px] bg-surface-container rounded-t-xl flex-1 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-primary to-primary-container rounded-t-xl"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-on-surface">{b.year}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 flex flex-col justify-between gap-4">
          <div className="space-y-2.5">
            <h3 className="text-sm font-extrabold text-on-surface">
              Diretrizes Operacionais &amp; Selo Pericial
            </h3>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary mt-0.5">
                  check_circle
                </span>
                <span>Base de cálculo validada por XML NF-e (modelo 55) registro a registro.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary mt-0.5">
                  check_circle
                </span>
                <span>Retificação prévia de EFD-Contribuições (M210/M610) alinhada à IN 2.121.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary mt-0.5">
                  check_circle
                </span>
                <span>Assinatura PAdES-LTV obrigatória antes da transmissão no PER/DCOMP Web.</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
            <SafeImage
              src={ASSETS.laudoSealBanner}
              alt="Selo ICP-Brasil"
              fallbackName="ICP"
              className="w-16 h-12 rounded-lg object-cover shrink-0"
              fallbackClassName="w-16 h-12 rounded-lg bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-on-surface">
                Certificação ICP-Brasil Pronta
              </p>
              <p className="text-[11px] text-on-surface-variant">
                Clique em &ldquo;Assinar Digitalmente (e-CPF)&rdquo; para emitir o PDF/A-1b.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Competency Drilldown Modal */}
      {selectedCompetency && (
        <DetalhesCompetenciaModal
          competency={selectedCompetency}
          onClose={() => setSelectedCompetency(null)}
        />
      )}
    </div>
  );
};
