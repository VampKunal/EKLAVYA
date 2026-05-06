interface SessionLogsProps {
  sessions?: {
    protocol: string;
    sector: string;
    uptime: string;
    status: string;
  }[];
}

export default function SessionLogs({ sessions: propSessions }: SessionLogsProps) {
  const defaultSessions = [
    { protocol: "Quantum Computing Fundamentals", sector: "Theoretical_Physics", uptime: "45:12", status: "STABLE" },
    { protocol: "Synthetic Biology Ethics", sector: "Bioethics_01", uptime: "32:05", status: "STABLE" },
    { protocol: "Hacker Culture History", sector: "Digital_Sociology", uptime: "15:55", status: "STABLE" }
  ];

  const sessions = propSessions || defaultSessions;

  return (
    <section className="mb-24 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-baseline mb-10 gap-4">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter magenta-slash">Session Logs</h2>
        <span className="text-[10px] uppercase tracking-[4px] opacity-40 font-bold">[ Index_Sync_Node ]</span>
      </div>
      
      <div className="border-t border-white/5 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="py-8 font-black uppercase text-[10px] tracking-[3px] opacity-40">Protocol</th>
              <th className="py-8 font-black uppercase text-[10px] tracking-[3px] opacity-40">Sector</th>
              <th className="py-8 font-black uppercase text-[10px] tracking-[3px] opacity-40">Uptime</th>
              <th className="py-8 font-black uppercase text-[10px] tracking-[3px] opacity-40 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {sessions.map((session, index) => (
              <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                <td className="py-8 font-black text-lg uppercase tracking-tight italic group-hover:text-magenta transition-colors">{session.protocol}</td>
                <td className="py-8 text-white/40 uppercase text-[10px] tracking-widest font-bold">{session.sector}</td>
                <td className="py-8 text-white/40 font-serif italic text-base">{session.uptime}</td>
                <td className="py-8 text-right">
                  <span className="text-[10px] font-black tracking-widest px-3 py-1 border border-white/10 group-hover:border-magenta group-hover:text-magenta transition-all">{session.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
