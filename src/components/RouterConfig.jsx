import React from 'react';
import { Users, ShieldCheck, Phone, ArrowRight, Network } from 'lucide-react';

export default function RouterConfig({ vipNumbers, setVipNumbers }) {
  // Parse numbers to show a clean live tag view
  const parsedTags = vipNumbers
    ? vipNumbers.split(',').map((num) => num.trim()).filter((num) => num.length > 0)
    : [];

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          <Network className="galaxy-icon w-4.5 h-4.5" /> Universal Message Routing Rules
        </h3>
        <p className="text-[11px] text-zinc-400 mt-1">
          Route your traffic to specific AI Personas based on contact phone number segments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Input Section */}
        <div className="space-y-5">
          <div className="bg-zinc-950/40 border border-zinc-800 p-5 rounded-2xl space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" /> Segment A: VIP / Close Contacts List
              </label>
              <p className="text-[10px] text-zinc-500">
                Provide target phone numbers separated by commas.
              </p>
            </div>

            <textarea
              value={vipNumbers}
              onChange={(e) => setVipNumbers(e.target.value)}
              rows={3}
              placeholder="e.g. 15550199, 15550188, 15550177"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-purple-500 outline-none resize-none transition-all leading-relaxed placeholder:text-zinc-700"
            />

            {/* Tag preview */}
            <div className="space-y-2">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                Identified VIP Terminals ({parsedTags.length})
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pr-1">
                {parsedTags.length === 0 ? (
                  <span className="text-[10px] text-zinc-600 italic">No phone numbers added yet</span>
                ) : (
                  parsedTags.map((num, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-950/40 border border-purple-500/20 text-purple-300 text-[9px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      <Phone className="w-2.5 h-2.5" /> {num}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-zinc-950/40 border border-zinc-800 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Segment B: Public / Standard Traffic
            </h4>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              All other unknown incoming numbers will be automatically filtered and routed directly to your **Lead Nurturing Counter Persona** to protect your attention.
            </p>
          </div>
        </div>

        {/* Right Visual Flow Diagram */}
        <div className="bg-zinc-950/60 border border-zinc-850 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[250px]">
          <div className="absolute inset-0 bg-radial-at-t from-purple-500/5 to-transparent pointer-events-none" />
          
          <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">
            Flow Visual routing simulation
          </h4>

          <div className="space-y-6 relative z-10">
            {/* VIP Route */}
            <div className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-3.5">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                <div>
                  <h5 className="text-[11px] font-black text-white">VIP Contacts</h5>
                  <p className="text-[9px] text-zinc-500 font-mono">Matched Phone Segments</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600" />
              <div className="bg-purple-950/30 border border-purple-500/30 px-3 py-1.5 rounded-lg text-right">
                <span className="text-[10px] font-black text-purple-300 block uppercase">High Priority Persona</span>
                <span className="text-[8px] text-zinc-500">Warm & Informal Rules</span>
              </div>
            </div>

            {/* Standard Route */}
            <div className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-3.5">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <div>
                  <h5 className="text-[11px] font-black text-white">Standard Traffic</h5>
                  <p className="text-[9px] text-zinc-500 font-mono">All Unknown Numbers</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600" />
              <div className="bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-right">
                <span className="text-[10px] font-black text-emerald-300 block uppercase">Lead Nurturer</span>
                <span className="text-[8px] text-zinc-500">Promotions & Pitches</span>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-zinc-600 text-center uppercase tracking-widest mt-4">
            🤖 Auto-Synchronizing with n8n workflow filters
          </div>
        </div>
      </div>
    </div>
  );
}
