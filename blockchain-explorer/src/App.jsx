import React, { useEffect, useMemo, useState } from 'react';
import BlockCard from './components/BlockCard';
import BlockDetails from './components/BlockDetails';
import PendingTransactions from './components/PendingTransactions';
import TransactionForm from './components/TransactionForm';
import MineControls from './components/MineControls';
import BalancePanel from './components/BalancePanel';
import useBlockchainData from './hooks/useBlockchainData';
import { createTransaction, minePendingTransactions } from './api/client';

const App = () => {
    const {
        blocks,
        pendingTransactions,
        balances,
        isChainValid,
        loading,
        error,
        refresh,
    } = useBlockchainData();

    const [selectedBlock, setSelectedBlock] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState({ loading: false, message: '', error: '' });
    const [miningState, setMiningState] = useState({ loading: false, result: null, error: null });

    useEffect(() => {
        if (!selectedBlock && blocks.length > 0) {
            setSelectedBlock(blocks[0]);
        }
    }, [blocks, selectedBlock]);

    const blockStats = useMemo(() => ({
        totalBlocks: blocks.length,
        totalTransactions: blocks.reduce((sum, block) => sum + (block.transactions?.length || 0), 0),
    }), [blocks]);

    const handleTransactionSubmit = async ({ from, to, amount }) => {
        setTransactionStatus({ loading: true, message: '', error: '' });
        try {
            const response = await createTransaction({ from, to, amount });
            await refresh();
            setTransactionStatus({
                loading: false,
                message: response?.message || 'Transação adicionada ao mempool',
                error: '',
            });
        } catch (err) {
            console.error('Erro ao adicionar transação', err);
            setTransactionStatus({
                loading: false,
                message: '',
                error: err?.response?.data?.detail || err?.message || 'Falha ao adicionar transação',
            });
        }
    };

    const handleMine = async (minerAddress) => {
        setMiningState({ loading: true, result: null, error: null });
        try {
            const result = await minePendingTransactions(minerAddress);
            setMiningState({ loading: false, result, error: null });
            await refresh();
        } catch (err) {
            console.error('Erro ao minerar bloco', err);
            setMiningState({
                loading: false,
                result: null,
                error: err?.response?.data?.detail || err?.message || 'Falha na mineração',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="container mx-auto px-6 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Mini blockchain educacional</p>
                        <h1 className="text-2xl font-bold text-gray-900">Blockchain Explorer</h1>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <div>
                            <p className="text-gray-500">Blocos</p>
                            <p className="text-xl font-semibold text-gray-900">{blockStats.totalBlocks}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Transações</p>
                            <p className="text-xl font-semibold text-gray-900">{blockStats.totalTransactions}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Status</p>
                            <p className={`text-xl font-semibold ${isChainValid ? 'text-green-600' : 'text-red-600'}`}>
                                {isChainValid ? 'Válida' : 'Inválida'}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-6">
                {error && (
                    <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}. Verifique se o backend Python está rodando na porta configurada.
                    </div>
                )}

                {loading ? (
                    <div className="flex h-40 items-center justify-center text-gray-500">Carregando blockchain...</div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        <section className="lg:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Blocos</h2>
                                <button
                                    type="button"
                                    onClick={refresh}
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                                >
                                    Atualizar
                                </button>
                            </div>
                            <div className="grid gap-4">
                                {blocks.map((block) => (
                                    <BlockCard
                                        key={block.hash || block.index}
                                        block={block}
                                        isSelected={selectedBlock?.hash === block.hash}
                                        onSelect={() => setSelectedBlock(block)}
                                    />
                                ))}
                                {!blocks.length && (
                                    <div className="rounded border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                                        Nenhum bloco encontrado. Minere o bloco gênesis utilizando o backend.
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="rounded-lg bg-white p-4 shadow">
                                <h2 className="text-lg font-semibold text-gray-900">Detalhes do Bloco</h2>
                                {selectedBlock ? (
                                    <BlockDetails block={selectedBlock} />
                                ) : (
                                    <p className="pt-4 text-sm text-gray-500">Selecione um bloco para ver os detalhes completos.</p>
                                )}
                            </div>
                            <div className="rounded-lg bg-white p-4 shadow">
                                <PendingTransactions transactions={pendingTransactions} />
                            </div>
                            <MineControls
                                onMine={handleMine}
                                status={miningState}
                                pendingCount={pendingTransactions.length}
                            />
                            <BalancePanel balances={balances} />
                        </section>
                    </div>
                )}

                <section className="mt-8">
                    <TransactionForm onSubmit={handleTransactionSubmit} status={transactionStatus} />
                </section>
            </main>
        </div>
    );
};

export default App;