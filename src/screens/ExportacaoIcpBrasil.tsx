import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { copyToClipboard, downloadTextFile } from '../utils/export';

const DOC_SHA256 = '4f88e1bc990172e0b52cf3981a288921e25e982189d90a0fbb82';

export const ExportacaoIcpBrasil: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { showToast, setActiveRoute } = useCrm();

  const [includeLaudo, setIncludeLaudo] = useState(true);
  const [includeMemoria, setIncludeMemoria] = useState(true);
  const [includeSpedLogs, setIncludeSpedLogs] = useState(true);
  const [certType, setCertType] = useState<'a1a3' | 'cloud'>('a1a3');
  const [timestamping, setTimestamping] = useState(true);

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [signingProgress, setSigningProgress] = useState(0);
  const [signed, setSigned] = useState(false);

  const handleCopyHash = async () => {
    const ok = await copyToClipboard(DOC_SHA256);
    if (ok) showToast('Hash SHA-256 copiado', DOC_SHA256, 'info');
  };

  const handleSignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim().length < 4) {
      setPinError('Digite um PIN válido com no mínimo 4 caracteres.');
      return;
    }
    setPinError('');
    setSigningProgress(25);
    const t1 = setTimeout(() => setSigningProgress(65), 300);
    const t2 = setTimeout(() => {
      setSigningProgress(100);
      setSigned(true);
      setPinModalOpen(false);
      setPin('');
      showToast(
        'Documento assinado via ICP-Brasil',
        'PAdES-LTV e carimbo do tempo ON/BR aplicados com sucesso.'
      );
    }, 750);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  };

  const handleDownloadPackage = () => {
    downloadTextFile(
      'dossie-icp-brasil-ramos-tema69.txt',
      `DOSSIÊ PERICIAL ASSINADO DIGITALMENTE (ICP-BRASIL PAdES-LTV)\n` +
        `Contribuinte: Indústria Metalúrgica Ramos Ltda. (12.482.910/0001-44)\n` +
        `Crédito Total Apurado (60M): R$ 1.240.080,00\n` +
        `Perito Responsável: Carlos Eduardo Silveira (CRC/SP 1SP298.411/O-4 • CNPC 4.819)\n` +
        `Documentos: ${[
          includeLaudo && 'Laudo Técnico PDF/A-1b',
          includeMemoria && 'Memória de Cálculo 60M',
          includeSpedLogs && 'Logs de Auditoria SPED',
        ]
          .filter(Boolean)
          .join(', ')}\n` +
        `Carimbo do Tempo: ${timestamping ? 'ACT Observatório Nacional (ON/BR)' : 'Desabilitado'}\n` +
        `SHA-256: ${DOC_SHA256}\n` +
        `Status da Assinatura: ${signed ? 'ASSINADO DIGITALMENTE' : 'PRÉVIA NÃO ASSINADA'}\n`
    );
    showToast('Dossiê baixado', 'Arquivo consolidado salvo no seu dispositivo.');
  };

  return (
    <div className="space-y-5">
      {/* Top Breadcrumb Bar */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="h-9 px-3 rounded-xl bg-surface-container-low text-xs font-bold text-on-surface hover:bg-surface-container flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[17px]">arrow_back</span>
            <span>Voltar ao Laudo</span>
          </button>
          <div>
            <h2 className="text-sm font-extrabold text-on-surface">
              Exportação &amp; Assinatura Digital ICP-Brasil (PAdES-LTV)
            </h2>
            <p className="text-[11px] text-on-surface-variant">
              Padrão PDF/A-1b para protocolo na Receita Federal (e-CAC / PER/DCOMP Web)
            </p>
          </div>
        </div>

        <a
          href="https://validar.iti.gov.br"
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 px-3.5 rounded-xl border border-primary/40 text-primary text-xs font-bold hover:bg-primary-fixed/30 flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>Validar no Portal ITI (GOV.BR)</span>
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
        </a>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: PDF/A-1b Document Preview */}
        <div className="xl:col-span-7 bg-surface-container-low rounded-2xl border border-outline-variant/50 p-5 sm:p-8 flex justify-center">
          <div className="relative bg-white rounded-xl border border-outline-variant/60 shadow-lg max-w-xl w-full p-6 sm:p-8 space-y-5 overflow-hidden">
            {/* Watermark */}
            <div
              className="pointer-events-none select-none absolute inset-0 flex items-center justify-center -rotate-30 opacity-[0.04]"
              aria-hidden="true"
            >
              <span className="text-5xl font-black tracking-widest text-primary">ICP-BRASIL</span>
            </div>

            {/* Document Crest Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-outline-variant/40 relative">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 40 40" className="w-10 h-10 text-primary shrink-0" aria-hidden="true">
                  <rect width="40" height="40" rx="10" fill="#dbe1ff" />
                  <path
                    d="M20 8L30 12.5V20C30 26.2 25.7 31.6 20 33C14.3 31.6 10 26.2 10 20V12.5L20 8Z"
                    fill="#004ac6"
                  />
                  <path
                    d="M16.5 20.5L19 23L24.5 17.5"
                    stroke="#ffffff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <div>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-primary">
                    Laudo Técnico Contábil • PDF/A-1b
                  </span>
                  <h3 className="text-sm font-extrabold text-on-surface">
                    Exclusão do ICMS da Base de Cálculo PIS/COFINS
                  </h3>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold shrink-0 ${
                  signed ? 'bg-emerald-100 text-emerald-800' : 'bg-tertiary-fixed text-tertiary'
                }`}
              >
                {signed ? 'ASSINADO PAdES' : 'AGUARDANDO PIN'}
              </span>
            </div>

            {/* Perito & Empresa Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative text-xs">
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <span className="block text-[10px] font-bold uppercase text-outline">Contribuinte</span>
                <p className="font-extrabold text-on-surface mt-0.5">
                  Indústria Metalúrgica Ramos Ltda.
                </p>
                <p className="font-mono text-[11px] text-on-surface-variant">12.482.910/0001-44</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <span className="block text-[10px] font-bold uppercase text-outline">
                  Perito Responsável
                </span>
                <p className="font-extrabold text-on-surface mt-0.5">Carlos Eduardo Silveira</p>
                <p className="text-[11px] text-on-surface-variant">
                  CRC/SP 1SP298.411/O-4 • CNPC 4.819
                </p>
              </div>
            </div>

            {/* Credit Summary + Sparkline */}
            <div className="p-4 rounded-xl bg-primary-fixed/25 border border-primary/30 flex items-center justify-between gap-4 relative">
              <div>
                <span className="block text-[10px] font-bold uppercase text-primary">
                  Total Crédito Atualizado (60M)
                </span>
                <span className="text-2xl font-extrabold text-primary tabular-nums">
                  R$ 1.240.080,00
                </span>
                <span className="block text-[11px] text-on-surface-variant">
                  Principal R$ 984.320,00 + SELIC R$ 255.760,00
                </span>
              </div>
              <svg viewBox="0 0 90 36" className="w-20 h-9 shrink-0" aria-hidden="true">
                <polyline
                  fill="none"
                  stroke="#004ac6"
                  strokeWidth="2.5"
                  points="2,30 18,25 34,26 52,15 70,11 88,5"
                />
              </svg>
            </div>

            {/* PAdES Seal + QR */}
            <div className="p-3.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest flex items-center justify-between gap-4 relative">
              <div className="space-y-1 text-[11px]">
                <p className="font-extrabold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">
                    lock
                  </span>
                  <span>Selo Criptográfico ICP-Brasil (PAdES-LTV)</span>
                </p>
                <p className="font-mono text-[10px] text-on-surface-variant break-all">
                  SHA-256: {DOC_SHA256}
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  {signed
                    ? 'Assinado por CARLOS EDUARDO SILVEIRA (e-CPF A3) • Carimbo ON/BR'
                    : 'Pronto para assinatura com certificado e-CPF ou e-CNPJ'}
                </p>
              </div>
              {/* Deterministic QR SVG */}
              <svg viewBox="0 0 36 36" className="w-12 h-12 shrink-0 border border-outline-variant/40 rounded p-0.5" aria-hidden="true">
                <rect x="2" y="2" width="10" height="10" fill="#0b1c30" />
                <rect x="4" y="4" width="6" height="6" fill="#ffffff" />
                <rect x="5" y="5" width="4" height="4" fill="#0b1c30" />
                <rect x="24" y="2" width="10" height="10" fill="#0b1c30" />
                <rect x="26" y="4" width="6" height="6" fill="#ffffff" />
                <rect x="27" y="5" width="4" height="4" fill="#0b1c30" />
                <rect x="2" y="24" width="10" height="10" fill="#0b1c30" />
                <rect x="4" y="26" width="6" height="6" fill="#ffffff" />
                <rect x="5" y="27" width="4" height="4" fill="#0b1c30" />
                <rect x="15" y="15" width="6" height="6" fill="#004ac6" />
                <rect x="24" y="16" width="4" height="4" fill="#0b1c30" />
                <rect x="16" y="26" width="8" height="4" fill="#0b1c30" />
                <rect x="27" y="25" width="6" height="6" fill="#0b1c30" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right: 3-Step Signing Wizard */}
        <div className="xl:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 sm:p-6 space-y-5">
          {/* Step 1 */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
              1. Composição do Dossiê Técnico
            </span>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-low cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLaudo}
                  onChange={(e) => setIncludeLaudo(e.target.checked)}
                />
                <span className="font-semibold">Laudo Pericial Completo (PDF/A-1b)</span>
              </label>
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-low cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMemoria}
                  onChange={(e) => setIncludeMemoria(e.target.checked)}
                />
                <span className="font-semibold">Memória de Cálculo 60 Competências + SELIC</span>
              </label>
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-low cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSpedLogs}
                  onChange={(e) => setIncludeSpedLogs(e.target.checked)}
                />
                <span className="font-semibold">Logs de Integridade SPED / XML</span>
              </label>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
              2. Certificado Digital (e-CPF / e-CNPJ)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setCertType('a1a3')}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  certType === 'a1a3'
                    ? 'border-primary bg-primary-fixed/25'
                    : 'border-outline-variant/50 bg-surface-container-low/50'
                }`}
              >
                <p className="font-extrabold text-on-surface">Token A3 / Arquivo A1</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Assinatura local via WebPKI
                </p>
              </button>
              <button
                type="button"
                onClick={() => setCertType('cloud')}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  certType === 'cloud'
                    ? 'border-primary bg-primary-fixed/25'
                    : 'border-outline-variant/50 bg-surface-container-low/50'
                }`}
              >
                <p className="font-extrabold text-on-surface">Nuvem (VIDaaS / BirdID)</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Autorização push no celular
                </p>
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
              3. Carimbo do Tempo &amp; Integridade
            </span>
            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low text-xs cursor-pointer">
              <div>
                <p className="font-bold text-on-surface">Carimbo do Tempo ACT ON/BR</p>
                <p className="text-[11px] text-on-surface-variant">
                  Sincronizado com Observatório Nacional
                </p>
              </div>
              <input
                type="checkbox"
                checked={timestamping}
                onChange={(e) => setTimestamping(e.target.checked)}
              />
            </label>

            <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="block text-[10px] font-bold uppercase text-outline">
                  Hash SHA-256 do Pacote
                </span>
                <span className="block font-mono text-[11px] text-on-surface truncate">
                  {DOC_SHA256}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyHash}
                className="p-1.5 rounded-lg bg-white border border-outline-variant/50 text-primary shrink-0"
                title="Copiar Hash"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={() => setPinModalOpen(true)}
              className="w-full h-11 rounded-xl bg-primary text-white text-xs font-extrabold hover:bg-primary-container transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">draw</span>
              <span>{signed ? 'Reassinar Dossiê com PIN' : 'Assinar Digitalmente Agora'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleDownloadPackage}
                className="h-10 rounded-xl border border-outline-variant bg-white text-xs font-bold text-on-surface hover:bg-surface-container-low flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">folder_zip</span>
                <span>Baixar Pacote</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(
                    'Cópia enviada ao cliente',
                    'Link criptografado enviado para r.vasconcelos@metalramos.com.br.'
                  );
                }}
                className="h-10 rounded-xl border border-outline-variant bg-white text-xs font-bold text-on-surface hover:bg-surface-container-low flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">mail</span>
                <span>Enviar p/ Cliente</span>
              </button>
            </div>

            {signed && (
              <button
                type="button"
                onClick={() => setActiveRoute('transmissao-perdcomp-web')}
                className="w-full h-10 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[17px]">send_and_archive</span>
                <span>Prosseguir para Transmissão PER/DCOMP Web</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PIN Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-on-surface">
                Autorização Token ICP-Brasil
              </h3>
              <button
                type="button"
                onClick={() => setPinModalOpen(false)}
                className="p-1 text-outline"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSignSubmit} className="space-y-3">
              <div>
                <label htmlFor="token-pin" className="block text-xs font-bold text-on-surface mb-1">
                  PIN do Certificado Digital (mín. 4 dígitos)
                </label>
                <input
                  id="token-pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••"
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-sm tracking-widest focus:outline-none focus:border-primary"
                />
                {pinError && <p className="text-[11px] font-semibold text-error mt-1">{pinError}</p>}
              </div>

              {signingProgress > 0 && (
                <div className="space-y-1">
                  <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${signingProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-primary font-semibold">
                    Aplicando assinatura PAdES-LTV ({signingProgress}%)...
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPinModalOpen(false)}
                  className="h-9 px-4 rounded-xl border border-outline-variant text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-primary text-white text-xs font-bold"
                >
                  Confirmar Assinatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
