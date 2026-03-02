import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://znfwwwcjkjglgdudwnnq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU1MzE4MCwiZXhwIjoyMDg0MTI5MTgwfQ.ubOPwOz_06iT_7u_BIp31_1eiSbNr-a5m0xES70h_R0"
);

async function fetchAll(table, selectCols, filters) {
  let allData = [];
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    let query = supabase.from(table).select(selectCols).range(offset, offset + pageSize - 1);
    if (filters) {
      for (const f of filters) {
        if (f.type === "not_null") query = query.not(f.col, "is", null);
        if (f.type === "eq") query = query.eq(f.col, f.val);
      }
    }
    const { data, error } = await query;
    if (error) { console.error("Error:", error.message); break; }
    if (!data || data.length === 0) break;
    allData = allData.concat(data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return allData;
}

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
  // Get ALL data_source values
  const allSources = await fetchAll("schools", "data_source", [{ type: "not_null", col: "data_source" }]);
  const sourceCounts = {};
  allSources.forEach(r => { sourceCounts[r.data_source] = (sourceCounts[r.data_source] || 0) + 1; });
  console.log("=== DISTINCT DATA SOURCES (ALL) ===");
  Object.entries(sourceCounts).sort((a,b) => b[1]-a[1]).forEach(([s, c]) => {
    console.log("  " + s + ": " + c + " schools");
  });
  console.log("  Total schools with data_source: " + allSources.length);
  console.log();

  // 1. Schrole schools
  console.log("=== 1. SCHROLE-SOURCE SCHOOLS (3 with slugs) ===\n");
  const schroleKey = Object.keys(sourceCounts).find(s => s.toLowerCase().includes("schrole"));
  if (schroleKey) {
    const { data } = await supabase
      .from("schools")
      .select("name, slug, country_name, accreditations, programmes, website_url, mission_statement")
      .eq("data_source", schroleKey)
      .not("slug", "is", null)
      .limit(3);
    if (data && data.length > 0) data.forEach(printSchool);
    else console.log("No schrole schools with slugs found.\n");
  } else {
    console.log("No schrole data_source found in the database.");
    console.log("Available sources: " + Object.keys(sourceCounts).join(", "));
    console.log();
  }

  // 2. Teacher Horizons schools - get 3 with the most data
  console.log("=== 2. TEACHER HORIZONS-SOURCE SCHOOLS (3 with slugs) ===\n");
  const { data: th } = await supabase
    .from("schools")
    .select("name, slug, country_name, accreditations, programmes, website_url, mission_statement")
    .eq("data_source", "teacher_horizons")
    .not("slug", "is", null)
    .not("accreditations", "is", null)
    .limit(3);
  if (th && th.length > 0) {
    th.forEach(printSchool);
  } else {
    // Fall back to any TH school with slug
    const { data: th2 } = await supabase
      .from("schools")
      .select("name, slug, country_name, accreditations, programmes, website_url, mission_statement")
      .eq("data_source", "teacher_horizons")
      .not("slug", "is", null)
      .limit(3);
    if (th2 && th2.length > 0) {
      console.log("(No TH schools with accreditations; showing basic TH schools)\n");
      th2.forEach(printSchool);
    } else {
      console.log("No teacher_horizons schools with slugs found.\n");
    }
  }

  // 3. Accreditation values - fetch ALL
  console.log("=== 3. ACCREDITATION VALUES NOT COVERED BY BADGES ===\n");
  const knownBadges = new Set([
    "IBO", "CIS", "WASC", "NEASC", "MSA", "Cognia", "COBIS", "BSO",
    "ECIS", "EARCOS", "Cambridge", "Edexcel", "AP"
  ]);

  const allAccred = await fetchAll("schools", "accreditations", [{ type: "not_null", col: "accreditations" }]);
  const allAccredValues = new Set();
  const accredCounts = {};
  allAccred.forEach(row => {
    if (Array.isArray(row.accreditations)) {
      row.accreditations.forEach(v => {
        allAccredValues.add(v);
        accredCounts[v] = (accredCounts[v] || 0) + 1;
      });
    }
  });

  console.log("Total schools with accreditations: " + allAccred.length);
  console.log("Total distinct accreditation values: " + allAccredValues.size);
  console.log("\nAll accreditation values with counts:");
  [...allAccredValues].sort().forEach(v => {
    const badge = knownBadges.has(v) ? " [BADGE EXISTS]" : " [NO BADGE]";
    console.log("  \"" + v + "\": " + accredCounts[v] + " schools" + badge);
  });

  // 4. Country name duplicates - fetch ALL
  console.log("\n=== 4. COUNTRY NAME DUPLICATES ===\n");
  const allCountries = await fetchAll("schools", "country_name", [{ type: "not_null", col: "country_name" }]);
  const countMap = {};
  allCountries.forEach(r => { countMap[r.country_name] = (countMap[r.country_name] || 0) + 1; });

  const dupeGroups = [
    { label: "US", variants: ["United States", "United States of America", "USA", "US"] },
    { label: "UK", variants: ["United Kingdom", "UK", "England", "Great Britain"] },
    { label: "UAE", variants: ["United Arab Emirates", "UAE"] },
    { label: "South Korea", variants: ["South Korea", "Korea, Republic of", "Republic of Korea", "Korea"] },
    { label: "Brunei", variants: ["Brunei", "Brunei Darussalam"] },
    { label: "Czech", variants: ["Czech Republic", "Czechia"] },
    { label: "Congo", variants: ["Congo", "Democratic Republic of the Congo", "Republic of the Congo"] },
    { label: "Laos", variants: ["Laos", "Lao PDR"] },
    { label: "Myanmar", variants: ["Myanmar", "Burma", "Myanmar (Burma)"] },
    { label: "Tanzania", variants: ["Tanzania", "United Republic of Tanzania"] },
    { label: "Eswatini", variants: ["Eswatini", "Swaziland"] },
    { label: "Timor-Leste", variants: ["Timor-Leste", "East Timor"] },
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
  console.log("Total schools with country_name: " + allCountries.length);
  console.log("\nFull country list with counts:");
  sorted.forEach(c => console.log("  " + c + ": " + countMap[c]));
}

run().catch(console.error);
