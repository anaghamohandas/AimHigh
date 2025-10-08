"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the ResumeBuilder only on the client
const ResumeBuilder = dynamic(() => import("./resume-builder"), {
  ssr: false,
  loading: () => <p>Loading resume builder...</p>,
});

export default function ClientResume({ initialContent }) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResumeBuilder initialContent={initialContent} />
    </Suspense>
  );
}
