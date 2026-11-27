import React, { useMemo, useRef, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { SpedBatch } from '../types/crm';
import { downloadCsv, formatBRL, formatIntegerBR } from '../utils/export';

export const ImportacaoSpedXml: React.FC = () => {
  const { spedBatches, addSpedBatch, setActiveRoute, showToast } = useCrm();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedCompany, setSelectedCompany] = useState('Indústria Metalúrgica Ramos Ltda.');
  const [batchFilter, setBatchFilter] = useState<'Todos' | SpedBatch['status']>('Todos');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'EFD_CONTRIB_2019_2023_RAMOS.txt',
    'SPED_FISCAL_ICMS_IPI_60M.txt',
    'XML_NFES_LOTE_COMPLETO.zip',
  ]);
  const [auditing, setAuditing] = useState(false);

  const filteredBatches = useMemo(() => {
    return spedBatches.filter((b) => (batchFilter === 'Todos' ? true : b.status === batchFilter));
  }, [spedBatches, batchFilter]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const names = Array.from(files).map((f) => f.name);
    setUploadedFiles((prev) => [...names, ...prev]);
    setAuditing(true);
    setTimeout(() => {
      setAuditing(false);
      addSpedBatch({
        batchCode: `#LOTE-2024-${Math.floor(890 + Math.random() * 99)}A`,
        company: selectedCompany,
        period: '01/2019 a 12/2023 (60M)',
        filesCount: names.length * 140,
        totalLines: 482190,
        warnings: 3,
        blocks: 0,
        creditFound: 318400,
        status: 'Validado',
      });
      showToast('Arquivos SPED/XML validados', `${names.length} arquivo(s) processado(s) sem bloqueios.`);
    }, 600);
  };

  const handleExportFindingsCsv = () => {
    downloadCsv(
      'achados-auditoria-sped-884A.csv',
      ['Categoria', 'Base Legal', 'Ocorrências', 'Crédito Apurado'],
      [
        ['Exclusão ICMS Destacado (Tema 69)', 'RE 574.706 STF', '4.120 NF-e', 'R$ 498.120,00'],
        ['Crédito Insumos Essenciais (C100/C170)', 'REsp 1.221.170 STJ', '1.840 itens', 'R$ 214.380,00'],
        ['Alíquota Zero / Monofásico Indevido', 'IN RFB 2.121/2022', '628 registros', 'R$ 130.100,00'],
      ]
    );
    showToast('Relatório CSV baixado', 'Achados fiscais do lote #LOTE-2024-884A exportados.');
  };

  const stages = [
    { name: 'Leitura Sintática SPED (C100/C170)', status: '100% OK', icon: 'check_circle' },
    { name: 'Cruzamento XML NF-e x EFD', status: '100% OK', icon: 'check_circle' },
    { name: 'Auditoria CFOP & NCM Monofásico', status: '14 Alertas', icon: 'info' },
    { name: 'Apuração Base Tema 69 STF', status: 'Validado', icon: 'verified' },
  ];

  const findings = [
    {
      title: 'Exclusão ICMS Destacado (Tema 69)',
      desc: 'Divergência entre base destacada em XML e registro M210/M610 da EFD-Contribuições.',
      amount: 498120.0,
      badge: 'Alta Liquidez',
    },
    {
      title: 'Créditos sobre Insumos Industriais',
      desc: 'Itens produtivos classificados com CST 70 recuperáveis conforme REsp 1.221.170.',
      amount: 214380.0,
      badge: 'Auditado',
    },
    {
      title: 'Tributação Monofásica / Alíquota Zero',
      desc: 'Recolhimento a maior identificado em saídas de autopeças e embalagens NCM 3923.',
      amount: 130100.0,
      badge: 'Revisado',
    },
  ];

  return (
    <div className="space-y-5">
      {/* 4 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">Documentos Processados</span>
          <p className="text-2xl font-extrabold text-on-surface tabular-nums mt-1">4.280 docs</p>
          <span className="text-[11px] text-emerald-700 font-bold">XMLs + EFDs validados</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">Integridade PVA / Schema</span>
          <p className="text-2xl font-extrabold text-primary tabular-nums mt-1">99.42%</p>
          <span className="text-[11px] text-on-surface-variant">0 erros bloqueantes</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">Volume Fiscal Auditado</span>
          <p className="text-2xl font-extrabold text-on-surface tabular-nums mt-1">R$ 14,8 M</p>
          <span className="text-[11px] text-on-surface-variant">Base de cálculo analisada</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-xs font-semibold text-on-surface-variant">Motor Paralelo Ativo</span>
          <p className="text-2xl font-extrabold text-emerald-600 tabular-nums mt-1">8 Workers</p>
          <span className="text-[11px] text-on-surface-variant">Latência média 42ms/XML</span>
        </div>
      </div>

      {/* Batch Audit Engine */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/40">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-primary-fixed text-primary font-mono text-xs font-extrabold">
              #LOTE-2024-884A
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-on-surface">
                Motor de Auditoria Fiscal em Lote
              </h2>
              <p className="text-xs text-on-surface-variant">
                Importação de SPED Fiscal, EFD-Contribuições e lotes XML NF-e / CT-e
              </p>
            </div>
          </div>

          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="h-9 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-semibold text-on-surface"
          >
            <option>Indústria Metalúrgica Ramos Ltda.</option>
            <option>Farmácias São João Distribuidora</option>
            <option>Vanguarda Logística &amp; Cargas</option>
            <option>Construtora Alvorada S.A.</option>
          </select>
        </div>

        {/* Dropzone */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.xml,.zip"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full min-h-[160px] rounded-2xl border-2 border-dashed border-primary/40 bg-primary-fixed/15 hover:bg-primary-fixed/25 transition-colors p-6 flex flex-col items-center justify-center text-center gap-2"
            >
              <span className="material-symbols-outlined text-3xl text-primary">
                {auditing ? 'hourglass_top' : 'cloud_upload'}
              </span>
              <p className="text-xs font-extrabold text-on-surface">
                {auditing
                  ? 'Processando validação sintática...'
                  : 'Clique para selecionar arquivos SPED (.txt) ou XML (.zip)'}
              </p>
              <p className="text-[11px] text-on-surface-variant">
                Suporte a blocos C100, C170, M210, M610 e XML modelo 55/57
              </p>
            </button>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {stages.map((st) => (
                <div
                  key={st.name}
                  className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">
                      {st.icon}
                    </span>
                    <span className="text-xs font-semibold text-on-surface truncate">{st.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-primary shrink-0">{st.status}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-white border border-outline-variant/40">
                <span className="block text-[10px] font-bold uppercase text-outline">Linhas Lidas</span>
                <span className="text-sm font-extrabold text-on-surface tabular-nums">1.482.930</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-outline-variant/40">
                <span className="block text-[10px] font-bold uppercase text-outline">Bloqueios</span>
                <span className="text-sm font-extrabold text-emerald-700 tabular-nums">0 Bloqueios</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-outline-variant/40">
                <span className="block text-[10px] font-bold uppercase text-outline">Advertências</span>
                <span className="text-sm font-extrabold text-tertiary tabular-nums">14 Advertências</span>
              </div>
              <div className="p-3 rounded-xl bg-primary-fixed/40 border border-primary/30">
                <span className="block text-[10px] font-bold uppercase text-primary">Crédito Lote</span>
                <span className="text-sm font-extrabold text-primary tabular-nums">R$ 842.600,00</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {uploadedFiles.slice(0, 4).map((f, i) => (
                <span
                  key={`${f}-${i}`}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-low text-[11px] font-mono text-on-surface-variant"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Findings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {findings.map((f) => (
            <div
              key={f.title}
              className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/40 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-primary text-[10px] font-bold">
                    {f.badge}
                  </span>
                  <span className="text-sm font-extrabold text-primary tabular-nums">
                    {formatBRL(f.amount)}
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-on-surface mt-2">{f.title}</h4>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleExportFindingsCsv}
            className="h-10 px-4 rounded-xl border border-outline-variant bg-white text-xs font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>Exportar Achados (CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              showToast('Lote enviado para Memória de Cálculo', 'Apuração Tema 69 STF carregada.');
              setActiveRoute('laudo-tecnico-memoria-de-calculo');
            }}
            className="h-10 px-5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">calculate</span>
            <span>Concluir Validação &amp; Enviar p/ Memória de Cálculo</span>
          </button>
        </div>
      </div>

      {/* Historical Batches Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-extrabold text-on-surface">Histórico de Lotes Auditados</h3>
          <div className="flex items-center gap-1.5">
            {(['Todos', 'Validado', 'Com Advertências'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setBatchFilter(st)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  batchFilter === st
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-bold uppercase text-on-surface-variant">
                <th className="py-3 px-4">Lote</th>
                <th className="py-3 px-4">Empresa</th>
                <th className="py-3 px-4">Período</th>
                <th className="py-3 px-4 text-right">Linhas SPED</th>
                <th className="py-3 px-4 text-right">Crédito Apurado</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-xs">
              {filteredBatches.map((b) => (
                <tr key={b.id} className="hover:bg-surface-container-low/50">
                  <td className="py-3 px-4 font-mono font-bold text-primary">{b.batchCode}</td>
                  <td className="py-3 px-4 font-bold text-on-surface">{b.company}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{b.period}</td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {formatIntegerBR(b.totalLines)}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-primary tabular-nums">
                    {formatBRL(b.creditFound)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        b.status === 'Validado'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-tertiary-fixed text-tertiary'
                      }`}
                    >
                      {b.status}
                    </span>
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
