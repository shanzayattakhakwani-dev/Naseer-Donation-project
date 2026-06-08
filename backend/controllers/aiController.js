const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');

const callGemini = async (prompt) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('No Gemini key');

  // New v1beta endpoint that supports AQ.Ab... keys
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 500 }
    })
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Gemini API error:', JSON.stringify(data));
    throw new Error(data.error?.message || 'Gemini error');
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

exports.getRecommendations = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isActive:true }).sort({ isUrgent:-1 });
    if (req.user) {
      const history = await Donation.find({ donor:req.user._id }).populate('campaign','category isUrgent _id');
      const catCount = {};
      history.forEach(d => { const c=d.campaign?.category; if(c) catCount[c]=(catCount[c]||0)+1; });
      const topCat = Object.entries(catCount).sort((a,b)=>b[1]-a[1])[0]?.[0];
      const donated = new Set(history.map(d=>d.campaign?._id?.toString()));
      const recs = campaigns.filter(c=>!donated.has(c._id.toString())).filter(c=>!topCat||c.category===topCat||c.isUrgent).slice(0,3);
      return res.json({ success:true, data:recs.length?recs:campaigns.slice(0,3), reason:topCat?`Based on your ${topCat} donations.`:'Most urgent campaigns.' });
    }
    const urgent = campaigns.filter(c=>c.isUrgent).slice(0,3);
    res.json({ success:true, data:urgent.length?urgent:campaigns.slice(0,3), reason:'Most urgent campaigns right now.' });
  } catch(err){ res.status(500).json({ success:false, message:err.message }); }
};

exports.getSuggestions = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign) return res.status(404).json({ success:false, message:'Not found.' });
    const pct = campaign.raisedAmount/campaign.targetAmount*100;
    const remaining = campaign.targetAmount-campaign.raisedAmount;
    let tiers, reasoning;
    if (campaign.isUrgent||pct<20){ tiers=[1000,2000,5000,10000,20000]; reasoning='Urgent — higher donations have maximum impact.'; }
    else if (pct>=80){ const s=Math.max(Math.ceil(remaining/5/100)*100,100); tiers=[s,s*2,s*3,s*5,remaining].map(Math.round); reasoning=`Only PKR ${remaining.toLocaleString()} left!`; }
    else{ tiers=[500,1000,2000,5000,10000]; reasoning='Every amount makes a difference.'; }
    const impacts={500:"Provides a family's daily meal.",1000:"Covers a week's clean water.",2000:"Funds medicines for a child.",5000:"Emergency shelter for a family.",10000:"Sponsors a child's education.",20000:"Funds a complete medical kit."};
    res.json({ success:true, data:{ tiers, reasoning, impacts } });
  } catch(err){ res.status(500).json({ success:false, message:err.message }); }
};

exports.generateContent = async (req, res) => {
  const { topic, amount } = req.body;
  if (!topic) return res.status(400).json({ success:false, message:'Topic required.' });
  try {
    const prompt = `You are an AI for NASEER, a Palestinian humanitarian donation platform. Generate campaign content for: "${topic}" with PKR ${amount||1000}. Respond ONLY as valid JSON (no markdown): {"title":"max 8 words","description":"2-3 sentences","impact":"one sentence what PKR ${amount||1000} provides","urduTagline":"short urdu tagline","callToAction":"max 6 words"}`;
    const text  = await callGemini(prompt);
    const clean = text.replace(/```json/g,'').replace(/```/g,'').trim();
    res.json({ success:true, data:JSON.parse(clean) });
  } catch {
    res.json({ success:true, fallback:true, data:{ title:`Support Palestine: ${topic}`, description:'Critical humanitarian aid for Palestinian families.', impact:`PKR ${amount||1000} feeds a family for three days.`, urduTagline:'آپ کی مدد فلسطین کو طاقت دیتی ہے', callToAction:'Donate Now, Save Lives' } });
  }
};

exports.getImpact = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign) return res.status(404).json({ success:false, message:'Not found.' });
    if (campaign.impactStatement) return res.json({ success:true, data:{ statement:campaign.impactStatement } });
    const statement = await callGemini(`One sentence under 20 words starting "PKR X can..." about donating to: ${campaign.title}. Only the sentence, no quotes.`);
    res.json({ success:true, data:{ statement:statement.trim() } });
  } catch {
    res.json({ success:true, data:{ statement:'PKR 1,000 provides a week of clean water for a Gaza family.' } });
  }
};

exports.chat = async (req, res) => {
  const { messages } = req.body;
  if (!messages?.length) return res.status(400).json({ success:false, message:'Messages required.' });

  res.setHeader('Content-Type','text/event-stream');
  res.setHeader('Cache-Control','no-cache');
  res.setHeader('Connection','keep-alive');

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('No Gemini key configured');

    const campaigns = await Campaign.find({ isActive:true })
      .select('title category raisedAmount targetAmount isUrgent emoji').lean();
    const campContext = campaigns.map(c =>
      `- ${c.emoji} ${c.title} (${c.category}): PKR ${(c.raisedAmount/1000).toFixed(0)}K of PKR ${(c.targetAmount/1000).toFixed(0)}K${c.isUrgent?' [URGENT]':''}`
    ).join('\n');

    const systemText = `You are NASEER, a compassionate AI assistant for a Palestinian humanitarian donation platform. "NASEER" means "The Helper" in Arabic.

LIVE CAMPAIGNS:
${campContext}

Help donors understand campaigns, how donations work (Zakat/Sadaqah/Lillah), NGO verification, and impact. Be warm, concise, and compassionate. Recommend urgent campaigns when asked what to donate to.`;

    // Build contents with system context first
    const contents = [
      { role:'user',  parts:[{ text: systemText }] },
      { role:'model', parts:[{ text: 'Understood! I am NASEER, ready to help donors support Palestine.' }] }
    ];

    messages.forEach(m => {
      contents.push({
        role:  m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      });
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 500 }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini chat error:', JSON.stringify(data));
      throw new Error(data.error?.message || 'Gemini API error');
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      || "I'm sorry, I couldn't generate a response. Please try again.";

    res.write(`data: ${JSON.stringify({ text })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();

  } catch(err) {
    console.error('Chat error:', err.message);
    res.write(`data: ${JSON.stringify({ text: `Error: ${err.message}` })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
};