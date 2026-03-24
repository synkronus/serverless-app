const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] ? values[idx].trim() : '';
    });
    rows.push(obj);
  }
  return rows;
}

async function importData() {
  try {
    const csvPath = path.join(__dirname, 'dbSet', 'Students Social Media Addiction.csv');
    const text = fs.readFileSync(csvPath, 'utf-8');
    const rows = parseCSV(text);

    console.log(`Parsed ${rows.length} rows from CSV`);

    const BATCH_LIMIT = 500;
    let batchCount = 0;
    let batch = db.batch();
    let total = 0;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const doc = {
        Student_ID: parseInt(r.Student_ID) || 0,
        Age: parseInt(r.Age) || 0,
        Gender: r.Gender || '',
        Academic_Level: r.Academic_Level || '',
        Country: r.Country || '',
        Avg_Daily_Usage_Hours: parseFloat(r.Avg_Daily_Usage_Hours) || 0,
        Most_Used_Platform: r.Most_Used_Platform || '',
        Affects_Academic_Performance: r.Affects_Academic_Performance || '',
        Sleep_Hours_Per_Night: parseFloat(r.Sleep_Hours_Per_Night) || 0,
        Mental_Health_Score: parseInt(r.Mental_Health_Score) || 0,
        Relationship_Status: r.Relationship_Status || '',
        Conflicts_Over_Social_Media: parseInt(r.Conflicts_Over_Social_Media) || 0,
        Addicted_Score: parseInt(r.Addicted_Score) || 0,
        createdAt: new Date(Date.now() + i).toISOString(),
      };

      const docRef = db.collection('social_media_addiction').doc();
      batch.set(docRef, doc);
      batchCount++;
      total++;

      if (batchCount === BATCH_LIMIT) {
        await batch.commit();
        console.log(`Committed batch — ${total} rows so far`);
        batch = db.batch();
        batchCount = 0;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
      console.log(`Committed final batch — ${total} rows total`);
    }

    const snapshot = await db.collection('social_media_addiction').get();
    console.log(`Total documents in collection: ${snapshot.size}`);

    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();
