import React, { useMemo, useState } from 'react';
import { SafeImage } from '../components/SafeImage';
import { useCrm } from '../context/CrmContext';
import { ASSETS } from '../data/assets';
import { downloadCsv, downloadTextFile, formatBRL } from '../utils/export';

interface SplitRepassesModalProps {
  onClose: () => void;
}

export const SplitRepassesModal: React.FC<SplitRepassesModalProps> = ({ onClose }) => {
  const { splitRepasses, dispatchBatchPix, showToast } = useCrm();
  const [period, setPeriod] = useState('Exercício 2024 (Todos os Meses)');
  const [search, setSearch] = useState('');

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return splitRepasses;
    return splitRepasses.filter(
      (r) =>
        r.contractCode.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.eventRef.toLowerCase().includes(q)
    );
  }, [splitRepasses, search]);

  const handleExportSplit = () => {
    downloadCsv(
      'extrato_repasses_split_carlos_silveira.csv',
      ['Data', 'Evento', 'Contrato', 'Cliente', 'Parcela', 'Crédito Deferido', 'Êxito Vértice', 'Cota Parceiro', 'Retenções', 'Líquido Repassado', 'Status'],
      filteredRows.map((r) => [
        r.date,
        r.eventRef,
        r.contractCode,
        r.company,
        r.installment,
        formatBRL(r.deferredCredit),
        formatBRL(r.verticeFee),
        formatBRL(r.partnerShare),
        formatBRL(r.withholding),
        formatBRL(r.netPaid),
        r.status,
      ])
    );
    showToast('Extrato analítico de Split exportado (.CSV)');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-on-background/45 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-white border-b border-surface-container flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">call_split</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
                  Módulo Êxito Tributário
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Subconta Santander Custódia Ativa
                </span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mt-1">
                Extrato &amp; Histórico de Repasses de Split — Pareceristas e Peritos Externos
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Auditoria contábil de repasses proporcionais vinculados ao êxito administrativo da Receita Federal e PGFN
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              aria-label="Seletor de Período"
              className="h-9 px-3 rounded-xl bg-surface-container-low text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Exercício 2024 (Todos os Meses)</option>
              <option>Outubro 2024 (Mês Corrente)</option>
              <option>3º Trimestre 2024 (Jul - Set)</option>
              <option>1º Semestre 2024</option>
            </select>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar Modal"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-surface">
          {/* Partner Profile */}
          <div className="p-4 bg-white rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <SafeImage
                src={ASSETS.drCarlosSilveira}
                alt="Dr. Carlos Eduardo Silveira"
                fallbackName="CS"
                className="w-12 h-12 rounded-full object-cover shadow-xs shrink-0"
                fallbackClassName="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-on-surface truncate">
                    Dr. Carlos Eduardo Silveira
                  </span>
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                </div>
                <p className="text-xs text-on-surface-variant truncate">
                  OAB/SP 284.910 • CRC/SP 1SP294820/O-4 • Parecerista Tributário &amp; Perito Contábil Judicial
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <div className="px-3 py-1.5 bg-surface rounded-xl">
                <span className="block text-[10px] font-bold uppercase text-on-surface-variant">
                  Chave Pix Favorecida
                </span>
                <span className="font-semibold text-on-surface">
                  financeiro@silveirapericias.adv.br
                </span>
              </div>
              <div className="px-3 py-1.5 bg-surface rounded-xl">
                <span className="block text-[10px] font-bold uppercase text-on-surface-variant">
                  Agência / Conta Santander
                </span>
                <span className="font-semibold text-on-surface font-mono">
                  Ag 0340 • C/C 13009284-8
                </span>
              </div>
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-outline-variant/30 shadow-xs">
              <div className="flex items-center justify-between text-on-surface-variant mb-1">
                <span className="text-[11px] uppercase font-bold">Honorários Homologados</span>
                <span className="material-symbols-outlined text-primary text-[20px]">
                  assignment_turned_in
                </span>
              </div>
              <div className="text-xl font-bold text-on-surface tabular-nums">R$ 142.850,00</div>
              <p className="text-xs text-on-surface-variant mt-2">
                <strong className="text-primary">8 Laudos Deferidos</strong> pela RFB
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-outline-variant/30 shadow-xs">
              <div className="flex items-center justify-between text-on-surface-variant mb-1">
                <span className="text-[11px] uppercase font-bold">Repasses Liquidados</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">payments</span>
              </div>
              <div className="text-xl font-bold text-on-surface tabular-nums">R$ 94.620,00</div>
              <p className="text-xs text-on-surface-variant mt-2">
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-semibold">
                  6 Faturas Pagas
                </span>{' '}
                via Pix / TED
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-outline-variant/30 shadow-xs">
              <div className="flex items-center justify-between text-on-surface-variant mb-1">
                <span className="text-[11px] uppercase font-bold">Saldo Pendente</span>
                <span className="material-symbols-outlined text-tertiary-container text-[20px]">
                  hourglass_top
                </span>
              </div>
              <div className="text-xl font-bold text-on-surface tabular-nums">R$ 48.230,00</div>
              <p className="text-xs text-on-surface-variant mt-2">
                Vinculado à quitação dos clientes
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-outline-variant/30 shadow-xs">
              <div className="flex items-center justify-between text-on-surface-variant mb-1">
                <span className="text-[11px] uppercase font-bold">Retenções Tributárias</span>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  receipt_long
                </span>
              </div>
              <div className="text-xl font-bold text-on-surface tabular-nums">R$ 9.840,00</div>
              <p className="text-xs text-primary font-medium mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">folder_shared</span>
                DIRF e Informe de Rendimentos OK
              </p>
            </div>
          </div>

          {/* Quota Litis Split Rule Banner */}
          <div className="p-5 bg-surface-container-low rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">handshake</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-on-surface">
                    Regra de Rateio Contratual Cadastrada — Cláusula Quota Litis
                  </h4>
                  <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-[11px] rounded-full font-bold">
                    Automático D+1
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 max-w-3xl">
                  O perito faz jus a <strong>15,00% da verba de êxito</strong> recebida pela consultoria sobre cada compensação deferida pela RFB/CARF. O gatilho de liquidação ocorre no primeiro dia útil subsequente (D+1) à baixa bancária.
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <span className="block text-[10px] font-bold uppercase text-on-surface-variant">
                Taxa de Conversão Líquida
              </span>
              <span className="block text-lg font-bold text-primary tabular-nums">85% / 15%</span>
              <span className="block text-xs text-on-surface-variant">Vértice CRM x Perito</span>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px] absolute left-3 top-2">
                filter_alt
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filtrar por Contrato, Razão Social ou Protocolo..."
                className="w-full h-9 pl-9 pr-4 rounded-xl bg-white border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportSplit}
                className="h-9 px-3 bg-white border border-outline-variant/40 text-on-surface rounded-xl text-xs font-semibold hover:bg-surface-container-high flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">file_download</span>
                <span>Exportar Analítico (.CSV)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  downloadTextFile(
                    'informe_rendimentos_irpf_2024_carlos_silveira.txt',
                    'INFORME DE RENDIMENTOS ANUAL - REINF / DIRF\nBENEFICIÁRIO: Dr. Carlos Eduardo Silveira\nRENDIMENTOS LIQUIDOS REPASSADOS: R$ 94.620,00\nRETENÇÕES IRRF/ISS: R$ 9.840,00'
                  );
                  showToast('Informe de Rendimentos IRPF gerado');
                }}
                className="h-9 px-3 bg-white border border-outline-variant/40 text-on-surface rounded-xl text-xs font-semibold hover:bg-surface-container-high flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">badge</span>
                <span>Gerar Informes IRPF</span>
              </button>
              <button
                type="button"
                onClick={dispatchBatchPix}
                className="h-9 px-3.5 bg-primary text-on-primary rounded-xl text-xs font-semibold hover:bg-primary-container flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Disparar Pix em Lote</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="py-3 px-4">Data / Evento</th>
                    <th className="py-3 px-4">Contrato / Cliente</th>
                    <th className="py-3 px-4 text-center">Parcela</th>
                    <th className="py-3 px-4 text-right">Crédito Deferido</th>
                    <th className="py-3 px-4 text-right">Êxito Vértice (20%)</th>
                    <th className="py-3 px-4 text-right text-primary">Cota Parceiro (15%)</th>
                    <th className="py-3 px-4 text-right">Retenções</th>
                    <th className="py-3 px-4 text-right">Líquido Repassado</th>
                    <th className="py-3 px-4 text-center">Status Repasse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container text-xs text-on-surface">
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold">{row.date}</div>
                        <div className="text-[11px] text-on-surface-variant">{row.eventRef}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold font-mono">{row.contractCode}</div>
                        <div className="text-on-surface-variant truncate max-w-[190px]">
                          {row.company}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-[11px] font-semibold">
                          {row.installment}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium tabular-nums">
                        {formatBRL(row.deferredCredit)}
                      </td>
                      <td className="py-3 px-4 text-right text-on-surface-variant tabular-nums">
                        {formatBRL(row.verticeFee)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-primary tabular-nums">
                        {formatBRL(row.partnerShare)}
                      </td>
                      <td className="py-3 px-4 text-right text-error font-medium tabular-nums">
                        {row.withholdingPrefix ? `${row.withholdingPrefix} ` : '- '}
                        {formatBRL(row.withholding)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold tabular-nums">
                        {formatBRL(row.netPaid)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            row.status === 'Liquidado via Pix'
                              ? 'bg-primary-fixed text-on-primary-fixed'
                              : row.status === 'Em Processamento'
                              ? 'bg-secondary-fixed text-on-secondary-fixed'
                              : 'bg-tertiary-fixed text-on-tertiary-fixed'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              row.status === 'Liquidado via Pix'
                                ? 'bg-primary'
                                : row.status === 'Em Processamento'
                                ? 'bg-secondary'
                                : 'bg-tertiary'
                            }`}
                          />
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-outline-variant/30 flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[19px]">verified_user</span>
              <span>
                Valores reconciliados diariamente com o <strong>e-CAC / PER/DCOMP</strong> e comprovados via <strong>EFD-Reinf / DCTFWeb</strong>.
              </span>
            </div>
            <span className="font-mono text-[11px] text-outline">Hash Reinf: #d4a98f12c</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-surface-container flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-secondary">sync</span>
            <span>
              Última reconciliação bancária Santander: <strong>Hoje, às 14:32</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
            >
              Fechar Janela
            </button>
            <button
              type="button"
              onClick={() =>
                showToast('Cruzamento bancário OFX validado', 'Todos os 14 repasses conferem 100% com o extrato Santander.')
              }
              className="h-9 px-4 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary-container flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">verified</span>
              <span>Auditar Cruzamento Bancário com OFX</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
