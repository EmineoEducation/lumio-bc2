// ══════════════════════════════════════════════════════════════
//  LIVRABLE APP — BC2
//  PAC · Parcours Activation Compétences · Éminéo · MSMC
//  · Compétences C.7 à C.12
//  · Gabarit comparaison scénarios (C.11)
//  · Questions de positionnement (C.8)
//  · Jury IA — critères RNCP BC2 stricts
//  · Portfolio étudiant·e — envoi par mail
// ══════════════════════════════════════════════════════════════

const wc = (txt) => (txt || '').trim() ? (txt || '').trim().split(/\s+/).length : 0;
const GLOBAL_MIN = 520;

// ─── Prompt jury BC2 ─────────────────────────────────────────
const JURY_PROMPT = `Tu es un jury d'évaluation certifiant pour le Master MSMC (RNCP 38504), bloc de compétences BC2 — "Élaborer une stratégie marketing communication alignée avec les valeurs de la marque et favorisant l'engagement de son public cible".

Tu évalues une proposition de stratégie marcom produite par un·e étudiant·e dans le cadre Lumio Health. Chaque compétence RNCP (C.7 à C.12) a fait l'objet d'une réponse distincte.

Contexte Lumio Health — Board Northgate Capital, octobre 2026 :
- Medtech parisienne, 8 ans, wearable stress (Lumio Patch), 180 références B2B actives (pas 230 — chiffre gonflé)
- Pression fonds américain : 20 M€ CA en 36 mois, pivot B2C demandé
- Certification MDR absente — Q2 2027 best case, après 3e avis de non-conformité TÜV
- Tension budgétaire : 200 000 € plafond Théo vs 380 000 € demandé Sonia
- Churn réel ~9 % (Camille Ott) vs 4 % présenté dans le deck board
- Signal fort B2B : appel d'offres mutuelles 45 M€ avec MDR obligatoire
- Accord Darty Santé (50 000 unités B2C, conditionné MDR) signé par Théo sans annonce
- Clause de sortie Northgate à 18 mois si pivot non engagé

Pour chaque compétence, évalue la réponse de l'étudiant·e. Format STRICT :

### C.7 — [Satisfaisant / Insuffisant / Absent]
Une phrase de retour précise. Cite les mots de l'étudiant si pertinent.

### C.8 — [Satisfaisant / Insuffisant / Absent]
Une phrase de retour précise.

### C.9 — [Satisfaisant / Insuffisant / Absent]
Une phrase de retour précise.

### C.10 — [Satisfaisant / Insuffisant / Absent]
Une phrase de retour précise.

### C.11 — [Satisfaisant / Insuffisant / Absent]
Une phrase de retour précise.

### C.12 — [Satisfaisant / Insuffisant / Absent]
Une phrase de retour précise.

---

## Niveau de conformité global
**[Non conforme / Partiellement conforme / Conforme / Conforme avec distinction]**
Une phrase de synthèse.

## Question de jury
Une seule question qu'un jury poserait à l'oral — précise, dérangeante, sans réponse évidente. Elle doit porter sur une tension réelle du cas (MDR, churn réel, budget, signal mutuelles, accord Darty).

Règles :
- Ne propose pas de stratégie alternative
- Ne complète pas les lacunes
- Si une compétence est absente, écris "Absent" et une phrase
- La tension budgétaire 200K/380K DOIT être traitée pour obtenir C.12 satisfaisant
- Des objectifs sans date ni métrique = C.7 insuffisant
- Une recommandation sans évaluation comparative de scénarios = C.11 insuffisant`;

function LivrableApp() {
  const cfg = window.PASS_CONFIG;
  const COMPETENCES = cfg ? cfg.competences : [];

  const [answers, setAnswers] = React.useState(() => {
    try {
      const saved = localStorage.getItem('lumio_livrable_answers_bc2');
      return saved ? JSON.parse(saved) : Object.fromEntries(COMPETENCES.map(c => [c.code, '']));
    } catch { return Object.fromEntries(COMPETENCES.map(c => [c.code, ''])); }
  });

  const [gabaritMode, setGabaritMode] = React.useState(null);
  const [gabaritData, setGabaritData] = React.useState({});
  const [positionAnswers, setPositionAnswers] = React.useState({});
  const [phase, setPhase] = React.useState('edit'); // edit | submitting | done
  const [juryResult, setJuryResult] = React.useState('');
  const [activeTab, setActiveTab] = React.useState(COMPETENCES[0]?.code || 'C.7');
  const scrollRef = React.useRef(null);

  // Persister + notifier
  React.useEffect(() => {
    localStorage.setItem('lumio_livrable_answers_bc2', JSON.stringify(answers));
    if (window.__onLivrableChange) window.__onLivrableChange(answers);
  }, [answers]);

  const wordCounts = Object.fromEntries(COMPETENCES.map(c => [c.code, wc(answers[c.code])]));
  const globalWords = Object.values(wordCounts).reduce((a, b) => a + b, 0);
  const missingMin = COMPETENCES.filter(c => wordCounts[c.code] < c.min);
  const canSubmit = missingMin.length === 0 && globalWords >= GLOBAL_MIN && phase === 'edit';

  const setAnswer = (code, val) => setAnswers(prev => ({ ...prev, [code]: val }));

  const getMissingKeywords = (c) => {
    if (!c.motsCles) return [];
    const text = (answers[c.code] || '').toLowerCase();
    return c.motsCles.filter(kw => !text.toLowerCase().includes(kw.toLowerCase()));
  };

  // Gabarit scénarios → injection dans C.11
  const applyGabarit = () => {
    if (!cfg?.gabarits?.SCENARIOS) return;
    const struct = cfg.gabarits.SCENARIOS.structure;
    const text = struct.map(s => `**${s.label}**\n${gabaritData[s.cle] || ''}`).join('\n\n');
    setAnswer('C.11', text);
    setGabaritMode(null);
  };

  const submit = async () => {
    if (!canSubmit) return;
    setPhase('submitting');

    // Enrichir C.8 avec les réponses de positionnement si saisies
    const answersEnriched = { ...answers };
    if (Object.keys(positionAnswers).length > 0 && cfg?.questionsPositionnement) {
      const posText = cfg.questionsPositionnement
        .map(q => positionAnswers[q.id] ? `[Positionnement — ${q.texte}] → ${positionAnswers[q.id]}` : '')
        .filter(Boolean).join('\n');
      if (posText) {
        answersEnriched['C.8'] = (answersEnriched['C.8'] || '') + '\n\n' + posText;
      }
    }

    const livrableText = COMPETENCES.map(c =>
      `## ${c.code} — ${c.label}\n\n${answersEnriched[c.code] || '(non renseigné)'}`
    ).join('\n\n---\n\n');

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1200,
          system: JURY_PROMPT,
          messages: [{ role: 'user', content: livrableText }]
        })
      });
      const data = await resp.json();
      const result = data.content?.map(b => b.text || '').join('') || 'Erreur de connexion.';
      setJuryResult(result);
      setPhase('done');

      // ── Complétion + envoi portfolio (best-effort, ne bloque pas l'UI) ──
      try {
        const _stu = (window.LUMIO_DATA && window.LUMIO_DATA.student) || {};
        const _bloc = (window.PAC_CONFIG && window.PAC_CONFIG.bloc) || 'bc2';
        if (_stu.email) {
          const _html = '<div style="font-family:sans-serif;max-width:680px;margin:auto">'
            + '<h1>Portfolio de compétences</h1>'
            + '<p><b>' + (_stu.name || '') + '</b> · PAC ' + _bloc + '</p>'
            + COMPETENCES.map(function(c){ return '<h3>' + c.code + ' — ' + c.label + '</h3>'
                + '<p style="white-space:pre-wrap">' + ((answersEnriched[c.code]) || '') + '</p>'; }).join('')
            + '<hr><h2>Retour du jury</h2><p style="white-space:pre-wrap">' + (result || '') + '</p></div>';
          fetch('/api/send-portfolio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: _stu.email, studentName: _stu.name, bloc: _bloc, html: _html })
          }).catch(function(){ /* coche Redis best-effort, échec silencieux */ });
        }
      } catch (_) { /* no-op */ }

      // Déclencher la réaction de Jakob dans Slack
      setTimeout(() => {
        if (window.__onSoniaLivrableReaction) window.__onSoniaLivrableReaction(answersEnriched);
        if (window.__onLivrableSubmitted) window.__onLivrableSubmitted(livrableText, '', result);
      }, 1200);

      window.LUMIO_LOG = window.LUMIO_LOG || {};
      window.LUMIO_LOG.livrableSubmitted = Date.now();
      window.LUMIO_LOG.wordCounts = wordCounts;
      window.LUMIO_LOG.globalWords = globalWords;
    } catch(e) {
      setPhase('edit');
      alert('Erreur de connexion. Réessaie dans un instant.');
    }
  };

  // ── Écran soumission ──────────────────────────────────────
  if (phase === 'submitting') return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#f9f8f5' }}>
      <div style={{ width: 44, height: 44, border: '3px solid rgba(27,58,107,0.2)', borderTopColor: '#1b3a6b', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <div style={{ fontSize: 14, color: 'var(--ink-mute)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>Le jury évalue votre recommandation…</div>
      <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>Le retour arrivera dans Slack · Jakob Rein</div>
    </div>
  );

  // ── Écran final ───────────────────────────────────────────
  if (phase === 'done') return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f9f8f5', overflowY: 'auto' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 40px', textAlign: 'center', gap: 20 }}>

        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1b3a6b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, color: 'var(--ink)', marginBottom: 6 }}>
            Recommandation remise à Jakob
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-mute)', lineHeight: 1.7 }}>
            {cfg?.epreuve || 'BC2'} · {cfg?.deadline || 'Jeudi 15 octobre · 20h00'}
          </div>
        </div>

        {/* Récap compétences */}
        <div style={{ width: '100%', maxWidth: 480, background: 'white', borderRadius: 10, padding: '16px 20px', border: '1px solid var(--rule)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 12 }}>Compétences soumises</div>
          {COMPETENCES.map(c => {
            const words = wordCounts[c.code];
            const ok = words >= c.min;
            return (
              <div key={c.code} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', borderBottom: '1px solid rgba(20,24,36,0.05)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#1b3a6b', minWidth: 30 }}>{c.code}</span>
                <span style={{ flex: 1, fontSize: 12, color: 'var(--ink)' }}>{c.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: ok ? '#1a6641' : '#c4420f', fontWeight: 700 }}>{words} mots {ok ? '✓' : '⚠'}</span>
              </div>
            );
          })}
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: '#1b3a6b' }}>{globalWords} mots</span>
          </div>
        </div>

        {/* Portfolio */}
        <div style={{ background: 'rgba(27,58,107,0.07)', borderRadius: 8, padding: '12px 20px', border: '1px solid rgba(27,58,107,0.18)', fontSize: 12, color: '#1b3a6b', lineHeight: 1.7, maxWidth: 480, width: '100%', textAlign: 'left' }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>🎓 Évaluation disponible dans Slack · Jakob Rein</div>
          <div style={{ color: 'var(--ink-mute)', fontSize: 11 }}>
            Cette évaluation fait partie de votre portfolio de compétences PAC. 
            Elle vous sera transmise par mail à la fin de la session. 
            Elle est autonome — indépendante de vos autres blocs.
          </div>
        </div>

        {/* Jury result preview */}
        {juryResult && (
          <div style={{ width: '100%', maxWidth: 480, background: 'white', borderRadius: 10, padding: '16px 20px', border: '1px solid rgba(27,58,107,0.2)', textAlign: 'left' }}>
            <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1b3a6b', marginBottom: 10 }}>Retour jury · BC2</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{juryResult}</div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Vue principale ────────────────────────────────────────
  const activeComp = COMPETENCES.find(c => c.code === activeTab);
  const missingKw = activeComp ? getMissingKeywords(activeComp) : [];
  const activeWords = activeComp ? wordCounts[activeComp.code] : 0;
  const activeOk = activeComp ? activeWords >= activeComp.min : false;

  // Couleurs par compétence
  const compColors = {
    'C.7': '#1b4f8a', 'C.8': '#1b6e8a', 'C.9': '#0a7a6e',
    'C.10': '#1a6641', 'C.11': '#c4420f', 'C.12': '#8a420f'
  };
  const activeColor = compColors[activeTab] || '#1b3a6b';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f9f8f5', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>

      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ padding: '12px 20px 10px', borderBottom: '1px solid var(--rule)', background: 'white', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Livrable — {cfg?.bloc || 'BC2'} · Lumio Health</div>
            <div style={{ fontSize: 10, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', marginTop: 1 }}>
              RNCP 38504 · {cfg?.deadline || 'Jeudi 15 octobre · 20h00'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: globalWords >= GLOBAL_MIN ? '#1b3a6b' : 'var(--ink-mute)', fontFamily: 'var(--font-mono)' }}>
              {globalWords}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--ink-faint)' }}>/{GLOBAL_MIN}</span>
            </div>
            <div style={{ fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>mots globaux</div>
          </div>
        </div>

        {/* Onglets */}
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 2 }}>
          {COMPETENCES.map(c => {
            const words = wordCounts[c.code];
            const ok = words >= c.min;
            const active = activeTab === c.code;
            const col = compColors[c.code] || '#1b3a6b';
            return (
              <button key={c.code} onClick={() => setActiveTab(c.code)} style={{
                flexShrink: 0, padding: '5px 10px',
                background: active ? col : ok ? `${col}18` : 'transparent',
                color: active ? 'white' : ok ? col : 'var(--ink-mute)',
                border: active ? 'none' : `1px solid ${ok ? `${col}40` : 'var(--rule)'}`,
                borderRadius: 6, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-mono)',
                transition: 'all .15s', whiteSpace: 'nowrap'
              }}>
                {ok ? '✓ ' : ''}{c.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Corps : 2 colonnes ─────────────────────────────── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', overflow: 'hidden', minHeight: 0 }}>

        {/* Colonne gauche — saisie */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--rule)' }}>

          {/* Sous-header compétence active */}
          <div style={{ padding: '10px 18px 8px', background: 'white', borderBottom: '1px solid var(--rule)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: activeColor }}>{activeTab}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{activeComp?.label}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: activeOk ? '#1a6641' : 'var(--ink-mute)', fontWeight: 700 }}>
                {activeWords}<span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>/{activeComp?.min}</span>
              </span>
            </div>

            {/* Barre de progression */}
            <div style={{ height: 3, background: 'var(--rule)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2, transition: 'width .3s',
                background: activeOk ? '#1a6641' : activeColor,
                width: `${Math.min(100, activeComp ? (activeWords / activeComp.min) * 100 : 0)}%`
              }} />
            </div>
          </div>

          {/* Questions de positionnement pour C.8 */}
          {activeTab === 'C.8' && cfg?.questionsPositionnement && (
            <div style={{ padding: '12px 18px', background: 'rgba(27,58,107,0.04)', borderBottom: '1px solid var(--rule)', flexShrink: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#1b3a6b', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                Positionnement stratégique (optionnel)
              </div>
              {cfg.questionsPositionnement.map(q => (
                <div key={q.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.5 }}>{q.texte}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {q.options.map(opt => (
                      <button key={opt} onClick={() => setPositionAnswers(prev => ({ ...prev, [q.id]: opt }))} style={{
                        padding: '4px 10px', fontSize: 11,
                        background: positionAnswers[q.id] === opt ? '#1b3a6b' : 'white',
                        color: positionAnswers[q.id] === opt ? 'white' : 'var(--ink-soft)',
                        border: `1px solid ${positionAnswers[q.id] === opt ? '#1b3a6b' : 'var(--rule)'}`,
                        borderRadius: 5, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s'
                      }}>{opt}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Gabarit scénarios pour C.11 */}
          {activeTab === 'C.11' && gabaritMode === 'SCENARIOS' && cfg?.gabarits?.SCENARIOS && (
            <div style={{ padding: '14px 18px', background: 'rgba(196,66,15,0.04)', borderBottom: '1px solid var(--rule)', overflowY: 'auto', maxHeight: '45%', flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#c4420f', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                Gabarit — Comparaison de scénarios
              </div>
              {cfg.gabarits.SCENARIOS.structure.map(s => (
                <div key={s.cle} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{s.label}</div>
                  <textarea
                    value={gabaritData[s.cle] || ''}
                    onChange={e => setGabaritData(prev => ({ ...prev, [s.cle]: e.target.value }))}
                    placeholder={s.placeholder}
                    rows={2}
                    style={{ width: '100%', border: '1px solid var(--rule)', borderRadius: 6, padding: '6px 10px', fontSize: 11, fontFamily: 'var(--font-display)', resize: 'vertical', outline: 'none' }}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={applyGabarit} style={{ padding: '6px 14px', background: '#c4420f', color: 'white', border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Injecter dans C.11 →
                </button>
                <button onClick={() => setGabaritMode(null)} style={{ padding: '6px 14px', background: 'transparent', color: 'var(--ink-mute)', border: '1px solid var(--rule)', borderRadius: 5, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Zone de texte */}
          <textarea
            ref={scrollRef}
            value={answers[activeTab] || ''}
            onChange={e => setAnswer(activeTab, e.target.value)}
            placeholder={activeComp?.placeholder || ''}
            style={{
              flex: 1, width: '100%', border: 'none', outline: 'none',
              padding: '16px 18px', fontSize: 13.5,
              fontFamily: 'var(--font-display)', lineHeight: 1.75,
              color: 'var(--ink)', resize: 'none', background: 'white', minHeight: 0
            }}
          />
        </div>

        {/* Colonne droite — référentiel ──────────────────── */}
        <div style={{ background: '#f4f2ee', overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Attendu RNCP */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: activeColor, fontWeight: 700, marginBottom: 6 }}>
              {activeComp?.code} · Attendu RNCP
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.65 }}>{activeComp?.rncp}</div>
            <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.06em' }}>minimum {activeComp?.min} mots</div>
          </div>

          {/* Conseil */}
          {activeComp?.conseil && (
            <div style={{ background: 'rgba(27,58,107,0.07)', borderRadius: 7, padding: '9px 12px', border: '1px solid rgba(27,58,107,0.18)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#1b3a6b', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Conseil</div>
              <div style={{ fontSize: 11, color: '#0d2545', lineHeight: 1.6 }}>{activeComp.conseil}</div>
            </div>
          )}

          {/* Gabarit scénarios pour C.11 */}
          {activeTab === 'C.11' && cfg?.gabarits?.SCENARIOS && !gabaritMode && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Gabarit optionnel</div>
              <button onClick={() => setGabaritMode('SCENARIOS')} style={{
                width: '100%', padding: '8px 12px',
                background: 'white', border: '1px solid rgba(20,24,36,0.15)', borderRadius: 7,
                fontSize: 12, fontWeight: 600, color: 'var(--ink)', cursor: 'pointer',
                textAlign: 'left', fontFamily: 'inherit', transition: 'background .15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#ece8e0'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                Utiliser le gabarit Comparaison de scénarios →
              </button>
              <div style={{ fontSize: 10, color: 'var(--ink-faint)', lineHeight: 1.6, fontStyle: 'italic', marginTop: 6 }}>
                Facultatif — 3 scénarios à évaluer (B2B / B2C / Hybride). Injecte une structure dans votre réponse.
              </div>
            </div>
          )}

          {/* Tension clé pour C.12 */}
          {activeTab === 'C.12' && (
            <div style={{ background: 'rgba(196,66,15,0.06)', borderRadius: 7, padding: '9px 12px', border: '1px solid rgba(196,66,15,0.2)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#c4420f', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>⚠ Tension budgétaire</div>
              <div style={{ fontSize: 11, color: '#7a2a0a', lineHeight: 1.6 }}>
                Théo : plafond 200 000 €<br/>
                Sonia : budget demandé 380 000 €<br/>
                Écart non résolu : 180 000 €<br/>
                <span style={{ fontStyle: 'italic', marginTop: 4, display: 'block' }}>Vous devez vous positionner explicitement.</span>
              </div>
            </div>
          )}

          {/* Mots-clés manquants */}
          {missingKw.length > 0 && activeWords > 50 && (
            <div style={{ background: 'rgba(196,66,15,0.05)', borderRadius: 7, padding: '9px 12px', border: '1px solid rgba(196,66,15,0.15)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#c4420f', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Angles absents du texte</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {missingKw.map(kw => (
                  <span key={kw} style={{ fontSize: 10, padding: '2px 7px', background: 'rgba(196,66,15,0.1)', borderRadius: 4, color: '#c4420f', fontFamily: 'var(--font-mono)' }}>{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* Progression globale */}
          <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--rule)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Progression</div>
            {COMPETENCES.map(c => {
              const words = wordCounts[c.code];
              const ok = words >= c.min;
              const col = compColors[c.code] || '#1b3a6b';
              return (
                <div key={c.code} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: ok ? col : 'var(--ink-faint)', fontWeight: 700 }}>{c.code}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: ok ? '#1a6641' : 'var(--ink-faint)' }}>{words}/{c.min}</span>
                  </div>
                  <div style={{ height: 2, background: 'var(--rule)', borderRadius: 1, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: ok ? '#1a6641' : col, width: `${Math.min(100, (words / c.min) * 100)}%`, transition: 'width .3s', borderRadius: 1 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div style={{ padding: '10px 20px', borderTop: '1px solid var(--rule)', background: 'white', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          {missingMin.length > 0 ? (
            <div style={{ fontSize: 11, color: '#b85c00' }}>Minimum non atteint : {missingMin.map(c => c.code).join(', ')}</div>
          ) : globalWords < GLOBAL_MIN ? (
            <div style={{ fontSize: 11, color: '#b85c00' }}>Total minimum {GLOBAL_MIN} mots requis ({GLOBAL_MIN - globalWords} restants)</div>
          ) : (
            <div style={{ fontSize: 11, color: '#1b3a6b' }}>✓ Recommandation complète — prête à soumettre</div>
          )}
        </div>
        <button
          onClick={canSubmit ? submit : undefined}
          style={{
            background: canSubmit ? '#1b3a6b' : 'rgba(20,24,36,0.1)',
            color: canSubmit ? 'white' : 'var(--ink-faint)',
            border: 'none', borderRadius: 6, padding: '9px 22px',
            fontSize: 13, fontWeight: 600,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'background .15s', fontFamily: 'inherit'
          }}
        >Soumettre au board →</button>
      </div>
    </div>
  );
}

window.LUMIO_APPS = window.LUMIO_APPS || {};
window.LUMIO_APPS.livrable = LivrableApp;
