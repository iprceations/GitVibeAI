const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not set!');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  const client = await pool.connect();
  try {
    console.log('Connecting to Neon database...');
    
    // Create the table
    await client.query(`
      CREATE TABLE IF NOT EXISTS github_roasts (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        avatar_url TEXT,
        roast_text TEXT NOT NULL,
        vibe_type VARCHAR(255),
        stats JSONB,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Table github_roasts created or already exists!');
    
    // Check if table is empty, maybe seed a funny sample roast for testing
    const countRes = await client.query('SELECT COUNT(*) FROM github_roasts');
    const count = parseInt(countRes.rows[0].count, 10);
    console.log(`Current count of roasts: ${count}`);
    
    if (count === 0) {
      console.log('Seeding initial roast of linus torvalds...');
      await client.query(`
        INSERT INTO github_roasts (username, name, avatar_url, roast_text, vibe_type, stats, likes)
        VALUES (
          'torvalds',
          'Linus Torvalds',
          'https://avatars.githubusercontent.com/u/1024025?v=4',
          'Bhai tumne C me Linux likha aur Git banaya, uske baad kya? Pura career bas logo ki pull requests me gaaliyan dene me nikal diya. Tumhara code toh solid hai, par standard compiler se zyada aggressive tumhara attitude hai. "C++ is rubbish"? Java is "for amateurs"? Thoda chill karo, meditation class join karo aur thoda modern React sikh lo (jk, please dont roast me back).',
          'The C God (Aggressive compiler)',
          '{"secretSuperpower": "Scaring kernel developers", "defenseLevel": 99, "overEngineeringScore": 5, "yapperIndex": 85, "bugsToFeaturesRatio": "1:100000", "favoriteLanguage": "C", "coffeeToCodeRatio": "1 cup : 1000 lines of kernel code"}',
          42
        );
      `);
      console.log('Successfully seeded!');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
