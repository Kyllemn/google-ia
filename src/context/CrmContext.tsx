import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  ActivePortfolio,
  AiMatchSuggestion,
  AutomationRule,
  BankStatementRow,
  CarfProcess,
  CollectorCapture,
  CollectorSource,
  CompetencyRow,
  CrmSettings,
  CrmUser,
  DctfAuditRow,
  DctfDebit,
  EcacMailboxItem,
  HonorarioContract,
  InactivePortfolio,
  InboxContact,
  IntimacaoEcac,
  LeadCard,
  LeadStage,
  NotificationItem,
  PerDcompTransmission,
  QuickApprovalItem,
  RestitutionConciliationRow,
  RouteId,
  SpedBatch,
  SplitRepasseRow,
  TaxProcess,
  ToastMessage,
} from '../types/crm';
import {
  COMPETENCIES,
  INITIAL_ACTIVE_PORTFOLIOS,
  INITIAL_AI_MATCHES,
  INITIAL_AUTOMATION_RULES,
  INITIAL_BANK_STATEMENTS,
  INITIAL_CAPTURES,
  INITIAL_CARF_PROCESSES,
  INITIAL_COLLECTORS,
  INITIAL_DCTF_AUDIT_ROWS,
  INITIAL_DCTF_DEBITS,
  INITIAL_ECAC_MAILBOX,
  INITIAL_HONORARIO_CONTRACTS,
  INITIAL_INACTIVE_PORTFOLIOS,
  INITIAL_INBOX_CONTACTS,
  INITIAL_INTIMACOES_ECAC,
  INITIAL_LEADS,
  INITIAL_NOTIFICATIONS,
  INITIAL_QUICK_APPROVALS,
  INITIAL_RESTITUTION_ROWS,
  INITIAL_SETTINGS,
  INITIAL_SPED_BATCHES,
  INITIAL_SPLIT_REPASSES,
  INITIAL_TAX_PROCESSES,
  INITIAL_TRANSMISSIONS,
  INITIAL_USERS,
} from '../data/mockData';

interface CrmContextValue {
  activeRoute: RouteId;
  setActiveRoute: (route: RouteId) => void;
  showIcpExport: boolean;
  setShowIcpExport: (show: boolean) => void;
  selectedCompetency: CompetencyRow | null;
  setSelectedCompetency: (comp: CompetencyRow | null) => void;
  settingsInitialTab: string;
  openSettingsTab: (tab: string) => void;

  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  inboxContacts: InboxContact[];
  updateContactStatus: (id: string, status: InboxContact['status']) => void;
  updateContactNotes: (id: string, notes: string) => void;
  sendContactToLeads: (id: string) => void;

  leads: LeadCard[];
  addLead: (lead: Omit<LeadCard, 'id' | 'updatedAt'>) => void;
  moveLeadStage: (id: string, stage: LeadStage) => void;

  collectors: CollectorSource[];
  captures: CollectorCapture[];
  toggleCollectorStatus: (id: string) => void;
  addCollector: (source: Omit<CollectorSource, 'id' | 'leadsToday' | 'conversionRate' | 'lastSync'>) => void;
  syncCollectorsNow: () => void;

  activePortfolios: ActivePortfolio[];
  addActivePortfolio: (p: Omit<ActivePortfolio, 'id' | 'lastActivity'>) => void;
  updateActivePortfolio: (id: string, patch: Partial<ActivePortfolio>) => void;

  inactivePortfolios: InactivePortfolio[];
  reactivatePortfolio: (id: string) => void;

  taxProcesses: TaxProcess[];
  addTaxProcess: (proc: Omit<TaxProcess, 'id' | 'updatedAt'>) => void;

  spedBatches: SpedBatch[];
  addSpedBatch: (batch: Omit<SpedBatch, 'id' | 'createdAt'>) => void;

  competencies: CompetencyRow[];

  transmissions: PerDcompTransmission[];
  addTransmission: (t: Omit<PerDcompTransmission, 'id' | 'submittedAt'>) => void;
  dctfDebits: DctfDebit[];
  toggleDctfDebit: (id: string) => void;

  bankStatements: BankStatementRow[];
  reconcileBankRow: (id: string, ref?: string) => void;
  restitutionRows: RestitutionConciliationRow[];
  aiMatches: AiMatchSuggestion[];
  applyAiConciliation: (id: string) => void;
  dismissAiMatch: (id: string) => void;
  automationRules: AutomationRule[];
  toggleAutomationRule: (id: string) => void;

  users: CrmUser[];
  addUser: (u: Omit<CrmUser, 'id' | 'lastAccess' | 'portfoliosCount'>) => void;
  toggleUserStatus: (id: string) => void;
  updateUserRole: (id: string, role: CrmUser['role']) => void;

  settings: CrmSettings;
  saveSettings: (next: CrmSettings) => void;

  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;

  toasts: ToastMessage[];
  showToast: (title: string, description?: string, variant?: ToastMessage['variant']) => void;
  dismissToast: (id: string) => void;

  // Part 2 state & sub-views
  showManifestacao: boolean;
  setShowManifestacao: (show: boolean) => void;
  manifestacaoProcess: string;
  openManifestacao: (processNumber?: string) => void;

  showNfseSplit: boolean;
  setShowNfseSplit: (show: boolean) => void;
  selectedContract: HonorarioContract | null;
  openNfseSplit: (contract?: HonorarioContract) => void;

  intimacoes: IntimacaoEcac[];
  acknowledgeIntimacoes: (ids: string[]) => void;
  addIntimacao: (item: Omit<IntimacaoEcac, 'id'>) => void;

  carfProcesses: CarfProcess[];
  addCarfProcess: (proc: Omit<CarfProcess, 'id'>) => void;

  dctfAuditRows: DctfAuditRow[];
  rectifyDctfAudit: () => void;

  honorarioContracts: HonorarioContract[];
  addHonorarioContract: (c: Omit<HonorarioContract, 'id'>) => void;
  markContractBilled: (contractCode: string) => void;

  splitRepasses: SplitRepasseRow[];
  dispatchBatchPix: () => void;

  quickApprovals: QuickApprovalItem[];
  resolveQuickApproval: (id: string, decision: 'approved' | 'rejected') => void;
  ecacMailbox: EcacMailboxItem[];
}

const CrmContext = createContext<CrmContextValue | null>(null);

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRoute, setActiveRouteState] = useState<RouteId>('receber-contatos');
  const [showIcpExport, setShowIcpExport] = useState(false);
  const [selectedCompetency, setSelectedCompetency] = useState<CompetencyRow | null>(null);
  const [settingsInitialTab, setSettingsInitialTab] = useState<string>('geral');
  const [globalSearch, setGlobalSearch] = useState('');

  const [inboxContacts, setInboxContacts] = useState<InboxContact[]>(INITIAL_INBOX_CONTACTS);
  const [leads, setLeads] = useState<LeadCard[]>(INITIAL_LEADS);
  const [collectors, setCollectors] = useState<CollectorSource[]>(INITIAL_COLLECTORS);
  const [captures, setCaptures] = useState<CollectorCapture[]>(INITIAL_CAPTURES);
  const [activePortfolios, setActivePortfolios] = useState<ActivePortfolio[]>(INITIAL_ACTIVE_PORTFOLIOS);
  const [inactivePortfolios, setInactivePortfolios] = useState<InactivePortfolio[]>(INITIAL_INACTIVE_PORTFOLIOS);
  const [taxProcesses, setTaxProcesses] = useState<TaxProcess[]>(INITIAL_TAX_PROCESSES);
  const [spedBatches, setSpedBatches] = useState<SpedBatch[]>(INITIAL_SPED_BATCHES);
  const [transmissions, setTransmissions] = useState<PerDcompTransmission[]>(INITIAL_TRANSMISSIONS);
  const [dctfDebits, setDctfDebits] = useState<DctfDebit[]>(INITIAL_DCTF_DEBITS);
  const [bankStatements, setBankStatements] = useState<BankStatementRow[]>(INITIAL_BANK_STATEMENTS);
  const [restitutionRows] = useState<RestitutionConciliationRow[]>(INITIAL_RESTITUTION_ROWS);
  const [aiMatches, setAiMatches] = useState<AiMatchSuggestion[]>(INITIAL_AI_MATCHES);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(INITIAL_AUTOMATION_RULES);
  const [users, setUsers] = useState<CrmUser[]>(INITIAL_USERS);
  const [settings, setSettings] = useState<CrmSettings>(INITIAL_SETTINGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Part 2 states
  const [showManifestacao, setShowManifestacao] = useState(false);
  const [manifestacaoProcess, setManifestacaoProcess] = useState('10830.720194/2024-11');
  const [showNfseSplit, setShowNfseSplit] = useState(false);
  const [selectedContract, setSelectedContract] = useState<HonorarioContract | null>(
    INITIAL_HONORARIO_CONTRACTS[0]
  );
  const [intimacoes, setIntimacoes] = useState<IntimacaoEcac[]>(INITIAL_INTIMACOES_ECAC);
  const [carfProcesses, setCarfProcesses] = useState<CarfProcess[]>(INITIAL_CARF_PROCESSES);
  const [dctfAuditRows, setDctfAuditRows] = useState<DctfAuditRow[]>(INITIAL_DCTF_AUDIT_ROWS);
  const [honorarioContracts, setHonorarioContracts] = useState<HonorarioContract[]>(
    INITIAL_HONORARIO_CONTRACTS
  );
  const [splitRepasses, setSplitRepasses] = useState<SplitRepasseRow[]>(INITIAL_SPLIT_REPASSES);
  const [quickApprovals, setQuickApprovals] = useState<QuickApprovalItem[]>(
    INITIAL_QUICK_APPROVALS
  );
  const [ecacMailbox] = useState<EcacMailboxItem[]>(INITIAL_ECAC_MAILBOX);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, description?: string, variant: ToastMessage['variant'] = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, description, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  const setActiveRoute = useCallback((route: RouteId) => {
    setActiveRouteState(route);
    if (route !== 'laudo-tecnico-memoria-de-calculo') {
      setShowIcpExport(false);
    }
    if (route !== 'intimacoes-prazos-e-cac') {
      setShowManifestacao(false);
    }
    if (route !== 'contratos-honorarios-exito') {
      setShowNfseSplit(false);
    }
  }, []);

  const openSettingsTab = useCallback((tab: string) => {
    setSettingsInitialTab(tab);
    setActiveRouteState('configuracoes-gerais');
    setShowIcpExport(false);
    setShowManifestacao(false);
    setShowNfseSplit(false);
  }, []);

  const openManifestacao = useCallback((processNumber?: string) => {
    if (processNumber) setManifestacaoProcess(processNumber);
    setActiveRouteState('intimacoes-prazos-e-cac');
    setShowManifestacao(true);
  }, []);

  const openNfseSplit = useCallback((contract?: HonorarioContract) => {
    if (contract) setSelectedContract(contract);
    setActiveRouteState('contratos-honorarios-exito');
    setShowNfseSplit(true);
  }, []);

  const updateContactStatus = useCallback((id: string, status: InboxContact['status']) => {
    setInboxContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }, []);

  const updateContactNotes = useCallback((id: string, notes: string) => {
    setInboxContacts((prev) => prev.map((c) => (c.id === id ? { ...c, notes } : c)));
  }, []);

  const sendContactToLeads = useCallback(
    (id: string) => {
      const contact = inboxContacts.find((c) => c.id === id);
      if (!contact) return;
      const newLead: LeadCard = {
        id: `lead-${Date.now()}`,
        company: contact.company,
        contactName: contact.name,
        email: contact.email,
        phone: contact.phone,
        value: contact.estimatedValue,
        stage: 'Novo Lead',
        owner: 'Mariana Silva',
        source: contact.origin,
        tags: ['Triagem Inbox', 'Novo'],
        updatedAt: 'Agora mesmo',
        priority: 'Alta',
        cnpj: contact.cnpj,
      };
      setLeads((prev) => [newLead, ...prev]);
      setInboxContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'Concluído' } : c))
      );
      showToast(
        'Contato enviado para Leads',
        `${contact.company} foi adicionado à coluna Novo Lead no Kanban.`
      );
    },
    [inboxContacts, showToast]
  );

  const addLead = useCallback(
    (lead: Omit<LeadCard, 'id' | 'updatedAt'>) => {
      const created: LeadCard = {
        ...lead,
        id: `lead-${Date.now()}`,
        updatedAt: 'Agora mesmo',
      };
      setLeads((prev) => [created, ...prev]);
      showToast('Lead criado com sucesso', `${lead.company} adicionado ao funil.`);
    },
    [showToast]
  );

  const moveLeadStage = useCallback(
    (id: string, stage: LeadStage) => {
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, stage, updatedAt: 'Agora mesmo' } : l))
      );
      showToast('Etapa atualizada', `Lead movido para "${stage}".`, 'info');
    },
    [showToast]
  );

  const toggleCollectorStatus = useCallback(
    (id: string) => {
      setCollectors((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const next = c.status === 'Ativa' ? 'Pausada' : 'Ativa';
          showToast(
            `Integração ${next === 'Ativa' ? 'ativada' : 'pausada'}`,
            `${c.name} (${c.code}) agora está ${next.toLowerCase()}.`,
            next === 'Ativa' ? 'success' : 'warning'
          );
          return { ...c, status: next, lastSync: next === 'Ativa' ? 'Agora mesmo' : 'Pausada agora' };
        })
      );
    },
    [showToast]
  );

  const addCollector = useCallback(
    (source: Omit<CollectorSource, 'id' | 'leadsToday' | 'conversionRate' | 'lastSync'>) => {
      const created: CollectorSource = {
        ...source,
        id: `col-${Date.now()}`,
        leadsToday: 0,
        conversionRate: 0,
        lastSync: 'Conectada agora',
      };
      setCollectors((prev) => [...prev, created]);
      showToast('Nova fonte conectada', `${source.name} (${source.code}) configurada.`);
    },
    [showToast]
  );

  const syncCollectorsNow = useCallback(() => {
    setCollectors((prev) =>
      prev.map((c) =>
        c.status === 'Ativa'
          ? { ...c, leadsToday: c.leadsToday + 1, lastSync: 'Agora mesmo' }
          : c
      )
    );
    const freshCapture: CollectorCapture = {
      id: `cap-${Date.now()}`,
      leadName: 'Luciano Tavares',
      company: 'Transportadora Mercúrio Sul',
      sourceName: 'Formulário do Site (Webhook)',
      sourceCode: 'SRC-WEB-03',
      capturedAt: new Date().toLocaleTimeString('pt-BR'),
      status: 'Triagem',
    };
    setCaptures((prev) => [freshCapture, ...prev.slice(0, 7)]);
    showToast('Sincronização concluída', 'Novos leads importados das fontes ativas.');
  }, [showToast]);

  const addActivePortfolio = useCallback(
    (p: Omit<ActivePortfolio, 'id' | 'lastActivity'>) => {
      const created: ActivePortfolio = {
        ...p,
        id: `act-${Date.now()}`,
        lastActivity: 'Agora mesmo',
      };
      setActivePortfolios((prev) => [created, ...prev]);
      showToast('Carteira cadastrada', `${p.company} adicionada às carteiras ativas.`);
    },
    [showToast]
  );

  const updateActivePortfolio = useCallback(
    (id: string, patch: Partial<ActivePortfolio>) => {
      setActivePortfolios((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch, lastActivity: 'Agora mesmo' } : p))
      );
      showToast('Carteira atualizada', 'Dados salvos com sucesso.');
    },
    [showToast]
  );

  const reactivatePortfolio = useCallback(
    (id: string) => {
      const item = inactivePortfolios.find((p) => p.id === id);
      if (!item) return;
      const restored: ActivePortfolio = {
        id: `act-${Date.now()}`,
        company: item.company,
        cnpj: item.cnpj,
        segment: 'Consultoria Tributária',
        mrr: item.lastMrr,
        owner: item.owner,
        contactsCount: 18,
        healthScore: 86,
        status: 'Em Dia',
        lastActivity: 'Reativada hoje',
      };
      setInactivePortfolios((prev) => prev.filter((p) => p.id !== id));
      setActivePortfolios((prev) => [restored, ...prev]);
      showToast('Carteira reativada', `${item.company} retornou para Carteiras Ativas.`);
    },
    [inactivePortfolios, showToast]
  );

  const addTaxProcess = useCallback(
    (proc: Omit<TaxProcess, 'id' | 'updatedAt'>) => {
      setTaxProcesses((prev) => [
        { ...proc, id: `tax-${Date.now()}`, updatedAt: 'Agora mesmo' },
        ...prev,
      ]);
      showToast('Simulação & Parecer salvos', `Processo para ${proc.company} registrado.`);
    },
    [showToast]
  );

  const addSpedBatch = useCallback(
    (batch: Omit<SpedBatch, 'id' | 'createdAt'>) => {
      setSpedBatches((prev) => [
        { ...batch, id: `batch-${Date.now()}`, createdAt: 'Agora mesmo' },
        ...prev,
      ]);
    },
    []
  );

  const addTransmission = useCallback(
    (t: Omit<PerDcompTransmission, 'id' | 'submittedAt'>) => {
      setTransmissions((prev) => [
        { ...t, id: `tr-${Date.now()}`, submittedAt: 'Agora mesmo' },
        ...prev,
      ]);
    },
    []
  );

  const toggleDctfDebit = useCallback((id: string) => {
    setDctfDebits((prev) =>
      prev.map((d) => (d.id === id ? { ...d, selected: !d.selected } : d))
    );
  }, []);

  const reconcileBankRow = useCallback(
    (id: string, ref?: string) => {
      setBankStatements((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: 'Conciliado',
                systemRef: ref ?? (r.systemRef.includes('VÍNCULO') || r.systemRef.includes('Aguardando') ? 'LANÇAMENTO ERP #9042' : r.systemRef),
              }
            : r
        )
      );
      showToast('Lançamento conciliado', 'Registro bancário vinculado ao razão contábil.');
    },
    [showToast]
  );

  const applyAiConciliation = useCallback(
    (id: string) => {
      const match = aiMatches.find((m) => m.id === id);
      if (!match) return;
      setAiMatches((prev) => prev.filter((m) => m.id !== id));
      setBankStatements((prev) =>
        prev.map((row) =>
          Math.abs(row.amount - match.amount) < 1
            ? { ...row, status: 'Conciliado', systemRef: match.systemDesc.split('•')[0].trim() }
            : row
        )
      );
      showToast('Match IA aplicado', `${match.systemDesc} conciliado (${match.confidence}% confiança).`);
    },
    [aiMatches, showToast]
  );

  const dismissAiMatch = useCallback(
    (id: string) => {
      setAiMatches((prev) => prev.filter((m) => m.id !== id));
      showToast('Sugestão descartada', 'O lançamento permanece pendente para análise manual.', 'info');
    },
    [showToast]
  );

  const toggleAutomationRule = useCallback(
    (id: string) => {
      setAutomationRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
      );
      showToast('Regra de conciliação atualizada', undefined, 'info');
    },
    [showToast]
  );

  const addUser = useCallback(
    (u: Omit<CrmUser, 'id' | 'lastAccess' | 'portfoliosCount'>) => {
      const created: CrmUser = {
        ...u,
        id: `usr-${Date.now()}`,
        lastAccess: 'Convite enviado',
        portfoliosCount: 0,
      };
      setUsers((prev) => [created, ...prev]);
      showToast('Usuário cadastrado', `${u.name} adicionado com perfil ${u.role}.`);
    },
    [showToast]
  );

  const toggleUserStatus = useCallback(
    (id: string) => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== id) return u;
          const next = u.status === 'Ativo' ? 'Inativo' : 'Ativo';
          showToast(
            `Usuário ${next === 'Ativo' ? 'ativado' : 'desativado'}`,
            `${u.name} agora está ${next.toLowerCase()}.`,
            next === 'Ativo' ? 'success' : 'warning'
          );
          return { ...u, status: next };
        })
      );
    },
    [showToast]
  );

  const updateUserRole = useCallback(
    (id: string, role: CrmUser['role']) => {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      showToast('Permissões atualizadas', `Perfil alterado para ${role}.`);
    },
    [showToast]
  );

  const saveSettings = useCallback(
    (next: CrmSettings) => {
      setSettings(next);
      showToast('Configurações salvas', 'Todas as preferências foram aplicadas em produção.');
    },
    [showToast]
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const acknowledgeIntimacoes = useCallback(
    (ids: string[]) => {
      setIntimacoes((prev) =>
        prev.map((item) =>
          ids.includes(item.id)
            ? {
                ...item,
                acknowledged: true,
                scienceStatus: 'Ciência Tomada',
                scienceDetail: 'Registrada via Certificado A1',
                scienceTone: 'emerald',
              }
            : item
        )
      );
      showToast(
        'Ciência Digital registrada',
        `${ids.length} notificação(ões) autenticadas no e-CAC.`
      );
    },
    [showToast]
  );

  const addIntimacao = useCallback(
    (item: Omit<IntimacaoEcac, 'id'>) => {
      setIntimacoes((prev) => [{ ...item, id: `int-${Date.now()}` }, ...prev]);
      showToast('Alerta de prazo cadastrado', `${item.company} incluída no monitoramento.`);
    },
    [showToast]
  );

  const addCarfProcess = useCallback(
    (proc: Omit<CarfProcess, 'id'>) => {
      setCarfProcesses((prev) => [{ ...proc, id: `carf-${Date.now()}` }, ...prev]);
      showToast('Recurso protocolado no acompanhamento', `Processo ${proc.processNumber} adicionado.`);
    },
    [showToast]
  );

  const rectifyDctfAudit = useCallback(() => {
    setDctfAuditRows((prev) =>
      prev.map((row) =>
        row.competency === '12/2023'
          ? {
              ...row,
              dctfValue: row.efdValue,
              delta: 0,
              origin: 'DCTFWeb Retificadora transmitida e conciliada',
              impact: 'Totalmente Apto',
              status: 'conciled',
            }
          : row
      )
    );
    showToast(
      'DCTFWeb Retificadora transmitida',
      'Competência 12/2023 assinada com e-CNPJ A1 e conciliada com EFD-Contribuições.'
    );
  }, [showToast]);

  const addHonorarioContract = useCallback(
    (c: Omit<HonorarioContract, 'id'>) => {
      setHonorarioContracts((prev) => [{ ...c, id: `ctr-${Date.now()}` }, ...prev]);
      showToast('Contrato de êxito cadastrado', `${c.contractCode} — ${c.company}`);
    },
    [showToast]
  );

  const markContractBilled = useCallback(
    (contractCode: string) => {
      setHonorarioContracts((prev) =>
        prev.map((c) =>
          c.contractCode === contractCode
            ? {
                ...c,
                billingStatus: 'NF Emitida (Vence 05/11)',
                dueNote: 'Aguardando Baixa',
              }
            : c
        )
      );
      showToast(
        'NFSe Municipal emitida e Split ativado',
        `Fatura vinculada ao contrato ${contractCode} com rateio 85% / 15%.`
      );
    },
    [showToast]
  );

  const dispatchBatchPix = useCallback(() => {
    setSplitRepasses((prev) =>
      prev.map((row) =>
        row.status === 'Em Processamento' ? { ...row, status: 'Liquidado via Pix' } : row
      )
    );
    showToast(
      'Pix em lote disparado',
      'Repasses em processamento liquidados para a conta Santander do perito.'
    );
  }, [showToast]);

  const resolveQuickApproval = useCallback(
    (id: string, decision: 'approved' | 'rejected') => {
      const target = quickApprovals.find((q) => q.id === id);
      setQuickApprovals((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: decision } : q))
      );
      if (target) {
        if (decision === 'approved' && target.type === 'dctf') {
          rectifyDctfAudit();
        } else {
          showToast(
            decision === 'approved' ? 'Operação autorizada' : 'Solicitação recusada',
            `${target.title} (${target.company})`,
            decision === 'approved' ? 'success' : 'warning'
          );
        }
      }
    },
    [quickApprovals, rectifyDctfAudit, showToast]
  );

  const value = useMemo<CrmContextValue>(
    () => ({
      activeRoute,
      setActiveRoute,
      showIcpExport,
      setShowIcpExport,
      selectedCompetency,
      setSelectedCompetency,
      settingsInitialTab,
      openSettingsTab,
      globalSearch,
      setGlobalSearch,
      inboxContacts,
      updateContactStatus,
      updateContactNotes,
      sendContactToLeads,
      leads,
      addLead,
      moveLeadStage,
      collectors,
      captures,
      toggleCollectorStatus,
      addCollector,
      syncCollectorsNow,
      activePortfolios,
      addActivePortfolio,
      updateActivePortfolio,
      inactivePortfolios,
      reactivatePortfolio,
      taxProcesses,
      addTaxProcess,
      spedBatches,
      addSpedBatch,
      competencies: COMPETENCIES,
      transmissions,
      addTransmission,
      dctfDebits,
      toggleDctfDebit,
      bankStatements,
      reconcileBankRow,
      restitutionRows,
      aiMatches,
      applyAiConciliation,
      dismissAiMatch,
      automationRules,
      toggleAutomationRule,
      users,
      addUser,
      toggleUserStatus,
      updateUserRole,
      settings,
      saveSettings,
      notifications,
      markAllNotificationsRead,
      toasts,
      showToast,
      dismissToast,
      showManifestacao,
      setShowManifestacao,
      manifestacaoProcess,
      openManifestacao,
      showNfseSplit,
      setShowNfseSplit,
      selectedContract,
      openNfseSplit,
      intimacoes,
      acknowledgeIntimacoes,
      addIntimacao,
      carfProcesses,
      addCarfProcess,
      dctfAuditRows,
      rectifyDctfAudit,
      honorarioContracts,
      addHonorarioContract,
      markContractBilled,
      splitRepasses,
      dispatchBatchPix,
      quickApprovals,
      resolveQuickApproval,
      ecacMailbox,
    }),
    [
      activeRoute,
      setActiveRoute,
      showIcpExport,
      selectedCompetency,
      settingsInitialTab,
      openSettingsTab,
      globalSearch,
      inboxContacts,
      updateContactStatus,
      updateContactNotes,
      sendContactToLeads,
      leads,
      addLead,
      moveLeadStage,
      collectors,
      captures,
      toggleCollectorStatus,
      addCollector,
      syncCollectorsNow,
      activePortfolios,
      addActivePortfolio,
      updateActivePortfolio,
      inactivePortfolios,
      reactivatePortfolio,
      taxProcesses,
      addTaxProcess,
      spedBatches,
      addSpedBatch,
      transmissions,
      addTransmission,
      dctfDebits,
      toggleDctfDebit,
      bankStatements,
      reconcileBankRow,
      restitutionRows,
      aiMatches,
      applyAiConciliation,
      dismissAiMatch,
      automationRules,
      toggleAutomationRule,
      users,
      addUser,
      toggleUserStatus,
      updateUserRole,
      settings,
      saveSettings,
      notifications,
      markAllNotificationsRead,
      toasts,
      showToast,
      dismissToast,
      showManifestacao,
      manifestacaoProcess,
      openManifestacao,
      showNfseSplit,
      selectedContract,
      openNfseSplit,
      intimacoes,
      acknowledgeIntimacoes,
      addIntimacao,
      carfProcesses,
      addCarfProcess,
      dctfAuditRows,
      rectifyDctfAudit,
      honorarioContracts,
      addHonorarioContract,
      markContractBilled,
      splitRepasses,
      dispatchBatchPix,
      quickApprovals,
      resolveQuickApproval,
      ecacMailbox,
    ]
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};

export function useCrm(): CrmContextValue {
  const ctx = useContext(CrmContext);
  if (!ctx) {
    throw new Error('useCrm must be used within CrmProvider');
  }
  return ctx;
}
