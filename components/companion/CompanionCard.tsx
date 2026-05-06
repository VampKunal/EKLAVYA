"use client";
import { motion } from "motion/react";
import { removeBookmark, addBookmark } from "@/lib/actions/companion.actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookmarkIcon, BookmarkPlusIcon } from "lucide-react";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  bookmarked: boolean;
  image?: string;
}

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked,
  image = "https://lh3.googleusercontent.com/aida-public/AB6AXuBUwCQYRLAyvkeE4BF0JLcYg0A3MjRS_1F-uiSoyzqS2qDfiuHOF5VUzm7VDigecxSYIy-GInlkC4SMMYllk2xVv2h8-i9NnoT24BWRrCDYyGDSN8SdtBYEwYiKvk8bJPjC1lHtSJkpdLJ8KaSeekw3UlcjE9b-Vfz6ZTrDexhPnsKzdYAOCC1GtlAPwhHiM4C8KIY_EXEeLFjAiENs3Lih8Rlx5pNuO_QGXuipj0OsN-wTLfaM_qcVnRZCJ4RrXcnhhb3X6i3evxK4"
}: CompanionCardProps) => {
  const pathname = usePathname();
  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      await removeBookmark(id, pathname);
    } else {
      await addBookmark(id, pathname);
    }
  };

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
        <div 
          className="absolute top-6 left-6 text-[10px] uppercase tracking-[3px] font-black py-1.5 px-3 border-l-2 shadow-lg bg-black/60"
          style={{ borderColor: color || 'var(--color-magenta)' }}
        >
          {subject}
        </div>
        <button 
          onClick={handleBookmark}
          className="absolute top-6 right-6 p-2 bg-black/60 backdrop-blur-md border border-white/10 hover:text-magenta transition-colors"
        >
          {bookmarked ? <BookmarkIcon size={16} fill="currentColor" /> : <BookmarkPlusIcon size={16} />}
        </button>
      </div>

      <div className="p-8 md:p-10 flex-grow flex flex-col justify-between">
        <div className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic group-hover:text-magenta transition-colors">
            {name}
          </h3>
          <p className="text-[11px] md:text-xs uppercase tracking-[2px] leading-relaxed opacity-60 font-medium line-clamp-3">
            {topic}
          </p>
        </div>

        <div className="mt-10 pt-10 border-t border-white/5 flex justify-between items-center">
          <Link 
            href={`/companion/${id}`}
            className="text-[10px] uppercase tracking-[3px] font-black hover:text-magenta transition-all border-b border-transparent hover:border-magenta pb-1"
          >
            Launch Lesson
          </Link>
          <div className="text-[9px] uppercase tracking-[2px] opacity-30 font-black italic">
            {duration} MINS // {subject.toUpperCase()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanionCard;
