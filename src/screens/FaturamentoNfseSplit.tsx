import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { copyToClipboard, formatBRL } from '../utils/export';

const DEFAULT_DISCRIMINACAO = `Honorários técnicos de consultoria tributária no êxito (Cláusula Quota Litis — Contrato CTR-2023-048, Parcela 1/4), referentes à apuração, habilitação e aproveitamento de créditos de PIS/COFINS decorrentes da exclusão do ICMS da base de cálculo (Tema 69 STF), homologados conforme Despacho Decisório PER/DCOMP nº 49102/2024. Crédito aproveitado: R$ 310.020,00 | Percentual de êxito: 20,0%.`;

const BARCODE_LINE = '34191.79001 01043.510047 91020.150008 8 98990005819075';

export const FaturamentoNfseSplit: React.FC = () => {
  const { setShowNfseSplit, selectedContract, markContractBilled, showToast } = useCrm();

  const [discriminacao, setDiscriminacao] = useState(DEFAULT_DISCRIMINACAO);
  const [issued, setIssued] = useState(false);

  const contractCode = selectedContract?.contractCode ?? 'CTR-2023-048';
  const company = selectedContract?.company ?? 'Indústria Metalúrgica Ramos Ltda';

  const creditoAproveitado = 310020.0;
  const percentualExito = 20.0;
  const valorBruto = 62004.0;
  const irrf = 930.06;
  const csrf = 2883.19;
  const iss = 1240.08;
  const valorLiquido = 58190.75;
  const splitVertice = 49462.14;
  const splitPerito = 8728.61;

  const handleCopyBarcode = async () => {
    const ok = await copyToClipboard(BARCODE_LINE);
    if (ok) {
      showToast('Linha digitável copiada', BARCODE_LINE);
    }
  };

  const handleEmitir = () => {
    setIssued(true);
    markContractBilled(contractCode);
  };

  return (
    <div className="space-y-6">
      {/* Header & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-on-surface-variant">
            <span>Financeiro &amp; Fiscal</span>
            <span className="material-symbols-outlined text-[15px] text-outline">chevron_right</span>
            <button
              type="button"
              onClick={() => setShowNfseSplit(false)}
              className="hover:text-primary font-medium"
            >
              Contratos &amp; Honorários no Êxito
            </button>
            <span className="material-symbols-outlined text-[15px] text-outline">chevron_right</span>
            <span className="text-primary font-semibold">Fatura #FAT-2024-089</span>
          </div>

          <h2 className="text-2xl font-bold text-on-surface tracking-tight">
            Faturamento &amp; Emissão de NFSe com Split
          </h2>

          <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {issued ? 'NFSe Emitida' : 'Apto para Emissão'}
            </span>
            <span>•</span>
            <span className="font-semibold text-on-surface font-mono">Contrato {contractCode}</span>
            <span>•</span>
            <span>{company}</span>
            <span>•</span>
            <span>Parcela 1/4</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowNfseSplit(false)}
          className="h-9 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/50 hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1.5 shadow-xs self-start sm:self-center whitespace-nowrap shrink-0"
        >
          <span className="material-symbols-outlined text-[17px]">arrow_back</span>
          <span>Voltar para Contratos</span>
        </button>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Credit Summary, Tax Composition, Service Description (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Homologated Credit Summary */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[19px]">verified</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Resumo do Crédito Homologado</h3>
                  <p className="text-xs text-on-surface-variant">Base de cálculo apurada via PER/DCOMP</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-surface-container-low text-xs font-mono font-semibold text-on-surface">
                PER/DCOMP Nº 49102/2024
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-surface-container-low space-y-1">
                <span className="block text-[10px] font-bold uppercase text-on-surface-variant">
                  Despacho Decisório
                </span>
                <span className="block text-base font-bold text-on-surface">
                  PER/DCOMP nº 49102/2024
                </span>
                <span className="block text-xs text-on-surface-variant">
                  Homologação Integral RFB
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low space-y-1">
                <span className="block text-[10px] font-bold uppercase text-on-surface-variant">
                  Crédito Aproveitado (Parcela 1/4)
                </span>
                <span className="block text-xl font-bold text-on-surface tabular-nums">
                  {formatBRL(creditoAproveitado)}
                </span>
                <span className="block text-xs text-on-surface-variant">
                  Compensação DCTFWeb Out/2024
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low space-y-1">
                <span className="block text-[10px] font-bold uppercase text-on-surface-variant">
                  Percentual de Êxito
                </span>
                <span className="block text-2xl font-bold text-primary tabular-nums">
                  {percentualExito.toFixed(1).replace('.', ',')}%
                </span>
                <span className="block text-xs text-on-surface-variant">
                  Cláusula 4ª — Quota Litis
                </span>
              </div>

              <div className="p-4 rounded-xl bg-primary text-on-primary space-y-1">
                <span className="block text-[10px] font-bold uppercase text-primary-fixed">
                  Valor Bruto da Fatura
                </span>
                <span className="block text-2xl font-bold tabular-nums">
                  {formatBRL(valorBruto)}
                </span>
                <span className="block text-xs text-primary-fixed">
                  Base para retenções federais e ISS
                </span>
              </div>
            </div>
          </div>

          {/* NFSe Tax Composition */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface-container text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[19px]">receipt</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Composição Tributária da NFSe</h3>
                  <p className="text-xs text-on-surface-variant">
                    Município de São Paulo • Regime Lucro Presumido
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                Cód. Serviço 17.19
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low">
              <span className="block text-[10px] font-bold uppercase text-on-surface-variant">
                Código de Serviço Municipal
              </span>
              <span className="text-xs font-semibold text-on-surface">
                17.19 — Consultoria e Contabilidade (Município de São Paulo)
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[11px] font-bold uppercase text-on-surface-variant">
                Retenções na Fonte
              </p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/70">
                <span className="flex items-center gap-2 font-medium text-on-surface">
                  <span className="w-2 h-2 rounded-full bg-tertiary" />
                  IRRF (1,5%)
                </span>
                <span className="font-bold text-tertiary tabular-nums">-{formatBRL(irrf)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/70">
                <span className="flex items-center gap-2 font-medium text-on-surface">
                  <span className="w-2 h-2 rounded-full bg-tertiary" />
                  CSRF / PCC (4,65%)
                </span>
                <span className="font-bold text-tertiary tabular-nums">-{formatBRL(csrf)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/70">
                <span className="flex items-center gap-2 font-medium text-on-surface">
                  <span className="w-2 h-2 rounded-full bg-outline" />
                  ISS (2,0% — Município de São Paulo)
                </span>
                <span className="font-bold text-on-surface tabular-nums">-{formatBRL(iss)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary-fixed/40 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="block text-[11px] font-bold uppercase text-on-surface">
                  Valor Líquido da NFSe
                </span>
                <span className="block text-xs text-on-surface-variant">
                  Valor a receber após retenções federais
                </span>
              </div>
              <span className="text-2xl font-bold text-primary tabular-nums">
                {formatBRL(valorLiquido)}
              </span>
            </div>
          </div>

          {/* Service Description */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[19px]">notes</span>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Discriminação dos Serviços</h3>
                  <p className="text-xs text-on-surface-variant">
                    Texto técnico que constará no corpo da NFSe
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDiscriminacao(DEFAULT_DISCRIMINACAO);
                  showToast('Texto técnico restaurado');
                }}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                <span>Restaurar padrão</span>
              </button>
            </div>

            <textarea
              value={discriminacao}
              onChange={(e) => setDiscriminacao(e.target.value)}
              rows={5}
              className="w-full rounded-xl bg-surface p-3.5 text-xs text-on-surface leading-relaxed border border-outline-variant/50 focus:outline-none focus:border-primary"
            />
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>Editável antes da transmissão à Prefeitura de São Paulo</span>
              <span className="tabular-nums">{discriminacao.length} caracteres</span>
            </div>
          </div>
        </div>

        {/* Right Column: Split, Payment Method & Emit CTAs (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Split Automático */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">call_split</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Split Automático de Recebíveis</h3>
                <p className="text-xs text-on-surface-variant">
                  Subconta Bancária • Rateio sobre {formatBRL(valorLiquido)}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-primary">Vértice Fiscal (85,0%)</span>
                <span className="text-tertiary">Perito Externo (15,0%)</span>
              </div>
              <div className="h-2.5 rounded-full bg-surface-container overflow-hidden flex">
                <div className="h-full bg-primary w-[85%]" />
                <div className="h-full bg-tertiary w-[15%]" />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-2 border-l-4 border-primary">
                <div>
                  <span className="block text-xs font-bold text-on-surface">
                    Vértice Fiscal (85,0%)
                  </span>
                  <span className="block text-[11px] text-on-surface-variant">Conta Principal</span>
                </div>
                <span className="text-sm font-bold text-on-surface tabular-nums">
                  {formatBRL(splitVertice)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-2 border-l-4 border-tertiary">
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-on-surface truncate">
                    Perito / Parecerista Externo
                  </span>
                  <span className="block text-[11px] text-on-surface-variant truncate">
                    Dr. Carlos Eduardo Silveira
                  </span>
                </div>
                <span className="text-sm font-bold text-on-surface tabular-nums shrink-0">
                  {formatBRL(splitPerito)}
                </span>
              </div>
            </div>
          </div>

          {/* Forma de Cobrança */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-surface-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">qr_code_2</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Forma de Cobrança</h3>
                <p className="text-xs text-on-surface-variant">
                  Liquidação integrada com split automático
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-primary-fixed/40 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-on-surface">
                <span className="material-symbols-outlined text-primary text-[17px]">check_circle</span>
                Boleto Registrado + Pix Dinâmico
              </div>
              <p className="text-primary font-medium mt-0.5">
                Vencimento 15/11/2024 • Valor {formatBRL(valorLiquido)}
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
              <div className="w-20 h-20 bg-white rounded-lg p-1.5 border border-outline-variant/40 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full text-on-surface">
                  <rect x="2" y="2" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <rect x="5" y="5" width="4" height="4" fill="currentColor" />
                  <rect x="24" y="2" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <rect x="27" y="5" width="4" height="4" fill="currentColor" />
                  <rect x="2" y="24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <rect x="5" y="27" width="4" height="4" fill="currentColor" />
                  <rect x="15" y="4" width="3" height="3" fill="currentColor" />
                  <rect x="16" y="10" width="4" height="4" fill="currentColor" />
                  <rect x="14" y="16" width="8" height="4" fill="currentColor" />
                  <rect x="25" y="16" width="4" height="6" fill="currentColor" />
                  <rect x="16" y="24" width="5" height="4" fill="currentColor" />
                  <rect x="24" y="25" width="8" height="8" fill="currentColor" />
                </svg>
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <span className="block text-[10px] font-bold uppercase text-on-surface-variant">
                  Linha Digitável do Boleto
                </span>
                <p className="text-[11px] font-mono text-on-surface break-all bg-white p-2 rounded-lg border border-outline-variant/30">
                  {BARCODE_LINE}
                </p>
                <button
                  type="button"
                  onClick={handleCopyBarcode}
                  className="w-full py-1.5 rounded-lg bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  <span>Copiar linha digitável</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleEmitir}
              disabled={issued}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-colors ${
                issued
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary hover:bg-primary-container text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>
                {issued
                  ? 'NFSe Emitida & Split Ativado'
                  : 'Emitir NFSe Municipal e Ativar Split'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Rascunho salvo', 'Fatura #FAT-2024-089 salva para revisão.')}
              className="w-full py-3 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/50 hover:bg-surface-container-low text-on-surface font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">save</span>
              <span>Salvar Rascunho</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
