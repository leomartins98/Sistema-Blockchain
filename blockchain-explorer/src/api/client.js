import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const client = axios.create({
    baseURL: `${API_BASE_URL.replace(/\/$/, '')}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

const normalizeArrayResponse = (payload, key) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (key && Array.isArray(payload[key])) return payload[key];
    if (Array.isArray(payload.data)) return payload.data;
    return [];
};

export const fetchBlocks = async () => {
    const { data } = await client.get('/blocks');
    return normalizeArrayResponse(data, 'blocks');
};

export const fetchPendingTransactions = async () => {
    const { data } = await client.get('/pending-transactions');
    return normalizeArrayResponse(data, 'transactions');
};

export const fetchBalances = async () => {
    const { data } = await client.get('/balances');
    const balancesArray = normalizeArrayResponse(data, 'balances');
    return balancesArray.map((item) => ({
        address: item.address,
        balance: Number(item.balance) || 0,
    }));
};

export const validateBlockchain = async () => {
    const { data } = await client.get('/validate-chain');
    if (typeof data === 'boolean') return data;
    if (typeof data?.isValid === 'boolean') return data.isValid;
    return false;
};

export const createTransaction = async (txPayload) => {
    const { data } = await client.post('/transactions', txPayload);
    return data;
};

export const minePendingTransactions = async (minerAddress) => {
    const body = minerAddress ? { miner: minerAddress } : {};
    const { data } = await client.post('/mine', body);
    return data;
};

export default client;