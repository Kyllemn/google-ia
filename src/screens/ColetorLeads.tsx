import React, { useMemo, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { CollectorSource } from '../types/crm';

export const ColetorLeads: React.FC = () => {
  const { collectors, captures, toggleCollectorStatus, addCollector, syncCollectorsNow, showToast } =
    useCrm();

  const [statusFilter, setStatusFilter] = useState<'Todas' | 'Ativas' | 'Pausadas'>('Todas');
  const [modalOpen, setModalOpen] = useState(false);
  const [configTarget, setConfigTarget] = useState<CollectorSource | null>(null);

  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('SRC-API-06');
  const [newType, setNewType] = useState<CollectorSource['type']>('Webhook');
  const [newEndpoint, setNewEndpoint] = useState('https://api.verticecrm.com.br/hooks/custom');

  const filteredCollectors = useMemo(() => {
    return collectors.filter((c) => {
      if (statusFilter === 'Ativas') return c.status === 'Ativa';
      if (statusFilter === 'Pausadas') return c.status === 'Pausada';
      return true;
    });
  }, [collectors, statusFilter]);

  const activeCount = collectors.filter((c) => c.status === 'Ativa').length;
  const totalLeadsToday = collectors.reduce((acc, c) => acc + c.leadsToday, 0);

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addCollector({
      name: newName.trim(),
      code: newCode.trim().toUpperCase(),
      type: newType,
      status: 'Ativa',
      endpoint: newEndpoint.trim(),
    });
    setNewName('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* 3 KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-on-surface-variant">
              Leads Captados Hoje
            </span>
            <p className="text-3xl font-extrabold text-on-surface tabular-nums mt-1">
              {totalLeadsToday}
            </p>
            <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700">
              +18,4% vs ontem
            </span>
          </div>
          <svg viewBox="0 0 120 44" className="w-28 h-11 shrink-0" aria-hidden="true">
            <polyline
              fill="none"
              stroke="#004ac6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="4,36 22,28 40,32 58,18 76,22 94,10 116,6"
            />
          </svg>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5">
          <span className="text-xs font-semibold text-on-surface-variant">Fontes Conectadas</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-primary tabular-nums">
              {activeCount} / {collectors.length}
            </span>
            <span className="text-xs font-semibold text-on-surface-variant">ativas</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-surface-container overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(activeCount / Math.max(collectors.length, 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5">
          <span className="text-xs font-semibold text-on-surface-variant">
            Taxa de Entrega Webhook
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-extrabold text-emerald-600 tabular-nums">99,2%</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold">
              SLA 140ms
            </span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-2">
            Zero falhas de payload nas últimas 24 horas.
          </p>
        </div>
      </div>

      {/* Actions & Filter Bar */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['Todas', 'Ativas', 'Pausadas'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === tab
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={syncCollectorsNow}
            className="h-9 px-3.5 rounded-xl border border-outline-variant bg-white text-xs font-semibold text-on-surface hover:bg-surface-container-low flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Sincronizar Agora</span>
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">add_link</span>
            <span>+ Nova Fonte</span>
          </button>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCollectors.map((col) => {
          const isActive = col.status === 'Ativa';
          return (
            <div
              key={col.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-surface-container-low font-mono text-[10px] font-bold text-primary">
                    {col.code}
                  </span>
                  <h3 className="text-sm font-extrabold text-on-surface mt-1.5">{col.name}</h3>
                  <p className="text-[11px] text-on-surface-variant">{col.type}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-tertiary-fixed text-tertiary'
                  }`}
                >
                  {col.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-container-low/70">
                <div>
                  <span className="block text-[10px] font-semibold text-outline uppercase">
                    Captados Hoje
                  </span>
                  <span className="text-lg font-extrabold text-on-surface tabular-nums">
                    {col.leadsToday}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-outline uppercase">
                    Conversão
                  </span>
                  <span className="text-lg font-extrabold text-primary tabular-nums">
                    {col.conversionRate.toFixed(1).replace('.', ',')}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                <span className="text-[11px] text-on-surface-variant">Sync: {col.lastSync}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfigTarget(col)}
                    className="px-2.5 py-1 rounded-lg border border-outline-variant/60 text-[11px] font-semibold text-on-surface hover:bg-surface-container-low"
                  >
                    Configurar
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCollectorStatus(col.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      isActive
                        ? 'bg-tertiary-fixed text-tertiary hover:bg-tertiary-fixed-dim/50'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    {isActive ? 'Pausar' : 'Ativar'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Captures Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-outline-variant/40 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-on-surface">Últimas Capturas Recebidas</h3>
          <span className="text-xs text-on-surface-variant">Atualização em tempo real</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/40 text-[11px] font-bold uppercase text-on-surface-variant">
                <th className="py-3 px-4">Lead / Empresa</th>
                <th className="py-3 px-4">Fonte</th>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Horário</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-xs">
              {captures.map((cap) => (
                <tr key={cap.id} className="hover:bg-surface-container-low/50">
                  <td className="py-3 px-4">
                    <p className="font-bold text-on-surface">{cap.company}</p>
                    <p className="text-[11px] text-on-surface-variant">{cap.leadName}</p>
                  </td>
                  <td className="py-3 px-4 text-on-surface">{cap.sourceName}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-primary">{cap.sourceCode}</td>
                  <td className="py-3 px-4 tabular-nums text-on-surface-variant">
                    {cap.capturedAt}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        cap.status === 'Integrado'
                          ? 'bg-emerald-50 text-emerald-700'
                          : cap.status === 'Triagem'
                          ? 'bg-primary-fixed text-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {cap.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Source Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-on-surface">Conectar Nova Fonte</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddSource} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Nome da Integração *</label>
                <input
                  required
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: HubSpot CRM ou LinkedIn Lead Gen"
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Código</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Tipo</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as CollectorSource['type'])}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs bg-white"
                  >
                    <option value="Webhook">Webhook</option>
                    <option value="CRM">CRM</option>
                    <option value="Ads">Ads</option>
                    <option value="Mensageria">Mensageria</option>
                    <option value="Planilha">Planilha</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Endpoint / URL</label>
                <input
                  type="url"
                  value={newEndpoint}
                  onChange={(e) => setNewEndpoint(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant/60 text-xs font-mono"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-9 px-4 rounded-xl border border-outline-variant text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-primary text-white text-xs font-bold"
                >
                  Conectar Fonte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Config Source Modal */}
      {configTarget && (
        <div className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-outline-variant/60 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-on-surface">
                Configurar {configTarget.name}
              </h3>
              <button
                type="button"
                onClick={() => setConfigTarget(null)}
                className="p-1 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="block font-bold text-on-surface mb-1">Endpoint Webhook</span>
                <code className="block p-3 rounded-xl bg-surface-container-low font-mono text-[11px] break-all">
                  {configTarget.endpoint}
                </code>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-surface-container-low">
                <span className="text-on-surface-variant">Código Identificador:</span>
                <span className="font-mono font-bold text-primary">{configTarget.code}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Teste de ping enviado', `${configTarget.name} respondeu HTTP 200 OK.`);
                  setConfigTarget(null);
                }}
                className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Testar Conexão (HTTP 200)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
