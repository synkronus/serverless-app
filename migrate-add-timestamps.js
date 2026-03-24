/**
 * Migration script to add createdAt timestamps to existing records
 * Run once: node migrate-add-timestamps.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function addTimestampsToExistingRecords() {
  try {
    console.log('🔄 Starting migration: Adding timestamps to existing records...\n');
    
    const snapshot = await db.collection('estudiantes').get();
    
    if (snapshot.empty) {
      console.log('❌ No documents found in estudiantes collection');
      return;
    }
    
    console.log(`📊 Found ${snapshot.size} documents\n`);
    
    const batch = db.batch();
    let updateCount = 0;
    let skipCount = 0;
    
    // Use a base timestamp and increment for each record
    // This ensures older records get older timestamps
    const baseTimestamp = new Date('2024-01-01T00:00:00Z');
    
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      
      // Only update if createdAt doesn't exist
      if (!data.createdAt) {
        const timestamp = new Date(baseTimestamp.getTime() + (index * 1000 * 60 * 60)); // 1 hour apart
        batch.update(doc.ref, {
          createdAt: timestamp.toISOString()
        });
        updateCount++;
        console.log(`✅ Will update: ${data.nombre} ${data.apellido} (${doc.id})`);
      } else {
        skipCount++;
        console.log(`⏭️  Skipping: ${data.nombre} ${data.apellido} (already has timestamp)`);
      }
    });
    
    if (updateCount > 0) {
      await batch.commit();
      console.log(`\n✅ Migration completed successfully!`);
      console.log(`   - Updated: ${updateCount} records`);
      console.log(`   - Skipped: ${skipCount} records`);
    } else {
      console.log(`\n✅ All records already have timestamps. No updates needed.`);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
addTimestampsToExistingRecords()
  .then(() => {
    console.log('\n🎉 Migration script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

