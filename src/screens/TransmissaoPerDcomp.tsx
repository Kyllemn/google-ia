import React, { useMemo, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { downloadTextFile, formatBRL } from '../utils/export';

const TOTAL_CREDIT_AVAILABLE = 1240080.0;

export const TransmissaoPerDcomp: React.FC = () => {
  const { transmissions, addTransmission, dctfDebits, toggleDctfDebit, showToast } = useCrm();

  const [activeStep, setActiveStep] = useState(3);
  const [stepProgress, setStepProgress] = useState(85);
  const [xmlModalOpen, setXmlModalOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState('');

  const selectedDebitsTotal = useMemo(
    () => dctfDebits.filter((d) => d.selected).reduce((acc, d) => acc + d.amount, 0),
    [dctfDebits]
  );

  const remainingCredit = Math.max(0, TOTAL_CREDIT_AVAILABLE - selectedDebitsTotal);

  const filteredTransmissions = useMemo(() => {
    const q = historySearch.trim().toLowerCase();
    if (!q) return transmissions;
    return transmissions.filter(
      (t) =>
        t.protocol.toLowerCase().includes(q) ||
        t.company.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
    );
  }, [transmissions, historySearch]);

  const handleTransmitBatch = () => {
    if (selectedDebitsTotal <= 0) {
      showToast('Selecione ao menos um débito DCTFWeb', undefined, 'warning');
      return;
    }
    setActiveStep(4);
    setStepProgress(100);
    const num = Math.floor(10000 + Math.random() * 89999);
    const protocol = `DCOMP-2024-0${num}`;
    addTransmission({
      protocol,
      type: 'DCOMP',
      company: 'Indústria Metalúrgica Ramos Ltda.',
      competency: '10/2024',
      amount: selectedDebitsTotal,
      status: 'Transmitido',
      receiptHash: `f28c${num}a91b04e8219d`,
    });
    showToast(
      'PER/DCOMP Web Transmitido',
      `Recibo ${protocol} protocolado via mTLS na Receita Federal.`
    );
  };

  const handleDownloadReceipt = (protocol: string, hash: string, amount: number) => {
    downloadTextFile(
      `recibo-${protocol}.txt`,
      `MINISTÉRIO DA FAZENDA — RECEITA FEDERAL DO BRASIL\n` +
        `RECIBO DE ENTREGA PER/DCOMP WEB\n` +
        `Protocolo: ${protocol}\n` +
        `Contribuinte: Indústria Metalúrgica Ramos Ltda. (12.482.910/0001-44)\n` +
        `Valor Compensado: ${formatBRL(amount)}\n` +
        `Autenticação mTLS Hash: ${hash}\n`
    );
    showToast('Recibo baixado', `Comprovante ${protocol} salvo.`);
  };

  const steps = [
    { num: 1, title: 'Validação Crédito Tema 69', desc: 'Laudo assinado ICP-Brasil' },
    { num: 2, title: 'Geração XML PER/DCOMP', desc: 'Schema RFB v6.9' },
    { num: 3, title: 'Vinculação DCTFWeb', desc: 'Débitos federais selecionados' },
    { num: 4, title: 'Protocolo WebService RFB', desc: 'Recibo oficial emitido' },
  ];

  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<PERDCOMP versao="6.9">
  <Identificacao>
    <Protocolo>PRD-2024-8849102-SP</Protocolo>
    <CNPJ>12482910000144</CNPJ>
    <TipoCredito>PIS_COFINS_TEMA_69_STF</TipoCredito>
    <ValorCreditoOriginal>984320.00</ValorCreditoOriginal>
    <ValorSelic>255760.00</ValorSelic>
    <ValorTotalCredito>1240080.00</ValorTotalCredito>
  </Identificacao>
  <DebitosCompensadosTotal>${selectedDebitsTotal.toFixed(2)}</DebitosCompensadosTotal>
</PERDCOMP>`;

  return (
    <div className="space-y-5">
      {/* WebService Status + Primary CTA */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-extrabold">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            WebService RFB: Operacional (Latência 142ms)
          </span>
          <span className="text-xs font-mono text-on-surface-variant">
            Lote Ativo: <strong className="text-on-surface">PRD-2024-8849102-SP</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setXmlModalOpen(true)}
            className="h-9 px-3.5 rounded-xl border border-outline-variant bg-white text-xs font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span>Inspecionar XML DCOMP</span>
          </button>
          <button
            type="button"
            onClick={handleTransmitBatch}
            className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">send</span>
            <span>+ Nova Transmissão em Lote</span>
          </button>
        </div>
      </div>

      {/* 4-Step Real-time Stepper */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-on-surface">
            Fluxo de Transmissão Digital — PRD-2024-8849102-SP
          </h2>
          <span className="text-xs font-extrabold text-primary tabular-nums">{stepProgress}% concluído</span>
        </div>

        <div className="h-2 rounded-full bg-surface-container overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-300"
            style={{ width: `${stepProgress}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {steps.map((st) => {
            const done = st.num < activeStep || (st.num === 4 && activeStep === 4);
            const current = st.num === activeStep && activeStep < 4;
            return (
              <div
                key={st.num}
                className={`p-3.5 rounded-xl border ${
                  done
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : current
                    ? 'border-primary/50 bg-primary-fixed/25'
                    : 'border-outline-variant/40 bg-surface-container-low/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-outline">
                    Passo 0{st.num}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      done ? 'text-emerald-600' : current ? 'text-primary' : 'text-outline'
                    }`}
                  >
                    {done ? 'check_circle' : current ? 'pending' : 'radio_button_unchecked'}
                  </span>
                </div>
                <p className="text-xs font-extrabold text-on-surface mt-1">{st.title}</p>
                <p className="text-[11px] text-on-surface-variant">{st.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* DCTFWeb Debit Binding + e-CAC mTLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-on-surface">
                Vinculação de Débitos DCTFWeb para Compensação
              </h3>
              <p className="text-xs text-on-surface-variant">
                Selecione os tributos federais a abater do crédito total ({formatBRL(TOTAL_CREDIT_AVAILABLE)})
              </p>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold uppercase text-outline">
                Saldo Remanescente do Crédito
              </span>
              <span className="text-lg font-extrabold text-emerald-600 tabular-nums">
                {formatBRL(remainingCredit)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {dctfDebits.map((deb) => (
              <label
                key={deb.id}
                className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  deb.selected
                    ? 'border-primary/50 bg-primary-fixed/20'
                    : 'border-outline-variant/40 bg-surface-container-low/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={deb.selected}
                    onChange={() => toggleDctfDebit(deb.id)}
                    className="rounded border-outline-variant text-primary"
                  />
                  <div>
                    <p className="text-xs font-extrabold text-on-surface">
                      {deb.code} — {deb.tribute}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      Apuração {deb.period} • Vencimento {deb.dueDate}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-on-surface tabular-nums">
                  {formatBRL(deb.amount)}
                </span>
              </label>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs">
            <span className="font-semibold text-on-surface-variant">
              Total selecionado para esta DCOMP:
            </span>
            <span className="text-base font-extrabold text-primary tabular-nums">
              {formatBRL(selectedDebitsTotal)}
            </span>
          </div>
        </div>

        {/* e-CAC mTLS Certificate Card */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-extrabold">
                mTLS ATIVO
              </span>
              <span className="material-symbols-outlined text-primary">security</span>
            </div>
            <h3 className="text-sm font-extrabold text-on-surface">
              Procuração Eletrônica e-CAC
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Certificado e-CNPJ autenticado via canal mútuo TLS 1.3 para transmissão direta ao
              WebService SERPRO/Receita Federal.
            </p>
            <div className="p-3 rounded-xl bg-surface-container-low space-y-1">
              <span className="block text-[10px] font-bold uppercase text-outline">
                Fingerprint Certificado
              </span>
              <code className="block font-mono text-[10px] text-on-surface break-all">
                9a7b51c89f023ea99d21e847c1b489a24e12
              </code>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              showToast('Canal e-CAC verificado', 'Procuração válida até 18/11/2025 (SERPRO OK).')
            }
            className="w-full h-10 rounded-xl border border-primary/40 text-primary text-xs font-bold hover:bg-primary-fixed/30 transition-colors"
          >
            Validar Procuração e-CAC
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-extrabold text-on-surface">
            Histórico de Transmissões e Recibos
          </h3>
          <div className="relative w-64">
            <span className="material-symbols-outlined text-[17px] text-outline absolute left-3 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Buscar protocolo ou empresa..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-bold uppercase text-on-surface-variant">
                <th className="py-3 px-4">Protocolo</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Contribuinte</th>
                <th className="py-3 px-4">Competência</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-xs">
              {filteredTransmissions.map((tr) => (
                <tr key={tr.id} className="hover:bg-surface-container-low/50">
                  <td className="py-3 px-4 font-mono font-bold text-primary">{tr.protocol}</td>
                  <td className="py-3 px-4 font-bold">{tr.type}</td>
                  <td className="py-3 px-4 text-on-surface font-medium">{tr.company}</td>
                  <td className="py-3 px-4 tabular-nums text-on-surface-variant">{tr.competency}</td>
                  <td className="py-3 px-4 text-right font-extrabold tabular-nums">
                    {formatBRL(tr.amount)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        tr.status === 'Homologado'
                          ? 'bg-emerald-50 text-emerald-700'
                          : tr.status === 'Transmitido'
                          ? 'bg-primary-fixed text-primary'
                          : 'bg-tertiary-fixed text-tertiary'
                      }`}
                    >
                      {tr.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownloadReceipt(tr.protocol, tr.receiptHash, tr.amount)}
                      className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-primary-fixed text-primary text-[11px] font-semibold inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">download</span>
                      <span>Recibo</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* XML Modal */}
      {xmlModalOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-on-surface">
                Payload XML PER/DCOMP Web (v6.9)
              </h3>
              <button
                type="button"
                onClick={() => setXmlModalOpen(false)}
                className="p-1 text-outline"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-inverse-surface text-inverse-on-surface font-mono text-xs overflow-x-auto">
              {sampleXml}
            </pre>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  downloadTextFile('perdcomp-PRD-2024-8849102-SP.xml', sampleXml, 'application/xml');
                  showToast('XML baixado', 'Arquivo salvo para conferência.');
                }}
                className="h-9 px-4 rounded-xl border border-outline-variant text-xs font-semibold"
              >
                Baixar XML
              </button>
              <button
                type="button"
                onClick={() => setXmlModalOpen(false)}
                className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
