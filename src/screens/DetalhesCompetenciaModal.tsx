import React, { useMemo, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { INITIAL_NFE_SAMPLES } from '../data/mockData';
import { CompetencyRow } from '../types/crm';
import { downloadCsv, downloadTextFile, formatBRL } from '../utils/export';

interface DetalhesCompetenciaModalProps {
  competency: CompetencyRow;
  onClose: () => void;
}

export const DetalhesCompetenciaModal: React.FC<DetalhesCompetenciaModalProps> = ({
  competency,
  onClose,
}) => {
  const { showToast } = useCrm();
  const [nfeSearch, setNfeSearch] = useState('');
  const [activeCfop, setActiveCfop] = useState<string>('Todos');

  const scaledSamples = useMemo(() => {
    const scale = competency.revenue / 1840500;
    return INITIAL_NFE_SAMPLES.map((sample) => ({
      ...sample,
      date: `${sample.date.slice(0, 3)}${competency.month}`,
      totalValue: Math.round(sample.totalValue * scale * 100) / 100,
      icmsValue: Math.round(sample.icmsValue * scale * 100) / 100,
      creditValue: Math.round(sample.creditValue * scale * 100) / 100,
    }));
  }, [competency]);

  const filteredNfe = useMemo(() => {
    const q = nfeSearch.trim().toLowerCase();
    return scaledSamples.filter((row) => {
      if (activeCfop !== 'Todos' && row.cfop !== activeCfop) return false;
      if (!q) return true;
      return (
        row.number.toLowerCase().includes(q) ||
        row.recipient.toLowerCase().includes(q) ||
        row.cfop.includes(q)
      );
    });
  }, [scaledSamples, nfeSearch, activeCfop]);

  const handleExportSample = () => {
    downloadCsv(
      `amostragem-nfe-${competency.month.replace('/', '-')}.csv`,
      ['Número NF-e', 'Data Emissão', 'CFOP', 'Destinatário', 'Valor Total', 'ICMS Destacado', 'Crédito PIS/COFINS'],
      filteredNfe.map((r) => [
        r.number,
        r.date,
        r.cfop,
        r.recipient,
        formatBRL(r.totalValue),
        formatBRL(r.icmsValue),
        formatBRL(r.creditValue),
      ])
    );
    showToast('Amostragem exportada', `Planilha da competência ${competency.month} gerada.`);
  };

  const handleInspectXml = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<nfeProc versao="4.00">\n  <NFe>\n    <infNFe Id="NFe3523121248291000014455001000104892100000001">\n      <ide><dhEmi>${competency.month}</dhEmi><natOp>Venda Producao Estabelecimento</natOp></ide>\n      <total><ICMSTot><vICMS>${competency.icmsHighlight.toFixed(2)}</vICMS><vNF>${competency.revenue.toFixed(2)}</vNF></ICMSTot></total>\n    </infNFe>\n  </NFe>\n</nfeProc>`;
    downloadTextFile(`lote-xml-${competency.month.replace('/', '-')}.xml`, xml, 'application/xml');
    showToast('XML da competência baixado', `Lote fiscal de ${competency.month} validado com schema 4.00.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant/40 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-primary text-white font-mono text-xs font-extrabold">
                Competência {competency.month}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-primary-fixed text-primary text-[11px] font-bold">
                {competency.nfCount} NF-e emitidas
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-outline-variant/50 text-[11px] font-semibold text-on-surface-variant">
                Alíquota PIS/COFINS: {competency.pisCofinsRate} • SELIC: {competency.selicRate.toFixed(2).replace('.', ',')}%
              </span>
            </div>
            <h3 className="text-base font-extrabold text-on-surface mt-1.5">
              Detalhamento Analítico por Nota Fiscal (EFD C100/C170)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant"
            aria-label="Fechar modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* 4 Mini Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <span className="block text-[10px] font-bold uppercase text-outline">
                Faturamento Bruto
              </span>
              <span className="block text-sm font-extrabold text-on-surface tabular-nums mt-1">
                {formatBRL(competency.revenue)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <span className="block text-[10px] font-bold uppercase text-outline">
                ICMS Destacado
              </span>
              <span className="block text-sm font-extrabold text-on-surface tabular-nums mt-1">
                {formatBRL(competency.icmsHighlight)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <span className="block text-[10px] font-bold uppercase text-outline">
                Crédito Principal
              </span>
              <span className="block text-sm font-extrabold text-primary tabular-nums mt-1">
                {formatBRL(competency.principalCredit)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-primary-fixed/35 border border-primary/30">
              <span className="block text-[10px] font-bold uppercase text-primary">
                Total c/ SELIC ({competency.selicRate.toFixed(2).replace('.', ',')}%)
              </span>
              <span className="block text-sm font-extrabold text-primary tabular-nums mt-1">
                {formatBRL(competency.totalUpdated)}
              </span>
            </div>
          </div>

          {/* Search & CFOP Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <span className="material-symbols-outlined text-[18px] text-outline absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                value={nfeSearch}
                onChange={(e) => setNfeSearch(e.target.value)}
                placeholder="Filtrar por NF-e, destinatário ou CFOP..."
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-on-surface-variant mr-1">CFOPs:</span>
              {(['Todos', ...competency.cfops] as string[]).map((cfop) => (
                <button
                  key={cfop}
                  type="button"
                  onClick={() => setActiveCfop(cfop)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold ${
                    activeCfop === cfop
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {cfop}
                </button>
              ))}
            </div>
          </div>

          {/* NF-e Table */}
          <div className="rounded-xl border border-outline-variant/40 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-bold uppercase text-on-surface-variant">
                  <th className="py-2.5 px-3">NF-e</th>
                  <th className="py-2.5 px-3">Emissão</th>
                  <th className="py-2.5 px-3">CFOP</th>
                  <th className="py-2.5 px-3">Destinatário</th>
                  <th className="py-2.5 px-3 text-right">Valor Nota</th>
                  <th className="py-2.5 px-3 text-right">ICMS</th>
                  <th className="py-2.5 px-3 text-right">Crédito Apurado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-xs">
                {filteredNfe.map((row) => (
                  <tr key={row.number} className="hover:bg-surface-container-low/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-primary">{row.number}</td>
                    <td className="py-2.5 px-3 tabular-nums text-on-surface-variant">{row.date}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold">{row.cfop}</td>
                    <td className="py-2.5 px-3 text-on-surface">{row.recipient}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">{formatBRL(row.totalValue)}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-on-surface-variant">
                      {formatBRL(row.icmsValue)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-primary tabular-nums">
                      {formatBRL(row.creditValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportSample}
              className="h-9 px-3.5 rounded-xl border border-outline-variant bg-white text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Exportar Amostragem CSV</span>
            </button>
            <button
              type="button"
              onClick={handleInspectXml}
              className="h-9 px-3.5 rounded-xl border border-outline-variant bg-white text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">code</span>
              <span>Baixar XMLs Validados</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-5 rounded-xl bg-primary text-white text-xs font-bold"
          >
            Concluir Análise
          </button>
        </div>
      </div>
    </div>
  );
};
