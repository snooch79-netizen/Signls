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

        body: JSON.stringify({ sleep, energy, mood, stress, eating, symptoms }),

      });

      const data = await response.json();

      setAiResponse(data.message);
     console.log('AI Response:', data.response);
     alert('Response received: ' + data.response);

      setEntries(prev => [{

        date: new Date().toLocaleDateString(),

        sleep, energy, mood, stress, eating, symptoms,

        aiResponse: data.response,

      }, ...prev]);

    } catch {

      setAiResponse('Sorry, something went wrong. Please try again.');

    } finally {

      setLoading(false);

    }

  };

 

  const SliderField = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (

    <div style={{ marginBottom: '25px' }}>

      <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>

        <span>{label}</span>

        <span style={{ color: '#4ade80' }}>{value}/10</span>

      </label>

      <input

        type="range" min="1" max="10" value={value}

        onChange={e => onChange(Number(e.target.value))}

        style={{ width: '100%', height: '6px', cursor: 'pointer' }}

      />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginTop: '5px' }}>

        <span>Low</span><span>High</span>

      </div>

    </div>

  );

 

  return (

    <div style={{ minHeight: '100vh', background: '#0b1e12', color: 'white', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <h1 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '28px' }}>Signls</h1>

        <p style={{ textAlign: 'center', color: '#aaa', marginBottom: '30px' }}>A gentle daily check-in with yourself.</p>

 

        <div style={{ background: '#1a3a24', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>

          <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Morning check-in</h2>

          <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '20px' }}>Take 30 seconds to see how you are today.</p>

 

          <form onSubmit={handleSubmit}>

            <SliderField label="Sleep quality" value={sleep} onChange={setSleep} />

            <SliderField label="Energy level" value={energy} onChange={setEnergy} />

            <SliderField label="Mood" value={mood} onChange={setMood} />

            <SliderField label="Stress" value={stress} onChange={setStress} />

            <SliderField label="Healthy Eating" value={eating} onChange={setEating} />

 

            <div style={{ marginBottom: '25px' }}>

              <label style={{ marginBottom: '10px', display: 'block' }}>Symptoms (what's bothering you?)</label>

              <textarea

                value={symptoms}

                onChange={e => setSymptoms(e.target.value)}

                placeholder="e.g., headache, back pain, tired..."

                style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#0b1e12', color: 'white', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }}

              />

            </div>

 

            <button

              type="submit"

              disabled={loading}

              style={{ width: '100%', padding: '12px', background: '#1b5e20', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}

            >

              {loading ? 'Loading...' : 'Log this check-in'}

            </button>

          </form>

        </div>

 

        {aiResponse && (

          <div style={{ background: '#1a3a24', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #2d5a35' }}>

            <h3 style={{ marginBottom: '10px', fontSize: '14px', color: '#4ade80' }}>Today's reflection</h3>

            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#ddd' }}>{aiResponse}</p>

          </div>

        )}

 

        {entries.length > 0 && (

          <div>

            <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Last 7 check-ins</h3>

            <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>Only visible to you</p>

            {entries.slice(0, 7).map((entry, idx) => (

              <div key={idx} style={{ background: '#1a3a24', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #2d5a35' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>

                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{entry.date}</span>

                  <span style={{ fontSize: '12px', color: '#888' }}>Sleep {entry.sleep}/10 • Energy {entry.energy}/10 • Mood {entry.mood}/10</span>

                </div>

                {entry.symptoms && <p style={{ fontSize: '13px', color: '#aaa' }}>{entry.symptoms}</p>}

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}
