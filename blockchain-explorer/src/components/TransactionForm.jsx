import React, { useState } from 'react';

const TransactionForm = ({ onSubmit, status }) => {
    const [formData, setFormData] = useState({ from: '', to: '', amount: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!onSubmit) return;
        const amountValue = Number(formData.amount);
        if (!Number.isFinite(amountValue) || amountValue <= 0) {
            return;
        }

        try {
            await onSubmit({
                from: formData.from.trim(),
                to: formData.to.trim(),
                amount: amountValue,
            });
            setFormData({ from: '', to: '', amount: '' });
        } catch (err) {
            console.error('Erro ao enviar transação', err);
        }
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Adicionar transação ao mempool</h2>
            <p className="mt-1 text-sm text-gray-500">
                Cadastre transações e acompanhe a mempool. Elas só entram na blockchain quando um bloco é minerado.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-3">
                <label className="text-sm font-medium text-gray-700 sm:col-span-1">
                    De
                    <input
                        type="text"
                        name="from"
                        value={formData.from}
                        onChange={handleChange}
                        className="mt-1 w-full rounded border border-gray-300 p-2"
                        required
                    />
                </label>
                <label className="text-sm font-medium text-gray-700 sm:col-span-1">
                    Para
                    <input
                        type="text"
                        name="to"
                        value={formData.to}
                        onChange={handleChange}
                        className="mt-1 w-full rounded border border-gray-300 p-2"
                        required
                    />
                </label>
                <label className="text-sm font-medium text-gray-700 sm:col-span-1">
                    Valor
                    <input
                        type="number"
                        name="amount"
                        step="0.0001"
                        min="0"
                        value={formData.amount}
                        onChange={handleChange}
                        className="mt-1 w-full rounded border border-gray-300 p-2"
                        required
                    />
                </label>
                <div className="sm:col-span-3 flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={status?.loading}
                        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-200"
                    >
                        {status?.loading ? 'Adicionando...' : 'Adicionar à mempool'}
                    </button>
                    {status?.message && (
                        <span className="text-sm text-green-600">{status.message}</span>
                    )}
                    {status?.error && (
                        <span className="text-sm text-red-600">{status.error}</span>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TransactionForm;