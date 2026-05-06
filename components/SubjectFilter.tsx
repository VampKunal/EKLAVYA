"use client";
import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { subjects } from "@/constants";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/utils";

const SubjectFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("subject") || "";

    const [subject, setSubject] = useState(query);

    useEffect(() => {
        let newUrl = "";

        const paramsObj = Object.fromEntries(searchParams.entries());

        if (subject === "all") {
            newUrl = removeKeysFromUrlQuery({
            params: paramsObj,
            keysToRemove: ["subject"],
            });
        } else {
            newUrl = formUrlQuery({
            params: paramsObj,
            key: "subject",
            value: subject,
            });
        }

        router.push(newUrl, { scroll: false });
    }, [subject]);


    return (
    <Select onValueChange={setSubject} value={subject}>
        <SelectTrigger className="bg-black/40 border-white/10 rounded-none h-14 px-8 text-[10px] uppercase tracking-[3px] font-black focus:ring-magenta transition-all w-full sm:w-[200px]">
            <SelectValue placeholder="FILTER_SECTOR" />
        </SelectTrigger>
        <SelectContent className="bg-surface-container border-white/10 rounded-none">
            <SelectItem value="all" className="uppercase tracking-[2px] text-[10px] font-black focus:bg-magenta focus:text-white">All Sectors</SelectItem>
            {subjects.map((subject) => (
                <SelectItem 
                    key={subject} 
                    value={subject} 
                    className="uppercase tracking-[2px] text-[10px] font-black focus:bg-magenta focus:text-white"
                >
                    {subject}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
    );
};

export default SubjectFilter;