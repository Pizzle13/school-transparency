import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://znfwwwcjkjglgdudwnnq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU1MzE4MCwiZXhwIjoyMDg0MTI5MTgwfQ.ubOPwOz_06iT_7u_BIp31_1eiSbNr-a5m0xES70h_R0"
);

const fields = "name, slug, country_name, accreditations, programmes, website_url, mission_statement";

function printSchool(s, i) {
  console.log("[" + (i+1) + "] " + s.name);
  console.log("    slug: " + s.slug);
  console.log("    country: " + s.country_name);
  console.log("    accreditations: " + JSON.stringify(s.accreditations));
  console.log("    programmes: " + JSON.stringify(s.programmes));
  console.log("    website: " + s.website_url);
  const mission = s.mission_statement ? s.mission_statement.substring(0, 150) + "..." : null;
  console.log("    mission: " + mission);
  console.log();
}

async function run() {
  // Distinct data sources
  const { data: srcSample } = await supabase
    .from("schools")
    .select("data_source")
    .not("data_source", "is", null);
  const distinctSources = [...new Set(srcSample.map(r => r.data_source))];
  console.log("=== DISTINCT DATA SOURCES ===");
  for (const s of distinctSources) {
    const count = srcSample.filter(r => r.data_source === s).length;
    console.log("  " + s + ": " + count + " schools");
  }
  console.log();

  // 1. Schrole schools
  console.log("=== 1. SCHROLE-SOURCE SCHOOLS (3 with slugs) ===\n");
  const schroleSource = distinctSources.find(s => s.toLowerCase().includes("schrole"));
  if (schroleSource) {
    const { data } = await supabase
      .from("schools")
      .select(fields)
      .eq("data_source", schroleSource)
      .not("slug", "is", null)
      .limit(3);
    if (data && data.length > 0) data.forEach(printSchool);
    else console.log("No schrole schools with slugs found.\n");
  } else {
    console.log("No schrole data_source found. Available sources: " + distinctSources.join(", ") + "\n");
  }

  // 2. Teacher Horizons schools
  console.log("=== 2. TEACHER HORIZONS-SOURCE SCHOOLS (3 with slugs) ===\n");
  const { data: th } = await supabase
    .from("schools")
    .select(fields)
    .eq("data_source", "teacher_horizons")
    .not("slug", "is", null)
    .limit(3);
  if (th && th.length > 0) th.forEach(printSchool);
  else console.log("No teacher_horizons schools with slugs found.\n");

  // 3. Accreditation values
  console.log("=== 3. ACCREDITATION VALUES NOT COVERED BY BADGES ===\n");
  const knownBadges = new Set([
    "IBO", "CIS", "WASC", "NEASC", "MSA", "Cognia", "COBIS", "BSO",
    "ECIS", "EARCOS", "Cambridge", "Edexcel", "AP"
  ]);

  const { data: accredData } = await supabase
    .from("schools")
    .select("accreditations")
    .not("accreditations", "is", null);

  const allAccredValues = new Set();
  const accredCounts = {};
  accredData.forEach(row => {
    if (Array.isArray(row.accreditations)) {
      row.accreditations.forEach(v => {
        allAccredValues.add(v);
        accredCounts[v] = (accredCounts[v] || 0) + 1;
      });
    }
  });

  console.log("Total distinct accreditation values: " + allAccredValues.size);
  console.log("Schools with accreditations: " + accredData.length);
  console.log("\nAll accreditation values with counts:");
  [...allAccredValues].sort().forEach(v => {
    const badge = knownBadges.has(v) ? " [BADGE EXISTS]" : " [NO BADGE]";
    console.log("  \"" + v + "\": " + accredCounts[v] + " schools" + badge);
  });

  // 4. Country name duplicates
  console.log("\n=== 4. COUNTRY NAME DUPLICATES ===\n");
  const { data: countries } = await supabase
    .from("schools")
    .select("country_name")
    .not("country_name", "is", null);

  const countMap = {};
  countries.forEach(r => {
    countMap[r.country_name] = (countMap[r.country_name] || 0) + 1;
  });

  // Known duplicate groups
  const dupeGroups = [
    { label: "US", variants: ["United States", "United States of America", "USA", "US"] },
    { label: "UK", variants: ["United Kingdom", "UK", "England", "Great Britain"] },
    { label: "UAE", variants: ["United Arab Emirates", "UAE"] },
    { label: "South Korea", variants: ["South Korea", "Korea, Republic of", "Republic of Korea", "Korea"] },
    { label: "Brunei", variants: ["Brunei", "Brunei Darussalam"] },
    { label: "Czech", variants: ["Czech Republic", "Czechia"] },
    { label: "Congo", variants: ["Congo", "Democratic Republic of the Congo", "Republic of the Congo", "Congo, Democratic Republic of the"] },
    { label: "Laos", variants: ["Laos", "Lao PDR"] },
    { label: "Myanmar", variants: ["Myanmar", "Burma", "Myanmar (Burma)"] },
    { label: "Tanzania", variants: ["Tanzania", "United Republic of Tanzania"] },
    { label: "Eswatini", variants: ["Eswatini", "Swaziland"] },
    { label: "Timor-Leste", variants: ["Timor-Leste", "East Timor"] },
    { label: "Ascension", variants: ["Ascension and Tristan da Cunha", "Saint Helena", "Saint Helena, Ascension and Tristan da Cunha"] },
    { label: "Ivory Coast", variants: ["Ivory Coast", "Cote dIvoire"] },
  ];

  console.log("Checking known duplicate patterns:\n");
  let foundDupes = false;
  for (const group of dupeGroups) {
    const found = group.variants.filter(v => countMap[v]);
    if (found.length > 1) {
      foundDupes = true;
      console.log("  ** DUPLICATE: " + group.label + " **");
      found.forEach(v => console.log("     \"" + v + "\": " + countMap[v] + " schools"));
      console.log();
    }
  }
  if (!foundDupes) console.log("  No exact duplicate patterns found among the checked groups.\n");

  // Alphabetically-adjacent near-duplicates
  const sorted = Object.keys(countMap).sort();
  console.log("Checking alphabetically-adjacent near-duplicates:");
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i].toLowerCase().replace(/[^a-z]/g, "");
    const b = sorted[i+1].toLowerCase().replace(/[^a-z]/g, "");
    if (a.startsWith(b) || b.startsWith(a) || (a.length > 4 && b.startsWith(a.substring(0, Math.ceil(a.length * 0.8))))) {
      console.log("  Possible: \"" + sorted[i] + "\" (" + countMap[sorted[i]] + ") vs \"" + sorted[i+1] + "\" (" + countMap[sorted[i+1]] + ")");
    }
  }

  console.log("\nTotal distinct country names: " + sorted.length);
  console.log("\nFull country list with counts:");
  sorted.forEach(c => console.log("  " + c + ": " + countMap[c]));
}

run().catch(console.error);
