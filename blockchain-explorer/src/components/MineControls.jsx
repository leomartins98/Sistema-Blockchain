import React, { useState } from 'react';

const MineControls = ({ onMine, status, pendingCount = 0 }) => {
    const [miner, setMiner] = useState('Miner1');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!onMine) return;
        const minerAddress = miner.trim() || 'Miner1';
        onMine(minerAddress);
    };

    const minedHash = status?.result?.hash || status?.result?.block?.hash;
    const chainIsValid = status?.result?.isValid;

    const disabled = status?.loading || pendingCount === 0;

    return (
        <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Minerar bloco</h2>
                    <p className="text-sm text-gray-500">
                        Executa o proof-of-work com todas as transações pendentes e envia a recompensa para o minerador.
                    </p>
                </div>
                <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    Dificuldade fixa: 4
                </div>
            </div>
            <form
                onSubmit={handleSubmit}
                className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
            >
                <label className="flex-1 text-sm font-medium text-gray-700">
                    Endereço do minerador
                    <input
                        type="text"
                        value={miner}
                        onChange={(event) => setMiner(event.target.value)}
                        className="mt-1 w-full rounded border border-gray-300 p-2"
                        placeholder="Miner1"
                    />
                </label>
                <button
                    type="submit"
                    disabled={disabled}
                    className="w-full rounded border border-green-600 bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:border-green-200 disabled:bg-green-200 sm:w-auto"
                >
                    {status?.loading ? 'Minerando...' : 'Minerar pendentes'}
                </button>
            </form>
            {pendingCount === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                    Sem transações pendentes. Adicione novas transações antes de minerar.
                </p>
            )}
            {status?.error && (
                <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {status.error}
                </div>
            )}
            {minedHash && (
                <div className="mt-4 rounded border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                    <p className="font-semibold">Hash encontrado:</p>
                    <p className="break-all font-mono text-xs">{minedHash}</p>
                    {typeof chainIsValid === 'boolean' && (
                        <p className="mt-2">
                            Blockchain {chainIsValid ? 'permanece válida ✅' : 'ficou inválida ⚠️'}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MineControls;
