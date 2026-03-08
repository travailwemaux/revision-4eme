import { useState, useEffect, useCallback } from "react";

const SUBJECTS = [
  {
    id: "francais", label: "Français", emoji: "📖", color: "#e8637a",
    lessons: [
      "5 - Les 5 classes de mots invariables / variables",
      "5 - Différences entre familles / synonymes",
      "5 - Les modes",
      "5 - Phrases simples / complexes",
      "5 - COD / COI et fonctions grammaticales",
      "5 - Préposition / adverbes / conjonctions de coordination / conjonctions de subordination",
      "5- Les types de phrases",
      "4 - Propositions indépendantes et subordonnées",
      "4 - Le réalisme / impressionnisme",
      "4 - Champs lexicaux / sémantique",
      "4 - Les valeurs du temps du récit / schéma narratif",
      "4 - Les modalisateurs",
      "4 - Les classes grammaticales",
      "4 - Le fantastique",
      "4 - Phrases actives / passives",
      "4 - Accorder un participe passé",
      "4 - Schéma d'une thèse",
      "4 - Les médias"
    ]
  },
    {
    id: "maths", label: "Mathématiques", emoji: "📐", color: "#5b7fe8",
    lessons: [
      "5 - Enchainement d'opérations",
      "5 - Rappels de 6ème",
      "5 - Abscisse et ordonnée d'un point",
      "5 - Mesure d'angles",
      "5 - Nombres permiers",
      "5 - Expressions litérales",
      "5 - Les solides",
      "5 - Les égalités de fractions",
      "4 - Multiplication simple / successive",
      "4 - Pythagoe + réciproque + contraposée",
      "4 - Divisions",
      "4 - Théorème de Thalès + réciproque + contraposée",
      "4 - Simplification / comparaison de fractions",
      "4 - Vocabulaire triangle",
      "4 - Cosinus",
    ]
  },
  {
    id: "geographie", label: "Géographie", emoji: "🌍", color: "#e8a23a",
    lessons: [
      "L'urbanisation",
      "Définitions",
      "Les villes dans la mondialisation",
    ]
  },
  {
    id: "histoire", label: "Histoire", emoji: "🏛️", color: "#e8a23a",
    lessons: [
      "L'expansion commerciale",
      "Le commerce triangulaire et l'esclavage",
      "La monarchie absolue",
      "Philosophes des Lumières",
      "La Révolution française et l'Empire",
    ]
  },
    {
    id: "emc", label: "EMC", emoji: "🗽", color: "#e8a23a",
    lessons: [
      "Liberté / Egalité",
    ]
  },
  {
    id: "techno", label: "Technologie", emoji: "💻", color: "#e8c85b",
    lessons: [
      "Stations de vélos électriques",
      "Analyses fonctionnelles",
      "La technologie RFID",
      "Chaines d'information / d'énergie",
      "Diagramme des interracteurs",
      "Les contraintes",
      "Apprendre à une machine à reconnaitre des poissons",
      "Les évolutions des objets",
      "Invention / découverte / innovation",
      "Avantages et inconvénients d'objets",
      "Bilan energétique d'une maison",
      "Caractéristiques des radiateurs",
      "Tableau de la consommation",
      "Les ampoules",
      "Les thermostats",
      "Internet",
      "Programme Scratch",
      "Schéma carré, losange, rond",
      "Connecter un objet à un réseau"
    ]
  },

  {
    id: "svt", label: "SVT", emoji: "🔬", color: "#5be87a",
    lessons: [
      "L'homme face aux micro-organismes",
      "Les barrières naturelles",
      "Comment se protéger de la contamination / infection ?",
      "Carte mentale bilan",
      "Calculer la taille réelle d'un objet",
      "Les graphiques",
      "Les antibiogrammes",
      "Caractères des êtres vivants ( individuels, spécifiques )",
      "Transmission des caractères",
      "La brebis Dolly",
      "Le contenu d'une cellule",
      "Les paires de chromosomes",
      "L'ADN",
      "Lexique de la reproduction",
      "Changement morphologique / physiologique",
      "La puberté",
      "Expérience du poulet",
      "Apparition des CS2",
      "Formation d'un nouvel individu",
      "Schéma des appareils reproducteurs",
      "Tableau des cellules reproductrices",
      "Les règles",
      "La formation d'un foetus",
      "Paroie de l'utérus",
      "De la fécondation à la naissance"

    ]
  },

  {
    id: "physique", label: "Physique-Chimie", emoji: "⚗️", color: "#b05be8",
    lessons: [
      "Les sources d'énergie",
      "Intêrets / inconvénients des énergies renouvelables",
      "Les chaines énergétiques",
      "Toutes les énergies",
      "Transfert d'énergie",
      "Puissance et énergie",
      "Les propriétés de l'air",
      "Compressibilité, expansibilité, élasticité de l'air",
      "Pression atmosphérique",
      "La masse de l'air",
      "Représentation d'un gaz, d'un solide, d'un liquide",
      "Représentation moléculaire",
      "Dissolution et missibilité",
      "Les atomes",
      "Le tableau périodique des éléments",
      "Le tableau des molécules et leurs compositions en atomes",
      "Combustion, combustible et comburant",
      "Triangle du feu",
    ]
  },







];

const STATUS_STEPS = [
  { key: "todo",     label: "À réviser", color: "#d0d0d0", bg: "#f5f5f5",  icon: "○" },
  { key: "apprise",  label: "Apprise",   color: "#e8a23a", bg: "#fff7e6",  icon: "🧠" },
  { key: "validee",  label: "Validée",   color: "#2ecf72", bg: "#e6fff1",  icon: "✅" },
];

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function getDaysUntilExam(examDate) {
  const diff = examDate - TODAY;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getWorkDays(examDate) {
  const days = [];
  const cur = new Date(TODAY);
  while (cur < examDate) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function distributeLessons(statuses, examDate) {
  const allLessons = [];
  SUBJECTS.forEach(s => {
    s.lessons.forEach((l, i) => {
      const id = `${s.id}_${i}`;
      if (statuses[id] !== "validee") {
        allLessons.push({ subjectId: s.id, lessonIndex: i, id });
      }
    });
  });

  const workDays = getWorkDays(examDate);
  const plan = {};
  workDays.forEach(d => { plan[d.toDateString()] = []; });

  allLessons.forEach((lesson, idx) => {
    const dayKey = workDays[idx % workDays.length].toDateString();
    plan[dayKey].push(lesson);
  });
  return { plan, workDays };
}

function formatDate(d) {
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

function StatusBadge({ status, onClick }) {
  const s = STATUS_STEPS.find(x => x.key === status) || STATUS_STEPS[0];
  return (
    <button
      onClick={onClick}
      title="Cliquer pour changer le statut"
      style={{
        background: s.bg,
        color: s.color,
        border: `2px solid ${s.color}`,
        borderRadius: 20,
        padding: "3px 12px",
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        whiteSpace: "nowrap",
        fontFamily: "inherit",
        transition: "all 0.15s",
      }}
    >
      {s.icon} {s.label}
    </button>
  );
}


export default function App() {
  const [statuses, setStatuses] = useState(() => {
    try {
      const r = localStorage.getItem("revision_statuses");
      return r ? JSON.parse(r) : {};
    } catch { return {}; }
  });
  const [tab, setTab] = useState("matieres");
  const [openSubjects, setOpenSubjects] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [examDateStr, setExamDateStr] = useState(() => {
    try { return localStorage.getItem("exam_date") || "2026-03-19"; } catch { return "2026-03-19"; }
  });
  const [tempDateStr, setTempDateStr] = useState(() => {
    try { return localStorage.getItem("exam_date") || "2026-03-19"; } catch { return "2026-03-19"; }
  });

  const examDate = (() => {
    const d = new Date(examDateStr + "T00:00:00");
    return isNaN(d) ? new Date("2026-03-19") : d;
  })();

  useEffect(() => {
    try { localStorage.setItem("revision_statuses", JSON.stringify(statuses)); } catch {}
  }, [statuses]);

  const saveExamDate = () => {
    setExamDateStr(tempDateStr);
    try { localStorage.setItem("exam_date", tempDateStr); } catch {}
    setShowSettings(false);
  };

  const cycleStatus = useCallback((id) => {
    setStatuses(prev => {
      const cur = prev[id] || "todo";
      const idx = STATUS_STEPS.findIndex(s => s.key === cur);
      const next = STATUS_STEPS[(idx + 1) % STATUS_STEPS.length].key;
      return { ...prev, [id]: next };
    });
  }, []);

  // Global stats
  const allIds = SUBJECTS.flatMap(s => s.lessons.map((_, i) => `${s.id}_${i}`));
  const total = allIds.length;
  const countByStatus = key => allIds.filter(id => (statuses[id] || "todo") === key).length;
  const validated = countByStatus("validee");
  const learned = countByStatus("apprise");
  const done = validated + learned;
  const globalPct = Math.round((done / total) * 100);

  const { plan, workDays } = distributeLessons(statuses, examDate);

  const toggleSubject = id => setOpenSubjects(p => ({ ...p, [id]: !p[id] }));

  const daysLeft = getDaysUntilExam(examDate);
  const examDateFormatted = examDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #f8f4ff 0%, #fff4f8 50%, #f4f8ff 100%)" }}>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 20, padding: 28, width: 300, boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>⚙️ Paramètres</div>
            <div style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>Choisissez la date de l'examen</div>
            <label style={{ display: "block", fontWeight: 700, fontSize: 13, marginBottom: 6, color: "#555" }}>Date de l'examen</label>
            <input
              type="date"
              value={tempDateStr}
              onChange={e => setTempDateStr(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "2px solid #e0d0ff", fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowSettings(false)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "2px solid #eee", background: "white", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, color: "#888" }}>
                Annuler
              </button>
              <button onClick={saveExamDate} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #6c3fff, #e84393)", color: "white", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #6c3fff, #e84393)", padding: "24px 20px 20px", color: "white", textAlign: "center", boxShadow: "0 4px 20px rgba(108,63,255,0.3)", position: "relative" }}>
        <button onClick={() => { setTempDateStr(examDateStr); setShowSettings(true); }} style={{ position: "absolute", top: 16, right: 16, zIndex: 1, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "6px 12px", color: "white", cursor: "pointer", fontSize: 18, fontFamily: "inherit" }} title="Paramètres">⚙️</button>
        <div style={{ fontSize: 13, opacity: 0.85, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Révisions 4ème</div>
        <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Épreuves Communes</div>
        <div style={{ fontSize: 13, opacity: 0.9 }}>
          Examen le <strong>{examDateFormatted}</strong> · <strong>{daysLeft > 0 ? `${daysLeft} jours restants` : daysLeft === 0 ? "C'est aujourd'hui ! 💪" : "Examen passé"}</strong>
        </div>

        {/* Global progress */}
        <div style={{ marginTop: 16, background: "rgba(255,255,255,0.15)", borderRadius: 16, padding: "12px 16px", maxWidth: 500, margin: "16px auto 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
            <span>Progression globale</span>
            <span style={{ fontWeight: 800 }}>{globalPct}%</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 8, height: 12, overflow: "hidden" }}>
            <div style={{ width: `${globalPct}%`, background: "white", height: "100%", borderRadius: 8, transition: "width 0.4s" }} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 10, justifyContent: "center", fontSize: 12, flexWrap: "wrap" }}>
            {[
              { label: "Apprises", val: learned, color: "#ffd093" },
              { label: "Validées", val: validated, color: "#93ffc0" },
            ].map(x => (
              <span key={x.label} style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "3px 10px" }}>
                <span style={{ color: x.color, fontWeight: 700 }}>●</span> {x.label} : <strong>{x.val}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", position: "sticky", top: 0, zIndex: 10 }}>
        {[
          { key: "matieres", label: "📚 Matières" },
          { key: "planning", label: "📅 Planning" },
          { key: "stats", label: "📊 Stats" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              padding: "14px 8px",
              border: "none",
              background: "none",
              fontWeight: tab === t.key ? 800 : 500,
              color: tab === t.key ? "#6c3fff" : "#888",
              borderBottom: tab === t.key ? "3px solid #6c3fff" : "3px solid transparent",
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ margin: "0 auto", padding: "20px 16px 40px" }}>

        {/* MATIÈRES TAB */}
        {tab === "matieres" && (
          <div>
            <p style={{ color: "#888", fontSize: 13, textAlign: "center", marginBottom: 16 }}>
              Cliquez sur le statut d'une leçon pour le faire avancer : <br></br><strong>À réviser → Apprise → Validée</strong>
            </p>
            {SUBJECTS.map(subject => {
              const subIds = subject.lessons.map((_, i) => `${subject.id}_${i}`);
              const subValidated = subIds.filter(id => statuses[id] === "validee").length;
              const subApprise = subIds.filter(id => statuses[id] === "apprise").length;
              const subDone = subValidated + subApprise;
              const subPct = Math.round((subDone / subIds.length) * 100);
              const isOpen = openSubjects[subject.id] !== false; // open by default

              return (
                <div key={subject.id} style={{ background: "white", borderRadius: 16, marginBottom: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden", border: `2px solid ${subject.color}22` }}>
                  {/* Subject header */}
                  <button
                    onClick={() => toggleSubject(subject.id)}
                    style={{ width: "100%", background: "none", border: "none", padding: "14px 16px", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{subject.emoji}</span>
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 15, color: "#222" }}>{subject.label}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                          <div style={{ background: "#eee", borderRadius: 8, height: 10, overflow: "hidden", flexGrow: 1, display: "flex" }}>
                            <div style={{ width: `${(subValidated / subIds.length) * 100}%`, background: "#2ecf72", transition: "width 0.4s" }} />
                            <div style={{ width: `${(subApprise / subIds.length) * 100}%`, background: "#e8a23a", transition: "width 0.4s" }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: subject.color, minWidth: 36 }}>{subPct}%</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: "#aaa", marginLeft: 4 }}>
                        {subValidated}/{subIds.length} ✅ {isOpen ? "▲" : "▼"}
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ borderTop: `1px solid ${subject.color}22`, padding: "4px 0 8px" }}>
                      {subject.lessons.map((lesson, i) => {
                        const id = `${subject.id}_${i}`;
                        const status = statuses[id] || "todo";
                        return (
                          <div key={id} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 16px",
                            background: status === "validee" ? "#f0fff7" : "transparent",
                            borderBottom: "1px solid #f5f5f5",
                          }}>
                            <span style={{
                              fontSize: 13,
                              color: status === "validee" ? "#aaa" : "#333",
                              flexGrow: 1,
                              minWidth: 0,
                              textDecoration: status === "validee" ? "line-through" : "none",
                            }}>{lesson}</span>
                            <StatusBadge status={status} onClick={() => cycleStatus(id)} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* PLANNING TAB */}
        {tab === "planning" && (
          <div>
            <div style={{ background: "white", borderRadius: 16, padding: "14px 16px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "#555" }}>Les leçons <strong>déjà validées</strong> disparaissent du planning.</div>
            </div>
            {workDays.map(day => {
              const key = day.toDateString();
              const dayLessons = plan[key] || [];
              const isToday = day.toDateString() === TODAY.toDateString();
              const isPast = day < TODAY;

              return (
                <div key={key} style={{
                  background: isToday ? "linear-gradient(135deg, #f0eaff, #ffe8f5)" : isPast ? "#fafafa" : "white",
                  borderRadius: 14,
                  marginBottom: 10,
                  boxShadow: isToday ? "0 3px 16px rgba(108,63,255,0.18)" : "0 2px 8px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                  border: isToday ? "2px solid #6c3fff" : "2px solid transparent",
                }}>
                  <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      fontWeight: 800, fontSize: 14,
                      color: isToday ? "#6c3fff" : isPast ? "#bbb" : "#333",
                      minWidth: 140,
                    }}>
                      {isToday && <span style={{ fontSize: 10, background: "#6c3fff", color: "white", borderRadius: 8, padding: "1px 6px", marginRight: 6 }}>AUJOURD'HUI</span>}
                      {formatDate(day)}
                    </div>
                    <span style={{ fontSize: 12, color: "#aaa" }}>
                      {dayLessons.length === 0 ? "✨ Journée libre" : `${dayLessons.length} leçon${dayLessons.length > 1 ? "s" : ""}`}
                    </span>
                  </div>
                  {dayLessons.length > 0 && (
                    <div style={{ padding: "0 14px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
                      {dayLessons.map(({ subjectId, lessonIndex, id }) => {
                        const sub = SUBJECTS.find(s => s.id === subjectId);
                        const lesson = sub.lessons[lessonIndex];
                        const status = statuses[id] || "todo";
                        const st = STATUS_STEPS.find(s => s.key === status);
                        return (
                          <div key={id} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: isPast ? "#f5f5f5" : sub.color + "11",
                            borderLeft: `3px solid ${sub.color}`,
                            borderRadius: "0 8px 8px 0",
                            padding: "5px 10px",
                          }}>
                            <span>{sub.emoji}</span>
                            <span style={{ fontSize: 13, color: "#333", flexGrow: 1, minWidth: 0 }}>{lesson}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: st.color }}>{st.icon}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* STATS TAB */}
        {tab === "stats" && (
          <div>
            {/* Pie-like summary */}
            <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16, textAlign: "center" }}>Bilan global 🎯</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Progression", val: `${globalPct}%`, color: "#6c3fff", icon: "🚀" },
                  { label: "Total de leçons", val: total, color: "#888", icon: "📚" },
                  { label: "À réviser", val: countByStatus("todo"), color: "#d0d0d0", icon: "○" },
                  { label: "Apprises", val: learned, color: "#e8a23a", icon: "🧠" },
                  { label: "Validées", val: validated, color: "#2ecf72", icon: "✅" },
                  
                ].map(item => (
                  <div key={item.label} style={{ background: "#f9f9fb", borderRadius: 12, padding: "14px 16px", textAlign: "center", gridColumn: item.label === "Progression" ? "1 / -1" : undefined }}>
                    <div style={{ fontSize: 22 }}>{item.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 22, color: item.color, marginTop: 2 }}>{item.val}</div>
                    <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Per subject */}
            <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>Par matière 📊</div>
              {SUBJECTS.map(subject => {
                const subIds = subject.lessons.map((_, i) => `${subject.id}_${i}`);
                const n = subIds.length;
                const todo = subIds.filter(id => !statuses[id] || statuses[id] === "todo").length;
                const apprise = subIds.filter(id => statuses[id] === "apprise").length;
                const validee = subIds.filter(id => statuses[id] === "validee").length;
                const pct = Math.round(((n - todo) / n) * 100);
                return (
                  <div key={subject.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <span>{subject.emoji}</span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#333", flexGrow: 1, minWidth: 0 }}>{subject.label}</span>
                      <span style={{ fontWeight: 800, fontSize: 13, color: subject.color }}>{pct}%</span>
                    </div>
                    {/* Stacked bar */}
                    <div style={{ height: 10, borderRadius: 8, background: "#eee", overflow: "hidden", display: "flex" }}>
                      <div style={{ width: `${(validee/n)*100}%`, background: "#2ecf72", transition: "width 0.4s" }} />
                      <div style={{ width: `${(apprise/n)*100}%`, background: "#e8a23a", transition: "width 0.4s" }} />
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 4, fontSize: 11, color: "#aaa" }}>
                      <span>✅ {validee}</span>
                      <span>🧠 {apprise}</span>
                      <span>○ {todo}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
