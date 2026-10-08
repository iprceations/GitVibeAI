import { Pool } from 'pg';

let pool: Pool | null = null;

if (process.env.DATABASE_URL) {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      });
    } else {
      if (!(global as any).pgPool) {
        (global as any).pgPool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false,
          },
        });
      }
      pool = (global as any).pgPool;
    }
  } catch (err) {
    console.warn('[GitVibeAI] Warning: PostgreSQL pool initialization failed, using in-memory store:', err);
    pool = null;
  }
} else {
  console.info('[GitVibeAI] DATABASE_URL is not set. Operating in resilient in-memory database mode.');
}

export { pool };

// Resilient in-memory storage for local dev / offline mode
interface InMemRoast {
  id: number;
  username: string;
  name: string;
  avatar_url: string;
  roast_text: string;
  vibe_type: string;
  stats: any;
  likes: number;
  created_at: Date;
}

const TOP_12_SEEDS: InMemRoast[] = [
  {
    id: 1,
    username: 'shikharthakur2404',
    name: 'Shikhar Thakur',
    avatar_url: 'https://avatars.githubusercontent.com/u/89398121?v=4',
    roast_text: `Shikhar, your bio flexes an M.Sc. in International Information Systems in Nürnberg alongside "Former Co-Founder @ FytlY", but your commit log tells a dramatically different story: you have turned your entire GitHub into an industrial-scale job hunt automation factory!

Between "cover-letter-printer-9000" (an n8n + Gemini pipeline to generate domain-bridged cover letters) and "fillbot" (a Chrome extension to auto-fill job applications), you have spent 500 hours overengineering automated workflows just to avoid writing a single manual paragraph to German recruiters. At this point, Gemini is attending your tech screenings and n8n is negotiating your salary!

And when you're not writing AI pipelines to bypass HR, you're building "emergency-mesh-nurnberg" for disaster coordination with 0 stars, followed by "karmic-ledger" to offset the bad karma of spamming 500 tech companies before breakfast. You're following 18 developers while holding onto 4 loyal followers—half of whom are probably your own automated test bots. Vibe check: certified German engineering student coping with job market despair through excessive pipeline architecture! 💀🔥`,
    vibe_type: 'The Job-Hunt Automation Overlord',
    stats: {
      secretSuperpower: 'Automating job applications he never intends to read',
      defenseLevel: 42,
      overEngineeringScore: 92,
      yapperIndex: 84,
      bugsToFeaturesRatio: '14:1 AI Hallucinations',
      favoriteLanguage: 'TypeScript',
      coffeeToCodeRatio: '4 German coffees : 1 n8n webhook'
    },
    likes: 96,
    created_at: new Date(Date.now() - 3600000 * 2)
  },
  {
    id: 2,
    username: 'torvalds',
    name: 'Linus Torvalds',
    avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    roast_text: `Linus, you built Linux in C and created Git out of sheer spite, but what has happened since? You've spent the last two decades treating kernel mailing list pull requests like an extreme demolition derby.

Your code is bulletproof, but your attitude is more aggressive than an unoptimized compiler throwing fatal segmentation faults. "C++ is rubbish"? Java is "for amateurs"? Maybe take a breath, sign up for a yoga retreat, and write a single harmless React component (just kidding, please don't roast me back).

Nobody on GitHub even dares fork your repos out of pure terror that a kernel panic will materialize in their living room. 💀🔥`,
    vibe_type: 'The C God (Aggressive Compiler)',
    stats: {
      secretSuperpower: 'Scaring kernel developers with words',
      defenseLevel: 99,
      overEngineeringScore: 5,
      yapperIndex: 85,
      bugsToFeaturesRatio: '1:100000',
      favoriteLanguage: 'C',
      coffeeToCodeRatio: '1 cup : 1000 lines of kernel code'
    },
    likes: 89,
    created_at: new Date(Date.now() - 3600000 * 24 * 2)
  },
  {
    id: 3,
    username: 'shadcn',
    name: 'shadcn',
    avatar_url: 'https://avatars.githubusercontent.com/u/124599?v=4',
    roast_text: `Convinced the entire world that copy-pasting raw component code directly into their own codebase is 'modern architecture' rather than dependency hell.

Single-handedly made every single AI SaaS startup on earth look identical with black backgrounds, zinc borders, and 0.625rem radius.

Nobody knows your true identity, but everyone's navbar and button components belong to you.`,
    vibe_type: 'Copy-Paste Component Wizard',
    stats: {
      secretSuperpower: 'Converting npm install into Ctrl+C / Ctrl+V',
      defenseLevel: 96,
      overEngineeringScore: 12,
      yapperIndex: 20,
      bugsToFeaturesRatio: '0:1 Tailwind utility',
      favoriteLanguage: 'TypeScript',
      coffeeToCodeRatio: '1 cold brew : 1 pristine UI component'
    },
    likes: 78,
    created_at: new Date(Date.now() - 3600000 * 10)
  },
  {
    id: 4,
    username: 'gaearon',
    name: 'Dan Abramov',
    avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',
    roast_text: `Invented Redux just so developers could write 45 boilerplate files and 8 action creators to increment a counter button by 1!

Then spent 5 years writing 4000-word philosophical essays about mental models, why useEffect is misunderstood, and how JavaScript closures actually work under the quantum realm.

Still asks community if centering a div is truly solved. Vibe check: Overthought every state machine known to mankind.`,
    vibe_type: 'State Management Overthinker',
    stats: {
      secretSuperpower: 'Explaining useEffect for 6 consecutive hours',
      defenseLevel: 88,
      overEngineeringScore: 94,
      yapperIndex: 78,
      bugsToFeaturesRatio: '1:42 re-renders',
      favoriteLanguage: 'JavaScript',
      coffeeToCodeRatio: '3 matchas : 1 state atom'
    },
    likes: 64,
    created_at: new Date(Date.now() - 3600000 * 18)
  },
  {
    id: 5,
    username: 'yyx990803',
    name: 'Evan You',
    avatar_url: 'https://avatars.githubusercontent.com/u/499550?v=4',
    roast_text: `Looked at React and Angular, sighed deeply, and decided to reinvent the entire JavaScript tooling universe while sipping green tea.

Releases a build tool that is 10x faster every 2 years just to invalidate everyone's webpack and configuration setups.

Code is so reactive it updates before the developer even thinks of typing the variable!`,
    vibe_type: 'Reactivity Evangelist',
    stats: {
      secretSuperpower: 'Benchmarking Vite against Webpack every 48 hours',
      defenseLevel: 91,
      overEngineeringScore: 40,
      yapperIndex: 45,
      bugsToFeaturesRatio: '0:999 builds',
      favoriteLanguage: 'TypeScript',
      coffeeToCodeRatio: '2 espressos : 0 bundle size'
    },
    likes: 52,
    created_at: new Date(Date.now() - 3600000 * 4)
  },
  {
    id: 6,
    username: 'iprceations',
    name: 'Pushkar Sharma',
    avatar_url: 'https://avatars.githubusercontent.com/u/206268019?v=4',
    roast_text: `Pushkar built GitVibeAI specifically to expose 0-star repos, overengineering, and commit sins of every engineer on earth, but who roasts the roaster?

You spent days perfecting a 60 FPS HTML5 Git constellation canvas and a zero-dependency PDF 1.4 stream generator just so developers could print their own humiliation in 300 DPI!

Between maintaining pdfmax.in and engineering full-stack AI roasters with sub-second response times, you are one bug away from automating yourself out of your own creation. Vibe check: Certified digital reality checker whose code is cleaner than his mercy! 💀🔥`,
    vibe_type: 'The Reality-Check Architect',
    stats: {
      secretSuperpower: 'Exposing everyone\'s commit history with zero remorse',
      defenseLevel: 86,
      overEngineeringScore: 78,
      yapperIndex: 46,
      bugsToFeaturesRatio: '0:1 Production Build',
      favoriteLanguage: 'TypeScript',
      coffeeToCodeRatio: '3 cold brews : 1 Next.js canvas pipeline'
    },
    likes: 48,
    created_at: new Date(Date.now() - 3600000 * 6)
  },
  {
    id: 7,
    username: 'leerob',
    name: 'Lee Robinson',
    avatar_url: 'https://github.com/leerob.png',
    roast_text: `Has recorded 400 YouTube videos explaining Next.js App Router caching, Server Actions, and Partial Prerendering, yet developers still wake up in cold sweats seeing "Unhandled Runtime Error". Has dedicated his entire life to convincing people that static sites are dynamic and dynamic sites are static!`,
    vibe_type: 'App Router Propagandist',
    stats: {
      secretSuperpower: 'Explaining PPR before coffee',
      defenseLevel: 82,
      overEngineeringScore: 75,
      yapperIndex: 70,
      bugsToFeaturesRatio: '1:5 Server Actions',
      favoriteLanguage: 'TypeScript',
      coffeeToCodeRatio: '2 pour-overs : 1 RFC'
    },
    likes: 44,
    created_at: new Date(Date.now() - 3600000 * 12)
  },
  {
    id: 8,
    username: 'rauchg',
    name: 'Guillermo Rauch',
    avatar_url: 'https://github.com/rauchg.png',
    roast_text: `Pioneered Socket.io, then decided milliseconds of latency were an existential crisis. Will tweet "Develop. Preview. Ship." at 3 AM from an airport lounge while his edge functions rewrite reality across 42 global regions.`,
    vibe_type: 'Edge Network Overlord',
    stats: {
      secretSuperpower: 'Deploying edge compute in 3 milliseconds',
      defenseLevel: 94,
      overEngineeringScore: 88,
      yapperIndex: 58,
      bugsToFeaturesRatio: '0:1 Edge Route',
      favoriteLanguage: 'JavaScript',
      coffeeToCodeRatio: '1 cortado : 1 edge cluster'
    },
    likes: 40,
    created_at: new Date(Date.now() - 3600000 * 20)
  },
  {
    id: 9,
    username: 'rich-harris',
    name: 'Rich Harris',
    avatar_url: 'https://github.com/rich-harris.png',
    roast_text: `Looked at Virtual DOM reconciliation diff algorithms, called them pure madness, and built a compiler to obliterate them. Spends keynotes showing 60fps animations while throwing polite British shade at React's bundle size!`,
    vibe_type: 'Virtual-DOM Abolitionist',
    stats: {
      secretSuperpower: 'Deleting Virtual DOM from existence',
      defenseLevel: 89,
      overEngineeringScore: 45,
      yapperIndex: 50,
      bugsToFeaturesRatio: '0:1 Svelte rune',
      favoriteLanguage: 'JavaScript',
      coffeeToCodeRatio: '2 Earl Grey teas : 0 reconciliation'
    },
    likes: 36,
    created_at: new Date(Date.now() - 3600000 * 28)
  },
  {
    id: 10,
    username: 'sophiebits',
    name: 'Sophie Alpert',
    avatar_url: 'https://github.com/sophiebits.png',
    roast_text: `Maintained React core for years, reviewed 10,000 pull requests, and still won't endorse class components. Knows every single hidden corner case of fiber trees and synthetic events that you pray you never debug in production!`,
    vibe_type: 'Synthetic Event Whisperer',
    stats: {
      secretSuperpower: 'Debugging fibers in raw assembly',
      defenseLevel: 95,
      overEngineeringScore: 50,
      yapperIndex: 30,
      bugsToFeaturesRatio: '0:10000 PRs',
      favoriteLanguage: 'JavaScript',
      coffeeToCodeRatio: '1 iced tea : 5 fiber nodes'
    },
    likes: 33,
    created_at: new Date(Date.now() - 3600000 * 36)
  },
  {
    id: 11,
    username: 't3dotgg',
    name: 'Theo Browne',
    avatar_url: 'https://github.com/t3dotgg.png',
    roast_text: `Claims to just want simplicity, yet created the T3 Stack so beginners could bootstrap 18 modern tools in 3 seconds. Will upload a 40-minute video titled "React is FINISHED" every time a new RFC drops on GitHub!`,
    vibe_type: 'Tech-Drama Speedrunner',
    stats: {
      secretSuperpower: 'Shipping hot takes at 4K resolution',
      defenseLevel: 78,
      overEngineeringScore: 82,
      yapperIndex: 92,
      bugsToFeaturesRatio: '3:1 Hot Takes',
      favoriteLanguage: 'TypeScript',
      coffeeToCodeRatio: '4 cold brews : 1 YouTube rant'
    },
    likes: 30,
    created_at: new Date(Date.now() - 3600000 * 44)
  },
  {
    id: 12,
    username: 'ThePrimeagen',
    name: 'ThePrimeagen',
    avatar_url: 'https://github.com/ThePrimeagen.png',
    roast_text: `Refuses to touch a mouse under penalty of death. Navigates his entire operating system using 14-key Vim macros at 300 words per minute. Will explain why Rust is the supreme evolutionary form of computing while drinking yerba mate at 180 BPM!`,
    vibe_type: 'Neovim Cult Leader',
    stats: {
      secretSuperpower: 'Refusing to touch a mouse for 7 consecutive years',
      defenseLevel: 92,
      overEngineeringScore: 68,
      yapperIndex: 90,
      bugsToFeaturesRatio: '0:1 (blazingly fast crash)',
      favoriteLanguage: 'Rust',
      coffeeToCodeRatio: '8 yerba mates : 1 Lua config'
    },
    likes: 27,
    created_at: new Date(Date.now() - 3600000 * 50)
  }
];

// Dynamic In-Memory store for roasts, initially seeded with top legends.
// When users search & roast profiles, they are saved up to 100 pages (1,200 entries max).
// Older entries are automatically cleared/trimmed once capacity is reached.
const MAX_RECENT_CAPACITY = 1200; // 100 pages * 12 entries
const memoryStore: InMemRoast[] = [...TOP_12_SEEDS];
let nextId = 13;

/**
 * High-performance paginated query for recent victims archive
 */
export async function getRecentPaginated(page = 1, limit = 12, search = '') {
  // Sort by created_at DESC (most recent victims first)
  let list = [...memoryStore].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

  // If search query provided, search across all records
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(r => 
      r.username.toLowerCase().includes(q) ||
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.vibe_type && r.vibe_type.toLowerCase().includes(q))
    );
  }

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validPage - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  const formatted = paginated.map(row => ({
    id: row.id,
    username: row.username,
    name: row.name,
    avatarUrl: row.avatar_url,
    vibeType: row.vibe_type,
    stats: typeof row.stats === 'string' ? JSON.parse(row.stats) : row.stats,
    likes: row.likes,
    createdAt: row.created_at
  }));

  return {
    roasts: formatted,
    total,
    page: validPage,
    pageSize: limit,
    totalPages
  };
}

/**
 * Resilient query handler: executes on PostgreSQL if available,
 * otherwise falls back gracefully to in-memory store.
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (pool) {
    try {
      const client = await pool.connect();
      try {
        const res = await client.query(sql, params);
        return res.rows as T[];
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn('[GitVibeAI] PostgreSQL query error, falling back to in-memory store:', err);
    }
  }

  // In-Memory Fallback Operations
  const normalizedSql = sql.trim().toUpperCase();

  // 1. SELECT ORDER BY likes (Top 12 Leaderboard)
  if (normalizedSql.includes('ORDER BY LIKES')) {
    const sorted = [...memoryStore].sort((a, b) => b.likes - a.likes || b.id - a.id).slice(0, 12);
    return sorted as unknown as T[];
  }

  // 2. SELECT ORDER BY created_at (Recent)
  if (normalizedSql.includes('ORDER BY CREATED_AT')) {
    const sorted = [...memoryStore].sort((a, b) => b.created_at.getTime() - a.created_at.getTime()).slice(0, 12);
    return sorted as unknown as T[];
  }

  // 3. UPDATE likes
  if (normalizedSql.startsWith('UPDATE GITHUB_ROASTS')) {
    const username = (params[0] || '').toLowerCase();
    const item = memoryStore.find(r => r.username.toLowerCase() === username);
    if (item) {
      item.likes += 1;
      return [{ likes: item.likes }] as unknown as T[];
    }
    return [] as unknown as T[];
  }

  // 4. INSERT INTO github_roasts
  if (normalizedSql.startsWith('INSERT INTO GITHUB_ROASTS')) {
    const [username, name, avatar_url, roast_text, vibe_type, statsRaw] = params;
    const cleanUsername = (username || '').toLowerCase();
    const statsObj = typeof statsRaw === 'string' ? JSON.parse(statsRaw) : statsRaw;

    const existingIdx = memoryStore.findIndex(r => r.username.toLowerCase() === cleanUsername);
    if (existingIdx >= 0) {
      memoryStore[existingIdx] = {
        ...memoryStore[existingIdx],
        name: name || memoryStore[existingIdx].name,
        avatar_url: avatar_url || memoryStore[existingIdx].avatar_url,
        roast_text,
        vibe_type,
        stats: statsObj,
        created_at: new Date()
      };
      // Move to top of recent
      const [updated] = memoryStore.splice(existingIdx, 1);
      memoryStore.unshift(updated);
      return [updated] as unknown as T[];
    } else {
      const newRoast: InMemRoast = {
        id: nextId++,
        username: cleanUsername,
        name: name || cleanUsername,
        avatar_url,
        roast_text,
        vibe_type,
        stats: statsObj,
        likes: 0,
        created_at: new Date()
      };
      memoryStore.unshift(newRoast);

      // Auto-clear oldest entries once capacity (100 pages = 1,200 victims) is reached
      if (memoryStore.length > MAX_RECENT_CAPACITY) {
        memoryStore.length = MAX_RECENT_CAPACITY;
      }

      return [newRoast] as unknown as T[];
    }
  }

  return [] as unknown as T[];
}
