
import React from 'react';
import { GcpIcon, Web3Icon, DeployIcon, GithubIcon } from './Icons';

interface DashboardProps {
    onNewProject: () => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-700/50 p-6 rounded-lg flex items-center space-x-4">
        <div className="p-3 bg-gray-800 rounded-full">{icon}</div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const ActivityItem: React.FC<{ title: string; description: string; time: string; icon: React.ReactNode }> = ({ title, description, time, icon }) => (
    <li className="flex items-center space-x-4 p-4 border-b border-gray-700 last:border-b-0">
        <div className="p-2 bg-gray-800 rounded-full">{icon}</div>
        <div className="flex-1">
            <p className="font-semibold text-white">{title}</p>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
        <span className="text-xs text-gray-500">{time}</span>
    </li>
);

export const Dashboard: React.FC<DashboardProps> = ({ onNewProject }) => {
  return (
    <div className="p-6 md:p-10 space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, dev-user!</h1>
            <p className="text-gray-400 mt-1">Here's a snapshot of your development ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Active Projects" value="5" icon={<GithubIcon className="w-6 h-6 text-brand-primary" />} />
            <StatCard title="Cloud Resources" value="12" icon={<GcpIcon className="w-6 h-6 text-brand-secondary" />} />
            <StatCard title="Web3 Contracts" value="3" icon={<Web3Icon className="w-6 h-6 text-brand-accent" />} />
            <StatCard title="Total Deployments" value="28" icon={<DeployIcon className="w-6 h-6 text-brand-danger" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                <div className="p-5 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                </div>
                <ul className="divide-y divide-gray-700">
                    <ActivityItem title="Deployment Succeeded" description="api-gateway on Cloud Run" time="2m ago" icon={<DeployIcon className="w-5 h-5 text-brand-secondary" />} />
                    <ActivityItem title="Contract Deployed" description="NanoBanana to Localhost Fork" time="1h ago" icon={<Web3Icon className="w-5 h-5 text-brand-accent" />} />
                    <ActivityItem title="Commit Pushed" description="feat: add new user auth flow" time="3h ago" icon={<GithubIcon className="w-5 h-5 text-brand-primary" />} />
                    <ActivityItem title="GCS Bucket Created" description="project-alpha-assets" time="5h ago" icon={<GcpIcon className="w-5 h-5 text-brand-danger" />} />
                </ul>
            </div>
            <div className="bg-gray-900 rounded-lg shadow-lg">
                <div className="p-5 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Quick Links</h2>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                    <button onClick={onNewProject} className="bg-brand-primary hover:bg-blue-600 p-4 rounded-lg text-center transition-colors">
                        <span className="text-lg font-medium">New Project</span>
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition-colors">
                        <span className="text-lg font-medium">Deploy App</span>
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition-colors">
                        <span className="text-lg font-medium">Browse GCP Templates</span>
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition-colors">
                        <span className="text-lg font-medium">Compile Contract</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
