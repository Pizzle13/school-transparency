import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://znfwwwcjkjglgdudwnnq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTMxODAsImV4cCI6MjA4NDEyOTE4MH0.AYJuOCdDcbQBkB_BHxskbsZPnrXesWnIAkrFp_VlK-E"
);

async function main() {
  console.log("=== COUNTRY DATA INVESTIGATION ===");
  console.log("");

  // 1. Count schools with country_name populated
  {
    const { count, error } = await supabase
      .from("schools")
      .select("*", { count: "exact", head: true })
      .not("country_name", "is", null)
      .neq("country_name", "");
    console.log("1. Schools with country_name populated: " + count);
    if (error) console.error("   Error:", error.message);
  }

  // 2. Count schools with country_code populated
  {
    const { count, error } = await supabase
      .from("schools")
      .select("*", { count: "exact", head: true })
      .not("country_code", "is", null)
      .neq("country_code", "");
    console.log("2. Schools with country_code populated: " + count);
    if (error) console.error("   Error:", error.message);
  }

  // 3. Distinct country_name values
  {
    const allNames = [];
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from("schools")
        .select("country_name")
        .not("country_name", "is", null)
        .neq("country_name", "")
        .range(from, from + 999);
      if (error) { console.error("Error:", error.message); break; }
      allNames.push(...data.map(r => r.country_name));
      if (data.length < 1000) break;
      from += 1000;
    }
    const distinctNames = [...new Set(allNames)].sort();
    console.log("3. Distinct country_name values: " + distinctNames.length);
  }

  // 4. Distinct country_code values
  {
    const allCodes = [];
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from("schools")
        .select("country_code")
        .not("country_code", "is", null)
        .neq("country_code", "")
        .range(from, from + 999);
      if (error) { console.error("Error:", error.message); break; }
      allCodes.push(...data.map(r => r.country_code));
      if (data.length < 1000) break;
      from += 1000;
    }
    const distinctCodes = [...new Set(allCodes)].sort();
    console.log("4. Distinct country_code values: " + distinctCodes.length);
  }

  // 5. Schools with country_code but NO country_name
  {
    console.log("");
    console.log("5. Sample schools with country_code but NO country_name:");
    const { data: d1 } = await supabase
      .from("schools")
      .select("name, country_code, country_name, slug, data_source")
      .not("country_code", "is", null)
      .neq("country_code", "")
      .is("country_name", null)
      .limit(5);
    if (d1 && d1.length > 0) {
      console.log("   (country_name IS NULL):");
      d1.forEach(s => console.log("   - " + s.name + " | code: " + s.country_code + " | source: " + s.data_source));
    }
    const { data: d2 } = await supabase
      .from("schools")
      .select("name, country_code, country_name, slug, data_source")
      .not("country_code", "is", null)
      .neq("country_code", "")
      .eq("country_name", "")
      .limit(5);
    if (d2 && d2.length > 0) {
      console.log("   (country_name is empty string):");
      d2.forEach(s => console.log("   - " + s.name + " | code: " + s.country_code + " | source: " + s.data_source));
    }
    if ((!d1 || d1.length === 0) && (!d2 || d2.length === 0)) {
      console.log("   None found - all schools with country_code also have country_name");
    }
  }

  // 6. Schools with NEITHER
  {
    console.log("");
    console.log("6. Sample schools with NEITHER country_code NOR country_name:");
    const { data } = await supabase
      .from("schools")
      .select("name, data_source, slug, country_name, country_code")
      .is("country_name", null)
      .limit(20);
    const filtered = (data || []).filter(s => !s.country_code || s.country_code === "");
    console.log("   Found in sample: " + filtered.length);
    filtered.slice(0, 5).forEach(s =>
      console.log("   - " + s.name + " | source: " + s.data_source + " | slug: " + s.slug)
    );
    const { count: nullCount } = await supabase
      .from("schools")
      .select("*", { count: "exact", head: true })
      .is("country_name", null);
    const { count: emptyCount } = await supabase
      .from("schools")
      .select("*", { count: "exact", head: true })
      .eq("country_name", "");
    console.log("   Total with country_name IS NULL: " + nullCount);
    console.log("   Total with country_name = empty string: " + emptyCount);
  }

  // 7. ALL distinct country_name values
  {
    console.log("");
    console.log("7. ALL distinct country_name values:");
    const allNames = [];
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from("schools")
        .select("country_name")
        .not("country_name", "is", null)
        .neq("country_name", "")
        .range(from, from + 999);
      if (error) { console.error("Error:", error.message); break; }
      allNames.push(...data.map(r => r.country_name));
      if (data.length < 1000) break;
      from += 1000;
    }
    const distinctNames = [...new Set(allNames)].sort();
    console.log("   Total distinct: " + distinctNames.length);
    distinctNames.forEach((name, i) => {
      const num = String(i + 1).padStart(3, " ");
      console.log("   " + num + ". " + name);
    });
  }

  // 8. Count by data_source
  {
    console.log("");
    console.log("8. Schools by data_source:");
    const allSources = [];
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from("schools")
        .select("data_source")
        .range(from, from + 999);
      if (error) { console.error("Error:", error.message); break; }
      allSources.push(...data.map(r => r.data_source));
      if (data.length < 1000) break;
      from += 1000;
    }
    const sourceCounts = {};
    allSources.forEach(s => {
      const key = s || "(null)";
      sourceCounts[key] = (sourceCounts[key] || 0) + 1;
    });
    Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([source, count]) => {
        console.log("   " + source + ": " + count);
      });
  }

  // 9. Country_name populated by data_source
  {
    console.log("");
    console.log("9. Country_name populated by data_source:");
    const allRows = [];
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from("schools")
        .select("data_source, country_name")
        .range(from, from + 999);
      if (error) { console.error("Error:", error.message); break; }
      allRows.push(...data);
      if (data.length < 1000) break;
      from += 1000;
    }
    const stats = {};
    allRows.forEach(r => {
      const source = r.data_source || "(null)";
      if (!stats[source]) stats[source] = { total: 0, withCountry: 0 };
      stats[source].total++;
      if (r.country_name && r.country_name !== "") stats[source].withCountry++;
    });
    Object.entries(stats)
      .sort((a, b) => b[1].total - a[1].total)
      .forEach(([source, s]) => {
        const pct = ((s.withCountry / s.total) * 100).toFixed(1);
        console.log("   " + source + ": " + s.withCountry + "/" + s.total + " (" + pct + "%)");
      });
  }

  console.log("");
  console.log("=== DONE ===");
}

main().catch(console.error);
