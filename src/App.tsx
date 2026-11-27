/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layout } from './components/Layout';
import { CrmProvider, useCrm } from './context/CrmContext';
import { AcoesRapidas } from './screens/AcoesRapidas';
import { AuditoriaDctfWebEfd } from './screens/AuditoriaDctfWebEfd';
import { CadastroUsuarios } from './screens/CadastroUsuarios';
import { CarteirasAtivas } from './screens/CarteirasAtivas';
import { CarteirasInativas } from './screens/CarteirasInativas';
import { ColetorLeads } from './screens/ColetorLeads';
import { ConciliacaoBancaria } from './screens/ConciliacaoBancaria';
import { ConfiguracoesGerais } from './screens/ConfiguracoesGerais';
import { ContratosHonorariosExito } from './screens/ContratosHonorariosExito';
import { GerenciamentoLeads } from './screens/GerenciamentoLeads';
import { ImportacaoSpedXml } from './screens/ImportacaoSpedXml';
import { IntimacoesPrazosEcac } from './screens/IntimacoesPrazosEcac';
import { LaudoTecnicoMemoria } from './screens/LaudoTecnicoMemoria';
import { ReceberContatos } from './screens/ReceberContatos';
import { RecuperacaoTributaria } from './screens/RecuperacaoTributaria';
import { RecursosCarf } from './screens/RecursosCarf';
import { RelatoriosMetricas } from './screens/RelatoriosMetricas';
import { TransmissaoPerDcomp } from './screens/TransmissaoPerDcomp';

const ScreenRouter: React.FC = () => {
  const { activeRoute } = useCrm();

  switch (activeRoute) {
    case 'acoes-rapidas':
      return <AcoesRapidas />;
    case 'receber-contatos':
      return <ReceberContatos />;
    case 'gerenciamento-de-leads':
      return <GerenciamentoLeads />;
    case 'coletor-de-leads':
      return <ColetorLeads />;
    case 'carteiras-ativas':
      return <CarteirasAtivas />;
    case 'carteiras-inativas':
      return <CarteirasInativas />;
    case 'recuperacao-tributaria':
      return <RecuperacaoTributaria />;
    case 'importacao-sped-xml':
      return <ImportacaoSpedXml />;
    case 'laudo-tecnico-memoria-de-calculo':
      return <LaudoTecnicoMemoria />;
    case 'transmissao-perdcomp-web':
      return <TransmissaoPerDcomp />;
    case 'conciliacao-bancaria':
      return <ConciliacaoBancaria />;
    case 'intimacoes-prazos-e-cac':
      return <IntimacoesPrazosEcac />;
    case 'recursos-carf':
      return <RecursosCarf />;
    case 'auditoria-dctfweb-efd':
      return <AuditoriaDctfWebEfd />;
    case 'contratos-honorarios-exito':
      return <ContratosHonorariosExito />;
    case 'relatorios-e-metricas':
      return <RelatoriosMetricas />;
    case 'cadastro-de-usuarios':
      return <CadastroUsuarios />;
    case 'configuracoes-gerais':
      return <ConfiguracoesGerais />;
    default:
      return <ReceberContatos />;
  }
};

export default function App() {
  return (
    <CrmProvider>
      <Layout>
        <ScreenRouter />
      </Layout>
    </CrmProvider>
  );
}
