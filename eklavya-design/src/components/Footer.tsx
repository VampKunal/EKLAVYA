export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 py-16 px-10">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12 lg:pl-[120px]">
        <div className="max-w-md">
          <div className="font-display text-4xl font-black uppercase tracking-tighter mb-8">
            Neural<span className="opacity-40">_Learn</span>
          </div>
          <p className="text-[10px] text-white/40 leading-loose uppercase tracking-[4px] font-bold">
            Designing the future of cognitive evolution. <br/>
            All systems functional. // NODE.2024
          </p>
        </div>
        
        <div className="flex flex-wrap gap-24">
          <div className="space-y-8">
            <h5 className="text-[10px] uppercase tracking-[4px] font-black opacity-40">Systems</h5>
            <ul className="space-y-4 text-[10px] uppercase tracking-[2px] font-bold">
              <li><a className="hover:opacity-60 transition-all" href="#">Protocols</a></li>
              <li><a className="hover:opacity-60 transition-all" href="#">Privacy_Core</a></li>
              <li><a className="hover:opacity-60 transition-all" href="#">Terminal_Gate</a></li>
            </ul>
          </div>
          
          <div className="space-y-8">
            <h5 className="text-[10px] uppercase tracking-[4px] font-black opacity-40">Status</h5>
            <ul className="space-y-4 text-[10px] uppercase tracking-[2px] font-bold">
              <li className="opacity-80 transition-all">Uptime: 99.98%</li>
              <li className="opacity-80 transition-all">Build: V.4.2.0-STABLE</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
