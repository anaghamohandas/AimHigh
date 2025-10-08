// import { SignUp } from "@clerk/clerk-react";

// export default function Page() {
//   return <SignUp />;
// }

// app/signup/page.tsx
"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp
        path="/sign-up"
        routing="path"
        fallbackRedirectUrl="/onboarding" // redirect after signup
      />
    </div>
  );
}
