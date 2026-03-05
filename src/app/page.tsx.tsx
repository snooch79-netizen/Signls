'use client';

import { useState } from 'react';

export default function Home() {
  const [sleep, setSleep] = useState(7);
  const [energy, setEnergy] = useState(6);
  const [mood, setMood] = useState(6);
  const [stress, setStress] = useState(5);
  const [eating, setEating] = useState(6);
  const [symptoms, setSymptoms] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/gemini-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wellnessData: { sleep, energy, mood, stress, eating, symptoms }
        }),
      });

      const data = await response.json();
      setAiResponse(data.message);

      const newEntry = {
        date: new Date().toLocaleDateString(),
        sleep, energy, mood, stress, eating, symptoms,
      };
      setEntries([newEntry, ...entries]);
    } catch (error) {
      setAiResponse('Thanks for checking in today.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b1e12', color: 'white', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Signls</h1>
        <p style={{ textAlign: 'center', color: '#aaa', marginBottom: '30px' }}>A gentle daily check-in with yourself.</p>

        <div style={{ background: '#1a3a24', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Morning check-in</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sleep quality</span>
                <span style={{ color: '#4ade80' }}>{sleep}/10</span>
              </label>
              <input type="range" min="1" max="10" value={sleep} onChange={(e) => setSleep(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Energy level</span>
                <span style={{ color: '#4ade80' }}>{energy}/10</span>
              </label>
              <input type="range" min="1" max="10" value={energy} onChange={(e) => setEnergy(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Mood</span>
                <span style={{ color: '#4ade80' }}>{mood}/10</span>
              </label>
              <input type="range" min="1" max="10" value={mood} onChange={(e) => setMood(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Stress</span>
                <span style={{ color: '#4ade80' }}>{stress}/10</span>
              </label>
              <input type="range" min="1" max="10" value={stress} onChange={(e) => setStress(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Healthy Eating</span>
                <span style={{ color: '#4ade80' }}>{eating}/10</span>
              </label>
              <input type="range" min="1" max="10" value={eating} onChange={(e) => setEating(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label>Symptoms</label>
              <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="What's bothering you?" style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#0b1e12', color: 'white', fontSize: '14px' }} />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#1b5e20', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              {loading ? 'Loading...' : 'Log this check-in'}
            </button>
          </form>
        </div>

        {aiResponse && (
          <div style={{ background: '#1a3a24', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '10px', color: '#4ade80' }}>Today's reflection</h3>
            <p>{aiResponse}</p>
          </div>
        )}

        {entries.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Last entries</h3>
            {entries.slice(0, 7).map((entry, idx) => (
              <div key={idx} style={{ background: '#1a3a24', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{entry.date}</p>
                <p style={{ margin: '0', fontSize: '12px', color: '#aaa' }}>Sleep {entry.sleep} • Energy {entry.energy} • Mood {entry.mood}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Save it** (Ctrl + S) and close Notepad.

Then git push:
```
cd "C:\Users\schne\OneDrive\Desktop\Signls Project\signls"
git add .
git commit -m "Update page.tsx"
git push origin main