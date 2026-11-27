export type RouteId =
  | 'acoes-rapidas'
  | 'receber-contatos'
  | 'gerenciamento-de-leads'
  | 'coletor-de-leads'
  | 'carteiras-ativas'
  | 'carteiras-inativas'
  | 'recuperacao-tributaria'
  | 'importacao-sped-xml'
  | 'laudo-tecnico-memoria-de-calculo'
  | 'transmissao-perdcomp-web'
  | 'conciliacao-bancaria'
  | 'intimacoes-prazos-e-cac'
  | 'recursos-carf'
  | 'auditoria-dctfweb-efd'
  | 'contratos-honorarios-exito'
  | 'relatorios-e-metricas'
  | 'cadastro-de-usuarios'
  | 'configuracoes-gerais';

export type LeadStage = 'Novo Lead' | 'Contato Iniciado' | 'Proposta Enviada' | 'Fechamento';

export interface InboxContact {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  origin: string;
  originCode: string;
  status: 'Pendente' | 'Em Atendimento' | 'Concluído';
  receivedAt: string;
  estimatedValue: number;
  notes: string;
  cnpj?: string;
}

export interface LeadCard {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  value: number;
  stage: LeadStage;
  owner: string;
  source: string;
  tags: string[];
  updatedAt: string;
  priority: 'Alta' | 'Média' | 'Normal';
  cnpj?: string;
}

export interface CollectorSource {
  id: string;
  code: string;
  name: string;
  type: 'CRM' | 'Ads' | 'Webhook' | 'Mensageria' | 'Planilha';
  status: 'Ativa' | 'Pausada';
  leadsToday: number;
  conversionRate: number;
  lastSync: string;
  endpoint: string;
}

export interface CollectorCapture {
  id: string;
  leadName: string;
  company: string;
  sourceName: string;
  sourceCode: string;
  capturedAt: string;
  status: 'Integrado' | 'Triagem' | 'Duplicado';
}

export interface ActivePortfolio {
  id: string;
  company: string;
  cnpj: string;
  segment: string;
  mrr: number;
  owner: string;
  contactsCount: number;
  healthScore: number;
  status: 'Em Dia' | 'Atenção' | 'Renovação';
  lastActivity: string;
}

export interface InactivePortfolio {
  id: string;
  company: string;
  cnpj: string;
  lastMrr: number;
  reason: 'Sem retorno' | 'Pausa' | 'Encerrado';
  inactivatedAt: string;
  owner: string;
  ownerAvatar: string;
  notes: string;
}

export interface TaxProcess {
  id: string;
  company: string;
  cnpj: string;
  regime: 'Lucro Real' | 'Lucro Presumido' | 'Simples Nacional';
  thesis: string;
  estimatedCredit: number;
  status: 'Em Análise' | 'Auditado' | 'Protocolado' | 'Deferido';
  risk: 'Baixo' | 'Médio';
  updatedAt: string;
}

export interface SpedBatch {
  id: string;
  batchCode: string;
  company: string;
  period: string;
  filesCount: number;
  totalLines: number;
  warnings: number;
  blocks: number;
  creditFound: number;
  status: 'Validado' | 'Com Advertências' | 'Em Processamento';
  createdAt: string;
}

export interface CompetencyRow {
  month: string; // MM/YYYY
  year: number;
  nfCount: number;
  revenue: number;
  icmsHighlight: number;
  principalCredit: number;
  selicRate: number;
  selicValue: number;
  totalUpdated: number;
  cfops: string[];
  pisCofinsRate: string;
}

export interface NfeSampleRow {
  number: string;
  date: string;
  cfop: string;
  recipient: string;
  totalValue: number;
  icmsValue: number;
  creditValue: number;
}

export interface PerDcompTransmission {
  id: string;
  protocol: string;
  type: 'PER' | 'DCOMP';
  company: string;
  competency: string;
  amount: number;
  status: 'Transmitido' | 'Processando' | 'Homologado';
  submittedAt: string;
  receiptHash: string;
}

export interface DctfDebit {
  id: string;
  code: string;
  tribute: string;
  period: string;
  dueDate: string;
  amount: number;
  selected: boolean;
}

export interface BankStatementRow {
  id: string;
  date: string;
  description: string;
  bankAccount: string;
  systemRef: string;
  amount: number;
  type: 'Crédito' | 'Débito';
  status: 'Conciliado' | 'Divergente' | 'Pendente';
}

export interface RestitutionConciliationRow {
  id: string;
  perdcomp: string;
  bankDate: string;
  tribute: string;
  expectedAmount: number;
  creditedAmount: number;
  status: 'Liquidado' | 'Parcial' | 'Aguardando';
}

export interface AiMatchSuggestion {
  id: string;
  bankDesc: string;
  systemDesc: string;
  amount: number;
  confidence: number;
  date: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  targetAccount: string;
  matchesCount: number;
  active: boolean;
}

export interface CrmUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Gestor Tributário' | 'Consultor Comercial' | 'Perito Contábil' | 'Analista Fiscal';
  department: string;
  portfoliosCount: number;
  status: 'Ativo' | 'Inativo';
  lastAccess: string;
  avatar?: string;
}

export interface CrmSettings {
  orgName: string;
  cnpj: string;
  timezone: string;
  currency: string;
  autoAssign: boolean;
  distributionMode: 'round-robin' | 'territory' | 'triage';
  slaMinutes: number;
  notifyNewLead: boolean;
  notifySlaBreach: boolean;
  notifyPrescription: boolean;
  webhookUrl: string;
  webhookKey: string;
  customFields: { id: string; label: string; type: string; required: boolean }[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'warning' | 'error';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  route?: RouteId;
}

export interface IntimacaoEcac {
  id: string;
  processNumber: string;
  notificationCode: string;
  company: string;
  cnpj: string;
  actType: string;
  actSubtitle: string;
  contextNote: string;
  contextTone: 'error' | 'emerald' | 'neutral';
  urgencyLabel: string;
  urgencyTone: 'critical' | 'warning' | 'info' | 'done';
  expiresNote: string;
  receivedDate: string;
  receivedTime: string;
  scienceStatus: string;
  scienceDetail: string;
  scienceTone: 'error' | 'emerald' | 'warning' | 'neutral';
  category: 'fatal' | 'homologacao' | 'geral';
  acknowledged: boolean;
  canManifest?: boolean;
}

export interface CarfProcess {
  id: string;
  processNumber: string;
  badge: string;
  badgeTone: 'error' | 'primary' | 'neutral';
  company: string;
  cnpj: string;
  turma: string;
  court: string;
  relator: string;
  thesis: string;
  taxPeriod: string;
  litigationAmount: number;
  successNote: string;
  statusLabel: string;
  statusSub: string;
  statusTone: 'error' | 'primary' | 'secondary';
  category: 'pautados' | 'distribuicao' | 'acordao' | 'csrf';
  sectionFilter: '1sec' | '2sec' | '3sec' | 'csrf' | 'drj';
  thesisFilter: 'pis' | 'agio' | 'jcp' | 'cred_ins' | 'subsidio';
}

export interface DctfAuditRow {
  id: string;
  competency: string;
  tribute: string;
  tributeCode: string;
  efdValue: number;
  dctfValue: number;
  delta: number;
  origin: string;
  impact: string;
  status: 'divergent' | 'conciled' | 'alert';
}

export interface HonorarioContract {
  id: string;
  contractCode: string;
  company: string;
  thesisTitle: string;
  thesisSubtitle: string;
  thesisCategory: 'tema69' | 'funrural' | 'monofasico' | 'frete';
  taxCredit: number;
  creditStatusLabel: string;
  successRate: number;
  feeAmount: number;
  feeInstallmentNote: string;
  billingStatus: 'Apto Faturamento (Parc. 1/4)' | 'Totalmente Quitado (100%)' | 'Aguardando Homologação' | 'NF Emitida (Vence 05/11)';
  dueDate: string;
  dueNote: string;
}

export interface SplitRepasseRow {
  id: string;
  date: string;
  eventRef: string;
  contractCode: string;
  company: string;
  installment: string;
  deferredCredit: number;
  verticeFee: number;
  partnerShare: number;
  withholding: number;
  withholdingPrefix?: string;
  netPaid: number;
  status: 'Liquidado via Pix' | 'Em Processamento' | 'Aguardando Baixa';
}

export interface QuickApprovalItem {
  id: string;
  type: 'dctf' | 'nfse';
  title: string;
  company: string;
  badge: string;
  metricLabel: string;
  metricValue: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  pillNote?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface EcacMailboxItem {
  id: string;
  title: string;
  description: string;
  company: string;
  time: string;
  tone: 'primary' | 'error' | 'secondary';
}
