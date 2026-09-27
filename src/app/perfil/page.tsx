import { getStorage } from "@/lib/data";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { GoalsList } from "@/components/profile/GoalsList";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const storage = getStorage();
  const profile = await storage.getProfile();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <ProfileHero profile={profile} />

      <section>
        <h2 className="font-display text-2xl font-bold text-text-primary mb-6 text-center">
          Mis Metas
        </h2>
        <GoalsList goals={profile.goals} />
      </section>
    </div>
  );
}
