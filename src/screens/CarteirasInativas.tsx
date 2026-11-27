import React, { useMemo, useState } from 'react';
import { SafeImage } from '../components/SafeImage';
import { useCrm } from '../context/CrmContext';
import { InactivePortfolio } from '../types/crm';
import { formatBRL } from '../utils/export';

export const CarteirasInativas: React.FC = () => {
  const { inactivePortfolios, reactivatePortfolio } = useCrm();

  const [reasonFilter, setReasonFilter] = useState<'Todos' | InactivePortfolio['reason']>('Todos');
  const [periodFilter, setPeriodFilter] = useState('Últimos 90 dias');

  const filtered = useMemo(() => {
    return inactivePortfolios.filter((p) => {
      if (reasonFilter !== 'Todos' && p.reason !== reasonFilter) return false;
      return true;
    });
  }, [inactivePortfolios, reasonFilter]);

  const reasonCounts = useMemo(() => {
    return {
      semRetorno: inactivePortfolios.filter((p) => p.reason === 'Sem retorno').length,
      pausa: inactivePortfolios.filter((p) => p.reason === 'Pausa').length,
      encerrado: inactivePortfolios.filter((p) => p.reason === 'Encerrado').length,
    };
  }, [inactivePortfolios]);

  const total = Math.max(inactivePortfolios.length, 1);
  const circ = 2 * Math.PI * 34;
  const seg1 = (reasonCounts.semRetorno / total) * circ;
  const seg2 = (reasonCounts.pausa / total) * circ;
  const seg3 = (reasonCounts.encerrado / total) * circ;

  return (
    <div className="space-y-5">
      {/* Header Summary Card with Donut */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 88 88" className="w-24 h-24 -rotate-90" aria-hidden="true">
              <circle cx="44" cy="44" r="34" fill="none" stroke="#e5eeff" strokeWidth="10" />
              <circle
                cx="44"
                cy="44"
                r="34"
                fill="none"
                stroke="#943700"
                strokeWidth="10"
                strokeDasharray={`${seg1} ${circ}`}
                strokeDashoffset={0}
              />
              <circle
                cx="44"
                cy="44"
                r="34"
                fill="none"
                stroke="#2563eb"
                strokeWidth="10"
                strokeDasharray={`${seg2} ${circ}`}
                strokeDashoffset={-seg1}
              />
              <circle
                cx="44"
                cy="44"
                r="34"
                fill="none"
                stroke="#737686"
                strokeWidth="10"
                strokeDasharray={`${seg3} ${circ}`}
                strokeDashoffset={-(seg1 + seg2)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-on-surface tabular-nums">
                {inactivePortfolios.length}
              </span>
              <span className="text-[9px] font-bold uppercase text-outline">Contas</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-base font-extrabold text-on-surface">
              Motivos de Inativação na Carteira
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                <span>Sem retorno ({reasonCounts.semRetorno})</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                <span>Pausa ({reasonCounts.pausa})</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-outline" />
                <span>Encerrado ({reasonCounts.encerrado})</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['Todos', 'Sem retorno', 'Pausa', 'Encerrado'] as const).map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => setReasonFilter(reason)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                reasonFilter === reason
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {reason}
            </button>
          ))}
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="h-8 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-medium text-on-surface"
          >
            <option>Últimos 90 dias</option>
            <option>Este Semestre</option>
            <option>Ano 2024</option>
          </select>
        </div>
      </div>

      {/* Cards / Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-emerald-600 mb-2">
            task_alt
          </span>
          <h3 className="text-base font-extrabold text-on-surface">
            Nenhuma carteira inativa neste filtro
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Todas as contas filtradas foram reativadas ou movidas para Carteiras Ativas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-on-surface">{item.company}</h3>
                    <p className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                      {item.cnpj}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                      item.reason === 'Sem retorno'
                        ? 'bg-tertiary-fixed text-tertiary'
                        : item.reason === 'Pausa'
                        ? 'bg-primary-fixed text-primary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {item.reason}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">{item.notes}</p>

                <div className="p-3 rounded-xl bg-surface-container-low/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="block text-[10px] font-semibold text-outline uppercase">
                      Último MRR
                    </span>
                    <span className="font-extrabold text-on-surface tabular-nums">
                      {formatBRL(item.lastMrr)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-semibold text-outline uppercase">
                      Inativada em
                    </span>
                    <span className="font-semibold text-on-surface-variant tabular-nums">
                      {item.inactivatedAt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <SafeImage
                    src={item.ownerAvatar}
                    alt={item.owner}
                    fallbackName={item.owner}
                    className="w-7 h-7 rounded-full object-cover"
                    fallbackClassName="w-7 h-7 rounded-full bg-primary-fixed text-primary font-bold text-[10px] flex items-center justify-center shrink-0"
                  />
                  <span className="text-xs font-medium text-on-surface truncate">{item.owner}</span>
                </div>

                <button
                  type="button"
                  onClick={() => reactivatePortfolio(item.id)}
                  className="h-8 px-3 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary-container transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                  <span>Reativar Carteira</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
