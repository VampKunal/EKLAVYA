"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {subjects} from "@/constants";
import {Textarea} from "@/components/ui/textarea";
import {createCompanion} from "@/lib/actions/companion.actions";
import {redirect} from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, { message: 'Companion is required.'}),
    subject: z.string().min(1, { message: 'Subject is required.'}),
    topic: z.string().min(1, { message: 'Topic is required.'}),
    style: z.string().min(1, { message: 'Style is required.'}),
    duration: z.coerce.number().min(1, { message: 'Duration is required.'}),
})

const CompanionForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            subject: '',
            topic: '',
            style: '',
            duration: 5,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const companion = await createCompanion(values);

        if(companion) {
            redirect(`/companion/${companion.id}`);
        } else {
            console.log('Failed to create a companion');
            redirect('/');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <FormLabel className="text-[10px] uppercase tracking-[4px] font-black opacity-40">Companion_Identifier</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex. Neural_tutor_v1"
                                        {...field}
                                        className="bg-black/40 border-white/10 rounded-none h-14 px-6 text-[11px] uppercase tracking-[2px] focus-visible:ring-magenta focus-visible:border-magenta transition-all"
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] text-magenta uppercase tracking-widest font-black" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <FormLabel className="text-[10px] uppercase tracking-[4px] font-black opacity-40">Subject_Domain</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="bg-black/40 border-white/10 rounded-none h-14 px-6 text-[11px] uppercase tracking-[2px] focus:ring-magenta transition-all">
                                            <SelectValue placeholder="Select Sector" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-surface-container border-white/10 rounded-none">
                                            {subjects.map((subject) => (
                                                <SelectItem
                                                    value={subject}
                                                    key={subject}
                                                    className="uppercase tracking-[2px] text-[10px] focus:bg-magenta focus:text-white"
                                                >
                                                    {subject}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className="text-[10px] text-magenta uppercase tracking-widest font-black" />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-[10px] uppercase tracking-[4px] font-black opacity-40">Knowledge_Parameters</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Define the scope of interaction (e.g., Quantum Mechanics Fundamentals)"
                                    {...field}
                                    className="bg-black/40 border-white/10 rounded-none min-h-[120px] p-6 text-[11px] uppercase tracking-[2px] focus-visible:ring-magenta focus-visible:border-magenta transition-all"
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] text-magenta uppercase tracking-widest font-black" />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <FormLabel className="text-[10px] uppercase tracking-[4px] font-black opacity-40">Interaction_Protocol</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="bg-black/40 border-white/10 rounded-none h-14 px-6 text-[11px] uppercase tracking-[2px] focus:ring-magenta transition-all">
                                            <SelectValue placeholder="Select Style" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-surface-container border-white/10 rounded-none">
                                            <SelectItem value="formal" className="uppercase tracking-[2px] text-[10px] focus:bg-magenta focus:text-white">Formal // Academic</SelectItem>
                                            <SelectItem value="casual" className="uppercase tracking-[2px] text-[10px] focus:bg-magenta focus:text-white">Casual // Intuitive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className="text-[10px] text-magenta uppercase tracking-widest font-black" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <FormLabel className="text-[10px] uppercase tracking-[4px] font-black opacity-40">Sync_Duration (Min)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="15"
                                        {...field}
                                        className="bg-black/40 border-white/10 rounded-none h-14 px-6 text-[11px] uppercase tracking-[2px] focus-visible:ring-magenta focus-visible:border-magenta transition-all"
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] text-magenta uppercase tracking-widest font-black" />
                            </FormItem>
                        )}
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-magenta text-white py-5 text-[11px] uppercase tracking-[5px] font-black hover:bg-white hover:text-black transition-all shadow-xl relative overflow-hidden group"
                >
                    <span className="relative z-10">Initialize_Construction</span>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
            </form>
        </Form>
    )
}

export default CompanionForm
