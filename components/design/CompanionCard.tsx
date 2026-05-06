import { motion } from 'motion/react';
import React from 'react';

interface CompanionCardProps {
  name: string;
  field: string;
  description: string;
  duration: string;
  rating: string;
  image: string;
}

const CompanionCard: React.FC<CompanionCardProps> = ({ name, field, description, image }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="group border border-white/5 bg-surface-container flex flex-col h-full transition-all duration-500 overflow-hidden shadow-xl"
    >
      <div className="relative aspect-video grayscale opacity-60 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden img-box-texture">
        <img 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4000ms]" 
          src={image} 
          alt={name}
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-6 left-6 text-[10px] uppercase tracking-[3px] font-black py-1.5 px-3 border-l-2 border-magenta bg-black/60 shadow-lg">
          {field}
        </div>
      </div>
      <div className="p-8 md:p-10 flex-grow flex flex-col justify-between">
        <div className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic group-hover:text-magenta transition-colors">{name}</h3>
          <p className="text-[11px] md:text-xs uppercase tracking-[2px] leading-relaxed opacity-60 font-medium">
            {description}
          </p>
        </div>
        <div className="mt-10 pt-10 border-t border-white/5 flex justify-between items-center">
          <button className="text-[10px] uppercase tracking-[3px] font-black hover:text-magenta transition-all border-b border-transparent hover:border-magenta pb-1">
            Access Files
          </button>
          <div className="text-[9px] uppercase tracking-[2px] opacity-30 font-black italic">
            NODE // 04
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanionCard;
