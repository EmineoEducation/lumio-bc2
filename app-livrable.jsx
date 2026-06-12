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


// ══════ Portfolio Éminéo — composants partagés (canonique) ══════
function parseJuryResult(juryText, competences) {
  const results = {};
  const niveauMap = {
    'satisfaisant': 'Satisfaisante',
    'insuffisant': 'Insuffisante',
    'absent': 'Absente',
    'conforme avec distinction': 'Maximale',
    'conforme': 'Haute',
    'partiellement conforme': 'Moyenne',
    'non conforme': 'Insuffisante'
  };

  competences.forEach(c => {
    const pattern = new RegExp(`###\\s*${c.code.replace('.', '\\.')}[^\\n]*\\[([^\\]]+)\\]`, 'i');
    const match = juryText.match(pattern);
    if (match) {
      const raw = match[1].toLowerCase().trim();
      results[c.code] = {
        niveau: niveauMap[raw] || match[1],
        acquis: raw !== 'insuffisant' && raw !== 'absent' && raw !== 'non conforme'
      };
    } else {
      results[c.code] = { niveau: 'Non évalué', acquis: false };
    }
  });

  // Global level
  const globalMatch = juryText.match(/\*\*\[([^\]]+)\]\*\*/);
  const globalRaw = globalMatch ? globalMatch[1].toLowerCase() : '';
  results._global = {
    label: globalMatch ? globalMatch[1] : 'Non évalué',
    acquis: globalRaw.includes('conforme') && !globalRaw.includes('non conforme')
  };

  // Question jury
  const qMatch = juryText.match(/## Question de jury\n([^\n]+)/);
  results._question = qMatch ? qMatch[1] : null;

  return results;
}

function PortfolioScreen({ studentName, studentEmail, competences, wordCounts, juryResult, globalWords, answers, blocLabel, affaire }) {
  const [sendState, setSendState] = React.useState('idle'); // idle | sending | sent | error
  const parsed = React.useMemo(() => parseJuryResult(juryResult || '', competences), [juryResult, competences]);
  const acquises = competences.filter(c => parsed[c.code]?.acquis);
  const nonAcquises = competences.filter(c => !parsed[c.code]?.acquis);
  const portfolioEarned = parsed._global?.acquis && acquises.length >= Math.ceil(competences.length * 0.5);
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const prenom = (studentName || '').split(' ')[0] || 'Étudiant';

  // ── Métadonnées affaire / livrable (depuis PASS_CONFIG avec fallbacks) ──
  const cfg = window.PASS_CONFIG || {};
  const blocId = blocLabel || cfg.bloc || 'BC1';
  const affaireTitre = affaire || cfg.titre_affaire || cfg.accroche || 'Affaire Lumio Health';
  const livrableTitre = cfg.livrableTitre || cfg.deliverable || 'Livrable certifiant PAC';
  const livrableMeta = cfg.epreuve || 'MSMC RNCP 38504';

  // ── Récit hybride : généré par l'IA depuis les réponses, éditable ──
  const [recit, setRecit] = React.useState('');
  const [signature, setSignature] = React.useState('');
  const [recitState, setRecitState] = React.useState('loading'); // loading | ready | error
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const genRecit = async () => {
      setRecitState('loading');
      try {
        const reponsesText = competences.map(c =>
          `${c.code} — ${c.label} :\n${(answers && answers[c.code]) || '(non renseigné)'}`
        ).join('\n\n');
        const sys = `Tu es l'étudiant ${prenom}, qui vient de produire un livrable certifiant pour le bloc ${blocId} (PAC Lumio Health). À partir de ses réponses ci-dessous, écris à la PREMIÈRE PERSONNE deux courts textes qui expriment sa POSTURE professionnelle et ses CHOIX — pas un résumé.

RÈGLES STRICTES :
- "recit" : 2 à 3 phrases. Commence par un fait concret tiré des réponses (un chiffre, une contradiction, une tension repérée), puis un choix posé ("j'ai choisi de…"). Ton sobre, professionnel, première personne. Pas de superlatif.
- "signature" : 1 phrase, sur le modèle "Dans cette affaire, j'ai choisi de … — parce que …". Elle nomme le parti-pris central et sa justification.
- Réponds UNIQUEMENT avec un objet JSON valide, sans balise Markdown, sans préambule : {"recit":"…","signature":"…"}`;
        const resp = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 400,
            system: sys,
            messages: [{ role: 'user', content: reponsesText }]
          })
        });
        if (!resp.ok) throw new Error('api');
        const data = await resp.json();
        const raw = (Array.isArray(data.content) ? data.content.map(b => b.text || '').join('') : '').trim();
        const clean = raw.replace(/```json|```/g, '').trim();
        const obj = JSON.parse(clean);
        if (cancelled) return;
        setRecit((obj.recit || '').trim());
        setSignature((obj.signature || '').trim());
        setRecitState('ready');
      } catch {
        if (cancelled) return;
        setRecit(`Dans cette affaire, j'ai dû trancher à partir de documents qui se contredisaient. J'ai choisi de nommer les tensions avant de proposer une direction, plutôt que de produire une réponse lisse qui les aurait masquées.`);
        setSignature(`Dans cette affaire, j'ai choisi de poser un diagnostic honnête avant de recommander — parce qu'une décision défendable vaut mieux qu'une note rassurante.`);
        setRecitState('ready');
      }
    };
    if (portfolioEarned) genRecit();
    else setRecitState('skip');
    return () => { cancelled = true; };
  }, [portfolioEarned]);

  const sendPortfolio = async () => {
    if (sendState === 'sending' || sendState === 'sent' || !portfolioEarned) return;
    if (!studentEmail) { setSendState('error'); return; }
    setSendState('sending');
    try {
      const portfolioHTML = generatePortfolioHTML(studentName, acquises, today, { blocId, affaireTitre, livrableTitre, recit, signature, prenom });
      const resp = await fetch('/api/send-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: studentEmail, studentName, portfolioHTML,
          bloc: blocId, acquises: acquises.map(c => c.code), date: today
        })
      });
      const data = await resp.json().catch(() => ({}));
      if (resp.ok && data.sent) setSendState('sent');
      else setSendState('error');
    } catch { setSendState('error'); }
  };

  const G = C_EMINEO;

  // ════════════════ Portfolio NON délivré → bilan sobre ════════════════
  if (!portfolioEarned) {
    return (
      <div style={{ height: '100%', overflowY: 'auto', background: G.givre, fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <div style={{ background: `linear-gradient(160deg, ${G.petrole} 0%, ${G.abysse} 100%)`, padding: '28px 32px 24px' }}>
          <div style={{ fontSize: 11, color: G.saumon, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
            Bilan PAC · {blocId} · {today}
          </div>
          <div style={{ fontSize: 22, fontWeight: 300, color: 'white', lineHeight: 1.2, marginBottom: 8 }}>{studentName}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(232,155,119,0.15)', border: `1px solid ${G.saumon}`, borderRadius: 20, padding: '5px 14px' }}>
            <span style={{ fontSize: 11, color: G.saumon, fontWeight: 600 }}>Portfolio non délivré — voir le détail ci-dessous</span>
          </div>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {acquises.length > 0 && <CompetenceBlock title={`Compétences acquises — ${acquises.length}/${competences.length}`} comps={acquises} parsed={parsed} ok G={G} />}
          {nonAcquises.length > 0 && <CompetenceBlock title={`À renforcer — ${nonAcquises.length}/${competences.length}`} comps={nonAcquises} parsed={parsed} G={G} />}
          {parsed._question && (
            <div style={{ background: G.abysse, borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ fontSize: 9, color: G.menthe, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Question de jury à préparer</div>
              <div style={{ fontSize: 13, color: 'white', lineHeight: 1.6, fontStyle: 'italic' }}>"{parsed._question}"</div>
            </div>
          )}
          <div style={{ textAlign: 'center', padding: '8px 0 16px', fontSize: 10, color: G.petrole, opacity: 0.45, letterSpacing: '0.08em' }}>
            PAC · Éminéo Éducation · MSMC RNCP 38504 · {today}
          </div>
        </div>
      </div>
    );
  }

  // ════════════════ Portfolio DÉLIVRÉ → carte façon PJ, charte Éminéo ════════════════
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: G.givre, fontFamily: "'IBM Plex Sans', sans-serif", padding: '24px 22px 30px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 40px rgba(11,43,45,0.14)', border: `1px solid rgba(19,69,71,0.08)` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr' }} className="pac-portfolio-grid">

          {/* ── Volet image ── */}
          <div style={{ position: 'relative', minHeight: 460, background: `linear-gradient(155deg, ${G.petrole} 0%, ${G.abysse} 100%)`, padding: '26px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
            {/* halo décoratif */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${G.menthe}22 0%, transparent 70%)` }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <svg width="30" height="30" viewBox="0 0 52 52" fill="none">
                  <circle cx="26" cy="26" r="26" fill={G.givre}/>
                  <circle cx="26" cy="22" r="8" fill={G.abysse}/>
                  <path d="M26 30 C26 30 14 34 14 42 L38 42 C38 34 26 30 26 30Z" fill={G.abysse}/>
                </svg>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white', letterSpacing: '0.02em' }}>emineo</div>
                  <div style={{ fontSize: 8, color: G.menthe, letterSpacing: '0.18em', textTransform: 'uppercase' }}>ÉDUCATION</div>
                </div>
              </div>
              <div style={{ display: 'inline-block', background: G.menthe, color: G.abysse, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.04em' }}>
                {blocId}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 10, color: G.menthe, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Portfolio de compétences</div>
              <div style={{ fontSize: 22, fontWeight: 300, color: 'white', lineHeight: 1.25, marginBottom: 14 }}>{affaireTitre}</div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', margin: '14px 0' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>{studentName}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>{livrableMeta} · {today}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, background: 'rgba(93,226,152,0.15)', border: `1px solid ${G.menthe}`, borderRadius: 20, padding: '4px 12px' }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="10 3 5 9 2 6" stroke={G.menthe} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontSize: 10, color: G.menthe, fontWeight: 600 }}>{parsed._global?.label || 'Conforme'}</span>
              </div>
            </div>
          </div>

          {/* ── Volet contenu ── */}
          <div style={{ padding: '30px 32px' }}>

            {/* Livrable produit */}
            <div style={{ fontSize: 10, color: G.menthe, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Livrable produit</div>
            <div style={{ fontSize: 19, fontWeight: 600, color: G.abysse, lineHeight: 1.3, marginBottom: 6 }}>{livrableTitre}</div>
            <div style={{ fontSize: 12, color: G.petrole, opacity: 0.7, marginBottom: 10 }}>{globalWords} mots produits · {acquises.length}/{competences.length} compétences validées</div>
            <div style={{ display: 'inline-block', background: G.givre, color: G.petrole, fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 6 }}>
              Évalué conforme par l'IA pédagogique
            </div>

            <div style={{ height: 1, background: 'rgba(19,69,71,0.1)', margin: '22px 0' }} />

            {/* Compétences mobilisées */}
            <div style={{ fontSize: 10, color: G.menthe, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Compétences mobilisées</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {acquises.map(c => (
                <div key={c.code} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: G.menthe, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><polyline points="8 2 4 8 2 5" stroke={G.abysse} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{ fontSize: 13, color: G.abysse, lineHeight: 1.45 }}>
                    <span style={{ fontWeight: 700, color: G.petrole, fontFamily: 'monospace', fontSize: 11, marginRight: 6 }}>{c.code}</span>
                    {c.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: 'rgba(19,69,71,0.1)', margin: '22px 0' }} />

            {/* Récit + signature — première personne, éditable */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: G.menthe, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700 }}>Ma posture</div>
              {recitState === 'ready' && (
                <button onClick={() => setEditing(e => !e)} style={{ background: 'none', border: `1px solid ${G.petrole}`, color: G.petrole, fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {editing ? '✓ Terminer' : '✎ Modifier'}
                </button>
              )}
            </div>

            {recitState === 'loading' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', color: G.petrole, opacity: 0.6, fontSize: 13, fontStyle: 'italic' }}>
                <div style={{ width: 16, height: 16, border: `2px solid rgba(19,69,71,0.2)`, borderTopColor: G.petrole, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                L'IA rédige une proposition de récit à partir de vos réponses…
              </div>
            )}

            {recitState === 'ready' && (
              <div style={{ background: `linear-gradient(135deg, ${G.givre} 0%, rgba(157,240,196,0.25) 100%)`, borderRadius: 12, padding: '20px 22px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 8, left: 14, fontSize: 42, color: G.menthe, opacity: 0.5, fontFamily: 'Georgia, serif', lineHeight: 1 }}>“</div>
                {editing ? (
                  <>
                    <textarea value={recit} onChange={e => setRecit(e.target.value)} rows={4}
                      style={{ width: '100%', background: 'white', border: `1px solid ${G.menthe}`, borderRadius: 8, padding: '10px 12px', fontSize: 13.5, lineHeight: 1.6, color: G.abysse, fontFamily: 'inherit', resize: 'vertical', marginBottom: 10, marginTop: 8 }} />
                    <textarea value={signature} onChange={e => setSignature(e.target.value)} rows={2}
                      style={{ width: '100%', background: 'white', border: `1px solid ${G.menthe}`, borderRadius: 8, padding: '10px 12px', fontSize: 13, lineHeight: 1.5, color: G.petrole, fontStyle: 'italic', fontFamily: 'inherit', resize: 'vertical' }} />
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: G.abysse, margin: '6px 0 14px', position: 'relative', zIndex: 1 }}>{recit}</p>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: G.petrole, fontStyle: 'italic', margin: 0, paddingTop: 12, borderTop: `1px solid rgba(19,69,71,0.12)` }}>
                      {signature}
                    </p>
                    <p style={{ fontSize: 12, color: G.petrole, fontWeight: 600, marginTop: 10, textAlign: 'right' }}>— {studentName}</p>
                  </>
                )}
              </div>
            )}

            {/* Envoi portfolio */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 11, color: G.petrole, opacity: 0.65, marginBottom: 10 }}>
                Recevez votre portfolio par email : <strong>{studentEmail || 'email non renseigné'}</strong>
              </div>
              <button onClick={sendPortfolio} disabled={sendState === 'sending' || sendState === 'sent'}
                style={{ width: '100%', padding: '11px 0', background: sendState === 'sent' ? G.menthe : sendState === 'sending' ? 'rgba(19,69,71,0.4)' : G.abysse, color: sendState === 'sent' ? G.abysse : 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: (sendState === 'idle' || sendState === 'error') ? 'pointer' : 'default', transition: 'all .25s', fontFamily: 'inherit' }}>
                {sendState === 'idle' && '📧 Recevoir mon portfolio →'}
                {sendState === 'sending' && 'Envoi en cours…'}
                {sendState === 'sent' && '✓ Portfolio envoyé'}
                {sendState === 'error' && '⚠ Erreur — réessayez'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer carte */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', background: G.abysse }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: G.menthe }} />
            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.04em' }}>PAC · Lumio Health · MSMC RNCP 38504</span>
          </div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>Éminéo Éducation · {today}</div>
        </div>
      </div>
    </div>
  );
}

// Bloc compétences réutilisable (bilan non-délivré)
function CompetenceBlock({ title, comps, parsed, ok, G }) {
  const accent = ok ? G.menthe : G.saumon;
  return (
    <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', border: `1px solid ${ok ? 'rgba(93,226,152,0.25)' : 'rgba(232,155,119,0.25)'}` }}>
      <div style={{ padding: '12px 16px', background: ok ? G.abysse : 'rgba(232,155,119,0.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</span>
      </div>
      {comps.map((c, i) => (
        <div key={c.code} style={{ padding: '10px 16px', borderBottom: i < comps.length - 1 ? `1px solid ${G.givre}` : 'none', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: ok ? G.menthe : 'rgba(232,155,119,0.15)', border: ok ? 'none' : `1px solid ${G.saumon}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            {ok
              ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="8 2 4 8 2 5" stroke={G.abysse} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <span style={{ fontSize: 10, color: G.saumon, fontWeight: 700 }}>–</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: G.petrole, fontFamily: 'monospace' }}>{c.code}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: G.abysse }}>{c.label}</span>
            </div>
            <div style={{ fontSize: 10, color: accent, fontWeight: 600 }}>{parsed[c.code]?.niveau || (ok ? 'Acquise' : 'Non acquise')}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function generatePortfolioHTML(studentName, acquises, date, meta) {
  meta = meta || {};
  const blocId = meta.blocId || 'BC1';
  const affaireTitre = meta.affaireTitre || 'Affaire Lumio Health';
  const livrableTitre = meta.livrableTitre || 'Livrable certifiant PAC';
  const recit = meta.recit || '';
  const signature = meta.signature || '';
  const comps = acquises.map(c =>
    `<tr><td style="padding:7px 0;font-family:monospace;font-weight:700;color:#134547;font-size:11px;width:42px;vertical-align:top;">${c.code}</td><td style="padding:7px 0;font-size:13px;color:#0B2B2D;">${c.label}</td></tr>`
  ).join('');
  return `<!DOCTYPE html><html><body style="margin:0;background:#E3FFF0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:28px 16px;">
<div style="max-width:600px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(11,43,45,0.14);">
  <div style="background:linear-gradient(155deg,#134547,#0B2B2D);padding:30px 34px;">
    <div style="font-size:13px;font-weight:700;color:white;letter-spacing:.02em;">emineo <span style="font-size:9px;color:#5DE298;letter-spacing:.18em;">ÉDUCATION</span></div>
    <div style="display:inline-block;background:#5DE298;color:#0B2B2D;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;margin-top:16px;">${blocId}</div>
    <div style="font-size:10px;color:#5DE298;letter-spacing:.16em;text-transform:uppercase;margin-top:18px;">Portfolio de compétences</div>
    <div style="font-size:22px;font-weight:300;color:white;line-height:1.25;margin:6px 0 14px;">${affaireTitre}</div>
    <div style="font-size:15px;font-weight:600;color:white;">${studentName}</div>
    <div style="font-size:11px;color:rgba(255,255,255,.55);margin-top:3px;">MSMC RNCP 38504 · Délivré le ${date}</div>
  </div>
  <div style="padding:26px 34px;">
    <div style="font-size:10px;color:#5DE298;letter-spacing:.16em;text-transform:uppercase;font-weight:700;margin-bottom:6px;">Livrable produit</div>
    <div style="font-size:18px;font-weight:600;color:#0B2B2D;line-height:1.3;margin-bottom:18px;">${livrableTitre}</div>
    <div style="font-size:10px;color:#5DE298;letter-spacing:.16em;text-transform:uppercase;font-weight:700;margin-bottom:8px;">Compétences mobilisées</div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:8px;"><tbody>${comps}</tbody></table>
    ${recit ? `<div style="background:linear-gradient(135deg,#E3FFF0,rgba(157,240,196,.25));border-radius:12px;padding:20px 22px;margin-top:18px;">
      <div style="font-size:10px;color:#134547;letter-spacing:.16em;text-transform:uppercase;font-weight:700;margin-bottom:10px;">Ma posture</div>
      <p style="font-size:14px;line-height:1.7;color:#0B2B2D;margin:0 0 14px;">${recit}</p>
      ${signature ? `<p style="font-size:13px;line-height:1.6;color:#134547;font-style:italic;margin:0;padding-top:12px;border-top:1px solid rgba(19,69,71,.12);">${signature}</p>` : ''}
      <p style="font-size:12px;color:#134547;font-weight:600;margin:10px 0 0;text-align:right;">— ${studentName}</p>
    </div>` : ''}
  </div>
  <div style="padding:14px 34px;background:#0B2B2D;font-size:10.5px;color:rgba(255,255,255,.6);">PAC · Lumio Health · MSMC RNCP 38504 · Éminéo Éducation · ${date}</div>
</div></body></html>`;
}


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
    <PortfolioScreen
      studentName={window.LUMIO_DATA?.student?.name || 'Étudiant'}
      studentEmail={window.LUMIO_DATA?.student?.email || ''}
      competences={COMPETENCES}
      wordCounts={wordCounts}
      juryResult={juryResult}
      globalWords={globalWords}
      answers={answers}
      blocLabel={cfg?.bloc || 'BC2'}
      affaire={cfg?.titre_affaire || cfg?.accroche || ''}
    />
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
