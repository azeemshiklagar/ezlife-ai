import React, { useState } from 'react';
import { ArrowRight, CalendarDays, Check, ChevronDown, Command, Mail, Menu, Play, Sparkles, Video, X, Zap } from 'lucide-react';

const API = 'http://localhost:5000/api';

function App() {
  const [mobile, setMobile] = useState(false);
  const [command, setCommand] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi — I’m ezLIfe AI. Tell me what you want done.' }
  ]);
  const [loading, setLoading] = useState(false);

  async function runCommand(e) {
    e?.preventDefault();
    const value = command.trim();
    if (!value || loading) return;

    setMessages(m => [...m, { role: 'user', text: value }]);
    setCommand('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/ai/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: value })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', text: data.message || 'I’m ready. Connect your tools to execute that action.' }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'The AI server is not running yet. Start the backend with npm run dev.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <nav className="nav">
        <a className="brand" href="#top">ezlife AI<span>•</span></a>
        <div className={`nav-links ${mobile ? 'open' : ''}`}>
          <a href="#how">How it works</a>
          <a href="#actions">Capabilities</a>
          <a href="#integrations">Integrations</a>
          <a href="#assistant">AI Assistant</a>
          <a className="nav-cta" href="#assistant">Try it <ArrowRight size={15}/></a>
        </div>
        <button className="mobile-menu" onClick={() => setMobile(!mobile)}>{mobile ? <X/> : <Menu/>}</button>
      </nav>

      <main id="top">
        <section className="hero section">
          <div className="eyebrow"><span className="pulse"></span> AI COMMAND CENTER</div>
          <h1>Tell it what to do.<br/><em>It gets it done.</em></h1>
          <p className="hero-copy">One intelligent assistant for email, meetings, calendars and the work between them.</p>
          <div className="hero-actions">
            <a className="button primary" href="#assistant">Try the assistant <ArrowRight size={17}/></a>
            <a className="button ghost" href="#how"><Play size={15}/> See how it works</a>
          </div>
          <div className="hero-orbit">
            <div className="orbit-ring ring-one"></div>
            <div className="orbit-ring ring-two"></div>
            <div className="core"><Sparkles size={28}/><span>ezLIfe AI</span></div>
            <div className="orbit-card card-a"><Mail size={17}/> Email</div>
            <div className="orbit-card card-b"><CalendarDays size={17}/> Calendar</div>
            <div className="orbit-card card-c"><Video size={17}/> Meetings</div>
          </div>
        </section>

        <section id="how" className="section split">
          <div>
            <div className="eyebrow">01 / SIMPLE BY DESIGN</div>
            <h2>Natural language.<br/><span>Real actions.</span></h2>
          </div>
          <div className="large-copy">
            <p>You don't need to learn another dashboard. Just tell ezLIfe AI what you need in plain English.</p>
            <div className="flow">
              <div><b>01</b><span>You command</span></div>
              <ArrowRight/>
              <div><b>02</b><span>AI understands</span></div>
              <ArrowRight/>
              <div><b>03</b><span>Tools execute</span></div>
            </div>
          </div>
        </section>

        <section id="actions" className="section">
          <div className="section-head">
            <div><div className="eyebrow">02 / CAPABILITIES</div><h2>Work, without the busywork.</h2></div>
            <p>Designed around actions — not endless chat.</p>
          </div>
          <div className="feature-grid">
            <Feature icon={<Mail/>} number="01" title="Send email" text="Draft and send clear, context-aware emails from one command." />
            <Feature icon={<CalendarDays/>} number="02" title="Book meetings" text="Turn a sentence into a scheduled meeting and calendar event." />
            <Feature icon={<Video/>} number="03" title="Create calls" text="Connect Google Meet, Zoom and Microsoft Teams workflows." />
            <Feature icon={<Zap/>} number="04" title="Automate actions" text="Build a foundation for tasks, reminders and multi-step workflows." />
          </div>
        </section>

        <section id="assistant" className="section assistant-section">
          <div className="assistant-shell">
            <div className="assistant-top">
              <div><div className="eyebrow"><span className="pulse"></span> LIVE COMMAND CENTER</div><h2>What should I do?</h2></div>
              <div className="status"><span></span> Ready</div>
            </div>
            <div className="chat">
              {messages.map((m, i) => <div key={i} className={`message ${m.role}`}><div className="message-label">{m.role === 'assistant' ? 'ezLIfe AI' : 'YOU'}</div><div>{m.text}</div></div>)}
              {loading && <div className="message assistant"><div className="message-label">ezLIfe AI</div><div className="typing"><i></i><i></i><i></i></div></div>}
            </div>
            <form className="command-box" onSubmit={runCommand}>
              <Command size={19}/>
              <input value={command} onChange={e => setCommand(e.target.value)} placeholder='Try: "Schedule a meeting with Rahul tomorrow at 4 PM"' />
              <button type="submit" disabled={loading}><ArrowRight/></button>
            </form>
            <div className="suggestions">
              <button onClick={() => setCommand('Draft an email to my client about tomorrow’s meeting')}>Draft an email</button>
              <button onClick={() => setCommand('Schedule a Google Meet tomorrow at 4 PM')}>Schedule a meeting</button>
              <button onClick={() => setCommand('Create a Zoom call for Friday at 3 PM')}>Create a Zoom call</button>
            </div>
          </div>
        </section>

        <section id="integrations" className="section integrations">
          <div className="eyebrow">03 / YOUR TOOLS, CONNECTED</div>
          <h2>One assistant.<br/><span>Your whole workflow.</span></h2>
          <div className="integration-row">
            <div><strong>G</strong><span>Google</span><small>Gmail + Calendar + Meet</small></div>
            <div><strong>ZO</strong><span>Zoom</span><small>Meetings + invitations</small></div>
            <div><strong>MS</strong><span>Microsoft</span><small>Outlook + Teams</small></div>
          </div>
        </section>

        <section className="section final-cta">
          <div className="eyebrow">04 / START HERE</div>
          <h2>Your next action<br/><em>starts with a sentence.</em></h2>
          <a className="button primary" href="#assistant">Open AI Assistant <ArrowRight size={17}/></a>
        </section>
      </main>

      <footer><div className="brand">ezLIfe AI<span>•</span></div><span>AI that gets things done.</span><span>© 2026</span></footer>
    </div>
  );
}

function Feature({ icon, number, title, text }) {
  return <article className="feature"><div className="feature-icon">{icon}</div><div className="feature-number">{number}</div><h3>{title}</h3><p>{text}</p><ArrowRight className="feature-arrow"/></article>;
}

export default App;
