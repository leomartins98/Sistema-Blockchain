import React from 'react';

const BlockDetails = ({ block }) => {
    if (!block) return null;
    const previousHash = block.previous_hash || block.previousHash || '—';
    const timestamp = block.timestamp || block.mined_at || block.minedAt;

    return (
        <div className="pt-4 text-sm text-gray-700">
            <div className="mb-2">
                <span className="font-semibold">Index:</span> {block.index}
            </div>
            <div className="mb-2 break-all font-mono text-xs">
                <span className="font-semibold text-gray-600">Hash:</span> {block.hash}
            </div>
            <div className="mb-2 break-all font-mono text-xs">
                <span className="font-semibold text-gray-600">Previous Hash:</span> {previousHash}
            </div>
            <div className="mb-2">
                <span className="font-semibold">Nonce:</span> {block.nonce}
            </div>
            {timestamp && (
                <div className="mb-4">
                    <span className="font-semibold">Timestamp:</span>{' '}
                    {new Date(Number(timestamp) * 1000).toLocaleString()}
                </div>
            )}
            <div>
                <span className="font-semibold">Transações ({block.transactions?.length || 0}):</span>
                {block.transactions?.length ? (
                    <ul className="mt-2 space-y-2">
                        {block.transactions.map((tx, index) => (
                            <li key={index} className="rounded border border-gray-100 bg-gray-50 p-2">
                                <p className="text-xs">
                                    <span className="font-semibold">De:</span> {tx.from}
                                </p>
                                <p className="text-xs">
                                    <span className="font-semibold">Para:</span> {tx.to}
                                </p>
                                <p className="text-xs">
                                    <span className="font-semibold">Valor:</span> {tx.amount}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-2 text-xs text-gray-500">Sem transações neste bloco.</p>
                )}
            </div>
        </div>
    );
};

export default BlockDetails;