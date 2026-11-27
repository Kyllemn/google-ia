import React, { useMemo, useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { ASSETS } from '../data/assets';
import { RouteId } from '../types/crm';
import { SafeImage } from './SafeImage';

interface NavItem {
  id: RouteId;
  label: string;
  icon: string;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeRoute,
    setActiveRoute,
    openSettingsTab,
    globalSearch,
    setGlobalSearch,
    inboxContacts,
    leads,
    activePortfolios,
    taxProcesses,
    notifications,
    markAllNotificationsRead,
    toasts,
    dismissToast,
  } = useCrm();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const pendingInboxCount = inboxContacts.filter((c) => c.status !== 'Concluído').length;
  const unreadNotifCount = notifications.filter((n) => n.unread).length;

  const navGroups: NavGroup[] = [
    {
      title: 'Principal',
      items: [
        { id: 'acoes-rapidas', label: 'Painel de Ações Rápidas', icon: 'bolt', badge: 3 },
        { id: 'receber-contatos', label: 'Receber Contatos', icon: 'inbox', badge: pendingInboxCount },
        { id: 'gerenciamento-de-leads', label: 'Gerenciamento de Leads', icon: 'view_kanban' },
        { id: 'coletor-de-leads', label: 'Coletor de Leads', icon: 'hub' },
      ],
    },
    {
      title: 'Carteiras',
      items: [
        { id: 'carteiras-ativas', label: 'Carteiras Ativas', icon: 'work' },
        { id: 'carteiras-inativas', label: 'Carteiras Inativas', icon: 'archive' },
      ],
    },
    {
      title: 'Financeiro & Fiscal',
      items: [
        { id: 'recuperacao-tributaria', label: 'Recuperação Tributária', icon: 'account_balance' },
        { id: 'importacao-sped-xml', label: 'Importação SPED / XML', icon: 'upload_file' },
        { id: 'laudo-tecnico-memoria-de-calculo', label: 'Laudo & Memória de Cálculo', icon: 'calculate' },
        { id: 'transmissao-perdcomp-web', label: 'Transmissão PER/DCOMP Web', icon: 'send_and_archive' },
        { id: 'conciliacao-bancaria', label: 'Conciliação Bancária', icon: 'account_balance_wallet' },
        { id: 'intimacoes-prazos-e-cac', label: 'Intimações & Prazos e-CAC', icon: 'gavel' },
        { id: 'recursos-carf', label: 'Recursos & CARF', icon: 'balance' },
        { id: 'auditoria-dctfweb-efd', label: 'Auditoria DCTFWeb x EFD', icon: 'fact_check' },
        { id: 'contratos-honorarios-exito', label: 'Contratos & Honorários no Êxito', icon: 'receipt_long' },
      ],
    },
    {
      title: 'Analytics & Admin',
      items: [
        { id: 'relatorios-e-metricas', label: 'Relatórios & Métricas', icon: 'insights' },
        { id: 'cadastro-de-usuarios', label: 'Cadastro de Usuários', icon: 'group_add' },
        { id: 'configuracoes-gerais', label: 'Configurações Gerais', icon: 'settings' },
      ],
    },
  ];

  const routeMeta: Record<RouteId, { title: string; subtitle: string }> = {
    'acoes-rapidas': {
      title: 'Painel de Ações Rápidas',
      subtitle: 'Cockpit executivo de prazos fatais, aprovações e caixa postal e-CAC',
    },
    'receber-contatos': {
      title: 'Receber Contatos',
      subtitle: 'Triagem de leads captados por webhook, CRM e anúncios',
    },
    'gerenciamento-de-leads': {
      title: 'Gerenciamento de Leads',
      subtitle: 'Pipeline comercial e acompanhamento de oportunidades',
    },
    'coletor-de-leads': {
      title: 'Coletor de Leads',
      subtitle: 'Monitoramento de fontes integradas e webhooks ativos',
    },
    'carteiras-ativas': {
      title: 'Carteiras Ativas',
      subtitle: 'Gestão de contratos recorrentes e saúde da base',
    },
    'carteiras-inativas': {
      title: 'Carteiras Inativas',
      subtitle: 'Histórico de contas pausadas ou encerradas para reativação',
    },
    'recuperacao-tributaria': {
      title: 'Recuperação Tributária',
      subtitle: 'Simulador de teses, matriz de risco e acompanhamento e-CAC',
    },
    'importacao-sped-xml': {
      title: 'Importação SPED / XML',
      subtitle: 'Motor de auditoria fiscal em lote e validação EFD-Contribuições',
    },
    'laudo-tecnico-memoria-de-calculo': {
      title: 'Laudo Técnico & Memória de Cálculo',
      subtitle: 'Apuração Tema 69 STF (60 competências) com atualização SELIC',
    },
    'transmissao-perdcomp-web': {
      title: 'Transmissão PER/DCOMP Web',
      subtitle: 'Protocolo digital Receita Federal e vinculação DCTFWeb',
    },
    'conciliacao-bancaria': {
      title: 'Conciliação Bancária & Extratos',
      subtitle: 'Motor de Match IA, extratos OFX/API e fluxo de restituições',
    },
    'intimacoes-prazos-e-cac': {
      title: 'Intimações & Prazos Processuais e-CAC',
      subtitle: 'Monitoramento RFB/PGFN, ciência tácita e manifestação de inconformidade',
    },
    'recursos-carf': {
      title: 'Contencioso Administrativo & Recursos CARF / DRJ',
      subtitle: 'Gestão de pautas, sustentações orais e radar jurisprudencial',
    },
    'auditoria-dctfweb-efd': {
      title: 'Auditoria Cruzada DCTFWeb x EFD Contribuições',
      subtitle: 'Confronto analítico de débitos e retificação preventiva para PER/DCOMP',
    },
    'contratos-honorarios-exito': {
      title: 'Contratos de Honorários & Cobrança no Êxito',
      subtitle: 'Cláusulas quota litis, faturamento NFSe e split automático de peritos',
    },
    'relatorios-e-metricas': {
      title: 'Relatórios & Métricas',
      subtitle: 'Funil executivo, ROAS por origem e ranking de consultores',
    },
    'cadastro-de-usuarios': {
      title: 'Cadastro de Usuários',
      subtitle: 'Controle de acesso baseado em funções (RBAC) e carteiras',
    },
    'configuracoes-gerais': {
      title: 'Configurações Gerais',
      subtitle: 'Regras de distribuição, SLA, webhooks e campos personalizados',
    },
  };

  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    const results: { label: string; category: string; route: RouteId }[] = [];

    inboxContacts.forEach((c) => {
      if (c.company.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)) {
        results.push({ label: `${c.company} (${c.name})`, category: 'Inbox Contatos', route: 'receber-contatos' });
      }
    });
    leads.forEach((l) => {
      if (l.company.toLowerCase().includes(q) || l.contactName.toLowerCase().includes(q)) {
        results.push({ label: `${l.company} — ${l.stage}`, category: 'Leads Kanban', route: 'gerenciamento-de-leads' });
      }
    });
    activePortfolios.forEach((p) => {
      if (p.company.toLowerCase().includes(q) || p.cnpj.includes(q)) {
        results.push({ label: `${p.company} (${p.cnpj})`, category: 'Carteira Ativa', route: 'carteiras-ativas' });
      }
    });
    taxProcesses.forEach((t) => {
      if (t.company.toLowerCase().includes(q) || t.thesis.toLowerCase().includes(q)) {
        results.push({ label: `${t.company} — ${t.thesis}`, category: 'Recuperação Tributária', route: 'recuperacao-tributaria' });
      }
    });

    return results.slice(0, 6);
  }, [globalSearch, inboxContacts, leads, activePortfolios, taxProcesses]);

  const handleNavClick = (id: RouteId) => {
    setActiveRoute(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-on-surface/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Fixed Sidebar (260px) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-surface-container-low border-r border-outline-variant/40 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-outline-variant/40 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('receber-contatos')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
          >
            <SafeImage
              src={ASSETS.brandLogo}
              alt="Vértice CRM"
              fallbackName="VC"
              className="w-9 h-9 rounded-xl object-cover shadow-xs"
              fallbackClassName="w-9 h-9 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0"
            />
            <div>
              <span className="block text-base font-extrabold tracking-tight text-on-surface leading-tight">
                Vértice CRM
              </span>
              <span className="block text-[11px] font-semibold text-primary tracking-wide uppercase">
                Inteligência Tributária
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
            aria-label="Fechar menu"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-outline">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isActive
                          ? 'bg-primary text-on-primary shadow-sm font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`material-symbols-outlined text-[19px] shrink-0 ${
                            isActive ? 'material-symbols-filled' : ''
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </span>
                      {typeof item.badge === 'number' && item.badge > 0 && (
                        <span
                          className={`px-1.5 py-0.5 text-[11px] font-bold rounded-full tabular-nums shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-primary-fixed text-primary'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Quick Action */}
        <div className="p-3 border-t border-outline-variant/40 shrink-0">
          <button
            type="button"
            onClick={() => openSettingsTab('campos')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs font-semibold text-primary hover:bg-primary-fixed/40 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>+ Novo Módulo / Campos</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
        {/* Topbar (64px) */}
        <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/40 px-4 lg:px-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container"
              aria-label="Abrir menu"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <div className="min-w-0">
              <h1 className="text-base lg:text-lg font-bold text-on-surface truncate">
                {routeMeta[activeRoute].title}
              </h1>
              <p className="hidden sm:block text-xs text-on-surface-variant truncate">
                {routeMeta[activeRoute].subtitle}
              </p>
            </div>
          </div>

          {/* Search & Profile Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Global Search */}
            <div className="relative hidden md:block w-72">
              <span className="material-symbols-outlined text-[18px] text-outline absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                placeholder="Buscar empresa, CNPJ ou processo..."
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:bg-white transition-colors"
              />
              {searchFocused && globalSearch.trim().length > 0 && (
                <div className="absolute top-11 left-0 right-0 bg-white rounded-xl border border-outline-variant/60 shadow-lg py-1.5 z-50">
                  {searchResults.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-on-surface-variant">
                      Nenhum registro encontrado para &ldquo;{globalSearch}&rdquo;.
                    </p>
                  ) : (
                    searchResults.map((res, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={() => {
                          setActiveRoute(res.route);
                          setGlobalSearch('');
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-surface-container-low flex items-center justify-between gap-2"
                      >
                        <span className="text-xs font-medium text-on-surface truncate">
                          {res.label}
                        </span>
                        <span className="text-[10px] font-semibold text-primary bg-primary-fixed px-2 py-0.5 rounded-md shrink-0">
                          {res.category}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                className="relative p-2 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors"
                aria-label="Notificações"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl border border-outline-variant/60 shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-outline-variant/40 flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">
                      Central de Alertas ({unreadNotifCount})
                    </span>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      Marcar lidas
                    </button>
                  </div>
                  <div className="divide-y divide-outline-variant/30 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          if (n.route) setActiveRoute(n.route);
                          setNotifOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors ${
                          n.unread ? 'bg-primary-fixed/20' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-on-surface">{n.title}</span>
                          <span className="text-[10px] text-outline shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                          {n.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Card */}
            <button
              type="button"
              onClick={() => setActiveRoute('cadastro-de-usuarios')}
              className="flex items-center gap-2.5 pl-2 pr-2.5 py-1 rounded-xl hover:bg-surface-container-low transition-colors text-left"
            >
              <SafeImage
                src={ASSETS.topbarAvatar}
                alt="Ricardo Mendes"
                fallbackName="Ricardo Mendes"
                className="w-8 h-8 rounded-full object-cover border border-outline-variant/50"
                fallbackClassName="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0"
              />
              <div className="hidden sm:block leading-tight">
                <span className="block text-xs font-bold text-on-surface">Ricardo Mendes</span>
                <span className="block text-[10px] font-medium text-on-surface-variant">
                  Diretor Tributário
                </span>
              </div>
            </button>
          </div>
        </header>

        {/* Active Screen */}
        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>

      {/* Toast Stack */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
          {toasts.map((toast) => {
            const palette =
              toast.variant === 'error'
                ? 'border-error/40 bg-white text-on-surface'
                : toast.variant === 'warning'
                ? 'border-tertiary/40 bg-white text-on-surface'
                : 'border-primary/30 bg-white text-on-surface';
            const iconColor =
              toast.variant === 'error'
                ? 'text-error'
                : toast.variant === 'warning'
                ? 'text-tertiary'
                : 'text-emerald-600';
            const iconName =
              toast.variant === 'error'
                ? 'error'
                : toast.variant === 'warning'
                ? 'warning'
                : toast.variant === 'info'
                ? 'info'
                : 'check_circle';

            return (
              <div
                key={toast.id}
                className={`pointer-events-auto rounded-xl border shadow-lg px-4 py-3 flex items-start gap-3 ${palette}`}
              >
                <span className={`material-symbols-outlined text-[20px] mt-0.5 ${iconColor}`}>
                  {iconName}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-on-surface">{toast.title}</p>
                  {toast.description && (
                    <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                      {toast.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="text-outline hover:text-on-surface p-0.5"
                  aria-label="Fechar notificação"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
