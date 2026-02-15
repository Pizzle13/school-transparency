const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://znfwwwcjkjglgdudwnnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTMxODAsImV4cCI6MjA4NDEyOTE4MH0.AYJuOCdDcbQBkB_BHxskbsZPnrXesWnIAkrFp_VlK-E'
);

async function cleanupDuplicates() {
  const cityId = '6667f0e7-f9c0-439d-abe1-029ad8f45093';

  console.log('🧹 Starting duplicate cleanup for HCMC...');
  console.log('====================================================');

  // First, check current status
  console.log('📊 Current status before cleanup:');
  const { data: beforeCount, error: beforeError } = await supabase
    .from('local_intel_data')
    .select('id, created_at, category')
    .eq('city_id', cityId);

  if (beforeError) {
    console.error('❌ Error checking current data:', beforeError.message);
    return;
  }

  console.log(`Total records before cleanup: ${beforeCount?.length || 0}`);

  // Group by date to see old vs new
  const oldRecords = beforeCount?.filter(r => new Date(r.created_at) < new Date('2026-01-25')) || [];
  const newRecords = beforeCount?.filter(r => new Date(r.created_at) >= new Date('2026-01-25')) || [];

  console.log(`Old records (before 2026-01-25): ${oldRecords.length}`);
  console.log(`New records (2026-01-25 and after): ${newRecords.length}`);

  if (oldRecords.length === 0) {
    console.log('✅ No old records found - no cleanup needed!');
    return;
  }

  // Attempt to delete old records
  console.log('\n🗑️ Attempting to delete old records...');
  const { data: deleteResult, error: deleteError } = await supabase
    .from('local_intel_data')
    .delete()
    .eq('city_id', cityId)
    .lt('created_at', '2026-01-25');

  if (deleteError) {
    console.error('❌ Failed to delete old records:', deleteError.message);
    console.log('\n💡 This is likely due to Row Level Security permissions.');
    console.log('   You\'ll need to run this in Supabase SQL Editor instead:');
    console.log(`
DELETE FROM local_intel_data
WHERE city_id = '${cityId}'
AND created_at < '2026-01-25';
    `);
    return;
  }

  console.log('✅ Successfully deleted old records!');

  // Verify the cleanup
  console.log('\n✅ Verifying cleanup results:');
  const { data: afterCount, error: afterError } = await supabase
    .from('local_intel_data')
    .select('id, created_at, category')
    .eq('city_id', cityId);

  if (afterError) {
    console.error('❌ Error checking results:', afterError.message);
    return;
  }

  console.log(`Total records after cleanup: ${afterCount?.length || 0}`);

  // Group by category to show final result
  if (afterCount && afterCount.length > 0) {
    const categories = {};
    afterCount.forEach(record => {
      const category = record.category;
      if (!categories[category]) categories[category] = [];
      categories[category].push(record);
    });

    console.log('\n📋 Final records by category:');
    Object.keys(categories).forEach(category => {
      console.log(`  ✅ ${category}: ${categories[category].length} records`);
    });
  }

  console.log('\n🎉 Cleanup completed successfully!');
}

cleanupDuplicates().catch(console.error);