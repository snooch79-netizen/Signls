"use client";

import { useState, FormEvent } from "react";

type WellnessEntry = {
  id: string;
  created_at: string;
  sleep_quality: number;
  energy_level: number;
  mood: number;
  stress: number;
  healthy_eating: number;
  symptoms: string | null;
};

export default function HomePage() {
  const [submitting, setSubmitting] = useState(false);
  const [entries, setEntries] = useState<WellnessEntry[]>([]);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [sleepQuality, setSleepQuality] = useState(7);
  const [energyLevel, setEnergyLevel] = useState(6);
  const [mood, setMood] = useState(6);
  const [stress, setStress] = useState(4);
  const [healthyEating, setHealthyEating] = useState(6);
  const [symptoms, setSymptoms] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setSubmitting(true);
    setError(null);

    const wellnessData = {
      sleepQuality,
      energyLevel,
      mood,
      stress,
      healthyEating,
      symptoms: symptoms || "None noted",
    };

    // For now, store entries only in local state so you can
    // test the UI + AI response without Supabase configured.
    const newEntry: WellnessEntry = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      sleep_quality: sleepQuality,
      energy_level: energyLevel,
      mood,
      stress,
      healthy_eating: healthyEating,
      symptoms: symptoms || null,
    };

    setEntries((prev) => [newEntry, ...prev].slice(0, 7));

    try {
      const response = await fetch("/api/gemini-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wellnessData }),
      });

      if (!response.ok) {
        throw new Error("Gemini request failed");
      }

      const json = (await response.json()) as { message?: string };
      setAiResponse(
        json.message ??
          "Thanks for checking in today. Keep listening to your body and adjusting gently as you go."
      );
    } catch (_err) {
      setAiResponse(
        "Thanks for checking in today. Keep listening to your body and adjusting gently as you go."
      );
    }

    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-[#0b1e12] text-white px-4 py-4 flex justify-center">
      <div className="w-full max-w-xl space-y-5">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Signls</h1>
            <p className="text-xs text-white/70">
              A gentle daily check-in with yourself.
            </p>
          </div>
        </header>

        <main className="space-y-5 pb-6">
          <section className="card-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-medium">Morning check-in</h2>
                <p className="text-xs text-white/70">
                  Take 30 seconds to see how you are today.
                </p>
              </div>
              <span className="chip">Today</span>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <SliderRow
                label="Sleep quality"
                value={sleepQuality}
                onChange={setSleepQuality}
              />
              <SliderRow
                label="Energy level"
                value={energyLevel}
                onChange={setEnergyLevel}
              />
              <SliderRow label="Mood" value={mood} onChange={setMood} />
              <SliderRow label="Stress" value={stress} onChange={setStress} />
              <SliderRow
                label="Healthy eating"
                value={healthyEating}
                onChange={setHealthyEating}
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium" htmlFor="symptoms">
                    Symptoms or signals
                  </label>
                  <span className="text-[11px] text-white/60">
                    Optional • what&apos;s bothering you
                  </span>
                </div>
                <textarea
                  id="symptoms"
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Headache, tension in shoulders, bloating, foggy, calm, grounded..."
                  className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-xs outline-none placeholder:text-white/40 focus:border-[#81C784]"
                />
              </div>

              {error && (
                <p className="text-xs text-red-300 bg-red-950/50 border border-red-500/40 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 w-full rounded-full bg-[#1B5E20] py-2.5 text-sm font-medium shadow-md shadow-black/50 hover:bg-[#23772a] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Logging your check-in..." : "Log this check-in"}
              </button>
            </form>
          </section>

          {aiResponse && (
            <section className="card-surface p-4 space-y-2">
              <h2 className="text-sm font-medium flex items-center gap-2">
                Today&apos;s reflection
                <span className="h-1.5 w-1.5 rounded-full bg-[#81C784]" />
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                {aiResponse}
              </p>
            </section>
          )}

          <section className="card-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">Last 7 check-ins</h2>
              <span className="text-[11px] text-white/60">
                Only visible to you
              </span>
            </div>
            {entries.length === 0 ? (
              <p className="text-xs text-white/60">
                Your recent check-ins will appear here after you log a few
                days.
              </p>
            ) : (
              <ul className="space-y-2">
                {entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-xs flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {new Date(entry.created_at).toLocaleDateString(
                          undefined,
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <span className="text-[11px] text-white/60">
                        Sleep {entry.sleep_quality}/10 • Energy{" "}
                        {entry.energy_level}/10 • Mood {entry.mood}/10
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 text-[11px] text-white/70">
                      <span className="chip bg-white/5">
                        Stress {entry.stress}/10
                      </span>
                      <span className="chip bg-white/5">
                        Eating {entry.healthy_eating}/10
                      </span>
                    </div>
                    {entry.symptoms && (
                      <p className="text-[11px] text-white/70 line-clamp-2">
                        {entry.symptoms}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

type SliderRowProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function SliderRow({ label, value, onChange }: SliderRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="inline-flex items-center gap-1 text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-[#81C784]" />
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#1B5E20]"
      />
      <div className="flex justify-between text-[10px] text-white/50">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

