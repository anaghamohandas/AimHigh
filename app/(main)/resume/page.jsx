import ClientResume from "./_components/client-resume";
import { getResume } from "@/actions/resume";

export default async function ResumePage() {
  const resume = await getResume();

  return (
    <div className="container mx-auto py-6">
      <ClientResume initialContent={resume?.content || ""} />
    </div>
  );
}
