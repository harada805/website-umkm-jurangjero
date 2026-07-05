"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { citizenStories } from "@/lib/data";
import { isFirestoreReady, subscribeCitizenStories } from "@/lib/firestore-service";
import {
  readLocalCitizenStories,
  subscribeLocalContent
} from "@/lib/local-content-store";
import type { CitizenStory, CitizenStoryRecord } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CitizenStories() {
  const [stories, setStories] = useState<CitizenStory[]>(
    sortStories(citizenStories.filter((story) => story.status !== "Draft"))
  );

  useEffect(() => {
    const fallbackStories = citizenStories.map((story) => ({
      id: story.id ?? `${story.name}-${story.role}`,
      name: story.name,
      role: story.role,
      quote: story.quote,
      status: story.status ?? "Tayang",
      createdAt: story.createdAt ?? "2026-07-05"
    })) satisfies CitizenStoryRecord[];

    function applyStories(items: CitizenStoryRecord[]) {
      const publishedStories = items.filter((story) => story.status === "Tayang");
      setStories(sortStories(publishedStories));
    }

    applyStories(readLocalCitizenStories(fallbackStories));
    const unsubscribeLocal = subscribeLocalContent(["citizenStories"], () => {
      applyStories(readLocalCitizenStories(fallbackStories));
    });
    const unsubscribeFirestore = isFirestoreReady()
      ? subscribeCitizenStories(
          (storedStories) => {
            if (storedStories.length) applyStories(storedStories);
          },
          () => undefined
        )
      : undefined;

    return () => {
      unsubscribeLocal();
      unsubscribeFirestore?.();
    };
  }, []);

  return (
    <section className="bg-white px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Cerita dari Warga"
          title="Suara kecil yang membuat platform ini terasa manusiawi"
          align="center"
        >
          Cerita warga membantu pengunjung memahami bahwa digitalisasi desa
          bukan sekadar sistem, melainkan cara memperpanjang jangkauan gotong
          royong.
        </SectionHeading>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {stories.map((story, index) => (
            <Reveal key={story.id ?? story.name} delay={index * 0.08}>
              <blockquote className="h-full rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] p-6 shadow-line">
                <Quote className="text-amber-500" size={28} />
                <p className="mt-5 text-base leading-8 text-stonewarm-700">
                  &quot;{story.quote}&quot;
                </p>
                <footer className="mt-6">
                  <p className="font-heading text-lg font-bold text-stonewarm-950">
                    {story.name}
                  </p>
                  <p className="text-sm text-leaf-800">{story.role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function sortStories(items: CitizenStory[]) {
  return [...items].sort(
    (a, b) =>
      new Date(b.createdAt ?? "1970-01-01").getTime() -
      new Date(a.createdAt ?? "1970-01-01").getTime()
  );
}
