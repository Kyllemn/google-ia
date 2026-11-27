import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { downloadTextFile } from '../utils/export';

interface DctfRetificadoraModalProps {
  onClose: () => void;
}

export const DctfRetificadoraModal: React.FC<DctfRetificadoraModalProps> = ({ onClose }) => {
  const { rectifyDctfAudit, showToast } = useCrm();
  const [confirmed, setConfirmed] = useState(true);
  const [step, setStep] = useState<2 | 3>(2);

  const handleDownloadXml = () => {
    downloadTextFile(
      'DCTFWeb_Retificadora_12_2023_Ramos.xml',
      `<DCTFWebRetificadora competencia="2023-12" cnpj="14892411000192"><Tributo codigo="8109" original="36525.60" retificado="33210.00"/><Tributo codigo="2172" original="166394.40" retificado="151290.00"/><TotalRetificado>184500.00</TotalRetificado></DCTFWebRetificadora>`,
      'application/xml;charset=utf-8'
    );
    showToast('XML Retificador baixado');
  };

  const handleTransmit = () => {
    if (!confirmed) return;
    setStep(3);
    rectifyDctfAudit();
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low flex items-start justify-between gap-4 border-b border-outline-variant/30">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-on-surface">
                Transmissão DCTFWeb Retificadora — Competência 12/2023
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Arquivo Pré-Formatado EFD-Contribuições
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Indústria Metalúrgica Ramos Ltda • CNPJ 14.892.411/0001-92
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* 3-Step Stepper */}
        <div className="px-6 py-4 bg-white border-b border-outline-variant/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-primary-fixed/50">
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-bold uppercase text-primary">Etapa 1</span>
                <span className="block text-xs font-bold text-on-surface truncate">
                  1. Conferência de Débitos
                </span>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 p-2.5 rounded-xl ${
                step === 2
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-primary-fixed/50 text-on-surface'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step === 2 ? 'bg-white text-primary' : 'bg-primary text-white'
                }`}
              >
                {step === 3 ? <span className="material-symbols-outlined text-[16px]">check</span> : '2'}
              </div>
              <div className="min-w-0">
                <span
                  className={`block text-[10px] font-bold uppercase ${
                    step === 2 ? 'text-primary-fixed' : 'text-primary'
                  }`}
                >
                  {step === 2 ? 'Em andamento' : 'Concluída'}
                </span>
                <span className="block text-xs font-bold truncate">2. Assinatura e-CNPJ A1</span>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 p-2.5 rounded-xl ${
                step === 3 ? 'bg-emerald-600 text-white' : 'bg-surface-container-low'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step === 3 ? 'bg-white text-emerald-700' : 'bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                3
              </div>
              <div className="min-w-0">
                <span
                  className={`block text-[10px] font-bold uppercase ${
                    step === 3 ? 'text-emerald-100' : 'text-on-surface-variant'
                  }`}
                >
                  {step === 3 ? 'Protocolado' : 'Aguardando'}
                </span>
                <span className="block text-xs font-bold truncate">3. Protocolo e-CAC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-on-surface">
                Comparativo de Débitos: Original vs. Retificado
              </h4>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                100% conciliado com EFD
              </span>
            </div>

            <div className="rounded-xl bg-surface-container-low overflow-hidden border border-outline-variant/30">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant text-[11px] font-bold uppercase">
                    <th className="py-2.5 px-4">Tributo / Código Receita</th>
                    <th className="py-2.5 px-4 text-right">Original</th>
                    <th className="py-2.5 px-4 text-right">Retificado</th>
                    <th className="py-2.5 px-4 text-right">Diferença</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-on-surface divide-y divide-outline-variant/20">
                  <tr className="bg-white">
                    <td className="py-3 px-4">
                      <div className="font-bold">PIS Faturamento</div>
                      <div className="text-on-surface-variant">Cód. 8109</div>
                    </td>
                    <td className="py-3 px-4 text-right text-on-surface-variant tabular-nums">
                      R$ 36.525,60
                    </td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums">R$ 33.210,00</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-semibold tabular-nums">
                        Redução de -R$ 3.315,60
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4">
                      <div className="font-bold">COFINS Faturamento</div>
                      <div className="text-on-surface-variant">Cód. 2172</div>
                    </td>
                    <td className="py-3 px-4 text-right text-on-surface-variant tabular-nums">
                      R$ 166.394,40
                    </td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums">R$ 151.290,00</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-semibold tabular-nums">
                        Redução de -R$ 15.104,40
                      </span>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-primary-fixed/40">
                    <td colSpan={2} className="py-3 px-4 text-xs font-bold text-on-surface">
                      Total de Débitos Retificados
                    </td>
                    <td className="py-3 px-4 text-right text-base font-bold text-primary tabular-nums">
                      R$ 184.500,00
                    </td>
                    <td className="py-3 px-4 text-right text-xs font-semibold text-on-primary-fixed-variant">
                      100% conciliado com EFD
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Digital Signature Panel */}
          <div className="p-5 rounded-xl bg-surface-container-low space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">verified_user</span>
                </div>
                <div>
                  <span className="block text-sm font-bold text-on-surface">Assinatura Digital</span>
                  <span className="block text-xs text-on-surface-variant">
                    Certificado selecionado para transmissão ao e-CAC
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white text-primary text-xs font-bold shadow-xs">
                Ativo • ICP-Brasil
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white">
                <span className="block text-[10px] font-bold uppercase text-on-surface-variant">
                  Certificado Digital
                </span>
                <span className="font-semibold text-on-surface">
                  e-CNPJ A1 Certisign (Válido até 18/11/2025)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white">
                <span className="block text-[10px] font-bold uppercase text-on-surface-variant">
                  Hash SHA-256 do Lote
                </span>
                <span className="font-mono text-on-surface block truncate">
                  8f4e2a9c1b7d3e6f0a5c8b2d4e7f9a1c3b5d7e9f0a2c4e6b8d0f1a3c5e7b9d2a
                </span>
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-on-surface">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-primary cursor-pointer shrink-0"
              />
              <span>
                Declaro, sob minha responsabilidade técnica, que os valores retificados de PIS (Cód. 8109) e COFINS (Cód. 2172) conferem integralmente com a escrituração EFD-Contribuições da competência 12/2023.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDownloadXml}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white border border-outline-variant/50 text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>Baixar XML Retificador</span>
          </button>
          <button
            type="button"
            disabled={!confirmed}
            onClick={handleTransmit}
            className="inline-flex items-center gap-2 h-9 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[17px]">send</span>
            <span>Assinar e Transmitir para e-CAC</span>
          </button>
        </div>
      </div>
    </div>
  );
};
