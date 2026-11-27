import React, { useMemo, useState } from 'react';
import { SafeImage } from '../components/SafeImage';
import { useCrm } from '../context/CrmContext';
import { ASSETS } from '../data/assets';
import { formatBRL } from '../utils/export';

export const ConciliacaoBancaria: React.FC = () => {
  const {
    bankStatements,
    reconcileBankRow,
    restitutionRows,
    aiMatches,
    applyAiConciliation,
    dismissAiMatch,
    automationRules,
    toggleAutomationRule,
    showToast,
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'extrato' | 'restituicoes' | 'regras'>('extrato');
  const [accountFilter, setAccountFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filteredStatements = useMemo(() => {
    return bankStatements.filter((row) => {
      if (accountFilter !== 'Todas' && !row.bankAccount.includes(accountFilter)) return false;
      if (statusFilter !== 'Todos' && row.status !== statusFilter) return false;
      return true;
    });
  }, [bankStatements, accountFilter, statusFilter]);

  const cashflowBars = [
    { label: 'Sem 1', credit: 78, debit: 24 },
    { label: 'Sem 2', credit: 92, debit: 31 },
    { label: 'Sem 3', credit: 65, debit: 19 },
    { label: 'Sem 4', credit: 88, debit: 27 },
  ];

  return (
    <div className="space-y-5">
      {/* 5 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-[11px] font-semibold text-on-surface-variant">Saldo Bancário OFX</span>
          <p className="text-xl font-extrabold text-on-surface tabular-nums mt-1">
            R$ 4.290.150,00
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-[11px] font-semibold text-on-surface-variant">Saldo Razão Sistema</span>
          <p className="text-xl font-extrabold text-primary tabular-nums mt-1">
            R$ 4.286.350,00
          </p>
        </div>
        <div className="bg-error-container/40 rounded-2xl border border-error/30 p-4">
          <span className="text-[11px] font-bold text-error">Divergência Detectada</span>
          <p className="text-xl font-extrabold text-error tabular-nums mt-1">R$ 3.800,00</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-[11px] font-semibold text-on-surface-variant">
            Restituições Previstas
          </span>
          <p className="text-xl font-extrabold text-on-surface tabular-nums mt-1">
            R$ 480.000,00
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4">
          <span className="text-[11px] font-semibold text-on-surface-variant">Índice Conciliado</span>
          <p className="text-xl font-extrabold text-emerald-600 tabular-nums mt-1">98,4%</p>
        </div>
      </div>

      {/* Filters + Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left 8 Cols: Tabs & Table + Cashflow */}
        <div className="xl:col-span-8 space-y-5">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
            {/* Tabs & Filters */}
            <div className="p-4 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('extrato')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 ${
                    activeTab === 'extrato'
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  Extrato Bancário vs Sistema
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('restituicoes')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 ${
                    activeTab === 'restituicoes'
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  Restituições &amp; PER/DCOMP
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('regras')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 ${
                    activeTab === 'regras'
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  Regras de Automação ({automationRules.length})
                </button>
              </div>

              {activeTab === 'extrato' && (
                <div className="flex items-center gap-2">
                  <select
                    value={accountFilter}
                    onChange={(e) => setAccountFilter(e.target.value)}
                    className="h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-xs"
                  >
                    <option value="Todas">Todas as Contas</option>
                    <option value="Itaú">Itaú Empresas</option>
                    <option value="Banco do Brasil">Banco do Brasil</option>
                    <option value="Santander">Santander Corporate</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-xs"
                  >
                    <option value="Todos">Todos Status</option>
                    <option value="Conciliado">Conciliado</option>
                    <option value="Divergente">Divergente</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </div>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'extrato' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-bold uppercase text-on-surface-variant">
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4">Histórico Bancário / Conta</th>
                      <th className="py-3 px-4">Vínculo Sistema</th>
                      <th className="py-3 px-4 text-right">Valor</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30 text-xs">
                    {filteredStatements.map((row) => (
                      <tr key={row.id} className="hover:bg-surface-container-low/50">
                        <td className="py-3 px-4 tabular-nums text-on-surface-variant">{row.date}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-on-surface">{row.description}</p>
                          <p className="text-[11px] text-on-surface-variant">{row.bankAccount}</p>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-primary">
                          {row.systemRef}
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-extrabold tabular-nums ${
                            row.type === 'Crédito' ? 'text-emerald-700' : 'text-error'
                          }`}
                        >
                          {row.type === 'Crédito' ? '+' : '-'}
                          {formatBRL(row.amount)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              row.status === 'Conciliado'
                                ? 'bg-emerald-50 text-emerald-700'
                                : row.status === 'Divergente'
                                ? 'bg-error-container text-error'
                                : 'bg-tertiary-fixed text-tertiary'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {row.status !== 'Conciliado' ? (
                            <button
                              type="button"
                              onClick={() => reconcileBankRow(row.id)}
                              className="px-2.5 py-1 rounded-lg bg-primary text-white font-bold text-[11px] hover:bg-primary-container"
                            >
                              {row.status === 'Divergente' ? 'Criar Lançamento' : 'Confirmar Match'}
                            </button>
                          ) : (
                            <span className="text-[11px] font-semibold text-outline">OK</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'restituicoes' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-bold uppercase text-on-surface-variant">
                      <th className="py-3 px-4">PER/DCOMP</th>
                      <th className="py-3 px-4">Tributo</th>
                      <th className="py-3 px-4">Previsão / Crédito</th>
                      <th className="py-3 px-4 text-right">Esperado</th>
                      <th className="py-3 px-4 text-right">Liquidado</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30 text-xs">
                    {restitutionRows.map((r) => (
                      <tr key={r.id} className="hover:bg-surface-container-low/50">
                        <td className="py-3 px-4 font-mono font-bold text-primary">{r.perdcomp}</td>
                        <td className="py-3 px-4 font-semibold text-on-surface">{r.tribute}</td>
                        <td className="py-3 px-4 text-on-surface-variant">{r.bankDate}</td>
                        <td className="py-3 px-4 text-right tabular-nums">
                          {formatBRL(r.expectedAmount)}
                        </td>
                        <td className="py-3 px-4 text-right font-extrabold text-emerald-700 tabular-nums">
                          {formatBRL(r.creditedAmount)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              r.status === 'Liquidado'
                                ? 'bg-emerald-50 text-emerald-700'
                                : r.status === 'Parcial'
                                ? 'bg-primary-fixed text-primary'
                                : 'bg-tertiary-fixed text-tertiary'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'regras' && (
              <div className="divide-y divide-outline-variant/30">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-extrabold text-on-surface">{rule.name}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        Condição: {rule.condition} &rarr; <strong>{rule.targetAccount}</strong>
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-primary">
                        {rule.matchesCount} conciliações automáticas em Outubro
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleAutomationRule(rule.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        rule.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {rule.active ? 'Ativa' : 'Pausada'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cashflow + Origin Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-3">
              <h3 className="text-sm font-extrabold text-on-surface">Fluxo de Caixa Outubro</h3>
              <div className="grid grid-cols-4 gap-3 items-end h-32 pt-2">
                {cashflowBars.map((bar) => (
                  <div key={bar.label} className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="flex items-end gap-1 h-24">
                      <div
                        className="w-3.5 bg-primary rounded-t"
                        style={{ height: `${bar.credit}%` }}
                        title="Entradas"
                      />
                      <div
                        className="w-3.5 bg-tertiary/70 rounded-t"
                        style={{ height: `${bar.debit}%` }}
                        title="Saídas"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-on-surface-variant">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-3">
              <h3 className="text-sm font-extrabold text-on-surface">Origem dos Créditos Bancários</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Restituições RFB (PER/DCOMP)</span>
                    <span className="tabular-nums text-primary">68%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Honorários de Êxito Contábil</span>
                    <span className="tabular-nums text-secondary">24%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Reembolsos &amp; Taxas ICP</span>
                    <span className="tabular-nums text-tertiary">8%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-tertiary rounded-full" style={{ width: '8%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: AI Match Engine + Treasury Governance */}
        <div className="xl:col-span-4 space-y-5">
          <div className="bg-surface-container-lowest rounded-2xl border border-primary/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <h3 className="text-sm font-extrabold text-on-surface">Motor de Match IA</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-primary text-[10px] font-bold">
                {aiMatches.length} sugestões
              </span>
            </div>

            {aiMatches.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold text-center">
                Todas as sugestões de conciliação IA foram processadas.
              </div>
            ) : (
              <div className="space-y-3">
                {aiMatches.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold tabular-nums">
                        {m.confidence}% confiança
                      </span>
                      <span className="text-sm font-extrabold text-primary tabular-nums">
                        {formatBRL(m.amount)}
                      </span>
                    </div>
                    <div className="text-[11px] space-y-0.5">
                      <p className="font-bold text-on-surface">{m.bankDesc}</p>
                      <p className="text-on-surface-variant">&rarr; {m.systemDesc}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => applyAiConciliation(m.id)}
                        className="flex-1 h-8 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary-container"
                      >
                        Aplicar Conciliação
                      </button>
                      <button
                        type="button"
                        onClick={() => dismissAiMatch(m.id)}
                        className="h-8 px-2.5 rounded-lg border border-outline-variant bg-white text-[11px] font-semibold text-on-surface-variant"
                      >
                        Ignorar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                showToast('Varredura completa executada', 'Extratos OFX conferidos com ERP Sankhya/TOTVS.')
              }
              className="w-full h-9 rounded-xl border border-primary/40 text-primary text-xs font-bold hover:bg-primary-fixed/30"
            >
              Executar Varredura Completa OFX
            </button>
          </div>

          {/* Treasury & Controller Card */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-on-surface">Gestão de Tesouraria &amp; ERP</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-surface-container-low">
                <span className="text-on-surface-variant">Vínculos ERP Ativos</span>
                <span className="font-bold text-on-surface">SANKHYA / TOTVS</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-surface-container-low">
                <span className="text-on-surface-variant">Fechamento Contábil</span>
                <span className="font-bold text-primary">Aberto até 31/10</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-surface-container-low">
                <span className="text-on-surface-variant">Auditoria SHA-256</span>
                <span className="font-mono font-bold text-emerald-700">Íntegro</span>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex items-center gap-3">
              <SafeImage
                src={ASSETS.conciliacaoMarianaVasconcelos}
                alt="Dra. Mariana Vasconcelos"
                fallbackName="Mariana Vasconcelos"
                className="w-10 h-10 rounded-full object-cover"
                fallbackClassName="w-10 h-10 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0"
              />
              <div>
                <p className="text-xs font-extrabold text-on-surface">Dra. Mariana Vasconcelos</p>
                <p className="text-[11px] text-on-surface-variant">
                  Diretora de Tesouraria &amp; Compliance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
