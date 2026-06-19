import React, { useState, useEffect } from 'react';
import { Trash2, Plus, TrendingDown, Calendar, Tag, Settings, X, DollarSign, TrendingUp, ChevronDown, Lock } from 'lucide-react';
import ReactDOM from 'react-dom/client';

// ALTERE A SUA SENHA AQUI ABAIXO:
const SENHA_CORRETA = 'cmcg2408';

export default function PainelDespesas() {
  // Controle de Autenticação
  const [autenticado, setAutenticado] = useState(() => {
    return localStorage.getItem('app_autenticado') === 'true';
  });
  const [senhaInput, setSenhaInput] = useState('');
  const [erroSenha, setErroSenha] = useState(false);

  // Estado do mês selecionado
  const [mesSelecionado, setMesSelecionado] = useState(new Date().toISOString().slice(0, 7));
  const [mesesDisponiveis, setMesesDisponiveis] = useState([]);
 
  // Carregar dados do localStorage por mês
  const [despesas, setDespesas] = useState(() => {
    const saved = localStorage.getItem(`despesas_${mesSelecionado}`);
    return saved ? JSON.parse(saved) : (mesSelecionado === '2026-06' ? [
      { id: 1, valor: 4.50, categoria: 'Transporte', data: '2026-06-16', descricao: '' },
      { id: 2, valor: 100.00, categoria: 'João Felipe', data: '2026-06-16', descricao: '' }
    ] : []);
  });
 
  const [receitas, setReceitas] = useState(() => {
    const saved = localStorage.getItem(`receitas_${mesSelecionado}`);
    return saved ? JSON.parse(saved) : {};
  });
 
  const [metas, setMetas] = useState(() => {
    const saved = localStorage.getItem(`metas_${mesSelecionado}`);
    return saved ? JSON.parse(saved) : {};
  });
 
  // Estados da interface
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('Moradia');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [mostrarConfigMetas, setMostrarConfigMetas] = useState(false);
  const [metasTemp, setMetasTemp] = useState({});
  const [mostrarConfigReceita, setMostrarConfigReceita] = useState(false);
  const [novaReceita, setNovaReceita] = useState('');
  const [mostrarSeletorMes, setMostrarSeletorMes] = useState(false);
 
  const categorias = [
    'Moradia',
    'Alimentação',
    'João Felipe',
    'Transporte',
    'Saúde',
    'Telefonia/Internet',
    'Cartão de Crédito',
    'Dívidas',
    'Narcóticos Anônimos / Igreja',
    'Lazer',
    'Outros Gastos',
    'Reserva de Emergência',
    'Aumento de Limite do Cartão'
  ];
  
  const cores = {
    'Moradia': '#a78bfa',
    'Alimentação': '#10b981',
    'João Felipe': '#ec4899',
    'Transporte': '#06b6d4',
    'Saúde': '#f97316',
    'Telefonia/Internet': '#06b6d4',
    'Cartão de Crédito': '#f59e0b',
    'Dívidas': '#ef4444',
    'Narcóticos Anônimos / Igreja': '#8b5cf6',
    'Lazer': '#eab308',
    'Outros Gastos': '#64748b',
    'Reserva de Emergência': '#14b8a6',
    'Aumento de Limite do Cartão': '#6366f1'
  };
 
  // Gerar lista de meses de junho/2026 até junho/2027
  useEffect(() => {
    const meses = [];
    for (let i = 0; i < 13; i++) {
      const data = new Date(2026, 5 + i, 1);
      const mesStr = data.toISOString().slice(0, 7);
      meses.push(mesStr);
    }
    setMesesDisponiveis(meses);
  }, []);
 
  // Atualizar dados quando mês muda
  useEffect(() => {
    if (!autenticado) return;
    const savedDespesas = localStorage.getItem(`despesas_${mesSelecionado}`);
    setDespesas(savedDespesas ? JSON.parse(savedDespesas) : (mesSelecionado === '2026-06' ? [
      { id: 1, valor: 4.50, categoria: 'Transporte', data: '2026-06-16', descricao: '' },
      { id: 2, valor: 100.00, categoria: 'João Felipe', data: '2026-06-16', descricao: '' }
    ] : []));
 
    const savedReceitas = localStorage.getItem(`receitas_${mesSelecionado}`);
    setReceitas(savedReceitas ? JSON.parse(savedReceitas) : {});
 
    const savedMetas = localStorage.getItem(`metas_${mesSelecionado}`);
    setMetas(savedMetas ? JSON.parse(savedMetas) : {});
 
    setFiltroCategoria('Todas');
    setMostrarSeletorMes(false);
  }, [mesSelecionado, autenticado]);
 
  // Salvar dados no localStorage
  useEffect(() => {
    if (autenticado) localStorage.setItem(`despesas_${mesSelecionado}`, JSON.stringify(despesas));
  }, [despesas, mesSelecionado, autenticado]);
 
  useEffect(() => {
    if (autenticado) localStorage.setItem(`receitas_${mesSelecionado}`, JSON.stringify(receitas));
  }, [receitas, mesSelecionado, autenticado]);
 
  useEffect(() => {
    if (autenticado) localStorage.setItem(`metas_${mesSelecionado}`, JSON.stringify(metas));
  }, [metas, mesSelecionado, autenticado]);
 
  useEffect(() => {
    if (mostrarConfigMetas) setMetasTemp({ ...metas });
  }, [mostrarConfigMetas, metas]);
 
  useEffect(() => {
    if (mostrarConfigReceita) setNovaReceita((receitas.valor || 0).toString());
  }, [mostrarConfigReceita, receitas]);
 
  const verificarSenha = () => {
    if (senhaInput === SENHA_CORRETA) {
      setAutenticado(true);
      setErroSenha(false);
      localStorage.setItem('app_autenticado', 'true');
    } else {
      setErroSenha(true);
      setSenhaInput('');
    }
  };

  const fazerLogout = () => {
    setAutenticado(false);
    localStorage.removeItem('app_autenticado');
  };
 
  const adicionarDespesa = () => {
    if (novoValor && parseFloat(novoValor) > 0) {
      const dataAtual = new Date().toISOString().split('T')[0];
      const novaDespesa = {
        id: Date.now(),
        valor: parseFloat(novoValor),
        categoria: novaCategoria,
        data: dataAtual,
        descricao: novaDescricao
      };
      setDespesas([novaDespesa, ...despesas]);
      setNovoValor('');
      setNovaDescricao('');
      setNovaCategoria('Moradia');
    }
  };
 
  const removeDespesa = (id) => {
    setDespesas(despesas.filter(d => d.id !== id));
  };
 
  const salvarMetas = () => {
    setMetas(metasTemp);
    setMostrarConfigMetas(false);
  };
 
  const salvarReceita = () => {
    if (novaReceita && parseFloat(novaReceita) >= 0) {
      const dataAtual = new Date().toISOString().split('T')[0];
      setReceitas({
        valor: parseFloat(novaReceita),
        data: dataAtual
      });
      setMostrarConfigReceita(false);
    }
  };
 
  const despesasFiltradas = despesas.filter(d => {
    const catMatch = filtroCategoria === 'Todas' || d.categoria === filtroCategoria;
    return catMatch;
  });
 
  const totalGasto = despesasFiltradas.reduce((sum, d) => sum + d.valor, 0);
  const receitaMensal = receitas.valor || 0;
  const saldo = receitaMensal - totalGasto;
 
  const gastosPorCategoria = categorias.map(cat => ({
    categoria: cat,
    total: despesas.filter(d => d.categoria === cat).reduce((sum, d) => sum + d.valor, 0),
    quantidade: despesas.filter(d => d.categoria === cat).length,
    meta: metas[cat] || 0
  })).filter(c => c.total > 0 || c.meta > 0).sort((a, b) => b.total - a.total);
 
  const formatarData = (data) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };
 
  const obterNomeMes = (mesStr) => {
    const [ano, mes] = mesStr.split('-');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${meses[parseInt(mes) - 1]} ${ano}`;
  };
 
  const calcularPercentualMeta = (gasto, meta) => {
    if (meta === 0) return 0;
    return Math.min((gasto / meta) * 100, 100);
  };
 
  const obterCorStatusMeta = (gasto, meta) => {
    if (meta === 0) return '#64748b';
    if (gasto <= meta * 0.8) return '#10b981';
    if (gasto <= meta) return '#f59e0b';
    return '#ef4444';
  };
 
  const obterCorSaldo = () => {
    if (saldo > 0) return '#10b981';
    if (saldo === 0) return '#f59e0b';
    return '#ef4444';
  };
 
  const obterStatusSaldo = () => {
    if (saldo > 0) return '✓ Superávit';
    if (saldo === 0) return '= Equilibrado';
    return '✕ Déficit';
  };
 
  // Se NÃO estiver autenticado, mostra a tela de bloqueio
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-xl border-2 border-purple-500/30 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <Lock size={28} className="text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Acesso Restrito</h2>
          <p className="text-sm text-gray-400 mb-6">Insira a senha para acessar o painel de finanças.</p>
          
          <div className="space-y-4">
            <input
              type="password"
              value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && verificarSenha()}
              placeholder="Digite a senha"
              className="w-full px-4 py-3 rounded-lg text-white bg-slate-950 border border-slate-700 placeholder-gray-600 text-center focus:outline-none focus:border-purple-500 transition-all"
            />
            
            {erroSenha && (
              <p className="text-xs text-red-400 font-medium">⚠️ Senha incorreta. Tente novamente.</p>
            )}

            <button
              onClick={verificarSenha}
              className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-slate-950 font-bold rounded-lg transition-all shadow-lg shadow-purple-500/20"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se ESTIVER autenticado, mostra o app original
  return (
    <div className="min-h-screen pb-12 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#a78bfa' }}>
              Controle de Finanças Pessoais
            </h1>
            <p className="text-gray-400">Acompanhe receitas, despesas e saldo em tempo real • Dados salvos automaticamente</p>
          </div>
          <button 
            onClick={fazerLogout}
            className="px-4 py-2 bg-slate-900 border border-red-500/40 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/10 transition-all self-start sm:self-center"
          >
            Sair do App
          </button>
        </div>
 
        {/* Seletor de Mês */}
        <div className="mb-8 relative">
          <button
            onClick={() => setMostrarSeletorMes(!mostrarSeletorMes)}
            className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition"
            style={{ background: '#1a1a2e', borderColor: '#06b6d4', borderWidth: '2px', color: '#06b6d4' }}
          >
            <Calendar size={20} />
            {obterNomeMes(mesSelecionado)}
            <ChevronDown size={20} style={{ transform: mostrarSeletorMes ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
 
          {mostrarSeletorMes && (
            <div className="absolute top-16 left-0 w-64 max-h-96 overflow-y-auto rounded-lg border-2 z-50" style={{ background: '#1a1a2e', borderColor: '#06b6d4' }}>
              {mesesDisponiveis.map(mes => (
                <button
                  key={mes}
                  onClick={() => setMesSelecionado(mes)}
                  className="w-full px-4 py-3 text-left hover:bg-purple-500/20 transition flex items-center gap-2"
                  style={{
                    background: mesSelecionado === mes ? '#06b6d4' : 'transparent',
                    color: mesSelecionado === mes ? '#000' : '#a78bfa',
                    borderBottom: '1px solid #333'
                  }}
                >
                  <Calendar size={16} />
                  {obterNomeMes(mes)}
                  {mesSelecionado === mes && <span className="ml-auto">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Painel Esquerda */}
          <div className="lg:col-span-1">
            {/* SALDO - NO TOPO */}
            <div className="p-8 rounded-lg border-2 mb-6" style={{ background: '#1a1a2e', borderColor: obterCorSaldo() }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold" style={{ color: obterCorSaldo() }}>SALDO</h2>
                <DollarSign size={32} style={{ color: obterCorSaldo() }} />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  Receita: <span className="text-green-400 font-semibold">R$ {receitaMensal.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-400">
                  Despesas: <span className="text-red-400 font-semibold">R$ {totalGasto.toFixed(2)}</span>
                </p>
                <div className="h-px my-4" style={{ background: '#333' }}></div>
                <p className="text-4xl font-bold" style={{ color: obterCorSaldo() }}>
                  R$ {saldo.toFixed(2)}
                </p>
                <p className="text-lg font-semibold" style={{ color: obterCorSaldo() }}>
                  {obterStatusSaldo()}
                </p>
              </div>
            </div>
 
            {/* Nova Despesa */}
            <div className="p-6 rounded-lg border mb-6" style={{ background: '#1a1a2e', borderColor: '#06b6d4', borderWidth: '2px' }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#06b6d4' }}>Nova Despesa</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#a78bfa' }}>Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoValor}
                    onChange={(e) => setNovoValor(e.target.value)}
                    placeholder="0,00"
                    className="w-full px-4 py-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition"
                    style={{ background: '#0f172a' }}
                    onKeyPress={(e) => e.key === 'Enter' && adicionarDespesa()}
                  />
                </div>
 
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#a78bfa' }}>Categoria</label>
                  <select
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 transition"
                    style={{ background: '#0f172a' }}
                  >
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
 
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#a78bfa' }}>Descrição (opcional)</label>
                  <input
                    type="text"
                    value={novaDescricao}
                    onChange={(e) => setNovaDescricao(e.target.value)}
                    placeholder="Ex: Ônibus para clínica"
                    className="w-full px-4 py-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition"
                    style={{ background: '#0f172a' }}
                  />
                </div>
 
                <button
                  onClick={adicionarDespesa}
                  className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #10b981)', color: '#000' }}
                >
                  <Plus size={20} />
                  Adicionar
                </button>
              </div>
            </div>
 
            {/* Receita Mensal - AGORA EMBAIXO */}
            <div className="p-6 rounded-lg border mb-6" style={{ background: '#1a1a2e', borderColor: '#10b981', borderWidth: '2px' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#10b981' }}>
                  <TrendingUp size={20} />
                  Receita Mensal
                </h2>
                <button
                  onClick={() => setMostrarConfigReceita(true)}
                  className="p-2 hover:bg-green-500/20 rounded-lg transition"
                  style={{ color: '#10b981' }}
                >
                  <Settings size={20} />
                </button>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#0f172a' }}>
                <p className="text-xs text-gray-400 mb-1">Mês: {obterNomeMes(mesSelecionado)}</p>
                <p className="text-3xl font-bold" style={{ color: '#10b981' }}>
                  R$ {receitaMensal.toFixed(2)}
                </p>
                {receitas.data && (
                  <p className="text-xs text-gray-500 mt-2">Registrada em: {formatarData(receitas.data)}</p>
                )}
              </div>
            </div>
 
            {/* Resumo Rápido */}
            <div className="space-y-3">
              <div className="p-4 rounded-lg border-l-4" style={{ background: '#1a1a2e', borderColor: '#8b5cf6' }}>
                <p className="text-xs text-gray-400">Total Gasto</p>
                <p className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>
                  R$ {totalGasto.toFixed(2)}
                </p>
              </div>
              <div className="p-4 rounded-lg border-l-4" style={{ background: '#1a1a2e', borderColor: '#f59e0b' }}>
                <p className="text-xs text-gray-400">Transações</p>
                <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
                  {despesasFiltradas.length}
                </p>
              </div>
              <div className="p-4 rounded-lg border-l-4" style={{ background: '#1a1a2e', borderColor: obterCorSaldo() }}>
                <p className="text-xs text-gray-400">{obterStatusSaldo()}</p>
                <p className="text-2xl font-bold" style={{ color: obterCorSaldo() }}>
                  R$ {Math.abs(saldo).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
 
          {/* Painel Central e Direita */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Metas por Categoria */}
            {gastosPorCategoria.length > 0 && (
              <div className="p-6 rounded-lg border" style={{ background: '#1a1a2e', borderColor: '#a78bfa', borderWidth: '1px' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#a78bfa' }}>
                    <Tag size={20} />
                    Metas & Gastos por Categoria
                  </h2>
                  <button
                    onClick={() => setMostrarConfigMetas(true)}
                    className="p-2 hover:bg-purple-500/20 rounded-lg transition"
                    style={{ color: '#a78bfa' }}
                  >
                    <Settings size={20} />
                  </button>
                </div>
                <div className="space-y-3">
                  {gastosPorCategoria.map(cat => (
                    <div key={cat.categoria} className="p-4 rounded-lg" style={{ background: '#0f172a' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ background: cores[cat.categoria] }}></div>
                          <div>
                            <p className="text-sm font-medium text-white">{cat.categoria}</p>
                            <p className="text-xs text-gray-400">{cat.quantidade} transação(ões)</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold" style={{ color: cores[cat.categoria] }}>
                            R$ {cat.total.toFixed(2)}
                          </p>
                          {cat.meta > 0 && (
                            <p className="text-xs text-gray-400">
                              Meta: R$ {cat.meta.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {cat.meta > 0 && (
                        <div className="w-full h-2 rounded-full" style={{ background: '#1a1a2e' }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${calcularPercentualMeta(cat.total, cat.meta)}%`,
                              background: obterCorStatusMeta(cat.total, cat.meta)
                            }}
                          ></div>
                        </div>
                      )}
                      
                      {cat.meta > 0 && (
                        <div className="mt-2 flex justify-between items-center text-xs">
                          <span style={{ color: obterCorStatusMeta(cat.total, cat.meta) }}>
                            {cat.total <= cat.meta * 0.8 ? '✓ No Caminho' : cat.total <= cat.meta ? '⚠ Próximo do Limite' : '✕ Acima da Meta'}
                          </span>
                          <span className="text-gray-500">
                            {calcularPercentualMeta(cat.total, cat.meta).toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
 
            {/* Lista de Despesas */}
            <div className="p-6 rounded-lg border" style={{ background: '#1a1a2e', borderColor: '#06b6d4', borderWidth: '1px' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#06b6d4' }}>
                  <TrendingDown size={20} />
                  Transações de {obterNomeMes(mesSelecionado)}
                </h2>
              </div>
 
              <div className="mb-4 flex flex-wrap gap-2">
                {['Todas', ...categorias].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFiltroCategoria(cat)}
                    className="px-3 py-1 rounded-full text-sm transition-all"
                    style={{
                      background: filtroCategoria === cat ? (cores[cat] || '#8b5cf6') : '#0f172a',
                      color: filtroCategoria === cat ? '#000' : '#a78bfa',
                      borderColor: cores[cat] || '#8b5cf6',
                      borderWidth: '1px'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
 
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {despesasFiltradas.length > 0 ? (
                  despesasFiltradas.map(despesa => (
                    <div
                      key={despesa.id}
                      className="flex items-center justify-between p-4 rounded-lg hover:shadow-lg transition"
                      style={{ background: '#0f172a', borderLeft: `3px solid ${cores[despesa.categoria]}` }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-white">{despesa.categoria}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {formatarData(despesa.data)}
                          </span>
                        </div>
                        {despesa.descricao && (
                          <p className="text-sm text-gray-400">{despesa.descricao}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="text-lg font-bold"
                          style={{ color: cores[despesa.categoria] }}
                        >
                          R$ {despesa.valor.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeDespesa(despesa.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <p>Nenhuma despesa encontrada</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* Modal Metas */}
      {mostrarConfigMetas && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg border-2 p-8 max-w-md w-full" style={{ borderColor: '#a78bfa' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: '#a78bfa' }}>Configurar Metas Mensais</h3>
              <button
                onClick={() => setMostrarConfigMetas(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>
 
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {categorias.map(cat => (
                <div key={cat}>
                  <label className="block text-sm mb-2 text-gray-300">{cat}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={metasTemp[cat] || ''}
                    onChange={(e) => setMetasTemp({
                      ...metasTemp,
                      [cat]: e.target.value ? parseFloat(e.target.value) : 0
                    })}
                    placeholder="0,00"
                    className="w-full px-3 py-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition"
                    style={{ background: '#0f172a' }}
                  />
                </div>
              ))}
            </div>
 
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setMostrarConfigMetas(false)}
                className="flex-1 px-4 py-2 rounded-lg text-white transition"
                style={{ background: '#1a1a2e', borderColor: '#64748b', borderWidth: '1px' }}
              >
                Cancelar
              </button>
              <button
                onClick={salvarMetas}
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition hover:shadow-lg"
                style={{ background: '#a78bfa', color: '#000' }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* Modal Receita */}
      {mostrarConfigReceita && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg border-2 p-8 max-w-md w-full" style={{ borderColor: '#10b981' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: '#10b981' }}>Receita de {obterNomeMes(mesSelecionado)}</h3>
              <button
                onClick={() => setMostrarConfigReceita(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>
 
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-300">Valor da Receita (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={novaReceita}
                  onChange={(e) => setNovaReceita(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition text-lg"
                  style={{ background: '#0f172a' }}
                  onKeyPress={(e) => e.key === 'Enter' && salvarReceita()}
                />
              </div>
              <p className="text-xs text-gray-400">
                Insira sua receita mensal total (salário, extras, etc)
              </p>
            </div>
 
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setMostrarConfigReceita(false)}
                className="flex-1 px-4 py-2 rounded-lg text-white transition"
                style={{ background: '#1a1a2e', borderColor: '#64748b', borderWidth: '1px' }}
              >
                Cancelar
              </button>
              <button
                onClick={salvarReceita}
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition hover:shadow-lg"
                style={{ background: '#10b981', color: '#000' }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PainelDespesas />
  </React.StrictMode>,
)
