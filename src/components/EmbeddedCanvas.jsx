import React from 'react';
import { Eye, ExternalLink, Terminal, Shield } from 'lucide-react';

export default function EmbeddedCanvas({ workflowId, n8nUrl }) {
  if (!workflowId) return null;

  const baseUrl = n8nUrl.replace(/\/+$/, '');
  const embedUrl = `${baseUrl}/workflow/${workflowId}?embed=true`;

  return (
    <div className="space-y-4 animate-in zoom-in-95 duration-500">
      <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Terminal Header */}
        <div className="bg-zinc-950 border-b border-zinc-900 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/70 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/70 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/70 inline-block"></span>
            </div>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">
                n8n Live Workflow Canvas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3 text-purple-400 animate-pulse" /> Live Node Web
            </span>
            <a
              href={`${baseUrl}/workflow/${workflowId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition-colors"
            >
              Open n8n <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Embedded IFrame Viewer */}
        <div className="relative bg-zinc-950/20 min-h-[600px] flex items-center justify-center">
          {/* Iframe element */}
          <iframe
            src={embedUrl}
            title="n8n Automated Workflow Builder"
            className="w-full h-[600px] border-none rounded-b-2xl shadow-inner relative z-10 bg-transparent"
            allow="clipboard-read; clipboard-write"
          />

          {/* Background Loading Cradle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 gap-3 text-center">
            <Eye className="w-12 h-12 text-zinc-400 animate-pulse" />
            <div>
              <p className="text-xs font-black uppercase text-zinc-400 tracking-[0.2em]">Synchronizing Canvas...</p>
              <p className="text-[9px] text-zinc-500 max-w-[220px] mx-auto mt-1">If the iframe does not load immediately, click "Open n8n" to authorize credentials.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
