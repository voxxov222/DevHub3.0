
import React, { useState } from 'react';
import { DeployIcon, DockerIcon, CloudRunIcon, K8sIcon } from './Icons';

type DeployTarget = 'CloudRun' | 'DockerSelfHosted' | 'Kubernetes';

const TargetCard: React.FC<{ name: string; icon: React.ReactNode; selected: boolean; onClick: () => void }> = ({ name, icon, selected, onClick }) => (
    <button
        onClick={onClick}
        className={`p-6 rounded-lg border-2 text-center transition-all duration-200 ${selected ? 'border-brand-primary bg-blue-500/10' : 'border-gray-700 bg-gray-700/50 hover:border-gray-500'}`}
    >
        {icon}
        <p className={`mt-2 font-semibold ${selected ? 'text-brand-primary' : 'text-white'}`}>{name}</p>
    </button>
);


export const DeployerView: React.FC = () => {
    const [target, setTarget] = useState<DeployTarget>('CloudRun');
    const [port, setPort] = useState('8080');
    const [isDeploying, setIsDeploying] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const handleDeploy = () => {
        setIsDeploying(true);
        setLogs(['Deployment process started...']);

        const deploymentSteps = [
            'Connecting to repository...',
            'Building Docker image...',
            'Pushing image to artifact registry...',
            `Deploying to ${target} on port ${port}...`,
            'Verifying service health...',
            'Deployment successful! Endpoint is live.'
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < deploymentSteps.length) {
                setLogs(prev => [...prev, deploymentSteps[i]]);
                i++;
            } else {
                clearInterval(interval);
                setIsDeploying(false);
            }
        }, 1000);
    };

    return (
        <div className="p-6 md:p-10">
            <div className="flex items-center mb-8">
                <DeployIcon className="w-10 h-10 mr-4"/>
                <div>
                    <h1 className="text-3xl font-bold text-white">Application Deployer</h1>
                    <p className="text-gray-400 mt-1">Deploy your projects to the cloud or self-hosted environments.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-900 rounded-lg shadow-lg p-8 space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-white">1. Select Deployment Target</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <TargetCard name="Cloud Run" icon={<CloudRunIcon className="w-12 h-12 mx-auto text-blue-400"/>} selected={target === 'CloudRun'} onClick={() => setTarget('CloudRun')} />
                            <TargetCard name="Self-Hosted" icon={<DockerIcon className="w-12 h-12 mx-auto text-cyan-400"/>} selected={target === 'DockerSelfHosted'} onClick={() => setTarget('DockerSelfHosted')} />
                            <TargetCard name="Kubernetes" icon={<K8sIcon className="w-12 h-12 mx-auto text-indigo-400"/>} selected={target === 'Kubernetes'} onClick={() => setTarget('Kubernetes')} />
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-white">2. Configure Settings</h3>
                        <label htmlFor="tcp-port" className="block text-sm font-medium text-gray-300 mb-2">TCP Port</label>
                        <input
                            id="tcp-port"
                            type="number"
                            value={port}
                            onChange={(e) => setPort(e.target.value)}
                            className="w-full max-w-xs p-3 bg-gray-800 text-gray-200 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-primary focus:outline-none font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-2">Default port for your application container.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-white">3. Deploy</h3>
                        <button
                            onClick={handleDeploy}
                            disabled={isDeploying}
                            className="w-full bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {isDeploying && (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isDeploying ? 'Deploying...' : 'Deploy Now'}
                        </button>
                    </div>

                </div>
                <div className="bg-gray-900 rounded-lg shadow-lg p-8">
                    <h3 className="text-xl font-semibold mb-4 text-white">Deployment Logs</h3>
                    <div className="bg-black rounded-md p-4 h-96 overflow-y-auto font-mono text-xs text-green-400">
                        {logs.map((log, index) => (
                            <p key={index} className="whitespace-pre-wrap">{`[${new Date().toLocaleTimeString()}] ${log}`}</p>
                        ))}
                         {isDeploying && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mt-2"></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
