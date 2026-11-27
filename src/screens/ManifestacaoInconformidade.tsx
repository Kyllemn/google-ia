import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { downloadTextFile } from '../utils/export';

type TabKey = 'fatos' | 'direito' | 'memoria' | 'pedidos';

const INITIAL_SECTIONS: Record<TabKey, { heading: string; body: string }> = {
  fatos: {
    heading: 'I. DOS FATOS & DA INTIMAÇÃO ELETRÔNICA',
    body: `A Manifestante, Indústria Metalúrgica Ramos Ltda, transmitiu regularmente o Pedido de Ressarcimento / Declaração de Compensação (PER/DCOMP) relativo a créditos de PIS/COFINS não cumulativos apurados no 3º trimestre de 2023, totalizando R$ 1.240.080,00.

Em 24/10/2024, foi cientificada via Caixa Postal do e-CAC acerca do Despacho Decisório que homologou parcialmente o crédito, glosando a quantia de R$ 142.500,00. Diante da tempestividade da presente Manifestação de Inconformidade (prazo fatal em 28/10/2024), requer-se a reforma integral da decisão.`,
  },
  direito: {
    heading: 'II. DO DIREITO — DA IMPROCEDÊNCIA DA GLOSA PARCIAL DE PIS/COFINS',
    body: `A d. Autoridade Fiscal, ao proferir o Despacho Decisório nº 4419/2024 no âmbito do Processo Administrativo nº 10830.720194/2024-11, houve por bem glosar parcialmente o crédito pleiteado pela Manifestante no montante de R$ 142.500,00, sob a alegação de suposta divergência na exclusão do ICMS destacado nas notas fiscais de saída da base de cálculo das contribuições ao PIS e à COFINS.

Ocorre que tal entendimento contraria frontalmente a tese vinculante fixada pelo Supremo Tribunal Federal no julgamento do RE 574.706 (Tema 69 da Repercussão Geral), segundo a qual "o ICMS não compõe a base de cálculo para a incidência do PIS e da COFINS", devendo ser excluído o imposto destacado no documento fiscal, e não apenas o efetivamente recolhido.

Ademais, a própria Receita Federal do Brasil consolidou esse entendimento por meio da IN RFB nº 2.121/2022 (art. 26, XII e art. 171), reconhecendo expressamente o direito à exclusão do ICMS destacado na nota fiscal, bem como a recomposição dos créditos extemporâneos devidamente demonstrados na EFD-Contribuições retificada e no Laudo Pericial Contábil anexo.`,
  },
  memoria: {
    heading: 'III. DA MEMÓRIA DE CÁLCULO & PROVAS PERICIAIS',
    body: `Conforme demonstrado no Laudo Pericial Contábil assinado digitalmente (ICP-Brasil) e na EFD-Contribuições retificada (Recibo nº 99.4820.112-0), a apuração do crédito de R$ 142.500,00 decorre exatamente da recomposição analítica nota a nota dos documentos fiscais eletrônicos (NF-e) do período.

Todas as memórias de cálculo encontram-se conciliadas com os registros do SPED Fiscal e DCTFWeb, não subsistindo qualquer divergência material que justifique a glosa.`,
  },
  pedidos: {
    heading: 'IV. DOS PEDIDOS',
    body: `Diante do exposto, requer a Manifestante a essa d. Delegacia da Receita Federal de Julgamento (DRJ):

a) O recebimento e processamento da presente Manifestação de Inconformidade, com a consequente suspensão da exigibilidade do débito nos termos do art. 151, III, do CTN;

b) No mérito, o integral provimento para cancelar a glosa parcial de R$ 142.500,00, homologando-se integralmente as compensações declaradas no Processo nº 10830.720194/2024-11.`,
  },
};

export const ManifestacaoInconformidade: React.FC = () => {
  const { setShowManifestacao, manifestacaoProcess, showToast } = useCrm();

  const [activeTab, setActiveTab] = useState<TabKey>('direito');
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [attachments, setAttachments] = useState([
    { title: 'Procuração Eletrônica e-CAC', meta: 'Válida até 12/2025 • PDF/A' },
    { title: 'Laudo Pericial Assinado ICP-Brasil (PDF/A)', meta: 'CRC-SP 1SP284910 • 4,2 MB' },
    { title: 'EFD-Contribuições Retificada (Recibo)', meta: 'Recibo nº 99.4820.112-0 • 840 KB' },
  ]);
  const [savedTime, setSavedTime] = useState('14:32');
  const [protocolado, setProtocolado] = useState(false);

  const currentSection = sections[activeTab];
  const wordCount = currentSection.body.trim()
    ? currentSection.body.trim().split(/\s+/).length
    : 0;
  const charCount = currentSection.body.length;

  const updateBody = (nextBody: string) => {
    setSections((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], body: nextBody },
    }));
    const now = new Date();
    setSavedTime(
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    );
  };

  const insertSnippet = (snippet: string, toastTitle: string) => {
    updateBody(`${currentSection.body.trim()}\n\n${snippet}`);
    showToast(toastTitle);
  };

  const handleAddAttachment = () => {
    const nextIdx = attachments.length + 1;
    setAttachments((prev) => [
      ...prev,
      {
        title: `Memória Analítica NF-e (Anexo ${nextIdx})`,
        meta: 'Anexado agora • PDF/A • Validado',
      },
    ]);
    showToast('Documento complementar anexado ao dossiê.');
  };

  const handleGeneratePdf = () => {
    const fullText = (['fatos', 'direito', 'memoria', 'pedidos'] as TabKey[])
      .map((k) => `${sections[k].heading}\n\n${sections[k].body}`)
      .join('\n\n----------------------------------------\n\n');
    downloadTextFile(
      `manifestacao_inconformidade_${manifestacaoProcess.replace(/[^0-9]/g, '')}.txt`,
      `MANIFESTAÇÃO DE INCONFORMIDADE - PROCESSO ${manifestacaoProcess}\nCONTRIBUINTE: Indústria Metalúrgica Ramos Ltda\n\n${fullText}`
    );
    showToast('PDF/A da Peça (PAdES) gerado', 'Arquivo pronto para conferência técnica.');
  };

  const handleProtocolar = () => {
    setProtocolado(true);
    showToast(
      'Peça assinada com e-CPF e protocolada no e-CAC',
      `Recibo DRJ gerado para o processo ${manifestacaoProcess}. Exigibilidade suspensa (Art. 151, III CTN).`
    );
  };

  const tabs: { key: TabKey; num: string; label: string }[] = [
    { key: 'fatos', num: '1', label: '1. Dos Fatos & Intimação' },
    { key: 'direito', num: '2', label: '2. Do Direito (Tema 69 STF)' },
    { key: 'memoria', num: '3', label: '3. Memória de Cálculo & Provas' },
    { key: 'pedidos', num: '4', label: '4. Dos Pedidos' },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
            <button
              type="button"
              onClick={() => setShowManifestacao(false)}
              className="hover:text-primary transition-colors flex items-center gap-1 font-semibold text-primary"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Intimações &amp; Prazos e-CAC
            </button>
            <span className="material-symbols-outlined text-[15px] text-outline">chevron_right</span>
            <span className="text-on-surface font-semibold">Manifestação de Inconformidade</span>
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-surface-container-lowest shadow-xs text-xs text-on-surface-variant flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Rascunho salvo automaticamente às {savedTime}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold uppercase tracking-wider">
                Contencioso Administrativo
              </span>
              <span className="text-xs text-on-surface-variant">
                e-CAC • Delegacia da Receita Federal de Julgamento (DRJ)
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-on-surface tracking-tight">
              Manifestação de Inconformidade — Proc. {manifestacaoProcess}
            </h2>
          </div>
        </div>
      </div>

      {/* Urgency & Litigation Banner */}
      <div className="rounded-2xl bg-error-container text-on-error-container p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start lg:items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-error text-on-error flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">gavel</span>
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-on-error-container">
                Prazo Fatal: 4 dias restantes (Expira em 28/10/2024)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-error text-on-error text-[10px] font-bold uppercase">
                Prioridade Máxima
              </span>
            </div>
            <p className="text-xs text-on-error-container/90">
              Contagem em dias corridos nos termos do Art. 5º do Decreto nº 70.235/1972 (PAF). Protocolo obrigatório via e-CAC até 23h59.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 bg-white/95 text-on-surface px-5 py-3 rounded-xl shadow-xs shrink-0">
          <div>
            <span className="block text-[10px] font-bold uppercase text-on-surface-variant">
              Valor em Litígio
            </span>
            <span className="text-lg font-bold text-error tabular-nums">R$ 142.500,00</span>
          </div>
          <div className="h-8 w-px bg-outline-variant/40" />
          <div>
            <span className="block text-[10px] font-bold uppercase text-on-surface-variant">
              Contribuinte
            </span>
            <span className="block text-xs font-bold text-on-surface">
              Indústria Metalúrgica Ramos Ltda
            </span>
            <span className="block text-[11px] text-on-surface-variant font-mono">
              CNPJ 14.892.411/0001-92
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Rich Legal-Accounting Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface-container-low p-1.5 rounded-xl flex flex-wrap gap-1.5">
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 min-w-[160px] px-3 py-2.5 rounded-lg text-xs text-left flex items-center gap-2 transition-all ${
                    active
                      ? 'bg-white text-primary font-bold shadow-xs'
                      : 'text-on-surface-variant hover:bg-white/60 font-medium'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                      active
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {tab.num}
                  </span>
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-xs overflow-hidden">
            {/* Toolbar */}
            <div className="bg-surface-container-low/70 px-4 py-2.5 border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    insertSnippet(
                      'Conforme dispõe o Art. 151, inciso III, do Código Tributário Nacional (CTN), a impugnação tempestiva suspende a exigibilidade do crédito tributário.',
                      'Fundamentação CTN inserida.'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                >
                  + Art. 151 CTN
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertSnippet(
                      'Nos termos da IN RFB nº 2.121/2022, art. 26, XII, é assegurada a exclusão integral do ICMS destacado nas notas fiscais de saída.',
                      'Citação IN RFB 2.121/2022 inserida.'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                >
                  + IN 2.121/22
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    insertSnippet(
                      '"PIS/COFINS. EXCLUSÃO DO ICMS DA BASE DE CÁLCULO. TEMA 69 STF. Conforme decidido no RE 574.706, o ICMS a ser excluído da base de cálculo das contribuições é o destacado na nota fiscal." (CARF, Acórdão nº 3401-011.842)',
                      'Jurisprudência CARF inserida na peça.'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">balance</span>
                  <span>Inserir Jurisprudência CARF</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertSnippet(
                      '[Anexo Vinculado: Tabela Resumo do Laudo Pericial Contábil — Diferença ICMS Destacado: R$ 142.500,00 | 60 Competências Auditadas]',
                      'Tabela do Laudo vinculada ao texto.'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">table_chart</span>
                  <span>Vincular Tabela do Laudo</span>
                </button>
              </div>
            </div>

            {/* Editable Area */}
            <div className="p-5 space-y-3">
              <p className="text-sm font-bold text-on-surface">{currentSection.heading}</p>
              <textarea
                value={currentSection.body}
                onChange={(e) => updateBody(e.target.value)}
                rows={15}
                className="w-full rounded-xl bg-surface p-4 text-sm text-on-surface leading-relaxed border border-outline-variant/40 focus:outline-none focus:border-primary resize-y"
              />
            </div>

            <div className="bg-surface-container-low/60 px-5 py-2.5 flex items-center justify-between text-xs text-on-surface-variant border-t border-outline-variant/30">
              <span>Formatação padrão DRJ / e-CAC • Fonte Padrão PAdES</span>
              <span className="tabular-nums font-medium">
                {wordCount} palavras • {charCount} caracteres
              </span>
            </div>
          </div>
        </div>

        {/* Right: Attachments Dossier & Contest Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Mandatory Attachments */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">folder_check</span>
                <h3 className="text-sm font-bold text-on-surface">
                  Dossiê de Anexos Obrigatórios (e-CAC)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold shrink-0">
                {attachments.length}/{attachments.length} Prontos
              </span>
            </div>

            <div className="space-y-2.5">
              {attachments.map((att, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-surface-container-low"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[19px] shrink-0">
                      check_circle
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-on-surface truncate">{att.title}</p>
                      <p className="text-[11px] text-on-surface-variant">{att.meta}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold shrink-0">
                    Validado
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddAttachment}
              className="w-full py-2.5 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-primary font-semibold text-xs transition-colors"
            >
              + Anexar Documento Complementar
            </button>
          </div>

          {/* Summary of Contested Disallowance */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface">Resumo da Glosa Contestada</h3>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                analytics
              </span>
            </div>

            <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    className="stroke-surface-container-highest"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="15.915"
                    strokeWidth="3.5"
                  />
                  <circle
                    className="stroke-tertiary"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="15.915"
                    strokeDasharray="11.49 88.51"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-tertiary tabular-nums">11,49%</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-on-surface-variant">
                  Percentual Contestado
                </span>
                <span className="block text-xl font-bold text-on-surface tabular-nums">11,49%</span>
                <span className="block text-[11px] text-on-surface-variant">
                  Parcela glosada sobre o total pleiteado
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-container-low/70">
                <span className="text-on-surface-variant">Crédito Pleiteado</span>
                <span className="font-bold text-on-surface tabular-nums">R$ 1.240.080,00</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-tertiary-fixed/50">
                <span className="text-on-tertiary-fixed-variant font-medium">
                  Valor Glosado (Em Litígio)
                </span>
                <span className="font-bold text-tertiary tabular-nums">R$ 142.500,00</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-container-low/70">
                <span className="text-on-surface-variant">Crédito Homologado</span>
                <span className="font-bold text-primary tabular-nums">R$ 1.097.580,00</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGeneratePdf}
              className="w-full py-3 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/50 hover:bg-surface-container-low text-on-surface font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">picture_as_pdf</span>
              <span>Gerar PDF da Peça (PAdES)</span>
            </button>
            <button
              type="button"
              onClick={handleProtocolar}
              disabled={protocolado}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all ${
                protocolado
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary hover:bg-primary-container text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>
                {protocolado
                  ? 'Protocolado no e-CAC (Recibo Emitido)'
                  : 'Assinar com e-CPF e Protocolar no e-CAC'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
