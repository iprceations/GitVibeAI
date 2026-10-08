import { NextRequest, NextResponse } from 'next/server';
import { generateObject, gateway } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { query } from '@/lib/db';

function getLanguageModel() {
  if (process.env.OPENAI_API_KEY) {
    return openai('gpt-4o-mini');
  }
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google('gemini-1.5-flash');
  }
  if (process.env.AI_GATEWAY_API_KEY) {
    return gateway('openai/gpt-4o-mini');
  }
  return null;
}

type SpiceLevel = 'mild' | 'spicy' | 'nuclear';

function generateFallbackRoast(profile: any, repos: any[], spiceLevel: SpiceLevel = 'spicy') {
  // Determine primary language
  const languages = repos.map((r: any) => r.language).filter(Boolean);
  const langCount = languages.reduce((acc: any, curr: string) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});
  const primaryLang = Object.keys(langCount).sort((a, b) => langCount[b] - langCount[a])[0] || 'HTML/CSS';

  // Determine archetype based on languages and followers
  let vibeType = "The Ghost Committer";
  let superpower = "Writing try-catch without catching errors";
  let overEngineering = 40;
  let yapperIndex = 35;
  let bugsRatio = "5:1";
  let favLang = primaryLang;
  let coffeeRatio = "3 cups : 1 line of CSS";
  let defense = 50;

  if (profile.followers > 1000) {
    vibeType = "The LinkedIn Influencer";
    superpower = "Writing 10-paragraph posts about a 1-line commit";
    overEngineering = 15;
    yapperIndex = 98;
    bugsRatio = "99:1";
    coffeeRatio = "5 matchas : 0 lines of code";
    defense = 12;
  } else if (primaryLang === 'TypeScript' || primaryLang === 'JavaScript') {
    vibeType = "React Dependency Collector";
    superpower = "Installing 500MB node_modules for a counter button";
    overEngineering = 85;
    yapperIndex = 65;
    bugsRatio = "23:1";
    coffeeRatio = "4 Red Bulls : 1 state-refresh bug";
    defense = 32;
  } else if (primaryLang === 'Python') {
    vibeType = "AI Wrapper 'Architect'";
    superpower = "Copying prompt-engineering templates";
    overEngineering = 45;
    yapperIndex = 75;
    bugsRatio = "10:1";
    coffeeRatio = "1 iced coffee : 2 API keys leaked";
    defense = 45;
  } else if (primaryLang === 'Rust') {
    vibeType = "Memory Safety Cultist";
    superpower = "Explaining lifetimes to developers who just want to ship";
    overEngineering = 95;
    yapperIndex = 80;
    bugsRatio = "0:1 (but it never compiles)";
    coffeeRatio = "1 double shot espresso : 0 working builds";
    defense = 88;
  } else if (primaryLang === 'Go') {
    vibeType = "The Simplicity Extremist";
    superpower = "Writing 'if err != nil' 500 times in a single script";
    overEngineering = 10;
    yapperIndex = 40;
    bugsRatio = "2:1";
    coffeeRatio = "1 black coffee : 1 goroutine leak";
    defense = 75;
  } else if (primaryLang === 'C++' || primaryLang === 'C') {
    vibeType = "Vintage Segment-Faulter";
    superpower = "Leaking memory directly into public production";
    overEngineering = 90;
    yapperIndex = 25;
    bugsRatio = "Infinite:1";
    coffeeRatio = "6 black teas : 1 manual pointer fix";
    defense = 95;
  } else if (primaryLang === 'Java') {
    vibeType = "Enterprise Boilerplate Overlord";
    superpower = "Creating AbstractSingletonProxyFactoryBean for a greeting message";
    overEngineering = 99;
    yapperIndex = 50;
    bugsRatio = "12:1";
    coffeeRatio = "5 filter coffees : 1 NullPointerException";
    defense = 80;
  } else if (primaryLang === 'PHP') {
    vibeType = "Legacy WordPress Archaeologist";
    superpower = "Fixing fatal errors directly inside live FTP server";
    overEngineering = 20;
    yapperIndex = 55;
    bugsRatio = "15:1";
    coffeeRatio = "2 instant coffees : 1 white screen of death";
    defense = 40;
  } else if (primaryLang === 'Dart') {
    vibeType = "Widget Tree Botanist";
    superpower = "Nesting 35 widgets just to add 4px padding";
    overEngineering = 70;
    yapperIndex = 45;
    bugsRatio = "8:1";
    coffeeRatio = "3 cappuccinos : 1 Hot Reload";
    defense = 60;
  }

  // Adjust stats & tones based on spice level
  if (spiceLevel === 'nuclear') {
    overEngineering = Math.min(100, overEngineering + 15);
    yapperIndex = Math.min(100, yapperIndex + 20);
    defense = Math.max(5, defense - 25);
  } else if (spiceLevel === 'mild') {
    defense = Math.min(95, defense + 20);
    overEngineering = Math.max(10, overEngineering - 15);
  }

  // Generate personalized paragraphs
  const hasBio = profile.bio && profile.bio !== 'No bio provided. Busy coding, apparently.';
  
  let bioRoast = '';
  let statsRoast = '';
  let repoRoast = '';
  let finalAdvice = '';

  if (spiceLevel === 'mild') {
    bioRoast = hasBio 
      ? `Bio says: "${profile.bio}". Sounds ambitious and passionate!`
      : `Bio is mysteriously empty — quiet coder vibez!`;
    statsRoast = `Followers: ${profile.followers}, Following: ${profile.following}. Keeping the circle tight and focused on building.`;
    const repoCount = repos.length;
    repoRoast = repoCount > 0 
      ? `Currently managing ${profile.publicRepos} public repositories including "${repos[0].name}". Honest work in progress!`
      : `Getting started with ${profile.publicRepos} repositories — great things take time!`;
    finalAdvice = `Keep pushing code, squash those bugs, and celebrate the small wins! 🚀`;
  } else if (spiceLevel === 'nuclear') {
    bioRoast = hasBio
      ? `Your bio claims: "${profile.bio}". Whoa there, Chief Architect! Are you preparing to launch a deep-space NASA telescope or did you just deploy a cloned Next.js portfolio template? The sheer audacity here is making my compiler throw a fatal stack overflow.`
      : `Bio is completely blank? Pretending you have that mysterious "Staff Principal Architect" aura doesn't change reality. Did writing a single sentence cause an unhandled memory leak?`;
    statsRoast = `Followers: ${profile.followers}, Following: ${profile.following}. Looking at that ratio, it's pretty clear you've been aggressively soliciting follow-backs at every tech meetup you've ever attended.`;
    const repoCount = repos.length;
    if (repoCount > 0) {
      repoRoast = `Stumbling across your repository "${repos[0].name}" (boasting a staggering ${repos[0].stars} stars) was a genuinely emotional experience. Your commit log reads like a cry for help: "update", "temp fix", "pls compile", and "final final v2". Half your repositories never made it past the auto-generated README!`;
    } else {
      repoRoast = `Zero active projects? Is this a GitHub profile or an abandoned digital ghost town?`;
    }
    finalAdvice = `Here's some humble unsolicited advice: Stop binge-learning a new JavaScript framework every single weekend, uninstall the 500 redundant npm dependencies, and try writing some original logic. Otherwise, you're going to spend your entire engineering career copy-pasting ChatGPT prompts into 404 pages! 💀🔥`;
  } else {
    // Default Spicy
    bioRoast = hasBio 
      ? `Your bio boasts: "${profile.bio}". Love the confidence! You're projecting the energy of a Senior Tech Lead running Google's core search infrastructure, but a quick glance at your repositories reveals the exact same tutorial "responsive landing page" everyone built in 2021.`
      : `Left your bio completely empty, huh? Putting "busy building" in invisible ink doesn't fool anyone. Writing a simple one-line self-summary shouldn't trigger an out-of-memory exception.`;
    statsRoast = `Followers: ${profile.followers}, Following: ${profile.following}. Your organic reach has basically cratered into the floor. Following twice as many people as follow you back gives off serious LinkedIn connection-spammer vibes.`;
    const repoCount = repos.length;
    if (repoCount > 0) {
      const topRepo = repos[0];
      repoRoast = `You've got ${profile.publicRepos} public repositories, proudly led by "${topRepo.name}" (holding down ${topRepo.stars} stars). Scanned the whole tree, and the most descriptive commit message found was "README.md updated". The rest are the classic hits: "fix", "wip", and "added stuff" — absolute certified developer behavior!`;
    } else {
      repoRoast = `You have ${profile.publicRepos} public repositories listed, but not a single active, shipping codebase. Is this an active engineering portfolio or a digital showroom for empty directories?`;
    }
    finalAdvice = `Parting words of wisdom: Trim down that bloated node_modules folder, stop running cron jobs just to keep your commit contribution graph green, and ship some real production code. Otherwise, you'll be stuck writing "AI Wrapper Founder" in your bio forever! 🔥`;
  }

  const roastText = `${vibeType} Vibe Check:\n\n${bioRoast} ${statsRoast}\n\n${repoRoast}\n\n${finalAdvice}`;

  return {
    vibeType,
    roastText,
    secretSuperpower: superpower,
    defenseLevel: defense,
    stats: {
      overEngineeringScore: overEngineering,
      yapperIndex,
      bugsToFeaturesRatio: bugsRatio,
      favoriteLanguage: favLang,
      coffeeToCodeRatio: coffeeRatio
    }
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, spiceLevel = 'spicy' } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    if (!cleanUsername) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    const currentSpice: SpiceLevel = ['mild', 'spicy', 'nuclear'].includes(spiceLevel) ? spiceLevel : 'spicy';

    const githubHeaders: Record<string, string> = {
      'User-Agent': 'GitVibe-AI-Roaster',
    };
    if (process.env.GITHUB_TOKEN) {
      githubHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch GitHub user details
    const userRes = await fetch(`https://api.github.com/users/${cleanUsername}`, {
      headers: githubHeaders,
    });

    if (userRes.status === 404) {
      return NextResponse.json({ error: 'GitHub user not found. Check the username!' }, { status: 404 });
    }

    if (!userRes.ok) {
      const rateLimitRemaining = userRes.headers.get('x-ratelimit-remaining');
      if (rateLimitRemaining === '0') {
        return NextResponse.json({ 
          error: 'GitHub API Rate Limit reached! Please try again shortly or click one of the developers on our leaderboard.' 
        }, { status: 429 });
      }
      return NextResponse.json({ error: 'Failed to fetch GitHub profile' }, { status: userRes.status });
    }

    const userData = await userRes.json();

    // 2. Fetch public repositories
    const reposRes = await fetch(`https://api.github.com/users/${cleanUsername}/repos?per_page=30&sort=updated`, {
      headers: githubHeaders,
    });

    let reposData = [];
    if (reposRes.ok) {
      reposData = await reposRes.json();
    }

    // Process repositories for AI context
    const reposSummary = reposData.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      isFork: repo.fork,
    })).slice(0, 15);

    // Profile summary
    const profileSummary = {
      username: userData.login,
      name: userData.name || userData.login,
      bio: userData.bio || 'No bio provided. Busy coding, apparently.',
      followers: userData.followers,
      following: userData.following,
      publicRepos: userData.public_repos,
      company: userData.company,
      location: userData.location,
      createdAt: userData.created_at,
    };

    let aiOutput;

    const selectedModel = getLanguageModel();

    if (selectedModel) {
      try {
        // 3. Call AI SDK using configured model (OpenAI / Gemini / AI Gateway)
        const spiceInstructions = currentSpice === 'nuclear'
          ? 'Maximum nuclear savagery: zero mercy, brutally roast their architectural choices, commit frequency, 0-star repos, framework hype chasing, and tech delusions. Keep it hilarious, unapologetic, and 100% in natural US English.'
          : currentSpice === 'mild'
          ? 'Playful and gentle tease: light sarcasm with friendly constructive dev humor, keeping it friendly and uplifting in fluent US English.'
          : 'Spicy US tech roast: witty, sarcastic, punchy technical observations, calling out typical developer coping mechanisms and habits in sharp, modern US English.';

        const result = await generateObject({
          model: selectedModel,
          schema: z.object({
            vibeType: z.string().describe('A funny developer archetype/persona in US English (e.g. "Spaghetti Code Architect", "Commit Spammer", "Quiet Prodigy")'),
            roastText: z.string().describe('A hilarious, savage, witty, yet deeply technical developer roast in 3-4 paragraphs written exclusively in natural, modern US English (Silicon Valley / Hacker News / Tech Twitter humor). Absolutely NO Hindi, Hinglish, or foreign slang. Keep it engaging, meme-worthy, and culturally grounded in standard US English tech culture.'),
            secretSuperpower: z.string().describe('A funny, ironic superpower in US English (e.g., "Copying StackOverflow without looking", "Writing bugs with 100% confidence")'),
            defenseLevel: z.number().describe('A hilarious defense score (0-100) based on how bulletproof their code looks'),
            stats: z.object({
              overEngineeringScore: z.number().describe('0 to 100 score of how complex they make simple things'),
              yapperIndex: z.number().describe('0 to 100 score of code vs talk ratio (high bio yapping means high index)'),
              bugsToFeaturesRatio: z.string().describe('A funny ratio (e.g., "10:1", "Infinite:0", "99:1")'),
              favoriteLanguage: z.string().describe('The language they probably worship or hate'),
              coffeeToCodeRatio: z.string().describe('A hilarious coffee ratio (e.g. "10 liters : 2 lines of CSS")')
            })
          }),
          prompt: `You are the world's most savage, expert, and witty Senior AI Software Engineer from Silicon Valley.
Your job is to deeply analyze this GitHub profile and repositories, and write a hilarious, high-context developer roast.
Roast intensity level: "${currentSpice}". Style guide: ${spiceInstructions}
Write EXCLUSIVELY in US English. Do NOT use any Hindi, Hinglish, or non-English slang.
Be technical and full of modern dev jokes (Tailwind vs CSS, Rust fanboyism, React re-renders, JS dependencies, AI-generated code, commit messages like "fix", "please work").

Here is the GitHub profile data:
${JSON.stringify(profileSummary, null, 2)}

Here are some of their repositories:
${JSON.stringify(reposSummary, null, 2)}

Write the roast text in sharp, punchy, laugh-out-loud US English so that it is authentic, technical, and viral on Tech Twitter and Reddit! Keep it lighthearted but deeply savage about their coding habits, follower count, or repository count.`,
        });
        
        aiOutput = result.object;
      } catch (aiError) {
        console.warn('[GitVibeAI] AI generation error, using fallback:', aiError);
        aiOutput = generateFallbackRoast(profileSummary, reposSummary, currentSpice);
      }
    } else {
      aiOutput = generateFallbackRoast(profileSummary, reposSummary, currentSpice);
    }

    // 4. Save/Update roast in database
    const savedRows = await query(
      `INSERT INTO github_roasts (username, name, avatar_url, roast_text, vibe_type, stats)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (username) 
       DO UPDATE SET 
         name = EXCLUDED.name,
         avatar_url = EXCLUDED.avatar_url,
         roast_text = EXCLUDED.roast_text,
         vibe_type = EXCLUDED.vibe_type,
         stats = EXCLUDED.stats,
         created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        cleanUsername,
        profileSummary.name,
        userData.avatar_url,
        aiOutput.roastText,
        aiOutput.vibeType,
        JSON.stringify({
          secretSuperpower: aiOutput.secretSuperpower,
          defenseLevel: aiOutput.defenseLevel,
          ...aiOutput.stats
        })
      ]
    );

    const savedRecord = Array.isArray(savedRows) && savedRows.length > 0 ? savedRows[0] : null;
    const finalLikes = typeof savedRecord?.likes === 'number' ? savedRecord.likes : 0;

    return NextResponse.json({
      username: cleanUsername,
      name: profileSummary.name,
      avatarUrl: userData.avatar_url,
      vibeType: aiOutput.vibeType,
      roastText: aiOutput.roastText,
      secretSuperpower: aiOutput.secretSuperpower,
      defenseLevel: aiOutput.defenseLevel,
      stats: aiOutput.stats,
      spiceLevel: currentSpice,
      likes: finalLikes
    });

  } catch (error: any) {
    console.error('[GitVibeAI] Error in /api/roast:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
