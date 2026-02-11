import { useState, useEffect, useCallback } from "react";

// ─── Color & Style Constants ───
const COLORS = {
  bg: "#faf7f5",
  card: "#ffffff",
  border: "#e8ddd6",
  borderLight: "#f0e9e3",
  accent: "#c4727f",
  accentLight: "#f2dce0",
  accentDark: "#a35566",
  text: "#3d3235",
  textMuted: "#8a7680",
  textLight: "#b09da6",
  green: "#5a9e7c",
  greenBg: "#e8f5ee",
  yellow: "#c4a24e",
  yellowBg: "#fdf6e3",
  orange: "#d07c4a",
  orangeBg: "#fdf0e6",
  red: "#c4505a",
  redBg: "#fde8ea",
  purple: "#8a6aad",
  purpleBg: "#f0e8f7",
};

const fontStack = `'Instrument Serif', 'Georgia', serif`;
const fontBody = `'DM Sans', 'Helvetica Neue', sans-serif`;

// ─── Utility Components ───
const Badge = ({ color, children }) => {
  const colorMap = {
    green: { bg: COLORS.greenBg, text: COLORS.green, border: "#c8e6d5" },
    yellow: { bg: COLORS.yellowBg, text: COLORS.yellow, border: "#f0e0b0" },
    orange: { bg: COLORS.orangeBg, text: COLORS.orange, border: "#f0d4bc" },
    red: { bg: COLORS.redBg, text: COLORS.red, border: "#f0c4c8" },
    purple: { bg: COLORS.purpleBg, text: COLORS.purple, border: "#d8c8e8" },
    muted: { bg: "#f5f0ed", text: COLORS.textMuted, border: COLORS.border },
  };
  const c = colorMap[color] || colorMap.muted;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      fontFamily: fontBody, background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      letterSpacing: 0.2, whiteSpace: "nowrap",
    }}>{children}</span>
  );
};

const SeverityDot = ({ level }) => {
  const colors = { normal: COLORS.green, alert: COLORS.yellow, warning: COLORS.orange, critical: COLORS.red };
  return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: colors[level] || COLORS.textLight, marginRight: 6 }} />;
};

const Field = ({ label, children, hint, required, style: extraStyle }) => (
  <div style={{ marginBottom: 16, ...extraStyle }}>
    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: COLORS.text, fontFamily: fontBody, marginBottom: 5 }}>
      {label}{required && <span style={{ color: COLORS.accent, marginLeft: 2 }}>*</span>}
    </label>
    {children}
    {hint && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 3, fontFamily: fontBody }}>{hint}</div>}
  </div>
);

const inputStyle = {
  width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
  fontSize: 14, fontFamily: fontBody, color: COLORS.text, background: "#fff",
  outline: "none", transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const NumInput = ({ value, onChange, min, max, unit, placeholder, style: extra }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <input
      type="number" value={value ?? ""} min={min} max={max} placeholder={placeholder}
      onChange={e => onChange(e.target.value === "" ? null : Number(e.target.value))}
      style={{ ...inputStyle, width: unit ? "calc(100% - 44px)" : "100%", ...extra }}
      onFocus={e => e.target.style.borderColor = COLORS.accent}
      onBlur={e => e.target.style.borderColor = COLORS.border}
    />
    {unit && <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: fontBody, minWidth: 38 }}>{unit}</span>}
  </div>
);

const Toggle = ({ value, onChange, label }) => (
  <button
    onClick={() => onChange(!value)}
    style={{
      display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px",
      borderRadius: 20, border: `1.5px solid ${value ? COLORS.accent : COLORS.border}`,
      background: value ? COLORS.accentLight : "#fff", cursor: "pointer",
      fontSize: 13, fontFamily: fontBody, color: value ? COLORS.accentDark : COLORS.textMuted,
      fontWeight: value ? 600 : 400, transition: "all 0.2s",
    }}
  >
    <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${value ? COLORS.accent : COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", background: value ? COLORS.accent : "#fff", transition: "all 0.2s" }}>
      {value && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
    </span>
    {label}
  </button>
);

const Select = ({ value, onChange, options, placeholder }) => (
  <select
    value={value ?? ""} onChange={e => onChange(e.target.value || null)}
    style={{ ...inputStyle, cursor: "pointer", appearance: "auto" }}
    onFocus={e => e.target.style.borderColor = COLORS.accent}
    onBlur={e => e.target.style.borderColor = COLORS.border}
  >
    <option value="">{placeholder || "Selecionar..."}</option>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Card = ({ children, style: extra, accent }) => (
  <div style={{
    background: COLORS.card, borderRadius: 14, border: `1px solid ${COLORS.borderLight}`,
    padding: "20px 22px", marginBottom: 16,
    borderLeft: accent ? `3px solid ${accent}` : undefined,
    boxShadow: "0 1px 4px rgba(61,50,53,0.04)",
    ...extra,
  }}>{children}</div>
);

const SectionTitle = ({ icon, children }) => (
  <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: fontBody, color: COLORS.text, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
    {icon && <span style={{ fontSize: 17 }}>{icon}</span>}
    {children}
  </h3>
);

// ─── Step Components ───

function Step1_DadosGravida({ data, setData }) {
  const imc = data.peso && data.altura ? (data.peso / ((data.altura / 100) ** 2)).toFixed(1) : null;
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 20px" }}>
          <Field label="Idade materna" required style={{ flex: "1 1 200px", minWidth: 0 }}><NumInput value={data.idadeMaterna} onChange={v => setData({ ...data, idadeMaterna: v })} min={12} max={55} unit="anos" placeholder="Ex: 32" /></Field>
          <Field label="Idade gestacional" required style={{ flex: "1 1 200px", minWidth: 0 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <NumInput value={data.igSemanas} onChange={v => setData({ ...data, igSemanas: v })} min={0} max={42} unit="sem" placeholder="Sem" style={{ width: 70 }} />
              <span style={{ color: COLORS.textLight, fontSize: 13 }}>+</span>
              <NumInput value={data.igDias} onChange={v => setData({ ...data, igDias: v })} min={0} max={6} unit="dias" placeholder="Dias" style={{ width: 70 }} />
            </div>
          </Field>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 20px" }}>
          <Field label="Paridade" required style={{ flex: "1 1 200px", minWidth: 0 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Toggle value={data.paridade === "nulipara"} onChange={() => setData({ ...data, paridade: "nulipara" })} label="Nulípara" />
              <Toggle value={data.paridade === "multipara"} onChange={() => setData({ ...data, paridade: "multipara" })} label="Multípara" />
            </div>
          </Field>
          <Field label="Gestação" required style={{ flex: "1 1 200px", minWidth: 0 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Toggle value={data.gemeos === false} onChange={() => setData({ ...data, gemeos: false })} label="Única" />
              <Toggle value={data.gemeos === true} onChange={() => setData({ ...data, gemeos: true })} label="Múltipla" />
            </div>
          </Field>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 20px", marginTop: 4 }}>
        <Field label="Peso" hint="Opcional" style={{ flex: "1 1 120px", minWidth: 0 }}><NumInput value={data.peso} onChange={v => setData({ ...data, peso: v })} min={30} max={250} unit="kg" /></Field>
        <Field label="Altura" hint="Opcional" style={{ flex: "1 1 120px", minWidth: 0 }}><NumInput value={data.altura} onChange={v => setData({ ...data, altura: v })} min={120} max={200} unit="cm" /></Field>
        <Field label="IMC" hint="Calculado" style={{ flex: "1 1 120px", minWidth: 0 }}>
          <div style={{ ...inputStyle, background: "#f9f6f4", color: imc ? COLORS.text : COLORS.textLight }}>
            {imc ? `${imc} kg/m²` : "—"}
          </div>
        </Field>
      </div>
    </div>
  );
}

function Step2_Antecedentes({ data, setData }) {
  const toggleField = (field) => setData({ ...data, [field]: !data[field] });
  return (
    <div>
      <SectionTitle icon="📋">Comorbilidades</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        <Toggle value={data.htaCronica} onChange={() => toggleField("htaCronica")} label="HTA Crónica" />
        <Toggle value={data.dm} onChange={() => toggleField("dm")} label="Diabetes" />
        <Toggle value={data.drc} onChange={() => toggleField("drc")} label="Doença Renal" />
        <Toggle value={data.autoimune} onChange={() => toggleField("autoimune")} label="Doença Autoimune" />
        <Toggle value={data.epilepsia} onChange={() => toggleField("epilepsia")} label="Epilepsia" />
      </div>
      {data.dm && (
        <Field label="Tipo de Diabetes">
          <Select value={data.tipoDm} onChange={v => setData({ ...data, tipoDm: v })} options={[{ value: "dm1", label: "DM tipo 1" }, { value: "dm2", label: "DM tipo 2" }, { value: "dg", label: "Diabetes Gestacional" }]} />
        </Field>
      )}

      <SectionTitle icon="🤰">História Obstétrica</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        <Toggle value={data.peAnterior} onChange={() => toggleField("peAnterior")} label="PE em gravidez anterior" />
        <Toggle value={data.rma} onChange={() => toggleField("rma")} label="Reprodução Assistida" />
      </div>
      {data.peAnterior && (
        <Field label="PE anterior precoce (<34s)?">
          <div style={{ display: "flex", gap: 8 }}>
            <Toggle value={data.peAnteriorPrecoce === true} onChange={() => setData({ ...data, peAnteriorPrecoce: true })} label="Precoce" />
            <Toggle value={data.peAnteriorPrecoce === false} onChange={() => setData({ ...data, peAnteriorPrecoce: false })} label="Tardia" />
          </div>
        </Field>
      )}

      <SectionTitle icon="💊">Medicação Profilática</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Toggle value={data.aspirina} onChange={() => toggleField("aspirina")} label="Aspirina 150 mg" />
        <Toggle value={data.tromboprofilaxia} onChange={() => toggleField("tromboprofilaxia")} label="Tromboprofilaxia" />
      </div>
    </div>
  );
}

function Step3_TA({ data, setData }) {
  const sys = data.taSistolica;
  const dia = data.taDiastolica;
  const isEmergency = sys >= 160 || dia >= 110;
  const isHTA = sys >= 140 || dia >= 90;
  const map = sys && dia ? ((2 * dia + sys) / 3).toFixed(0) : null;

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 20px" }}>
        <Field label="TA Sistólica" required style={{ flex: "1 1 180px", minWidth: 0 }}><NumInput value={data.taSistolica} onChange={v => setData({ ...data, taSistolica: v })} min={60} max={250} unit="mmHg" placeholder="Ex: 148" /></Field>
        <Field label="TA Diastólica" required style={{ flex: "1 1 180px", minWidth: 0 }}><NumInput value={data.taDiastolica} onChange={v => setData({ ...data, taDiastolica: v })} min={30} max={160} unit="mmHg" placeholder="Ex: 95" /></Field>
      </div>

      {map && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "#f9f6f4", marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: fontBody }}>TAM:</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, fontFamily: fontBody }}>{map} mmHg</span>
        </div>
      )}

      {isEmergency && (
        <Card accent={COLORS.red} style={{ background: COLORS.redBg }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🚨</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.red, fontFamily: fontBody, marginBottom: 4 }}>EMERGÊNCIA HIPERTENSIVA</div>
              <div style={{ fontSize: 13, color: COLORS.text, fontFamily: fontBody, lineHeight: 1.5 }}>
                TA ≥160/110 mmHg — Iniciar protocolo escalonado imediato.<br />
                Confirmar em 2 medições espaçadas por minutos.
              </div>
            </div>
          </div>
        </Card>
      )}

      {isHTA && !isEmergency && (
        <Card accent={COLORS.yellow} style={{ background: COLORS.yellowBg }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.yellow, fontFamily: fontBody, marginBottom: 2 }}>HTA confirmada</div>
              <div style={{ fontSize: 12, color: COLORS.text, fontFamily: fontBody }}>TA ≥140/90 mmHg — Prosseguir com avaliação laboratorial e clínica.</div>
            </div>
          </div>
        </Card>
      )}

      <SectionTitle icon="🩺">2.ª Medição (recomendado)</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 20px" }}>
        <Field label="TA Sistólica (2.ª)" style={{ flex: "1 1 180px", minWidth: 0 }}><NumInput value={data.taSistolica2} onChange={v => setData({ ...data, taSistolica2: v })} min={60} max={250} unit="mmHg" /></Field>
        <Field label="TA Diastólica (2.ª)" style={{ flex: "1 1 180px", minWidth: 0 }}><NumInput value={data.taDiastolica2} onChange={v => setData({ ...data, taDiastolica2: v })} min={30} max={160} unit="mmHg" /></Field>
      </div>
    </div>
  );
}

function Step4_Sintomas({ data, setData }) {
  const symptoms = [
    { key: "cefaleias", label: "Cefaleias graves ou persistentes", detail: "Refratárias a analgesia" },
    { key: "visuais", label: "Alterações visuais", detail: "Escotomas, fotofobia, visão turva" },
    { key: "consciencia", label: "Alterações do estado de consciência", detail: "" },
    { key: "epigastralgia", label: "Epigastralgia / dor hipocôndrio direito", detail: "Persistente, sem resposta a terapêutica" },
    { key: "edemaPulmonar", label: "Edema pulmonar", detail: "Dispneia, crepitações, SpO2 diminuída" },
    { key: "convulsoes", label: "Convulsões de novo", detail: "→ ECLÂMPSIA" },
  ];

  const toggleSymptom = (key) => {
    const s = { ...data.sintomas, [key]: !data.sintomas?.[key] };
    setData({ ...data, sintomas: s });
  };

  const hasAny = data.sintomas && Object.values(data.sintomas).some(v => v);

  return (
    <div>
      <p style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: fontBody, marginBottom: 16, lineHeight: 1.5 }}>
        Assinale os sintomas presentes. Cada um constitui critério de gravidade independentemente dos valores tensionais.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {symptoms.map(s => (
          <button key={s.key} onClick={() => toggleSymptom(s.key)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
            borderRadius: 10, border: `1.5px solid ${data.sintomas?.[s.key] ? COLORS.red : COLORS.border}`,
            background: data.sintomas?.[s.key] ? COLORS.redBg : "#fff", cursor: "pointer",
            textAlign: "left", transition: "all 0.2s",
          }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${data.sintomas?.[s.key] ? COLORS.red : COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", background: data.sintomas?.[s.key] ? COLORS.red : "#fff", flexShrink: 0 }}>
              {data.sintomas?.[s.key] && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
            </span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text, fontFamily: fontBody }}>{s.label}</div>
              {s.detail && <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: fontBody }}>{s.detail}</div>}
            </div>
          </button>
        ))}
      </div>

      {data.sintomas?.convulsoes && data.epilepsia && (
        <Card accent={COLORS.orange} style={{ marginTop: 16, background: COLORS.orangeBg }}>
          <div style={{ fontSize: 13, fontFamily: fontBody, color: COLORS.orange, fontWeight: 600, marginBottom: 4 }}>⚠ Epilepsia conhecida</div>
          <div style={{ fontSize: 12, fontFamily: fontBody, color: COLORS.text }}>
            Grávida com epilepsia conhecida — excluir crise epiléptica antes de diagnosticar eclâmpsia. Avaliar contexto clínico, adesão à terapêutica e outras causas de convulsões.
          </div>
        </Card>
      )}

      {hasAny && !data.sintomas?.convulsoes && (
        <Card accent={COLORS.red} style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontFamily: fontBody, fontWeight: 600, color: COLORS.red }}>Critério(s) de gravidade presente(s)</div>
        </Card>
      )}
    </div>
  );
}

function Step5_Lab({ data, setData }) {
  const setLab = (key, val) => setData({ ...data, lab: { ...data.lab, [key]: val } });
  const lab = data.lab || {};
  const lsnAst = lab.lsnAst || 40;
  const igWeeks = data.igSemanas || 0;

  const getLevel = (val, alertThresh, critThresh, dir = "above") => {
    if (val == null) return "none";
    if (dir === "above") return val >= critThresh ? "critical" : val >= alertThresh ? "alert" : "normal";
    return val <= critThresh ? "critical" : val <= alertThresh ? "alert" : "normal";
  };

  const plaqLevel = getLevel(lab.plaquetas, 150, 100, "below");
  const astLevel = lab.ast != null && lsnAst ? (lab.ast >= 2 * lsnAst ? "critical" : lab.ast >= lsnAst ? "alert" : "normal") : "none";
  const altLevel = lab.alt != null && lsnAst ? (lab.alt >= 2 * lsnAst ? "critical" : lab.alt >= lsnAst ? "alert" : "normal") : "none";
  const creatLevel = getLevel(lab.creatinina, 0.9, 1.1);
  const ldhLevel = getLevel(lab.ldh, 400, 600);

  // sFlt-1/PlGF interpretation
  const ratio = lab.sflt1plgf;
  let ratioInterpretation = null;
  if (ratio != null) {
    if (igWeeks < 34) {
      if (ratio <= 38) ratioInterpretation = { level: "green", text: "PE improvável em 1 semana", detail: "VPN 99.3% — Tranquilizar", conduct: "Vigilância ambulatória; repetir em 1-2 semanas se clínica suspeita" };
      else if (ratio <= 85) ratioInterpretation = { level: "yellow", text: "Zona intermédia", detail: "Inconclusivo", conduct: "Reavaliar em 1 semana" };
      else if (ratio <= 655) ratioInterpretation = { level: "orange", text: "PE provável", detail: "Risco de outcomes adversos em 4 semanas", conduct: "Internamento" };
      else ratioInterpretation = { level: "red", text: "Muito alto risco", detail: "Provável necessidade de parto em ≤48h", conduct: "Internamento + Maturação pulmonar fetal imediata" };
    } else {
      if (ratio <= 38) ratioInterpretation = { level: "green", text: "PE improvável em 1 semana", detail: "VPN 99.3%", conduct: "Tranquilizar" };
      else if (ratio <= 110) ratioInterpretation = { level: "yellow", text: "Zona intermédia", detail: "Inconclusivo", conduct: "Ponderar indução >37 semanas" };
      else if (ratio <= 201) ratioInterpretation = { level: "orange", text: "PE provável", detail: "Alto risco", conduct: "Internamento" };
      else ratioInterpretation = { level: "red", text: "Muito alto risco", detail: "Provável necessidade de parto em ≤48h", conduct: "Internamento; terminação se IG 34-36+6" };
    }
  }

  const levelColors = { critical: COLORS.red, alert: COLORS.yellow, normal: COLORS.green, none: COLORS.textLight };
  const LabField = ({ label, unit, value, onChange, level, min, max, hint }) => (
    <Field label={label} hint={hint}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {level !== "none" && <SeverityDot level={level} />}
        <NumInput value={value} onChange={onChange} unit={unit} min={min} max={max} />
      </div>
    </Field>
  );

  return (
    <div>
      <SectionTitle icon="🔬">Hemograma e Bioquímica</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}><LabField label="Plaquetas" unit="×10³/µL" value={lab.plaquetas} onChange={v => setLab("plaquetas", v)} level={plaqLevel} hint={plaqLevel === "critical" ? "< 100.000 — Critério gravidade" : plaqLevel === "alert" ? "< 150.000 — Pedir coagulação" : ""} /></div>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}><LabField label="AST" unit="U/L" value={lab.ast} onChange={v => setLab("ast", v)} level={astLevel} /></div>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}><LabField label="ALT" unit="U/L" value={lab.alt} onChange={v => setLab("alt", v)} level={altLevel} /></div>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}><LabField label="Creatinina" unit="mg/dL" value={lab.creatinina} onChange={v => setLab("creatinina", v)} level={creatLevel} hint={creatLevel === "critical" ? "> 1.1 — Critério gravidade" : ""} /></div>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}><LabField label="LDH" unit="U/L" value={lab.ldh} onChange={v => setLab("ldh", v)} level={ldhLevel} hint={ldhLevel === "critical" ? "≥ 600 — Sugestivo hemólise" : ""} /></div>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}>
          <Field label="LSN AST/ALT" hint="Limite superior normal do hospital">
            <NumInput value={lsnAst} onChange={v => setLab("lsnAst", v)} unit="U/L" />
          </Field>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}><LabField label="Ácido úrico" unit="mg/dL" value={lab.acUrico} onChange={v => setLab("acUrico", v)} level="none" /></div>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}><LabField label="Bilirrubina total" unit="mg/dL" value={lab.bilirrubina} onChange={v => setLab("bilirrubina", v)} level={lab.bilirrubina > 1.2 ? "alert" : "none"} /></div>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}><LabField label="Haptoglobina" unit="mg/dL" value={lab.haptoglobina} onChange={v => setLab("haptoglobina", v)} level={lab.haptoglobina != null && lab.haptoglobina < 30 ? "alert" : "none"} /></div>
      </div>

      <div style={{ height: 1, background: COLORS.borderLight, margin: "20px 0" }} />
      <SectionTitle icon="🧪">Proteinúria</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}>
          <Field label="Rácio P/C" hint="≥0.3 = positivo">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {lab.pc != null && <SeverityDot level={lab.pc >= 0.3 ? "critical" : "normal"} />}
              <NumInput value={lab.pc} onChange={v => setLab("pc", v)} unit="mg/mg" />
            </div>
          </Field>
        </div>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}>
          <Field label="Proteinúria 24h" hint="≥300 = positivo">
            <NumInput value={lab.prot24} onChange={v => setLab("prot24", v)} unit="mg/24h" />
          </Field>
        </div>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}>
          <Field label="Tira reagente">
            <Select value={lab.tira} onChange={v => setLab("tira", v)} options={[
              { value: "neg", label: "Negativo" }, { value: "tracos", label: "Traços" },
              { value: "1+", label: "1+" }, { value: "2+", label: "2+" },
              { value: "3+", label: "3+" }, { value: "4+", label: "4+" },
            ]} />
          </Field>
        </div>
      </div>

      {(lab.prot24 > 5000 || (lab.pc && lab.pc > 5)) && (
        <Card accent={COLORS.purple} style={{ background: COLORS.purpleBg }}>
          <div style={{ fontSize: 12, fontFamily: fontBody, color: COLORS.purple, fontWeight: 600 }}>Suspeita de síndrome nefrótico — Confirmar proteinúria 24h; implicações na tromboprofilaxia</div>
        </Card>
      )}

      <div style={{ height: 1, background: COLORS.borderLight, margin: "20px 0" }} />
      <SectionTitle icon="🔮">Rácio sFlt-1/PlGF</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}><Field label="sFlt-1" hint="pg/mL"><NumInput value={lab.sflt1} onChange={v => setLab("sflt1", v)} unit="pg/mL" /></Field></div>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}><Field label="PlGF" hint="pg/mL"><NumInput value={lab.plgf} onChange={v => setLab("plgf", v)} unit="pg/mL" /></Field></div>
        <div style={{ flex: "1 1 160px", minWidth: 0 }}><Field label="Rácio sFlt-1/PlGF" hint="Calculado ou manual">
          <NumInput value={ratio ?? (lab.sflt1 && lab.plgf && lab.plgf > 0 ? Math.round(lab.sflt1 / lab.plgf) : null)} onChange={v => setLab("sflt1plgf", v)} />
        </Field></div>
      </div>

      {ratioInterpretation && (
        <Card accent={levelColors[ratioInterpretation.level === "green" ? "normal" : ratioInterpretation.level === "yellow" ? "alert" : ratioInterpretation.level === "orange" ? "alert" : "critical"]} style={{ background: ratioInterpretation.level === "green" ? COLORS.greenBg : ratioInterpretation.level === "yellow" ? COLORS.yellowBg : ratioInterpretation.level === "orange" ? COLORS.orangeBg : COLORS.redBg }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Badge color={ratioInterpretation.level === "green" ? "green" : ratioInterpretation.level === "yellow" ? "yellow" : ratioInterpretation.level === "orange" ? "orange" : "red"}>
                {igWeeks < 34 ? "<34 semanas" : "≥34 semanas"}
              </Badge>
              <div style={{ fontWeight: 700, fontSize: 14, fontFamily: fontBody, color: COLORS.text, marginTop: 8 }}>{ratioInterpretation.text}</div>
              <div style={{ fontSize: 12, fontFamily: fontBody, color: COLORS.textMuted, marginTop: 2 }}>{ratioInterpretation.detail}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: fontStack, color: COLORS.text }}>{lab.sflt1plgf || (lab.sflt1 && lab.plgf ? Math.round(lab.sflt1 / lab.plgf) : "—")}</div>
            </div>
          </div>
          <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: fontBody, color: COLORS.text }}>
            <strong>Conduta:</strong> {ratioInterpretation.conduct}
          </div>
        </Card>
      )}
    </div>
  );
}

function Step6_Fetal({ data, setData }) {
  const setFetal = (key, val) => setData({ ...data, fetal: { ...data.fetal, [key]: val } });
  const f = data.fetal || {};
  return (
    <div>
      <SectionTitle icon="👶">Biometria Fetal</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
        <div style={{ flex: "1 1 150px", minWidth: 0 }}><Field label="PFE" hint="Peso fetal estimado"><NumInput value={f.pfe} onChange={v => setFetal("pfe", v)} unit="g" /></Field></div>
        <div style={{ flex: "1 1 150px", minWidth: 0 }}><Field label="Percentil PFE"><NumInput value={f.percentilPfe} onChange={v => setFetal("percentilPfe", v)} /></Field></div>
        <div style={{ flex: "1 1 150px", minWidth: 0 }}><Field label="AFI" hint="Índice líquido amniótico"><NumInput value={f.afi} onChange={v => setFetal("afi", v)} unit="cm" /></Field></div>
      </div>

      {f.percentilPfe != null && f.percentilPfe < 10 && (
        <Card accent={f.percentilPfe < 3 ? COLORS.red : COLORS.orange} style={{ background: f.percentilPfe < 3 ? COLORS.redBg : COLORS.orangeBg }}>
          <div style={{ fontSize: 13, fontFamily: fontBody, fontWeight: 600, color: f.percentilPfe < 3 ? COLORS.red : COLORS.orange }}>
            {f.percentilPfe < 3 ? "PFE < p3 — RCF grave" : "PFE < p10 — Avaliar Doppler fetal"}
          </div>
        </Card>
      )}

      <SectionTitle icon="📡">Doppler Fetal</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
        <div style={{ flex: "1 1 200px", minWidth: 0 }}>
          <Field label="Fluxo diastólico AU">
            <Select value={f.fluxoAU} onChange={v => setFetal("fluxoAU", v)} options={[
              { value: "normal", label: "Normal" }, { value: "ausente", label: "Ausente" }, { value: "reverso", label: "Reverso" }
            ]} />
          </Field>
        </div>
        <div style={{ flex: "1 1 200px", minWidth: 0 }}>
          <Field label="Ductus venoso onda a">
            <Select value={f.dv} onChange={v => setFetal("dv", v)} options={[
              { value: "normal", label: "Normal" }, { value: "ausente", label: "Ausente" }, { value: "reversa", label: "Reversa" }
            ]} />
          </Field>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
        <div style={{ flex: "1 1 200px", minWidth: 0 }}><Field label="IP Artéria Umbilical"><NumInput value={f.ipAU} onChange={v => setFetal("ipAU", v)} /></Field></div>
        <div style={{ flex: "1 1 200px", minWidth: 0 }}><Field label="IP ACM"><NumInput value={f.ipACM} onChange={v => setFetal("ipACM", v)} /></Field></div>
      </div>
      <Field label="CTG">
        <Select value={f.ctg} onChange={v => setFetal("ctg", v)} options={[
          { value: "tranquilizador", label: "Tranquilizador" }, { value: "atipico", label: "Atípico" }, { value: "patologico", label: "Patológico" }
        ]} />
      </Field>

      {f.fluxoAU === "reverso" && (
        <Card accent={COLORS.red} style={{ background: COLORS.redBg }}>
          <div style={{ fontSize: 13, fontFamily: fontBody, fontWeight: 700, color: COLORS.red }}>🚨 Fluxo diastólico reverso na artéria umbilical — Considerar parto urgente</div>
        </Card>
      )}
      {f.dv === "reversa" && (
        <Card accent={COLORS.red} style={{ background: COLORS.redBg }}>
          <div style={{ fontSize: 13, fontFamily: fontBody, fontWeight: 700, color: COLORS.red }}>🚨 Onda a reversa no ductus venoso — Descompensação cardíaca fetal iminente</div>
        </Card>
      )}
    </div>
  );
}

// ─── Classification Engine ───
function classifyCase(data) {
  const ig = (data.igSemanas || 0) + (data.igDias || 0) / 7;
  const sys = data.taSistolica || 0;
  const dia = data.taDiastolica || 0;
  const lab = data.lab || {};
  const sint = data.sintomas || {};
  const fetal = data.fetal || {};
  const lsn = lab.lsnAst || 40;

  const hasHTA = sys >= 140 || dia >= 90;
  const hasSevereHTA = sys >= 160 || dia >= 110;
  const hasProteinuria = (lab.pc && lab.pc >= 0.3) || (lab.prot24 && lab.prot24 >= 300) || lab.tira === "2+" || lab.tira === "3+" || lab.tira === "4+";

  const hasThrombocytopenia = lab.plaquetas != null && lab.plaquetas < 100;
  const hasRenalInsuff = lab.creatinina != null && lab.creatinina > 1.1;
  const hasLiverDysf = (lab.ast != null && lab.ast >= 2 * lsn) || (lab.alt != null && lab.alt >= 2 * lsn);
  const hasHemolysis = (lab.ldh != null && lab.ldh >= 600) && (lab.haptoglobina != null ? lab.haptoglobina < 30 : true);

  const hasClinicalSeverity = sint.cefaleias || sint.visuais || sint.consciencia || sint.epigastralgia || sint.edemaPulmonar;
  const hasConvulsions = sint.convulsoes;

  const ratio = lab.sflt1plgf || (lab.sflt1 && lab.plgf && lab.plgf > 0 ? lab.sflt1 / lab.plgf : null);
  const hasAngiogenicImbalance = ratio != null && ((ig < 34 && ratio >= 85) || (ig >= 34 && ratio >= 110));

  const hasOrganDysfunction = hasThrombocytopenia || hasRenalInsuff || hasLiverDysf || sint.edemaPulmonar || hasClinicalSeverity;
  const hasPlacentalDysf = (fetal.percentilPfe != null && fetal.percentilPfe < 10) || fetal.fluxoAU === "ausente" || fetal.fluxoAU === "reverso";

  const severityCriteria = [];
  if (hasSevereHTA) severityCriteria.push("HTA grave (≥160/110)");
  if (hasThrombocytopenia) severityCriteria.push("Trombocitopenia (<100.000)");
  if (hasLiverDysf) severityCriteria.push("Disfunção hepática (transaminases ≥2×LSN)");
  if (hasRenalInsuff) severityCriteria.push("Insuficiência renal (Cr >1.1)");
  if (sint.edemaPulmonar) severityCriteria.push("Edema pulmonar");
  if (sint.cefaleias) severityCriteria.push("Cefaleias graves/persistentes");
  if (sint.visuais) severityCriteria.push("Alterações visuais");
  if (sint.consciencia) severityCriteria.push("Alterações da consciência");
  if (sint.epigastralgia) severityCriteria.push("Epigastralgia/dor HD");
  if (hasAngiogenicImbalance) severityCriteria.push("Desequilíbrio angiogénico (sFlt-1/PlGF elevado)");

  // HELLP?
  const hellpComponents = [];
  if (hasHemolysis) hellpComponents.push("Hemólise");
  if (hasLiverDysf) hellpComponents.push("Elevação enzimas hepáticas");
  if (hasThrombocytopenia) hellpComponents.push("Trombocitopenia");
  const isHELLP = hellpComponents.length === 3;
  const isPartialHELLP = hellpComponents.length >= 2 && !isHELLP;

  // Classification
  let diagnosis, level, color;

  if (hasConvulsions) {
    diagnosis = "ECLÂMPSIA";
    level = "critical";
    color = "red";
  } else if (isHELLP) {
    diagnosis = "Síndrome HELLP Completo";
    level = "critical";
    color = "red";
  } else if (isPartialHELLP && hasHTA) {
    diagnosis = "Síndrome HELLP Parcial";
    level = "critical";
    color = "red";
  } else if (data.htaCronica && hasHTA && (hasProteinuria || hasOrganDysfunction || hasAngiogenicImbalance)) {
    diagnosis = "Pré-eclâmpsia sobreposta a HTA Crónica";
    level = severityCriteria.length > 0 ? "severe" : "moderate";
    color = severityCriteria.length > 0 ? "red" : "orange";
  } else if (hasHTA && (hasProteinuria || hasOrganDysfunction || hasAngiogenicImbalance || hasPlacentalDysf)) {
    if (severityCriteria.length > 0) {
      diagnosis = "Pré-eclâmpsia COM critérios de gravidade";
      level = "severe";
      color = "red";
    } else {
      diagnosis = "Pré-eclâmpsia SEM critérios de gravidade";
      level = "moderate";
      color = "orange";
    }
  } else if (hasHTA && !hasProteinuria && !hasOrganDysfunction) {
    diagnosis = "Hipertensão Gestacional";
    level = "mild";
    color = "yellow";
  } else if (!hasHTA) {
    diagnosis = "Sem hipertensão nesta avaliação";
    level = "normal";
    color = "green";
  } else {
    diagnosis = "Avaliação incompleta";
    level = "unknown";
    color = "muted";
  }

  // Delivery timing
  let deliveryTiming = "";
  let deliveryUrgency = "";
  if (diagnosis === "ECLÂMPSIA" || isHELLP) {
    deliveryTiming = "Estabilização + parto imediato";
    deliveryUrgency = "immediate";
  } else if (level === "severe") {
    if (ig >= 34) { deliveryTiming = "Parto após estabilização"; deliveryUrgency = "urgent"; }
    else if (ig >= 24) { deliveryTiming = `Gestão expectante possível em UCIP (${ig.toFixed(0)}s) — Corticóides + MgSO4`; deliveryUrgency = "expectant"; }
    else { deliveryTiming = "Considerar interrupção — outcomes neonatais muito reservados (<24s)"; deliveryUrgency = "discuss"; }
  } else if (level === "moderate") {
    if (ig >= 37) { deliveryTiming = "Parto (≥37 semanas)"; deliveryUrgency = "planned"; }
    else if (ig >= 34 && ratio != null && ratio > 201) { deliveryTiming = "Ponderar terminação (sFlt-1/PlGF >201 entre 34-36+6)"; deliveryUrgency = "urgent"; }
    else { deliveryTiming = "Vigilância apertada — reavaliar para parto às 37 semanas"; deliveryUrgency = "monitor"; }
  } else if (level === "mild") {
    deliveryTiming = ig >= 37 ? "Ponderar parto (≥37s)" : "Vigilância 1-2×/semana; parto ≥37 semanas";
    deliveryUrgency = ig >= 37 ? "planned" : "monitor";
  }

  // sFlt-1/PlGF >655 override
  if (ratio > 655 && ig < 34 && deliveryUrgency !== "immediate") {
    deliveryTiming += " ⚠ sFlt-1/PlGF >655 — Corticóides imediatos; provável parto em ≤48h";
    deliveryUrgency = "urgent";
  }

  return { diagnosis, level, color, severityCriteria, hellpComponents, isHELLP, isPartialHELLP, deliveryTiming, deliveryUrgency, ig, hasProteinuria };
}

function StepResults({ data }) {
  const result = classifyCase(data);
  const ig = result.ig;
  const colorMap = { green: COLORS.green, yellow: COLORS.yellow, orange: COLORS.orange, red: COLORS.red, muted: COLORS.textMuted };
  const bgMap = { green: COLORS.greenBg, yellow: COLORS.yellowBg, orange: COLORS.orangeBg, red: COLORS.redBg, muted: "#f5f0ed" };

  return (
    <div>
      {/* Main Diagnosis Card */}
      <div style={{
        background: bgMap[result.color], border: `2px solid ${colorMap[result.color]}`,
        borderRadius: 16, padding: "24px 28px", marginBottom: 20, textAlign: "center",
      }}>
        <div style={{ fontSize: 11, fontFamily: fontBody, fontWeight: 600, color: colorMap[result.color], textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Classificação</div>
        <div style={{ fontSize: 22, fontFamily: fontStack, fontWeight: 700, color: COLORS.text, lineHeight: 1.3 }}>{result.diagnosis}</div>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <Badge color={result.color}>{ig.toFixed(1)} semanas</Badge>
          {result.hasProteinuria && <Badge color="purple">Proteinúria +</Badge>}
          {result.isHELLP && <Badge color="red">HELLP Completo</Badge>}
          {result.isPartialHELLP && <Badge color="orange">HELLP Parcial</Badge>}
        </div>
      </div>

      {/* Severity Criteria */}
      {result.severityCriteria.length > 0 && (
        <Card accent={COLORS.red}>
          <SectionTitle icon="⚠️">Critérios de gravidade identificados</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {result.severityCriteria.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: fontBody, color: COLORS.text }}>
                <SeverityDot level="critical" />{c}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Delivery Timing */}
      <Card accent={result.deliveryUrgency === "immediate" ? COLORS.red : result.deliveryUrgency === "urgent" ? COLORS.orange : COLORS.green}>
        <SectionTitle icon="🏥">Conduta — Timing do parto</SectionTitle>
        <div style={{ fontSize: 14, fontFamily: fontBody, color: COLORS.text, lineHeight: 1.6, fontWeight: 500 }}>
          {result.deliveryTiming}
        </div>
      </Card>

      {/* Treatment suggestions */}
      {(result.level === "severe" || result.level === "critical") && (
        <Card accent={COLORS.accent}>
          <SectionTitle icon="💊">Terapêutica sugerida</SectionTitle>
          <div style={{ fontSize: 13, fontFamily: fontBody, color: COLORS.text, lineHeight: 1.7 }}>
            {(data.taSistolica >= 160 || data.taDiastolica >= 110) && (
              <div style={{ marginBottom: 8 }}>
                <strong style={{ color: COLORS.red }}>Emergência hipertensiva:</strong> Nifedipina 10 mg PO (escalonar cada 20 min) ou Labetalol 20 mg IV (escalonar cada 10 min)
              </div>
            )}
            <div style={{ marginBottom: 8 }}>
              <strong>MgSO4:</strong> Carga 4 g IV em 20 min → Manutenção 2 g/h. Manter 24h pós-parto.
            </div>
            {ig < 34 && (
              <div style={{ marginBottom: 8 }}>
                <strong>Corticóides:</strong> Maturação pulmonar fetal (betametasona 12 mg IM, 2 doses, 24h intervalo)
              </div>
            )}
            <div>
              <strong>Manutenção:</strong> Nifedipina AP 30-60 mg/dia PO ou Labetalol 100-400 mg 2-3×/dia PO
            </div>
          </div>
        </Card>
      )}

      {/* Surveillance checklist */}
      <Card>
        <SectionTitle icon="📋">Vigilância recomendada</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", fontSize: 12, fontFamily: fontBody, color: COLORS.text }}>
          {result.level === "severe" || result.level === "critical" ? (
            <>
              <div>◻ TA 6/6h (mín.)</div>
              <div>◻ Analítica diária (mín.)</div>
              <div>◻ CTG 8/8h</div>
              <div>◻ sFlt-1/PlGF semanal</div>
              <div>◻ Ecografia cada 2 semanas</div>
              <div>◻ Perfil biofísico semanal</div>
              <div>◻ Balanço hídrico</div>
              <div>◻ Magnesemia 6/6h (se MgSO4)</div>
            </>
          ) : (
            <>
              <div>◻ TA 1-2×/dia</div>
              <div>◻ Analítica 2×/semana</div>
              <div>◻ CTG diário</div>
              <div>◻ sFlt-1/PlGF semanal</div>
              <div>◻ Ecografia cada 15 dias</div>
              <div>◻ Perfil biofísico 1×/semana</div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── Main App ───
const STEPS = [
  { key: "dados", title: "Dados da Grávida", icon: "👩" },
  { key: "antecedentes", title: "Antecedentes", icon: "📋" },
  { key: "ta", title: "Tensão Arterial", icon: "🩺" },
  { key: "sintomas", title: "Sintomatologia", icon: "⚡" },
  { key: "lab", title: "Laboratório", icon: "🔬" },
  { key: "fetal", title: "Avaliação Fetal", icon: "👶" },
  { key: "resultado", title: "Resultado", icon: "📊" },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [data, setData] = useState({ sintomas: {}, lab: { lsnAst: 40 }, fetal: {} });

  const goToStep = (i) => {
    if (i <= maxVisited) setStep(i);
  };

  const goNext = () => {
    if (canNext() && step < STEPS.length - 1) {
      const next = step + 1;
      setStep(next);
      setMaxVisited(prev => Math.max(prev, next));
    }
  };

  const canNext = () => {
    if (step === 0) return data.idadeMaterna && data.igSemanas != null && data.paridade;
    if (step === 2) return data.taSistolica && data.taDiastolica;
    return true;
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: fontBody, color: COLORS.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: `1px solid ${COLORS.borderLight}`,
        padding: "16px 24px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 20, fontFamily: fontStack, fontWeight: 400, color: COLORS.text, margin: 0, letterSpacing: -0.3 }}>
              Hipertensão <em>na</em> Gravidez
            </h1>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>Algoritmo de decisão clínica</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: COLORS.textLight, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>Organizado e revisto por</div>
            <div style={{ fontSize: 12, color: COLORS.accent, fontWeight: 600 }}>Dra. Mariana Dória</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>Especialista em Medicina Materno-Fetal</div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "20px 16px 100px" }}>
        {/* Step Progress */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
          {STEPS.map((s, i) => {
            const isActive = i === step;
            const isVisited = i <= maxVisited;
            const isFuture = i > maxVisited;
            return (
              <button key={s.key} onClick={() => goToStep(i)} style={{
                flex: 1, minWidth: 80, padding: "10px 6px", borderRadius: 10, border: "none",
                background: isActive ? COLORS.accent : isVisited ? COLORS.accentLight : "#f0ebe7",
                color: isActive ? "#fff" : isVisited ? COLORS.accentDark : COLORS.textLight,
                fontSize: 11, fontFamily: fontBody, fontWeight: isActive ? 600 : 400,
                cursor: isVisited ? "pointer" : "default", transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                opacity: isFuture ? 0.5 : 1,
              }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span style={{ lineHeight: 1.2 }}>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Step Content */}
        <Card style={{ padding: "28px 26px" }}>
          <h2 style={{ fontSize: 18, fontFamily: fontStack, fontWeight: 400, color: COLORS.text, margin: "0 0 20px", borderBottom: `1px solid ${COLORS.borderLight}`, paddingBottom: 12 }}>
            {STEPS[step].icon} {STEPS[step].title}
          </h2>

          {step === 0 && <Step1_DadosGravida data={data} setData={setData} />}
          {step === 1 && <Step2_Antecedentes data={data} setData={setData} />}
          {step === 2 && <Step3_TA data={data} setData={setData} />}
          {step === 3 && <Step4_Sintomas data={data} setData={setData} />}
          {step === 4 && <Step5_Lab data={data} setData={setData} />}
          {step === 5 && <Step6_Fetal data={data} setData={setData} />}
          {step === 6 && <StepResults data={data} />}
        </Card>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, gap: 12 }}>
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} style={{
              padding: "12px 24px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`,
              background: "#fff", color: COLORS.text, fontSize: 14, fontFamily: fontBody,
              fontWeight: 500, cursor: "pointer",
            }}>← Anterior</button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button onClick={goNext} disabled={!canNext()} style={{
              padding: "12px 28px", borderRadius: 10, border: "none",
              background: canNext() ? COLORS.accent : COLORS.border,
              color: canNext() ? "#fff" : COLORS.textLight, fontSize: 14, fontFamily: fontBody,
              fontWeight: 600, cursor: canNext() ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}>Seguinte →</button>
          ) : (
            <button onClick={() => { setStep(0); setMaxVisited(0); setData({ sintomas: {}, lab: { lsnAst: 40 }, fetal: {} }); }} style={{
              padding: "12px 24px", borderRadius: 10, border: `1.5px solid ${COLORS.accent}`,
              background: COLORS.accentLight, color: COLORS.accentDark, fontSize: 14,
              fontFamily: fontBody, fontWeight: 600, cursor: "pointer",
            }}>Nova Avaliação</button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(250,247,245,0.95)", borderTop: `1px solid ${COLORS.borderLight}`,
        padding: "8px 16px", textAlign: "center",
        backdropFilter: "blur(8px)",
      }}>
        <div style={{ fontSize: 10, color: COLORS.textLight, fontFamily: fontBody, maxWidth: 820, margin: "0 auto" }}>
          Ferramenta de apoio à decisão clínica — Não substitui o julgamento clínico. Baseado em ISSHP 2021, ACOG 2020/2024, NICE 2023, Protocolo HPH/ULS Matosinhos 2022.
        </div>
      </footer>
    </div>
  );
}
