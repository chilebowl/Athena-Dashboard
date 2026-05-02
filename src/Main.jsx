import { useState, useEffect } from “react”;

// ── FONT INJECTION ────────────────────────────────────────────────────────────
function useFonts() {
useEffect(() => {
const link = document.createElement(“link”);
link.rel = “stylesheet”;
link.href = “https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap”;
document.head.appendChild(link);
}, []);
}

// ── RESPONSIVE BREAKPOINT ─────────────────────────────────────────────────────
function useBreakpoint() {
const get = () => {
const w = typeof window !== “undefined” ? window.innerWidth : 1200;
return w < 620 ? “mobile” : w < 980 ? “tablet” : “desktop”;
};
const [bp, setBp] = useState(get);
useEffect(() => {
const h = () => setBp(get());
window.addEventListener(“resize”, h);
return () => window.removeEventListener(“resize”, h);
}, []);
return bp;
}

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const T = {
// Backgrounds — warm charcoal, not blue-black
bg:       “#121110”,
bgPanel:  “#191816”,
bgHeader: “#211f1d”,
bgRaised: “#1e1c1a”,
bgScope:  “#0c0b0a”,
bgRow:    “#161513”,
bgRowAlt: “#191816”,

// Borders — warm subtle
border:     “#2a2826”,
borderDim:  “#201e1c”,
borderHi:   “#383432”,

// Text — warm palette
valColor:  “#ddd7ce”,   // numbers & values
textPri:   “#b0aaa2”,   // body text
textSec:   “#686460”,   // labels
textDim:   “#3c3a38”,   // muted / inactive
textLabel: “#807a74”,   // panel labels

// Accent colors (Baselight language)
orange:    “#c47228”,   // primary interactive
orangeHi:  “#d8833a”,
orangeDim: “#6e3e14”,
orangeFog: “rgba(196,114,40,0.12)”,
blue:      “#4a88b2”,
blueFog:   “rgba(74,136,178,0.10)”,
green:     “#5a9260”,
greenFog:  “rgba(90,146,96,0.10)”,
amber:     “#b87e2a”,
amberFog:  “rgba(184,126,42,0.10)”,
red:       “#b03428”,
redFog:    “rgba(176,52,40,0.10)”,
purple:    “#7862a8”,
purpleFog: “rgba(120,98,168,0.10)”,

// Scope trace colors
traceOrange: “#c47228”,
traceBlue:   “#4a88b2”,
traceGreen:  “#5a9260”,
traceAmber:  “#b87e2a”,
traceGrid:   “#1a1816”,

// Fonts
sans: “‘Barlow’, system-ui, sans-serif”,
mono: “‘IBM Plex Mono’, ‘Courier New’, monospace”,
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
const LAT = 32.67, LON = -117.10;
const REFRESH = 5 * 60 * 1000;

const WX = {0:“Clear”,1:“Mostly clear”,2:“Partly cloudy”,3:“Overcast”,45:“Fog”,51:“Light drizzle”,61:“Light rain”,63:“Rain”,65:“Heavy rain”,80:“Showers”,95:“Thunderstorm”};
const wxDesc = c => WX[c] || `Code ${c}`;

const kpColor  = v => { v=parseFloat(v); return v>=7?T.red:v>=5?T.amber:v>=3?T.orange:T.green; };
const bzColor  = v => { v=parseFloat(v); return v<-10?T.red:v<-5?T.amber:”#7a7a6a”; };
const magColor = m => m>=5?T.red:m>=4?T.amber:m>=3?T.orange:T.green;
const timeAgo  = ts => { const m=Math.floor((Date.now()-ts)/60000); return m<60?`${m}m ago`:`${Math.floor(m/60)}h ago`; };
const dist2d   = (lat,lon) => { const dy=(lat-LAT)*111,dx=(lon-LON)*111*Math.cos(LAT*Math.PI/180); return Math.round(Math.sqrt(dy*dy+dx*dx)); };

// ── PANEL COMPONENT ───────────────────────────────────────────────────────────
function Panel({ title, src, accent=T.orange, status=“loading”, children, noPad }) {
const dotColor = status===“ok”?T.green:status===“error”?T.red:T.amber;
const dotLabel = status===“ok”?“LIVE”:status===“error”?“ERR”:”···”;
return (
<div style={{
background: T.bgPanel,
border: `1px solid ${T.border}`,
borderLeft: `3px solid ${accent}`,
display: “flex”, flexDirection: “column”,
overflow: “hidden”,
}}>
{/* Header */}
<div style={{
background: T.bgHeader,
borderBottom: `1px solid ${T.borderDim}`,
padding: “7px 12px”,
display: “flex”, justifyContent: “space-between”, alignItems: “center”,
minHeight: 30,
}}>
<div>
<span style={{ fontFamily: T.sans, fontSize: 9, fontWeight: 600, color: T.textLabel, letterSpacing: “0.18em”, textTransform: “uppercase” }}>{title}</span>
{src && <span style={{ fontFamily: T.sans, fontSize: 8, fontWeight: 300, color: T.textDim, marginLeft: 8, letterSpacing: “0.06em” }}>{src}</span>}
</div>
<div style={{ display: “flex”, alignItems: “center”, gap: 5 }}>
<div style={{ width: 5, height: 5, borderRadius: “50%”, background: dotColor, opacity: status===“ok”?1:0.6 }}/>
<span style={{ fontFamily: T.mono, fontSize: 8, color: dotColor, letterSpacing: “0.1em” }}>{dotLabel}</span>
</div>
</div>
{/* Body */}
<div style={{ padding: noPad ? 0 : “12px 14px”, flex: 1 }}>{children}</div>
</div>
);
}

// ── DATA ROW ─────────────────────────────────────────────────────────────────
function Row({ label, value, unit, color, accent, mono=true, alt }) {
return (
<div style={{
display: “flex”, justifyContent: “space-between”, alignItems: “baseline”,
padding: “5px 10px”,
background: alt ? T.bgRowAlt : T.bgRow,
borderBottom: `1px solid ${T.borderDim}`,
}}>
<span style={{ fontFamily: T.sans, fontSize: 9, fontWeight: 400, color: T.textSec, letterSpacing: “0.08em”, textTransform: “uppercase” }}>{label}</span>
<span style={{ fontFamily: mono?T.mono:T.sans, fontSize: 11, fontWeight: 400, color: color||T.valColor }}>
{value??<span style={{color:T.textDim}}>—</span>}
{unit&&<span style={{ fontSize: 9, color: T.textSec, marginLeft: 4 }}>{unit}</span>}
</span>
</div>
);
}

// ── BIG VALUE ─────────────────────────────────────────────────────────────────
function BigVal({ label, value, unit, color=T.valColor, note, noteColor }) {
return (
<div style={{ padding: “10px 14px 8px”, borderBottom: `1px solid ${T.borderDim}` }}>
<div style={{ fontFamily: T.sans, fontSize: 8, fontWeight: 500, color: T.textSec, letterSpacing: “0.15em”, textTransform: “uppercase”, marginBottom: 5 }}>{label}</div>
<div style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 300, color, lineHeight: 1, letterSpacing: “-0.02em” }}>
{value??<span style={{color:T.textDim, fontSize:16}}>no signal</span>}
{unit&&<span style={{ fontSize: 13, color: T.textSec, marginLeft: 6, fontWeight: 300 }}>{unit}</span>}
</div>
{note&&<div style={{ fontFamily: T.sans, fontSize: 8, color: noteColor||T.textSec, marginTop: 5, letterSpacing: “0.06em” }}>{note}</div>}
</div>
);
}

// ── SCOPE (sparkline with Baselight scope aesthetic) ─────────────────────────
function Scope({ data, colorFn, label, height=32, centerLine }) {
if (!data || data.length === 0) return null;
return (
<div style={{ background: T.bgScope, padding: “6px 10px 4px” }}>
{label && <div style={{ fontFamily: T.sans, fontSize: 7, color: T.textDim, letterSpacing: “0.12em”, textTransform: “uppercase”, marginBottom: 4 }}>{label}</div>}
<div style={{ position: “relative”, height }}>
{/* Grid lines */}
{[0.25, 0.5, 0.75].map(p => (
<div key={p} style={{ position:“absolute”, top:`${p*100}%`, left:0, right:0, height:1, background:T.traceGrid }}/>
))}
{centerLine && <div style={{ position:“absolute”, top:“50%”, left:0, right:0, height:1, background:”#282624” }}/>}
{/* Trace bars */}
<div style={{ position:“absolute”, inset:0, display:“flex”, gap:1, alignItems:“flex-end” }}>
{data.map((v, i) => {
const norm = Math.min(1, Math.max(0.02, Math.abs(v) / (centerLine ? 20 : Math.max(…data.map(Math.abs)) || 1)));
const col = colorFn ? colorFn(v) : T.traceOrange;
return (
<div key={i} style={{
flex:1, height: `${norm*100}%`,
background: col,
opacity: 0.75,
alignSelf: centerLine && v < 0 ? “flex-end” : “flex-end”,
}}/>
);
})}
</div>
</div>
<div style={{ display:“flex”, justifyContent:“space-between”, fontFamily:T.mono, fontSize:6, color:T.textDim, marginTop:2 }}>
<span>−{data.length}</span><span>NOW</span>
</div>
</div>
);
}

// ── STATUS DOT ────────────────────────────────────────────────────────────────
function StatusLine({ label, src, status, color=T.orange }) {
const s = status===“ok”?T.green:status===“pending”?T.textDim:status===“error”?T.red:T.amber;
const lbl = status===“ok”?“ACTIVE”:status===“pending”?“PHASE 1+”:status===“error”?“ERROR”:“INIT”;
return (
<div style={{ display:“flex”, alignItems:“center”, gap:8, padding:“4px 10px”, borderBottom:`1px solid ${T.borderDim}`, background:T.bgRow }}>
<div style={{ width:4, height:4, borderRadius:“50%”, background:s, flexShrink:0 }}/>
<div style={{ flex:1 }}>
<div style={{ fontFamily:T.sans, fontSize:8, fontWeight:500, color:status===“pending”?T.textDim:color, letterSpacing:“0.08em”, textTransform:“uppercase” }}>{label}</div>
{src&&<div style={{ fontFamily:T.mono, fontSize:7, color:T.textDim, marginTop:1 }}>{src}</div>}
</div>
<span style={{ fontFamily:T.mono, fontSize:7, color:s, letterSpacing:“0.08em” }}>{lbl}</span>
</div>
);
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function AthenaFase0() {
useFonts();
const bp = useBreakpoint();

const [wx, setWx]         = useState(null);
const [kpData, setKpData] = useState(null);
const [magData, setMagData] = useState(null);
const [plasmaData, setPlasmaData] = useState(null);
const [neo, setNeo]       = useState(null);
const [quakes, setQuakes] = useState(null);
const [launches, setLaunches] = useState(null);
const [st, setSt]         = useState({});
const [updated, setUpdated] = useState(null);

const fetchAll = async () => {
setSt(s => ({…s, wx:“loading”, kp:“loading”, solar:“loading”, neo:“loading”, quakes:“loading”, launches:“loading”}));
const run = async (fn) => { try { return { data: await fn(), ok: true }; } catch { return { data: null, ok: false }; }};
const [r0,r1,r2,r3,r4,r5,r6] = await Promise.all([
run(()=>fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,weather_code,precipitation,wind_direction_10m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=3&timezone=America/Los_Angeles&wind_speed_unit=kmh`).then(r=>r.json())),
run(()=>fetch(“https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json”).then(r=>r.json())),
run(()=>fetch(“https://services.swpc.noaa.gov/products/solar-wind/mag.json”).then(r=>r.json())),
run(()=>fetch(“https://services.swpc.noaa.gov/products/solar-wind/plasma.json”).then(r=>r.json())),
run(()=>fetch(“https://api.nasa.gov/neo/rest/v1/feed/today?api_key=DEMO_KEY”).then(r=>r.json())),
run(()=>fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${LAT}&longitude=${LON}&maxradiuskm=500&minmagnitude=2.0&limit=7&orderby=time`).then(r=>r.json())),
run(()=>fetch(“https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=6&format=json”).then(r=>r.json())),
]);
if(r0.ok) setWx(r0.data);
if(r1.ok) setKpData(r1.data);
if(r2.ok) setMagData(r2.data);
if(r3.ok) setPlasmaData(r3.data);
if(r4.ok) setNeo(r4.data);
if(r5.ok) setQuakes(r5.data);
if(r6.ok) setLaunches(r6.data);
setSt({
wx: r0.ok?“ok”:“error”,
kp: r1.ok?“ok”:“error”,
mag: r2.ok?“ok”:“error”,
plasma: r3.ok?“ok”:“error”,
solar: r2.ok&&r3.ok?“ok”:“error”,
neo: r4.ok?“ok”:“error”,
quakes: r5.ok?“ok”:“error”,
launches: r6.ok?“ok”:“error”,
});
setUpdated(new Date());
};

useEffect(() => {
fetchAll();
const id = setInterval(fetchAll, REFRESH);
return () => clearInterval(id);
}, []);

// ── Derived ──
const cur    = wx?.current;
const daily  = wx?.daily;
const lastKp = kpData?.[kpData.length-1];
const kpVal  = lastKp?.[1];
const f107   = lastKp?.[3];
const lastMag = magData?.[magData.length-1];
const bzVal  = lastMag?.[3];
const btVal  = lastMag?.[6];
const lastPlas = plasmaData?.[plasmaData.length-1];
const swSpeed  = lastPlas?.[2];
const swDens   = lastPlas?.[1];

const todayKey = Object.keys(neo?.near_earth_objects||{})[0];
const neos = todayKey
? (neo.near_earth_objects[todayKey]||[])
.sort((a,b)=>parseFloat(a.close_approach_data[0]?.miss_distance?.lunar)-parseFloat(b.close_approach_data[0]?.miss_distance?.lunar))
.slice(0,5)
: [];

const qList = quakes?.features || [];
const lList = launches?.results || [];
const activeCount = Object.values(st).filter(s=>s===“ok”).length;

// ── Sparkline data ──
const bzSeries  = (magData||[]).slice(-60).map(r=>parseFloat(r[3]));
const kpSeries  = (kpData||[]).slice(-8).map(r=>parseFloat(r[1]));

// ── Grid columns by breakpoint ──
const cols = bp===“mobile” ? 1 : bp===“tablet” ? 2 : 3;

return (
<div style={{ background: T.bg, minHeight: “100vh”, fontFamily: T.sans, color: T.textPri, padding: bp===“mobile”?“10px”:“16px” }}>

```
  {/* ═══ TOPBAR ═══ */}
  <div style={{
    background: T.bgHeader,
    border: `1px solid ${T.border}`,
    borderLeft: `3px solid ${T.orange}`,
    marginBottom: 10,
    padding: bp==="mobile" ? "10px 12px" : "10px 18px",
    display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
  }}>
    <div>
      <div style={{ fontFamily:T.sans, fontSize:8, fontWeight:500, color:T.textDim, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:5 }}>
        PROYECTO ATHENA · FASE 0 · 32.67°N 117.10°W
      </div>
      <div style={{ fontFamily:T.sans, fontSize: bp==="mobile"?16:20, fontWeight:600, color:T.valColor, letterSpacing:"0.06em" }}>
        MULTI-DOMAIN FUSION SYSTEM
      </div>
      <div style={{ fontFamily:T.sans, fontSize:8, fontWeight:300, color:T.textDim, marginTop:3, letterSpacing:"0.1em" }}>
        NATIONAL CITY / SAN DIEGO · REMOTE SOURCES ONLY · LOCAL SENSORS PHASE 1+
      </div>
    </div>

    <div style={{ display:"flex", gap: bp==="mobile"?12:20, alignItems:"center", flexWrap:"wrap" }}>
      {[
        { label:"SOURCES", value:`${activeCount}/7`, color:T.orange },
        { label:"UPDATED", value:updated?updated.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}):"—", color:T.green },
      ].map((s,i)=>(
        <div key={i} style={{ textAlign:"right" }}>
          <div style={{ fontFamily:T.mono, fontSize:18, fontWeight:400, color:s.color, lineHeight:1 }}>{s.value}</div>
          <div style={{ fontFamily:T.sans, fontSize:7, color:T.textDim, letterSpacing:"0.15em", marginTop:3 }}>{s.label}</div>
        </div>
      ))}
      <button onClick={fetchAll} style={{
        background:"transparent", border:`1px solid ${T.borderHi}`,
        color:T.textSec, padding:"7px 14px",
        fontFamily:T.sans, fontSize:9, fontWeight:500,
        cursor:"pointer", letterSpacing:"0.12em",
        transition:"all 0.15s",
      }}
      onMouseOver={e=>{e.currentTarget.style.borderColor=T.orange;e.currentTarget.style.color=T.orange;}}
      onMouseOut={e=>{e.currentTarget.style.borderColor=T.borderHi;e.currentTarget.style.color=T.textSec;}}
      >↺ REFRESH</button>
    </div>
  </div>

  {/* ═══ DOMAIN STRIP ═══ */}
  <div style={{ display:"flex", gap:4, marginBottom:10, flexWrap:"wrap" }}>
    {[
      ["METEOROLOGY", T.blue,   st.wx==="ok"],
      ["SOLAR WIND",  T.orange, st.solar==="ok"],
      ["SPACE WX",    T.amber,  st.kp==="ok"],
      ["NEO WATCH",   T.purple, st.neo==="ok"],
      ["SEISMOLOGY",  T.green,  st.quakes==="ok"],
      ["LAUNCHES",    T.purple, st.launches==="ok"],
      ["SAT IMAGERY", T.green,  true],
      ["RTL-SDR",     T.textDim,false],
    ].map(([lbl,col,on],i)=>(
      <div key={i} style={{
        padding:"3px 9px",
        border:`1px solid ${on?col+"50":T.borderDim}`,
        background:on?col+"0e":T.bgPanel,
        fontFamily:T.sans, fontSize:7, fontWeight:on?500:300,
        color:on?col:T.textDim,
        letterSpacing:"0.14em", textTransform:"uppercase",
      }}>
        {on?"▪":"▫"} {lbl}
      </div>
    ))}
  </div>

  {/* ═══ PANEL GRID ═══ */}
  <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:8 }}>

    {/* ── WEATHER ── */}
    <Panel title="Local Weather" src="open-meteo.com · National City SD" accent={T.blue} status={st.wx||"loading"} noPad>
      {cur ? (
        <>
          <div style={{ padding:"14px 14px 10px", borderBottom:`1px solid ${T.borderDim}`, background:T.bgRaised }}>
            <div style={{ fontFamily:T.sans, fontSize:8, color:T.textSec, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6 }}>CURRENT CONDITIONS</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
              <div>
                <div style={{ fontFamily:T.mono, fontSize:40, fontWeight:300, color:T.valColor, lineHeight:1 }}>
                  {cur.temperature_2m?.toFixed(1)}<span style={{ fontSize:16, color:T.textSec }}>°C</span>
                </div>
                <div style={{ fontFamily:T.sans, fontSize:10, color:T.blue, marginTop:6, fontWeight:400 }}>{wxDesc(cur.weather_code)}</div>
              </div>
              <div style={{ fontFamily:T.mono, fontSize:11, color:T.textSec, textAlign:"right", lineHeight:2 }}>
                <div>Feels {cur.apparent_temperature?.toFixed(1)}°</div>
                <div>RH {cur.relative_humidity_2m}%</div>
              </div>
            </div>
          </div>
          <Row label="Pressure"    value={cur.surface_pressure?.toFixed(1)}   unit="hPa" />
          <Row label="Wind"        value={cur.wind_speed_10m?.toFixed(1)}      unit="km/h" alt />
          <Row label="Wind Dir"    value={`${cur.wind_direction_10m}°`}        />
          <Row label="Precip"      value={cur.precipitation?.toFixed(1)}       unit="mm/h" alt />
          {daily && (
            <div style={{ display:"flex", borderTop:`1px solid ${T.borderDim}` }}>
              {["TODAY","TMW","D+2"].map((d,i)=>(
                <div key={i} style={{ flex:1, padding:"8px 6px", textAlign:"center", borderRight:i<2?`1px solid ${T.borderDim}`:"none", background:i%2?T.bgRowAlt:T.bgRow }}>
                  <div style={{ fontFamily:T.sans, fontSize:7, color:T.textDim, letterSpacing:"0.12em", marginBottom:4 }}>{d}</div>
                  <div style={{ fontFamily:T.mono, fontSize:12, color:T.valColor }}>{daily.temperature_2m_max[i]?.toFixed(0)}°</div>
                  <div style={{ fontFamily:T.mono, fontSize:10, color:T.textSec }}>{daily.temperature_2m_min[i]?.toFixed(0)}°</div>
                  <div style={{ fontFamily:T.mono, fontSize:8, color:T.textDim, marginTop:2 }}>{daily.precipitation_sum[i]?.toFixed(1)}mm</div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ padding:24, textAlign:"center", fontFamily:T.sans, fontSize:9, color:T.textDim, letterSpacing:"0.1em" }}>CONNECTING OPEN-METEO...</div>
      )}
    </Panel>

    {/* ── SOLAR WIND ── */}
    <Panel title="Solar Wind" src="NOAA SWPC · DSCOVR/ACE · L1" accent={T.orange} status={st.solar||"loading"} noPad>
      {lastMag && lastPlas ? (
        <>
          <BigVal
            label="IMF Bz Component"
            value={`${parseFloat(bzVal)>=0?"+":""}${parseFloat(bzVal)?.toFixed(2)}`}
            unit="nT"
            color={bzColor(bzVal)}
            note={parseFloat(bzVal)<-10?"⚠ CRITICAL — CME IMPACT WINDOW":parseFloat(bzVal)<-5?"⚠ Bz SOUTH — RECONNECTION ACTIVE":"Northward / nominal"}
            noteColor={parseFloat(bzVal)<-5?T.red:T.textSec}
          />
          <Row label="Bt Total"    value={parseFloat(btVal)?.toFixed(2)}   unit="nT"    color={T.orange} />
          <Row label="Speed"       value={parseFloat(swSpeed)?.toFixed(0)} unit="km/s"  alt />
          <Row label="Density"     value={parseFloat(swDens)?.toFixed(2)}  unit="p/cm³" />
          <Row label="Data time"   value={lastMag[0]?.slice(11,16)}        unit="UTC"   color={T.textSec} alt />
          <Scope data={bzSeries} colorFn={bzColor} label="Bz — 60 min (1-min cadence)" height={36} centerLine />
        </>
      ) : (
        <div style={{ padding:24, textAlign:"center", fontFamily:T.sans, fontSize:9, color:T.textDim }}>CONNECTING NOAA SWPC...</div>
      )}
    </Panel>

    {/* ── SPACE WEATHER INDICES ── */}
    <Panel title="Space Weather Indices" src="NOAA SWPC · Solar Cycle 25" accent={T.amber} status={st.kp||"loading"} noPad>
      {lastKp ? (
        <>
          <BigVal
            label="Planetary Kp Index"
            value={`Kp ${parseFloat(kpVal)?.toFixed(1)}`}
            color={kpColor(kpVal)}
            note={parseFloat(kpVal)>=7?"SEVERE STORM G3+":parseFloat(kpVal)>=5?"MODERATE STORM G1+":parseFloat(kpVal)>=3?"UNSETTLED":"QUIET CONDITIONS"}
            noteColor={kpColor(kpVal)}
          />
          {/* Kp scale */}
          <div style={{ padding:"8px 10px", background:T.bgScope, borderBottom:`1px solid ${T.borderDim}` }}>
            <div style={{ fontFamily:T.sans, fontSize:7, color:T.textDim, letterSpacing:"0.12em", marginBottom:5 }}>Kp SCALE 0–9</div>
            <div style={{ display:"flex", gap:2 }}>
              {[0,1,2,3,4,5,6,7,8,9].map(k=>{
                const active=parseFloat(kpVal)>=k;
                return (
                  <div key={k} style={{ flex:1, height:14, background:active?kpColor(k):"#181614", border:`1px solid ${T.borderDim}`, position:"relative" }}>
                    <span style={{ position:"absolute", bottom:1, width:"100%", textAlign:"center", fontSize:6, fontFamily:T.mono, color:active?"#0a0a0a":T.textDim }}>{k}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <Row label="Solar Flux F10.7" value={parseFloat(f107)?.toFixed(0)} unit="sfu" color={parseFloat(f107)>=150?T.red:T.amber} />
          <Row label="Data time UTC"    value={lastKp[0]?.slice(11,16)}      color={T.textSec} alt />
          <Scope data={kpSeries} colorFn={kpColor} label="Kp — last 8 readings (3h cadence)" height={28} />
        </>
      ) : (
        <div style={{ padding:24, textAlign:"center", fontFamily:T.sans, fontSize:9, color:T.textDim }}>CONNECTING SWPC...</div>
      )}
    </Panel>

    {/* ── NEO WATCH ── */}
    <Panel title="NEO Watch" src="NASA CNEOS · api.nasa.gov" accent={T.purple} status={st.neo||"loading"} noPad>
      <div style={{ padding:"8px 10px 4px", background:T.bgHeader, borderBottom:`1px solid ${T.borderDim}` }}>
        <span style={{ fontFamily:T.sans, fontSize:7, color:T.textDim, letterSpacing:"0.1em" }}>CLOSE APPROACH — TODAY · SORTED BY MISS DISTANCE</span>
      </div>
      {neos.length>0 ? neos.map((n,i)=>{
        const ca=n.close_approach_data[0];
        const ld=parseFloat(ca?.miss_distance?.lunar).toFixed(2);
        const vel=parseFloat(ca?.relative_velocity?.kilometers_per_second).toFixed(1);
        const diam=parseFloat(n.estimated_diameter?.meters?.estimated_diameter_max).toFixed(0);
        const haz=n.is_potentially_hazardous_asteroid;
        const ldN=parseFloat(ld);
        const distColor=ldN<5?T.red:ldN<20?T.amber:T.green;
        return (
          <div key={i} style={{ padding:"7px 10px", borderBottom:`1px solid ${T.borderDim}`, background:haz?T.redFog:i%2?T.bgRowAlt:T.bgRow }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ fontFamily:T.sans, fontSize:9, fontWeight:500, color:haz?T.red:T.textPri, flex:1, letterSpacing:"0.02em" }}>
                {haz?"⚠ ":""}{n.name.replace(/[()]/g,"").trim()}
              </div>
              <div style={{ fontFamily:T.mono, fontSize:13, fontWeight:400, color:distColor, marginLeft:10 }}>
                {ld}<span style={{ fontSize:8, color:T.textSec }}> LD</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:14, marginTop:3 }}>
              <span style={{ fontFamily:T.mono, fontSize:7, color:T.textDim }}>Ø {diam}m</span>
              <span style={{ fontFamily:T.mono, fontSize:7, color:T.textDim }}>{vel} km/s</span>
              <span style={{ fontFamily:T.mono, fontSize:7, color:T.textDim }}>{ca?.close_approach_date}</span>
            </div>
          </div>
        );
      }) : (
        <div style={{ padding:20, textAlign:"center", fontFamily:T.sans, fontSize:9, color:T.textDim }}>
          {st.neo==="error"?"NASA API UNAVAILABLE (DEMO_KEY RATE LIMIT)":"LOADING NEO DATA..."}
        </div>
      )}
      <div style={{ padding:"5px 10px", background:T.bgHeader }}>
        <span style={{ fontFamily:T.sans, fontSize:7, color:T.textDim }}>1 LD = 384,400 km · ⚠ = Potentially Hazardous Asteroid</span>
      </div>
    </Panel>

    {/* ── SEISMOLOGY ── */}
    <Panel title="Regional Seismology" src="USGS FDSN · r=500km SD" accent={T.green} status={st.quakes||"loading"} noPad>
      <div style={{ padding:"8px 10px 4px", background:T.bgHeader, borderBottom:`1px solid ${T.borderDim}` }}>
        <span style={{ fontFamily:T.sans, fontSize:7, color:T.textDim, letterSpacing:"0.1em" }}>M2.0+ EVENTS · SORTED BY TIME</span>
      </div>
      {qList.length>0 ? qList.map((f,i)=>{
        const p=f.properties, c=f.geometry.coordinates;
        const km=dist2d(c[1],c[0]);
        const mc=magColor(p.mag);
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 10px", borderBottom:`1px solid ${T.borderDim}`, background:i%2?T.bgRowAlt:T.bgRow }}>
            <div style={{ fontFamily:T.mono, fontSize:15, fontWeight:400, color:mc, minWidth:38, lineHeight:1 }}>M{p.mag?.toFixed(1)}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:T.sans, fontSize:9, color:T.textPri, lineHeight:1.3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.place?.split(", ").slice(0,2).join(", ")}</div>
              <div style={{ fontFamily:T.mono, fontSize:7, color:T.textDim, marginTop:2 }}>{timeAgo(p.time)} · {km}km · depth {Math.round(c[2])}km</div>
            </div>
            <div style={{ width:20, height:20, border:`1.5px solid ${mc}`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontFamily:T.mono, fontSize:6, color:mc }}>{p.mag?.toFixed(1)}</span>
            </div>
          </div>
        );
      }) : (
        <div style={{ padding:20, textAlign:"center", fontFamily:T.sans, fontSize:9, color:T.textDim }}>
          {st.quakes==="error"?"USGS UNAVAILABLE":"NO M2.0+ EVENTS IN 500km RADIUS"}
        </div>
      )}
    </Panel>

    {/* ── LAUNCHES ── */}
    <Panel title="Launch Schedule" src="Launch Library 2 · thespacedevs.com" accent={T.purple} status={st.launches||"loading"} noPad>
      <div style={{ padding:"8px 10px 4px", background:T.bgHeader, borderBottom:`1px solid ${T.borderDim}` }}>
        <span style={{ fontFamily:T.sans, fontSize:7, color:T.textDim, letterSpacing:"0.1em" }}>UPCOMING · ★ = VANDENBERG SFB (100km N of SD)</span>
      </div>
      {lList.length>0 ? lList.slice(0,6).map((l,i)=>{
        const t=new Date(l.net);
        const vdb=l.pad?.location?.name?.toLowerCase().includes("vandenberg");
        const days=Math.ceil((t-Date.now())/86400000);
        return (
          <div key={i} style={{ padding:"7px 10px", borderBottom:`1px solid ${T.borderDim}`, background:vdb?T.purpleFog:i%2?T.bgRowAlt:T.bgRow }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:6 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:T.sans, fontSize:9, fontWeight:vdb?500:400, color:vdb?T.purple:T.textPri, lineHeight:1.3 }}>
                  {vdb?"★ ":""}{l.mission?.name||l.name?.split("|")[0].trim()}
                </div>
                <div style={{ fontFamily:T.mono, fontSize:7, color:T.textDim, marginTop:2 }}>
                  {l.rocket?.configuration?.name} · {l.pad?.location?.name?.split(",")[0]}
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontFamily:T.mono, fontSize:11, color:days<=1?T.orange:T.amber }}>{days<=0?"TODAY":days===1?"TOMORROW":`T−${days}d`}</div>
                <div style={{ fontFamily:T.mono, fontSize:7, color:T.textDim }}>{t.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
              </div>
            </div>
          </div>
        );
      }) : (
        <div style={{ padding:20, textAlign:"center", fontFamily:T.sans, fontSize:9, color:T.textDim }}>
          {st.launches==="error"?"LAUNCH LIBRARY UNAVAILABLE":"LOADING LAUNCHES..."}
        </div>
      )}
    </Panel>

    {/* ── SDO SOLAR IMAGE ── */}
    <Panel title="Solar Imagery" src="NASA SDO · AIA 193Å · ~12s cadence" accent={T.orange} status="ok" noPad>
      <div style={{ background:T.bgScope }}>
        <img src="https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0193.jpg" alt="SDO AIA 193"
          style={{ width:"100%", display:"block" }}
          onError={e=>{e.target.style.display="none";}}
        />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0, borderTop:`1px solid ${T.borderDim}` }}>
        {[["AIA 193Å","Corona 1.5MK",T.orange],["AIA 171Å","Loops 0.6MK",T.blue],["AIA 304Å","Chromosphere",T.red],["HMI Mag","Magnetogram",T.amber]].map(([b,d,c],i)=>(
          <div key={i} style={{ padding:"5px 8px", background:i%2?T.bgRowAlt:T.bgRow, borderBottom:`1px solid ${T.borderDim}`, borderRight:i%2===0?`1px solid ${T.borderDim}`:"none" }}>
            <div style={{ fontFamily:T.mono, fontSize:8, color:c }}>{b}</div>
            <div style={{ fontFamily:T.sans, fontSize:7, color:T.textDim }}>{d}</div>
          </div>
        ))}
      </div>
    </Panel>

    {/* ── GOES-18 ── */}
    <Panel title="GOES-18 West" src="NOAA NESDIS · GeoColor · Pacific SW" accent={T.blue} status="ok" noPad>
      <div style={{ background:T.bgScope }}>
        <img src="https://cdn.star.nesdis.noaa.gov/GOES18/ABI/SECTOR/psw/GEOCOLOR/latest.jpg" alt="GOES-18"
          style={{ width:"100%", display:"block" }}
          onError={e=>{
            e.target.src="https://cdn.star.nesdis.noaa.gov/GOES18/ABI/CONUS/GEOCOLOR/1250x750.jpg";
            e.target.onerror=ev=>{ev.target.style.display="none";};
          }}
        />
      </div>
      <Row label="Coverage"   value="SD / Baja / E. Pacific" mono={false} />
      <Row label="Product"    value="GeoColor (VIS+IR)" mono={false} alt />
      <Row label="Cadence"    value="5–10 min" />
      <Row label="Sector"     value="PSW (Pacific SW)" mono={false} alt />
    </Panel>

    {/* ── SYSTEM STATUS ── */}
    <Panel title="System Status" src="Phase 0 · Remote Sources" accent={T.orange} status="ok" noPad>
      <StatusLine label="Open-Meteo Weather"     src="api.open-meteo.com"                         status={st.wx}      color={T.blue}   />
      <StatusLine label="DSCOVR/ACE Mag Field"   src="services.swpc.noaa.gov/solar-wind/mag"      status={st.mag}     color={T.orange} />
      <StatusLine label="DSCOVR/ACE Plasma"      src="services.swpc.noaa.gov/solar-wind/plasma"   status={st.plasma}  color={T.orange} />
      <StatusLine label="NOAA Kp / F10.7"        src="services.swpc.noaa.gov/k-index"             status={st.kp}      color={T.amber}  />
      <StatusLine label="NASA NEO / CNEOS"        src="api.nasa.gov/neo (DEMO_KEY)"                status={st.neo}     color={T.purple} />
      <StatusLine label="USGS Seismic FDSN"       src="earthquake.usgs.gov/fdsnws"                 status={st.quakes}  color={T.green}  />
      <StatusLine label="Launch Library 2"        src="ll.thespacedevs.com"                        status={st.launches}color={T.purple} />
      <StatusLine label="NASA SDO Imagery"        src="sdo.gsfc.nasa.gov (static img)"             status="ok"         color={T.orange} />
      <StatusLine label="NOAA GOES-18"            src="cdn.star.nesdis.noaa.gov (static img)"      status="ok"         color={T.blue}   />
      <StatusLine label="RTL-SDR ADS-B Local"     src="Phase 1 — hardware required"               status="pending"    color={T.textDim}/>
      <StatusLine label="Met Station Local"       src="Phase 3 — Davis Vantage Pro"               status="pending"    color={T.textDim}/>
      <StatusLine label="Infrasonic / Geophone"   src="Phase 4 — RME UCX II"                      status="pending"    color={T.textDim}/>
      <div style={{ padding:"8px 10px", background:T.bgHeader, borderTop:`1px solid ${T.border}` }}>
        <div style={{ fontFamily:T.sans, fontSize:7, color:T.textDim, letterSpacing:"0.1em" }}>
          NEXT MILESTONE · PHASE 1 — RTL-SDR ADS-B<br/>
          <span style={{ color:T.orangeDim }}>Requires 30 days Phase 0 uptime · no manual intervention</span>
        </div>
      </div>
    </Panel>

  </div>

  {/* ═══ FOOTER ═══ */}
  <div style={{ marginTop:10, padding:"8px 14px", background:T.bgPanel, border:`1px solid ${T.border}`, borderLeft:`3px solid ${T.borderHi}`, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:6 }}>
    {[
      "PROYECTO ATHENA · FASE 0 · REV 3.0",
      "NODE: 32.67°N 117.10°W · NATIONAL CITY / SD",
      `AUTO-REFRESH: 5 MIN · ${updated?updated.toLocaleString("en-US"):"INITIALIZING"}`,
    ].map((s,i)=>(
      <span key={i} style={{ fontFamily:T.mono, fontSize:7, color:T.textDim, letterSpacing:"0.1em" }}>{s}</span>
    ))}
  </div>

</div>
```

);
}
