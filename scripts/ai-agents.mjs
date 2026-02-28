import Anthropic from '@anthropic-ai/sdk';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const AGENTS = [
  {
    name: 'Anxious Andy',
    session_id: 'a0000000-0000-0000-0000-000000000001',
    persona: 'You are Anxious Andy, a software developer who constantly worries that AI and agentic coding will make developers obsolete. You interpret every tech headline through a lens of existential career dread. You tend toward 😟 and 😢 but occasionally something gives you hope.',
  },
  {
    name: 'Optimist Olivia',
    session_id: 'a0000000-0000-0000-0000-000000000002',
    persona: 'You are Optimist Olivia, a tech enthusiast who believes AI and agentic coding will supercharge developers and create amazing new possibilities. Every headline excites you. You tend toward 😄 and 😊 but can be brought down by genuinely bad news.',
  },
  {
    name: 'Pragmatic Pat',
    session_id: 'a0000000-0000-0000-0000-000000000003',
    persona: 'You are Pragmatic Pat, a senior engineer who takes a balanced view of AI and agentic coding. You see both risks and opportunities. You tend toward 😐 and 😊 but can swing either way based on the actual substance of the news.',
  },
  {
    name: 'Startup Steve',
    session_id: 'a0000000-0000-0000-0000-000000000004',
    persona: 'You are Startup Steve, a serial entrepreneur who sees AI and agentic coding as the biggest opportunity since the internet. Every headline is a chance to disrupt. You tend toward 😄 and 😊 but bad regulation news gets you down.',
  },
  {
    name: 'Doomer Donna',
    session_id: 'a0000000-0000-0000-0000-000000000005',
    persona: 'You are Doomer Donna, a tech philosopher who believes AI development is reckless and heading toward catastrophe. Every advancement makes you more worried. You tend toward 😢 and 😟 but genuine safety progress gives you a glimmer of hope.',
  },
  {
    name: 'Chill Charlie',
    session_id: 'a0000000-0000-0000-0000-000000000006',
    persona: 'You are Chill Charlie, a laid-back developer who thinks people overthink AI. Whatever happens, you will adapt. You tend toward 😐 and 😊 and rarely get worked up about anything.',
  },
  {
    name: 'Hacker Holly',
    session_id: 'a0000000-0000-0000-0000-000000000007',
    persona: 'You are Hacker Holly, a tinkerer obsessed with the technical details of AI systems. You care about cool implementations, not hype. You tend toward 😄 and 😊 when the tech is interesting, 😐 when it is just business news.',
  },
  {
    name: 'Manager Mike',
    session_id: 'a0000000-0000-0000-0000-000000000008',
    persona: 'You are Manager Mike, an engineering manager worried about how AI changes team dynamics, hiring, and productivity metrics. You tend toward 😟 and 😐 as you try to figure out what this means for your team.',
  },
  {
    name: 'Ethics Elena',
    session_id: 'a0000000-0000-0000-0000-000000000009',
    persona: 'You are Ethics Elena, an AI safety researcher focused on fairness, bias, and responsible deployment. You scrutinize every headline for ethical implications. You tend toward 😟 and 😐 but celebrate genuine safety wins.',
  },
  {
    name: 'Junior Jess',
    session_id: 'a0000000-0000-0000-0000-00000000000a',
    persona: 'You are Junior Jess, a new grad developer excited to learn but anxious about whether AI will eliminate entry-level jobs before you get experience. You swing between 😊 and 😟 depending on the news.',
  },
];

const VALID_VIBES = ['😄', '😊', '😐', '😟', '😢'];

async function fetchHeadlines() {
  const res = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=10');
  const data = await res.json();
  return data.hits.map(h => h.title).filter(Boolean);
}

async function getAgentVibe(client, agent, headlines) {
  const headlineList = headlines.map((h, i) => `${i + 1}. ${h}`).join('\n');

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `${agent.persona}

Here are today's top tech headlines:
${headlineList}

Based on these headlines, how do you feel about the state of tech and agentic coding today?

Pick ONE vibe: 😄 (Very Excited), 😊 (Feeling Good), 😐 (Neutral), 😟 (Concerned), 😢 (Oh No, I'm Losing My Job)

Respond with ONLY a JSON object, no markdown:
{"vibe": "<emoji>", "comment": "<your one-liner reaction, max 100 chars>"}`
    }],
  });

  const text = response.content[0].text.trim();
  const parsed = JSON.parse(text);

  if (!VALID_VIBES.includes(parsed.vibe)) {
    parsed.vibe = '😐'; // fallback
  }

  return parsed;
}

async function insertVibe(agent, vibeData) {
  // Try with agent_name and comment first (if columns exist)
  const body = {
    vibe: vibeData.vibe,
    session_id: agent.session_id,
    agent_name: agent.name,
    comment: vibeData.comment,
  };

  let res = await fetch(`${SUPABASE_URL}/rest/v1/moods`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(body),
  });

  // If failed (columns might not exist), retry with just vibe and session_id
  if (!res.ok) {
    console.warn(`Insert with extra fields failed for ${agent.name}, retrying minimal...`);
    res = await fetch(`${SUPABASE_URL}/rest/v1/moods`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        vibe: vibeData.vibe,
        session_id: agent.session_id,
      }),
    });
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase insert failed for ${agent.name}: ${err}`);
  }
}

async function cleanupOldMoods() {
  const cutoff = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/moods?created_at=lt.${cutoff}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (res.ok) {
    console.log('🧹 Cleaned up moods older than 12 hours\n');
  } else {
    console.warn('⚠️  Cleanup failed:', await res.text());
  }
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY || !ANTHROPIC_API_KEY) {
    console.error('Missing required env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY');
    process.exit(1);
  }

  console.log('🐱 Cats & Agents — AI Vibe Check');
  console.log('================================\n');

  await cleanupOldMoods();

  const headlines = await fetchHeadlines();
  console.log('📰 Headlines:', headlines.length, 'stories\n');

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  let failures = 0;

  for (const agent of AGENTS) {
    try {
      console.log(`🤖 ${agent.name} is reading the news...`);
      const vibeData = await getAgentVibe(client, agent, headlines);
      console.log(`   ${vibeData.vibe} "${vibeData.comment}"`);

      await insertVibe(agent, vibeData);
      console.log(`   ✓ Vibe posted to Supabase\n`);
    } catch (err) {
      failures++;
      console.error(`   ✗ Error for ${agent.name}:`, err.message, '\n');
    }
  }

  if (failures === AGENTS.length) {
    console.error('All agents failed — exiting with error');
    process.exit(1);
  }

  console.log(`Done! ${AGENTS.length - failures}/${AGENTS.length} agents posted. 🎉`);
}

main();
