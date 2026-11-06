import React, { useState } from 'react';
import {
  X,
  GitBranch,
  CheckCircle2,
  Package,
  Terminal,
  ArrowRight,
  Download,
  Share2,
  Copy,
  Check,
} from 'lucide-react';

interface GithubCiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallPwa: () => void;
  isInstallable: boolean;
}

export const GithubCiModal: React.FC<GithubCiModalProps> = ({
  isOpen,
  onClose,
  onInstallPwa,
  isInstallable,
}) => {
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const pushCommand = `git init\ngit add .\ngit commit -m "feat: CBE Mobile Banking with PIN 0607, CI/CD, push alerts, activity logs"\ngit branch -M main\ngit remote add origin https://github.com/<YOUR_USER>/cbe-mobile-banking.git\ngit push -u origin main`;

  const handleCopyCommand = () => {
    navigator.clipboard?.writeText(pushCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[32px] max-h-[90%] flex flex-col p-5 shadow-2xl animate-in slide-in-from-bottom-10 duration-200">
        <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-[#7C21A4] flex items-center justify-center">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-800">
                GitHub CI/CD &amp; App Distribution
              </h3>
              <p className="text-[10px] text-neutral-400">
                Automated Testing, Build &amp; Distribution Workflow
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1 text-xs">
          {/* Pipeline stages */}
          <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Continuous Integration Workflow (.github/workflows/ci.yml)
            </span>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-neutral-900">1. Lint &amp; Typecheck</strong>:
                  Validates TypeScript strict types &amp; syntax.
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-neutral-900">2. Unit Tests</strong>:
                  Runs Node test runner on banking authentication &amp; calculations.
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-neutral-900">3. Build &amp; Package</strong>:
                  Compiles Vite PWA assets into distribution bundle.
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-neutral-900">4. Release Artifacts</strong>:
                  Uploads installable package for testing &amp; distribution.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Git Push snippet */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-neutral-700 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-600" />
                <span>Push to GitHub Repository</span>
              </span>
              <button
                onClick={handleCopyCommand}
                className="text-[10px] font-bold text-[#7C21A4] flex items-center gap-1 hover:underline"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>

            <pre className="p-2.5 bg-neutral-900 text-neutral-200 rounded-xl font-mono text-[10.5px] overflow-x-auto leading-relaxed border border-neutral-800">
              {pushCommand}
            </pre>
          </div>

          {/* Instant App Install for Testing */}
          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#7C21A4]">
                Install App on Phone for Testing
              </h4>
              <p className="text-[10.5px] text-neutral-600 mt-0.5">
                Install as a full-screen standalone application with offline support
              </p>
            </div>

            <button
              onClick={onInstallPwa}
              className="px-3.5 py-1.5 rounded-full bg-[#7C21A4] hover:bg-[#68198a] text-white text-xs font-bold shadow-xs active:scale-95 transition shrink-0"
            >
              Install App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
