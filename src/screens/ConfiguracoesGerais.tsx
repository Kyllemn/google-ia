import React, { useEffect, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { CrmSettings } from '../types/crm';
import { copyToClipboard } from '../utils/export';

type SettingsTab = 'geral' | 'distribuicao' | 'notificacoes' | 'campos' | 'webhooks';

export const ConfiguracoesGerais: React.FC = () => {
  const { settings, saveSettings, settingsInitialTab, showToast } = useCrm();

  const [activeTab, setActiveTab] = useState<SettingsTab>('geral');
  const [draft, setDraft] = useState<CrmSettings>(settings);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('Texto Curto');

  useEffect(() => {
    if (
      settingsInitialTab === 'geral' ||
      settingsInitialTab === 'distribuicao' ||
      settingsInitialTab === 'notificacoes' ||
      settingsInitialTab === 'campos' ||
      settingsInitialTab === 'webhooks'
    ) {
      setActiveTab(settingsInitialTab);
    }
  }, [settingsInitialTab]);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const handleCopyKey = async () => {
    const ok = await copyToClipboard(draft.webhookKey);
    if (ok) showToast('Chave copiada', 'Chave secreta de webhook copiada.', 'info');
  };

  const handleRegenerateKey = () => {
    const suffix = Math.random().toString(16).slice(2, 18);
    setDraft((prev) => ({ ...prev, webhookKey: `sk_live_${suffix}` }));
    showToast('Nova chave gerada', 'Salve as alterações para ativar a nova chave.', 'warning');
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;
    setDraft((prev) => ({
      ...prev,
      customFields: [
        ...prev.customFields,
        {
          id: `cf-${Date.now()}`,
          label: newFieldLabel.trim(),
          type: newFieldType,
          required: false,
        },
      ],
    }));
    setNewFieldLabel('');
  };

  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: 'geral', label: 'Geral', icon: 'business' },
    { id: 'distribuicao', label: 'Distribuição de Leads', icon: 'alt_route' },
    { id: 'notificacoes', label: 'Notificações & Alertas', icon: 'notifications_active' },
    { id: 'campos', label: 'Campos Personalizados', icon: 'tune' },
    { id: 'webhooks', label: 'Webhooks & Segurança', icon: 'vpn_key' },
  ];

  return (
    <div className="space-y-5 pb-20">
      {/* 5 Tabs */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-2 flex flex-wrap gap-1.5">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 space-y-5">
        {activeTab === 'geral' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Nome da Organização
              </label>
              <input
                type="text"
                value={draft.orgName}
                onChange={(e) => setDraft({ ...draft, orgName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">CNPJ Matriz</label>
              <input
                type="text"
                value={draft.cnpj}
                onChange={(e) => setDraft({ ...draft, cnpj: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Fuso Horário</label>
              <input
                type="text"
                value={draft.timezone}
                onChange={(e) => setDraft({ ...draft, timezone: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Moeda Padrão</label>
              <input
                type="text"
                value={draft.currency}
                onChange={(e) => setDraft({ ...draft, currency: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs"
              />
            </div>
          </div>
        )}

        {activeTab === 'distribuicao' && (
          <div className="space-y-5">
            <label className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low cursor-pointer">
              <div>
                <p className="text-sm font-extrabold text-on-surface">
                  Atribuição Automática de Novos Leads
                </p>
                <p className="text-xs text-on-surface-variant">
                  Distribui imediatamente contatos captados via Webhook e RD Station
                </p>
              </div>
              <input
                type="checkbox"
                checked={draft.autoAssign}
                onChange={(e) => setDraft({ ...draft, autoAssign: e.target.checked })}
                className="w-4 h-4"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: 'round-robin' as const,
                  title: 'Round-Robin',
                  desc: 'Alternância igualitária entre consultores online',
                },
                {
                  id: 'territory' as const,
                  title: 'Território / Região',
                  desc: 'Direcionamento por UF e porte tributário (CNPJ)',
                },
                {
                  id: 'triage' as const,
                  title: 'Fila de Triagem',
                  desc: 'Permanece em Receber Contatos até aprovação',
                },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setDraft({ ...draft, distributionMode: mode.id })}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    draft.distributionMode === mode.id
                      ? 'border-primary bg-primary-fixed/25'
                      : 'border-outline-variant/50 bg-surface-container-low/40'
                  }`}
                >
                  <p className="text-xs font-extrabold text-on-surface">{mode.title}</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">{mode.desc}</p>
                </button>
              ))}
            </div>

            <div className="max-w-xs">
              <label className="block text-xs font-bold text-on-surface mb-1">
                SLA Máximo de 1º Atendimento (minutos)
              </label>
              <input
                type="number"
                value={draft.slaMinutes}
                onChange={(e) => setDraft({ ...draft, slaMinutes: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-bold tabular-nums"
              />
            </div>
          </div>
        )}

        {activeTab === 'notificacoes' && (
          <div className="space-y-3">
            {[
              {
                key: 'notifyNewLead' as const,
                title: 'Notificar captura de novo lead qualificado',
                desc: 'Alerta instantâneo no sino e e-mail do gestor responsável',
              },
              {
                key: 'notifySlaBreach' as const,
                title: 'Alerta de estouro de SLA (acima de 30 min)',
                desc: 'Escala automaticamente contato pendente para o supervisor',
              },
              {
                key: 'notifyPrescription' as const,
                title: 'Alerta de Prescrição Quinquenal (60 meses)',
                desc: 'Avisa com 30 e 15 dias de antecedência para protocolo PER/DCOMP',
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low cursor-pointer"
              >
                <div>
                  <p className="text-xs font-extrabold text-on-surface">{item.title}</p>
                  <p className="text-[11px] text-on-surface-variant">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={draft[item.key]}
                  onChange={(e) => setDraft({ ...draft, [item.key]: e.target.checked })}
                />
              </label>
            ))}
          </div>
        )}

        {activeTab === 'campos' && (
          <div className="space-y-4">
            <form onSubmit={handleAddCustomField} className="flex flex-wrap gap-2">
              <input
                type="text"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                placeholder="Nome do novo campo personalizado..."
                className="flex-1 min-w-[200px] h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                className="h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs"
              >
                <option>Texto Curto</option>
                <option>Moeda (BRL)</option>
                <option>Lista de Seleção</option>
                <option>Booleano</option>
              </select>
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold"
              >
                + Adicionar Campo
              </button>
            </form>

            <div className="divide-y divide-outline-variant/30 border border-outline-variant/40 rounded-xl overflow-hidden">
              {draft.customFields.map((cf) => (
                <div key={cf.id} className="p-3.5 flex items-center justify-between text-xs bg-white">
                  <div>
                    <p className="font-bold text-on-surface">{cf.label}</p>
                    <p className="text-[11px] text-on-surface-variant">{cf.type}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        customFields: draft.customFields.filter((x) => x.id !== cf.id),
                      })
                    }
                    className="text-error text-[11px] font-bold hover:underline"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'webhooks' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-800">
                DB Polling &amp; Fila Webhook: Conectado (Latência 18ms)
              </span>
              <span className="font-mono text-emerald-700">TLS 1.3</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Endpoint de Entrada
              </label>
              <input
                type="url"
                value={draft.webhookUrl}
                onChange={(e) => setDraft({ ...draft, webhookUrl: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Chave Secreta de Assinatura (HMAC)
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  readOnly
                  type="text"
                  value={draft.webhookKey}
                  className="flex-1 min-w-[200px] h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="h-10 px-3.5 rounded-xl border border-outline-variant bg-white text-xs font-bold"
                >
                  Copiar
                </button>
                <button
                  type="button"
                  onClick={handleRegenerateKey}
                  className="h-10 px-3.5 rounded-xl bg-tertiary-fixed text-tertiary text-xs font-bold"
                >
                  Regenerar Chave
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-4 left-4 right-4 lg:left-[284px] lg:right-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-outline-variant/60 shadow-lg px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-on-surface-variant">
          Alterações aplicadas em tempo real para toda a organização.
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDraft(settings);
              showToast('Alterações descartadas', undefined, 'info');
            }}
            className="h-9 px-4 rounded-xl border border-outline-variant bg-white text-xs font-semibold text-on-surface-variant"
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={() => saveSettings(draft)}
            className="h-9 px-5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};
