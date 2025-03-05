"use client";

import { getProfileByUserId } from "@/db/profile";
import { getHomeWorkspaceByUserId } from "@/db/workspaces";
import { supabase } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const session = (await supabase.auth.getSession()).data.session;

      if (!session) {
        return router.push("/login");
      } else {
        const user = session.user;

        const profile = await getProfileByUserId(user.id);

        if (!profile.has_onboarded) {
          setLoading(false); // Allow the setup page to render
        } else {
          const homeWorkspace = await getHomeWorkspaceByUserId(user.id);

          if (!homeWorkspace) {
            console.error("No home workspace found for user:", user.id);
            return router.push("/setup"); // Redirect to setup if no home workspace exists
          }

          return router.push(`/${homeWorkspace.id}/chat`);
        }
      }
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or message
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div>Setup Page Content</div>
    </div>
  );
}
