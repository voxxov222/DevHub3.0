
import React, { useState } from 'react';
import { GcpIcon, CloudRunIcon, CloudFunctionsIcon, GcsIcon, CloudSqlIcon, VertexAiIcon } from './Icons';
import { generateCode } from '../services/geminiService';

const ServiceCard: React.FC<{ name: string; description: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; onConfigure: () => void; }> = ({ name, description, icon: Icon, onConfigure }) => (
    <div className="bg-gray-700/50 p-6 rounded-lg flex flex-col h-full">
        <div className="flex items-center mb-4">
            <Icon className="w-8 h-8 mr-4" />
            <h3 className="text-xl font-bold text-white">{name}</h3>
        </div>
        <p className="text-gray-400 flex-grow mb-6">{description}</p>
        <button onClick={onConfigure} className="mt-auto w-full bg-brand-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Configure
        </button>
    </div>
);

const BillingConfirmationModal: React.FC<{ resourceName: string; onConfirm: () => void; onCancel: () => void }> = ({ resourceName, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-brand-danger mb-4">Billing Confirmation</h2>
            <p className="text-gray-300 mb-6">
                You are about to provision a new <span className="font-bold text-yellow-400">{resourceName}</span> resource on Google Cloud. This action may incur costs on your linked billing account.
            </p>
            <p className="text-sm text-gray-500 mb-6">Please ensure you have reviewed the pricing and have the necessary budget approvals.</p>
            <div className="flex justify-end space-x-4">
                <button onClick={onCancel} className="px-4 py-2 rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
                <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-white bg-brand-danger hover:bg-red-600 transition-colors">Confirm & Provision</button>
            </div>
        </div>
    </div>
);


const VertexAICodeGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedCode('');
        try {
            const code = await generateCode(`Generate a code snippet for the following task: ${prompt}. Only return the code, without any markdown formatting or explanations.`);
            setGeneratedCode(code);
        } catch (err) {
            setError('Failed to generate code. Please check your API key and try again.');
            console.error(err);
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-gray-900 rounded-lg shadow-lg mt-8">
            <div className="p-5 border-b border-gray-700 flex items-center">
                <VertexAiIcon className="w-8 h-8 mr-4" />
                <h2 className="text-xl font-semibold text-white">Vertex AI Code Assistant</h2>
            </div>
            <div className="p-6 space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A React component to fetch and display a list of users from an API"
                    className="w-full h-24 p-3 bg-gray-800 text-gray-200 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-primary focus:outline-none font-mono text-sm"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center bg-brand-secondary hover:bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : 'Generate Code'}
                </button>
                {error && <p className="text-brand-danger text-sm">{error}</p>}
                {generatedCode && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Generated Code:</h3>
                        <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto">
                            <code className="text-sm font-mono text-gray-200">{generatedCode}</code>
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};


export const GoogleCloudView: React.FC = () => {
    const [showModal, setShowModal] = useState<string | null>(null);

    const handleConfigure = (serviceName: string) => {
        setShowModal(serviceName);
    };
    
    const handleConfirm = () => {
        console.log(`Provisioning ${showModal}...`);
        setShowModal(null);
    };

    const handleCancel = () => {
        setShowModal(null);
    };

    const services = [
        { name: 'Cloud Run', description: 'Deploy and scale containerized applications serverlessly.', icon: CloudRunIcon },
        { name: 'Cloud Functions', description: 'Run your code in the cloud with no servers to manage.', icon: CloudFunctionsIcon },
        { name: 'Cloud Storage', description: 'Store and retrieve any amount of data at any time.', icon: GcsIcon },
        { name: 'Cloud SQL', description: 'Fully managed relational database service for MySQL, PostgreSQL, and SQL Server.', icon: CloudSqlIcon },
    ];
    
    return (
        <div className="p-6 md:p-10">
            <div className="flex items-center mb-8">
                <GcpIcon className="w-10 h-10 mr-4"/>
                <div>
                    <h1 className="text-3xl font-bold text-white">Google Cloud Integrations</h1>
                    <p className="text-gray-400 mt-1">Connect, configure, and deploy resources on Google Cloud.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {services.map(service => (
                    <ServiceCard 
                        key={service.name} 
                        name={service.name} 
                        description={service.description} 
                        icon={service.icon} 
                        onConfigure={() => handleConfigure(service.name)}
                    />
                ))}
            </div>

            <VertexAICodeGenerator />

            {showModal && <BillingConfirmationModal resourceName={showModal} onConfirm={handleConfirm} onCancel={handleCancel} />}
        </div>
    );
};
