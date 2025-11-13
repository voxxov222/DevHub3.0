
import React from 'react';
import type { ViewType } from '../App';
import { DashboardIcon, GcpIcon, Web3Icon, DeployIcon, SecretsIcon, GithubIcon, DevHubIcon, PlusCircleIcon } from './Icons';

interface SidebarProps {
  onOpenView: (view: ViewType) => void;
  onNewProject: () => void;
}

const navItems: { view: ViewType; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { view: 'Dashboard', label: 'Dashboard', icon: DashboardIcon },
  { view: 'GoogleCloud', label: 'Google Cloud', icon: GcpIcon },
  { view: 'Web3', label: 'Web3 Suite', icon: Web3Icon },
  { view: 'Deployer', label: 'Deployer', icon: DeployIcon },
  { view: 'GitHub', label: 'GitHub Repos', icon: GithubIcon },
  { view: 'Secrets', label: 'Secrets Manager', icon: SecretsIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ onOpenView, onNewProject }) => {
  return (
    <aside className="w-64 bg-gray-900 flex-shrink-0 flex flex-col border-r border-gray-700 z-[60]">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-700">
        <DevHubIcon className="w-8 h-8 text-brand-primary" />
        <h1 className="text-xl font-bold ml-2 text-white">DevHub</h1>
      </div>
      <div className="px-4 pt-6 pb-4">
        <button
          onClick={onNewProject}
          className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 bg-brand-primary text-white hover:bg-blue-600"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          <span>New Project</span>
        </button>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-2">
        {navItems.map(item => (
          <button
            key={item.view}
            onClick={() => onOpenView(item.view)}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-700">
        <div className="p-4 bg-gray-800 rounded-lg text-center">
            <p className="text-xs text-gray-400">Project ID:</p>
            <p className="text-sm font-mono text-brand-accent">gen-lang-client-0509236270</p>
        </div>
      </div>
    </aside>
  );
};
