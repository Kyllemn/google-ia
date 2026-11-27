import React, { useMemo, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { downloadCsv, formatBRL } from '../utils/export';
import { DctfRetificadoraModal } from './DctfRetificadoraModal';

export const AuditoriaDctfWebEfd: React.FC = () => {
  const { dctfAuditRows, showToast } = useCrm();
  const [filterTab, setFilterTab] = useState<'all' | 'divergent' | 'conciled'>('all');
  const [selectedBatch, setSelectedBatch] = useState(
    'Indústria Metalúrgica Ramos Ltda - Competência: 12/2023'
  );
  const [runningBatch, setRunningBatch] = useState(false);
  const [showRetificadora, setShowRetificadora] = useState(false);

  const divergentCount = dctfAuditRows.filter((r) => r.status !== 'conciled').length;
  const conciledCount = dctfAuditRows.filter((r) => r.status === 'conciled').length;
  const isRectified = divergentCount <= 1; // 10/2023 alert remains, 12/2023 fixed

  const visibleRows = useMemo(() => {
    if (filterTab === 'divergent') return dctfAuditRows.filter((r) => r.status !== 'conciled');
    if (filterTab === 'conciled') return dctfAuditRows.filter((r) => r.status === 'conciled');
    return dctfAuditRows;
  }, [dctfAuditRows, filterTab]);

  const total1223Dctf = useMemo(() => {
    const rows12 = dctfAuditRows.filter((r) => r.competency === '12/2023');
    return rows12.reduce((acc, r) => acc + r.dctfValue, 0);
  }, [dctfAuditRows]);

  const total1223Delta = useMemo(() => {
    const rows12 = dctfAuditRows.filter((r) => r.competency === '12/2023');
    return Math.abs(rows12.reduce((acc, r) => acc + r.delta, 0));
  }, [dctfAuditRows]);

  const handleRunBatch = () => {
    setRunningBatch(true);
    setTimeout(() => {
      setRunningBatch(false);
      showToast(
        'Cruzamento de lote finalizado (Motor v4.12)',
        'EFD-Contribuições confrontada com declarações DCTFWeb em 0,8s.'
      );
    }, 850);
  };

  const handleExportMatrix = () => {
    downloadCsv(
      'matriz_auditoria_dctfweb_efd.csv',
      ['Competência', 'Tributo', 'Valor EFD', 'Valor DCTFWeb', 'Delta', 'Origem', 'Impacto'],
      visibleRows.map((r) => [
        r.competency,
        r.tribute,
        formatBRL(r.efdValue),
        formatBRL(r.dctfValue),
        formatBRL(r.delta),
        r.origin,
        r.impact,
      ])
    );
    showToast('Matriz de auditoria exportada (.CSV)');
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
            <span>Financeiro &amp; Fiscal</span>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <span>Auditoria Fiscal</span>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <span className="text-primary">Confronto DCTFWeb x EFD Contribuições</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[26px]">balance</span>
              Auditoria Cruzada DCTFWeb x EFD Contribuições
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
              MOTOR V4.12
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl">
            Confronto analítico e automatizado entre débitos apurados na escrituração e confissões de dívida previdenciária e tributária para prevenção de autos de infração.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            aria-label="Empresa e competência auditada"
            className="h-9 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
          >
            <option>Indústria Metalúrgica Ramos Ltda - Competência: 12/2023</option>
            <option>Farmácias São João Distribuidora - Competência: 11/2023</option>
          </select>

          <button
            type="button"
            onClick={handleExportMatrix}
            className="h-9 px-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-on-surface hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Exportar Matriz (.CSV)</span>
          </button>

          <button
            type="button"
            onClick={handleRunBatch}
            className="h-9 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <span className={`material-symbols-outlined text-[17px] ${runningBatch ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{runningBatch ? 'Executando...' : '+ Executar Cruzamento de Lote'}</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Conformidade Global
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
          </div>
          <div className="text-3xl font-bold text-primary mt-2 tabular-nums">
            {total1223Delta === 0 ? '98,4%' : '94,8%'}
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: total1223Delta === 0 ? '98%' : '95%' }}
            />
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            Divergência controlada de{' '}
            <strong className={total1223Delta === 0 ? 'text-emerald-700' : 'text-error'}>
              {formatBRL(total1223Delta)}
            </strong>
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Débito Total EFD Contribuições
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">description</span>
          </div>
          <div className="text-3xl font-bold text-on-surface mt-2 tabular-nums">R$ 184.500,00</div>
          <p className="text-xs text-on-surface-variant mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Blocos M200 (PIS) e M600 (COFINS)
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Débito Declarado DCTFWeb
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">cloud_upload</span>
          </div>
          <div className="text-3xl font-bold text-on-surface mt-2 tabular-nums">
            {formatBRL(total1223Dctf)}
          </div>
          <p
            className={`text-xs mt-3 font-medium ${
              total1223Delta === 0 ? 'text-emerald-700' : 'text-error'
            }`}
          >
            {total1223Delta === 0
              ? 'Retificadora transmitida e conciliada'
              : '! Exclusão ICMS não abatida no e-CAC'}
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Risco de Malha Fiscal RFB
            </span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">shield</span>
          </div>
          <div
            className={`text-2xl font-bold mt-2 ${
              isRectified ? 'text-emerald-700' : 'text-tertiary'
            }`}
          >
            {isRectified ? 'Baixo / Controlado' : 'Médio / Corrigível'}
          </div>
          <p className="text-xs text-on-surface-variant mt-3">
            {isRectified
              ? 'Competência 12/2023 apta para PER/DCOMP'
              : 'Exige retificadora antes da PER/DCOMP'}
          </p>
        </div>
      </div>

      {/* Diagnostic Preventive Banner */}
      <div className="rounded-2xl bg-primary-fixed/35 border border-primary/20 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">auto_fix_high</span>
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-on-surface">
                Diagnóstico Preventivo &amp; Plano de Ação Recomendado
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  total1223Delta === 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-surface-container-high text-on-surface'
                }`}
              >
                {total1223Delta === 0 ? 'Concluído' : 'Crítico'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant max-w-3xl">
              Transmitir DCTFWeb Retificadora para a competência <strong>12/2023</strong> importando o arquivo de confissão retificado da EFD-Contribuições. Essa etapa é pré-requisito para validação do saldo credor na PER/DCOMP Web sem retenção em malha fiscal.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowRetificadora(true)}
          className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
          <span>Gerar Arquivo de Retificação Pré-Formatado</span>
        </button>
      </div>

      {/* 3 Tributary Comparison Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[19px]">compare_arrows</span>
            Confronto Sintético por Tributo e Código de Receita
          </h3>
          <span className="text-xs text-on-surface-variant">Competência Base: Dezembro/2023</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(() => {
            const pisRow = dctfAuditRows.find((r) => r.competency === '12/2023' && r.tributeCode === '8109');
            const cofinsRow = dctfAuditRows.find((r) => r.competency === '12/2023' && r.tributeCode === '2172');
            return (
              <>
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                      Cód. 8109
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        pisRow?.status === 'conciled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {pisRow?.status === 'conciled' ? 'Conciliado' : 'Divergente'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-on-surface">PIS Faturamento</h4>
                  <div className="space-y-1.5 text-xs bg-surface-container-low p-3 rounded-xl">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">EFD (Bloco M200):</span>
                      <span className="font-bold tabular-nums">{formatBRL(pisRow?.efdValue ?? 33210)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">DCTFWeb Declarada:</span>
                      <span className="font-bold tabular-nums">{formatBRL(pisRow?.dctfValue ?? 36525.6)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-outline-variant/30">
                      <span className="text-tertiary font-semibold">Divergência / Sobrecarga:</span>
                      <span className="font-bold text-tertiary tabular-nums">
                        {formatBRL(pisRow?.delta ?? -3315.6)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Sobrecarga de imposto confessado em DCTFWeb referente à exclusão do ICMS da base de cálculo.
                  </p>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                      Cód. 2172
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        cofinsRow?.status === 'conciled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {cofinsRow?.status === 'conciled' ? 'Conciliado' : 'Divergente'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-on-surface">COFINS Faturamento</h4>
                  <div className="space-y-1.5 text-xs bg-surface-container-low p-3 rounded-xl">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">EFD (Bloco M600):</span>
                      <span className="font-bold tabular-nums">{formatBRL(cofinsRow?.efdValue ?? 151290)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">DCTFWeb Declarada:</span>
                      <span className="font-bold tabular-nums">{formatBRL(cofinsRow?.dctfValue ?? 166394.4)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-outline-variant/30">
                      <span className="text-tertiary font-semibold">Divergência / Sobrecarga:</span>
                      <span className="font-bold text-tertiary tabular-nums">
                        {formatBRL(cofinsRow?.delta ?? -15104.4)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Crédito de ICMS excluído na apuração da EFD mas ainda presente na confissão transmitida via DCTFWeb.
                  </p>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                      Cód. 2985
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      Conciliado
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-on-surface">CPRB / Previdenciário</h4>
                  <div className="space-y-1.5 text-xs bg-surface-container-low p-3 rounded-xl">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">EFD-Reinf (R-2060):</span>
                      <span className="font-bold tabular-nums">R$ 85.000,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">DCTFWeb Declarada:</span>
                      <span className="font-bold tabular-nums">R$ 85.000,00</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-outline-variant/30">
                      <span className="text-primary font-semibold">Divergência Apurada:</span>
                      <span className="font-bold text-primary tabular-nums">R$ 0,00</span>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Perfeita conformidade entre eventos de fechamento da EFD-Reinf e débitos previdenciários homologados.
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Analytical Matrix Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-on-surface">
              Matriz Analítica de Inconsistências por Registro
            </h3>
            <p className="text-xs text-on-surface-variant">
              Rastreabilidade detalhada dos blocos da EFD com reflexo na DCTFWeb e impactos no PER/DCOMP Web
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl text-xs">
            {[
              { id: 'all', label: `Todos (${dctfAuditRows.length})` },
              { id: 'divergent', label: `Divergentes (${divergentCount})` },
              { id: 'conciled', label: `Conciliados (${conciledCount})` },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilterTab(t.id as typeof filterTab)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  filterTab === t.id
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3 px-4">Competência</th>
                <th className="py-3 px-4">Tributo / Código</th>
                <th className="py-3 px-4 text-right">Valor EFD</th>
                <th className="py-3 px-4 text-right">Valor DCTFWeb</th>
                <th className="py-3 px-4 text-right">Delta</th>
                <th className="py-3 px-4">Origem da Divergência</th>
                <th className="py-3 px-4 text-right">Impacto PER/DCOMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-xs text-on-surface">
              {visibleRows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold font-mono">{row.competency}</td>
                  <td className="py-3.5 px-4 font-semibold flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        row.status === 'conciled' ? 'bg-primary' : 'bg-tertiary'
                      }`}
                    />
                    {row.tribute}
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums">{formatBRL(row.efdValue)}</td>
                  <td className="py-3.5 px-4 text-right tabular-nums">{formatBRL(row.dctfValue)}</td>
                  <td
                    className={`py-3.5 px-4 text-right font-bold tabular-nums ${
                      row.delta === 0 ? 'text-primary' : 'text-tertiary'
                    }`}
                  >
                    {formatBRL(row.delta)}
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{row.origin}</td>
                  <td className="py-3.5 px-4 text-right">
                    {row.status === 'divergent' ? (
                      <button
                        type="button"
                        onClick={() => setShowRetificadora(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-semibold text-[11px] hover:bg-error/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">block</span>
                        {row.impact}
                      </button>
                    ) : row.status === 'alert' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-semibold text-[11px]">
                        <span className="material-symbols-outlined text-[13px]">warning</span>
                        {row.impact}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold text-[11px]">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        {row.impact}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Validation & Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
            Assinatura Digital &amp; Validação Pericial
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Algoritmo de auditoria v4.12 executado com sucesso sobre a base da Receita Federal do Brasil (e-CAC / SPED). Confronto realizado em conformidade com as Instruções Normativas RFB nº 2005/2021 e nº 2055/2021.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-outline-variant/30 text-xs">
            <div>
              <span className="block text-[10px] font-bold uppercase text-outline">
                Hash Criptográfico SHA-256
              </span>
              <span className="font-mono text-on-surface">9f8a8c1e4d3b2a7f...b2a10</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-outline">
                Timestamp do Processamento
              </span>
              <span className="font-semibold text-on-surface">18/05/2024 às 14:38:22 BRT</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-outline">
                Auditor Responsável
              </span>
              <span className="font-semibold text-on-surface">Motor Vértice &amp; Dr. Carlos V.</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between">
            <span className="text-sm font-bold text-on-surface">Índice de Retenção RFB</span>
            <span className="material-symbols-outlined text-primary text-[18px]">pie_chart</span>
          </div>
          <div className="relative w-24 h-24 my-2 flex items-center justify-center">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
              <circle
                className="stroke-surface-container"
                cx="18"
                cy="18"
                fill="none"
                r="15"
                strokeWidth="3.5"
              />
              <circle
                className="stroke-primary"
                cx="18"
                cy="18"
                fill="none"
                r="15"
                strokeDasharray="94.8 100"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <div className="absolute text-center">
              <span className="block text-base font-bold text-on-surface tabular-nums">94.8%</span>
              <span className="block text-[9px] font-bold uppercase text-outline">Seguro</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" /> Conciliado (94.8%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary" /> Delta (5.2%)
            </span>
          </div>
        </div>
      </div>

      {showRetificadora && <DctfRetificadoraModal onClose={() => setShowRetificadora(false)} />}
    </div>
  );
};
