
import React, { useState } from 'react';
import { SecretsIcon } from './Icons';

interface Secret {
  name: string;
  value: string;
  lastUpdated: string;
}

const initialSecrets: Secret[] = [
  { name: 'GITHUB_TOKEN', value: 'ghp_********************************', lastUpdated: '2 weeks ago' },
  { name: 'ALCHEMY_API_KEY', value: '********-****-****-****-************', lastUpdated: '1 month ago' },
  { name: 'THIRDWEB_CLIENT_ID', value: '********************************', lastUpdated: '3 days ago' },
];

export const SecretsManagerView: React.FC = () => {
    const [secrets, setSecrets] = useState<Secret[]>(initialSecrets);
    const [newSecretName, setNewSecretName] = useState('');
    const [newSecretValue, setNewSecretValue] = useState('');

    const addSecret = () => {
        if (!newSecretName || !newSecretValue) return;
        const newSecret: Secret = {
            name: newSecretName.toUpperCase().replace(/\s/g, '_'),
            value: '********************************', // Mask value for display
            lastUpdated: 'Just now'
        };
        setSecrets([...secrets, newSecret]);
        setNewSecretName('');
        setNewSecretValue('');
    };
    
    return (
        <div className="p-6 md:p-10">
            <div className="flex items-center mb-8">
                <SecretsIcon className="w-10 h-10 mr-4"/>
                <div>
                    <h1 className="text-3xl font-bold text-white">Secrets Manager</h1>
                    <p className="text-gray-400 mt-1">Securely manage your API keys, tokens, and other environment variables.</p>
                </div>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-white">Add New Secret</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label htmlFor="secret-name" className="block text-sm font-medium text-gray-300 mb-2">Secret Name</label>
                        <input
                            id="secret-name"
                            type="text"
                            value={newSecretName}
                            onChange={(e) => setNewSecretName(e.target.value)}
                            placeholder="e.g., STRIPE_API_KEY"
                            className="w-full p-3 bg-gray-800 text-gray-200 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-primary focus:outline-none font-mono text-sm"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="secret-value" className="block text-sm font-medium text-gray-300 mb-2">Secret Value</label>
                        <input
                            id="secret-value"
                            type="password"
                            value={newSecretValue}
                            onChange={(e) => setNewSecretValue(e.target.value)}
                            placeholder="Paste your secret value here"
                            className="w-full p-3 bg-gray-800 text-gray-200 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-primary focus:outline-none font-mono text-sm"
                        />
                    </div>
                    <button onClick={addSecret} className="md:col-span-1 bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Add Secret
                    </button>
                </div>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-300">Name</th>
                            <th className="p-4 text-sm font-semibold text-gray-300">Value</th>
                            <th className="p-4 text-sm font-semibold text-gray-300">Last Updated</th>
                            <th className="p-4 text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {secrets.map((secret, index) => (
                            <tr key={index}>
                                <td className="p-4 font-mono text-sm text-brand-accent">{secret.name}</td>
                                <td className="p-4 font-mono text-sm text-gray-400">{secret.value}</td>
                                <td className="p-4 text-sm text-gray-400">{secret.lastUpdated}</td>
                                <td className="p-4">
                                    <button className="text-brand-danger hover:text-red-400 text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
