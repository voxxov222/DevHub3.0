
import React from 'react';
import { GithubIcon } from './Icons';

interface Repo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
}

const repos: Repo[] = [
  { name: 'project-alpha-backend', description: 'Node.js API for Project Alpha', language: 'TypeScript', stars: 12, forks: 3 },
  { name: 'gamma-protocol-contracts', description: 'Solidity smart contracts for Gamma Protocol', language: 'Solidity', stars: 45, forks: 11 },
  { name: 'zeta-webapp-frontend', description: 'React frontend for the Zeta dashboard', language: 'TypeScript', stars: 23, forks: 7 },
  { name: 'infra-as-code', description: 'Terraform and Architect configurations', language: 'HCL', stars: 8, forks: 1 },
];

const RepoCard: React.FC<{ repo: Repo }> = ({ repo }) => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-brand-primary transition-colors duration-200">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-white mb-2">{repo.name}</h3>
            <span className="text-xs font-mono py-1 px-2 rounded-full bg-gray-700 text-gray-300">{repo.language}</span>
        </div>
        <p className="text-gray-400 mb-4 h-10">{repo.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>⭐ {repo.stars}</span>
            <span>-</span>
            <span> forks: {repo.forks}</span>
        </div>
    </div>
);

export const GithubView: React.FC = () => {
    return (
        <div className="p-6 md:p-10">
            <div className="flex items-center mb-8">
                <GithubIcon className="w-10 h-10 mr-4"/>
                <div>
                    <h1 className="text-3xl font-bold text-white">GitHub Repositories</h1>
                    <p className="text-gray-400 mt-1">Browse your connected repositories and manage CI/CD templates.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {repos.map(repo => <RepoCard key={repo.name} repo={repo} />)}
                <div className="border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center hover:border-brand-secondary hover:text-brand-secondary transition-colors cursor-pointer">
                    <div className="text-center p-6 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="font-semibold">Connect New Repository</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-lg p-8 mt-10">
                <h2 className="text-2xl font-bold text-white mb-4">CI/CD Templates (GitHub Actions)</h2>
                <p className="text-gray-400 mb-6">Bootstrap your continuous integration pipelines. Secrets must be supplied manually in your GitHub repository settings.</p>
                <div className="flex space-x-4">
                    <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Node.js CI</button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Docker Build & Push</button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Deploy to Cloud Run</button>
                </div>
            </div>
        </div>
    );
};
