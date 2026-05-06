
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {cn, getSubjectColor} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ClockIcon } from "lucide-react";

interface CompanionsListProps {
    title: string;
    companions?: Companion[];
    classNames?: string;
}

const CompanionsList = ({ title, companions, classNames }: CompanionsListProps) => {
    return (
        <article className={cn('relative z-10', classNames)}>
            {title && (
                <div className="flex flex-col sm:flex-row justify-between items-baseline mb-10 gap-4">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter magenta-slash">{title}</h2>
                    <span className="text-[10px] uppercase tracking-[4px] opacity-40 font-bold">[ Index_Sync_Node ]</span>
                </div>
            )}

            <div className="border-t border-white/5 overflow-x-auto custom-scrollbar">
                <Table className="w-full text-left min-w-[600px] border-collapse">
                    <TableHeader>
                        <TableRow className="border-b border-white/5 hover:bg-transparent">
                            <TableHead className="py-8 font-black uppercase text-[10px] tracking-[3px] opacity-40 text-white">Lessons</TableHead>
                            <TableHead className="py-8 font-black uppercase text-[10px] tracking-[3px] opacity-40 text-white">Subject</TableHead>
                            <TableHead className="py-8 font-black uppercase text-[10px] tracking-[3px] opacity-40 text-right text-white">Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-white/[0.03]">
                        {companions?.map(({id, subject, name, topic, duration}, index) => (
                            <TableRow key={index} className="hover:bg-white/[0.02] transition-colors group border-white/5">
                                <TableCell className="py-8">
                                    <Link href={`/companion/${id}`} className="flex items-center gap-6">
                                        <div 
                                            className="size-12 flex items-center justify-center border border-white/10 bg-black/40 grayscale group-hover:grayscale-0 transition-all duration-500"
                                            style={{ borderLeftWidth: '3px', borderLeftColor: getSubjectColor(subject) }}
                                        >
                                            <Image
                                                src={`/icons/${subject}.svg`}
                                                alt={subject}
                                                width={24}
                                                height={24}
                                                className="opacity-40 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="font-black text-lg uppercase tracking-tight italic group-hover:text-magenta transition-colors">
                                                {name}
                                            </p>
                                            <p className="text-[10px] uppercase tracking-[2px] opacity-40 font-bold truncate max-w-[300px]">
                                                {topic}
                                            </p>
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell className="py-8">
                                    <span 
                                        className="text-[10px] font-black tracking-widest px-3 py-1 border border-white/10 group-hover:border-magenta group-hover:text-magenta transition-all"
                                        style={{ color: getSubjectColor(subject) }}
                                    >
                                        {subject.toUpperCase()}
                                    </span>
                                </TableCell>
                                <TableCell className="py-8 text-right">
                                    <div className="flex items-center gap-3 justify-end text-white/40 font-serif italic text-base">
                                        {duration} <span className="text-[9px] uppercase tracking-widest opacity-40 not-italic">MINS</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </article>
    )
}

export default CompanionsList;