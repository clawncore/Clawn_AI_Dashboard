import React from 'react';
import { Target, Link, FileText, Sparkles } from 'lucide-react';

export default function FunnelSettings({
  messageThreshold,
  setMessageThreshold,
  promoLink,
  setPromoLink,
  adInstructions,
  setAdInstructions
}) {
  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          <Target className="galaxy-icon w-4.5 h-4.5" /> Ad Funnel & Promotional Variables
        </h3>
        <p className="text-[11px] text-zinc-400 mt-1">
          Configure message thresholds, showcase links, and contextual guidelines for AI promotional injections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Threshold and Link Card */}
        <div className="bg-zinc-950/40 border border-zinc-800 p-6 rounded-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" /> Message Counter Pitch Threshold
            </label>
            <p className="text-[10px] text-zinc-500 leading-normal">
              Select exactly how many back-and-forth messages must pass before the AI smoothly pitches your promotional link.
            </p>
            <select
              value={messageThreshold}
              onChange={(e) => setMessageThreshold(parseInt(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all"
            >
              {[3, 5, 8, 10, 15, 20].map((val) => (
                <option key={val} value={val} className="bg-zinc-950 text-white font-bold">
                  {val} Messages (Pitch on Message #{val + 1})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2">
              <Link className="w-4 h-4 text-blue-400" /> Showcase Website / Link URL
            </label>
            <p className="text-[10px] text-zinc-500 leading-normal">
              The promotional showcase hyperlink the bot will casually insert.
            </p>
            <input
              type="text"
              value={promoLink}
              onChange={(e) => setPromoLink(e.target.value)}
              placeholder="e.g. https://clawn.ai/work"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>

        {/* Ad Prompt Guidelines Card */}
        <div className="bg-zinc-950/40 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-400" /> Ad Pitch Prompt Guidelines
            </label>
            <p className="text-[10px] text-zinc-500">
              Instruct the AI node exactly how to naturally contextually introduce the link.
            </p>
          </div>

          <textarea
            value={adInstructions}
            onChange={(e) => setAdInstructions(e.target.value)}
            rows={5}
            placeholder="e.g. Casually mention a recent project you completed and drop the URL naturally as an example of your capabilities."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-orange-500 outline-none resize-none transition-all leading-relaxed placeholder:text-zinc-700 h-[142px]"
          />
        </div>
      </div>
    </div>
  );
}
