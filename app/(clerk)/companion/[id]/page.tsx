"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import SourceUploader from "@/components/companion/SourceUploader";
import CompanionComponent from "@/components/companion/CompanionComponent";
import { getSubjectColor } from "@/lib/utils";
import { getCompanion } from "@/lib/actions/companion.actions";

const CompanionSession = () => {
  const router = useRouter();
  const params = useParams(); // <-- use useParams hook here
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();

  const [companion, setCompanion] = useState<Companion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const fetchCompanion = async () => {
      try {
        const id = params.id as string;
        const data = await getCompanion(id);

        if (!data?.name) {
          router.push("/companion");
        } else {
          setCompanion(data);
        }
      } catch (error) {
        console.error(error);
        router.push("/companion");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanion();
  }, [params, user, isLoaded, router]);

  if (loading || !companion) {
    return <p className="p-4 text-lg">Loading companion session...</p>;
  }

  const { name, subject, topic, duration } = companion;
  const initialReview = searchParams.get('review') || undefined;

  return (
    <main className="h-full flex flex-col space-y-6">
      <article className="flex rounded-border justify-between p-6 max-md:flex-col shadow-sm border bg-card/50">
        <div className="flex items-center gap-2">
          <div
            className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <Image
              src={`/icons/${subject}.svg`}
              alt={subject}
              width={35}
              height={35}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-2xl">{name}</p>
              <Badge className="max-sm:hidden">{subject}</Badge>
            </div>
            <p className="text-lg text-muted-foreground">{topic}</p>
          </div>
        </div>
        <div className="items-start text-2xl max-md:hidden text-muted-foreground">
          {duration} minutes
        </div>
      </article>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {/* Left Pane: Sources (NotebookLM style) */}
        <div className="md:col-span-1 space-y-6 flex flex-col">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <h2 className="text-xl font-bold mb-2">Notebook Guide</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your documents, notes, and study material here. Your AI companion will use this to accurately tutor you.
            </p>
          </div>
          <SourceUploader companionId={params.id as string} />
        </div>

        {/* Right Pane: Companion Chat */}
        <div className="md:col-span-2 border rounded-xl overflow-hidden shadow-sm bg-card flex flex-col">
          <CompanionComponent
            {...companion}
            companionId={params.id as string}
            userName={user?.firstName || "User"}
            userImage={user?.imageUrl || ""}
            initialUserMessage={initialReview}
          />
        </div>
      </div>
    </main>
  );
};

export default CompanionSession;
