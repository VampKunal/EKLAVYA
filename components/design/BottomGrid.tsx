export default function BottomGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-24 relative z-10">
      {/* Affinity Map */}
      <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-surface-container border border-white/5 p-8 md:p-12 h-[350px] md:h-[450px] relative overflow-hidden group img-box-texture shadow-xl">
        <img 
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:opacity-50 transition-all duration-[2000ms]" 
          src="https://lh3.googleusercontent.com/aida/ADBb0ug_7VQDSmwI4Hu3ZbVgKNQn6N4gb7E42xjF8Z_dhB8tRbsgo8OV-xDe5EPbq1x2RLXJzKKYLqzyNYGhTdCvFtsaBRhmddNKHQBBlWdx6L9jCQZ7J0jMu9_rs9gpKZ6r1FJ3XeJXBaQt55mHqCwt3PVmoHhem0NICG-x8mIc0hsvy89Nx0K-KZocloXS3zFyGP3URgOkam5daTb-za6YFHEXrFjlzeS-P7jEV6_vgIfNBXUSyExyfNCp2RgpWv50iakhhh7UkzqpkqM"
          alt="Neural Affinity Map"
          referrerPolicy="no-referrer"
        />
        <div className="relative h-full flex flex-col justify-end">
          <h4 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 italic magenta-slash">Affinity Map</h4>
          <p className="text-[10px] uppercase tracking-[4px] opacity-40 font-bold">Discipline_Progress // Node.Sync_Alpha</p>
        </div>
      </div>

      {/* Active Objectives */}
      <div className="col-span-1 md:col-span-12 lg:col-span-4 bg-surface-container-high border border-white/5 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden img-box-texture shadow-xl">
        <div className="space-y-12">
          <h4 className="text-2xl font-black uppercase tracking-tight italic">Objectives</h4>
          <div className="space-y-10">
            <ObjectiveItem value="1.2k" label="Quantum_Flux_Module" active />
            <ObjectiveItem value="Paris, FR" label="Base_Location" active />
            <ObjectiveItem value="400m²" label="Exhibition_Space" active={false} />
          </div>
        </div>
        <div className="mt-12">
          <button className="bg-magenta text-white px-6 py-3 text-[11px] uppercase tracking-[3px] font-black hover:bg-white hover:text-black transition-all">
            Enter Gallery
          </button>
        </div>
      </div>
    </section>
  );
}

function ObjectiveItem({ value, label, active }: { value: string; label: string; active: boolean }) {
  return (
    <div className={`flex flex-col gap-2 ${!active ? 'opacity-20' : ''}`}>
      <span className={`text-3xl font-serif italic ${active ? 'text-magenta' : 'text-white/90'}`}>{value}</span>
      <span className="text-[9px] uppercase tracking-[2px] opacity-40 font-bold">{label}</span>
    </div>
  );
}
