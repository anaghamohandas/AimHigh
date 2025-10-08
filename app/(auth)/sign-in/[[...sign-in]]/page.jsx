// import { SignIn } from "@clerk/nextjs";

// export default function Page() {
//   return <SignIn />;
// }

// app/signin/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn
        path="/sign-in"
        routing="path"
        fallbackRedirectUrl="/dashboard" // redirect after signin
      />
    </div>
  );
}
