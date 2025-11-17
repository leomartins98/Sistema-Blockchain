import { useState, useEffect, useCallback } from 'react';
import {
    fetchBlocks,
    fetchPendingTransactions,
    fetchBalances,
    validateBlockchain,
} from '../api/client';

const useBlockchainData = () => {
    const [blocks, setBlocks] = useState([]);
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [balances, setBalances] = useState([]);
    const [isChainValid, setIsChainValid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [blocksData, pendingData, balancesData, valid] = await Promise.all([
                fetchBlocks(),
                fetchPendingTransactions(),
                fetchBalances(),
                validateBlockchain(),
            ]);
            setBlocks(blocksData);
            setPendingTransactions(pendingData);
            setBalances(balancesData);
            setIsChainValid(valid);
        } catch (err) {
            console.error('Error loading blockchain data:', err);
            setError(
                err?.response?.data?.message || err?.message || 'Erro ao carregar blockchain',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        blocks,
        pendingTransactions,
        balances,
        isChainValid,
        loading,
        error,
        refresh,
    };
};

export default useBlockchainData;