# 🚀 Getting Started with AI Dreams - IMPORTANT FIRST STEPS

## ⚠️ You MUST Do This First

Your app now has AI capabilities, but they're disabled by default. To make dreams actually look good, you need to:

### Step 1: Get an OpenAI API Key (Takes 2 minutes)

1. Go to **https://platform.openai.com/account/api-keys**
2. Sign in with your account (or create one)
3. Click **"Create new secret key"**
4. Copy the key (it looks like: `sk-proj-abc123...`)

### Step 2: Create Your `.env` File

The app already created `.env` and `.env.example` for you!

Just edit the `.env` file and add your key:

```
VITE_OPENAI_API_KEY=sk-your-key-here
```

That's it! Two changes:
1. Replace `sk-your-key-here` with your actual key
2. Save the file

### Step 3: Restart the Dev Server

If your dev server is running:
```bash
# Press Ctrl+C to stop it
# Then restart it:
npm run dev
```

The app will restart and now has AI powers! 🎉

## That's It!

Now when you:
1. Record a dream or type one
2. The AI will interpret it properly
3. You'll see 4 render mode options
4. Dreams will look realistic instead of random blobs

## Example: What Changes

### Before (Without API Key):
```
You: "Spiderman was catching me"
System: Uses fallback mock data
Result: Random geometric shape (disappointing)
```

### After (With API Key):
```
You: "Spiderman was catching me"
AI: Understands who Spiderman is
AI: Generates realistic description
AI: Creates detailed scene data
Result: Beautiful illustration/3D world (amazing!)
```

## What Costs Money?

Yes, OpenAI charges:
- Each dream interpretation: ~$0.01 to $0.05
- Free tier: $5 credit (usually good for 50-100 dreams)
- Then you pay per dream

You can:
- Use free tier to test
- Set up payment for unlimited use
- Stop anytime

## What If I Don't Add a Key?

The app still works! It uses a fallback "mock" interpreter that:
- Makes random dreams
- Doesn't understand specific characters
- Creates okay results, not great results

So adding the key makes a BIG difference in quality.

## Verify It's Working

1. **Open browser console** (Press F12)
2. **Record or type a dream**
3. **Look for this in console:**
   ```
   [AI Interpreter] Requesting detailed dream interpretation from OpenAI...
   [AI Interpreter] Successfully generated detailed interpretation
   ```
4. **If you see that** - You're connected to AI! ✅
5. **If you see fallback message** - No API key found

## Troubleshooting

### Issue: "No OpenAI API key provided, using fallback"
**Fix:** Your `.env` file doesn't have the key
- Open `.env` file (not `.env.example`)
- Make sure you have: `VITE_OPENAI_API_KEY=sk-...`
- Restart dev server

### Issue: "Error: 401 Unauthorized"  
**Fix:** Your API key is wrong
- Copy it again from https://platform.openai.com/account/api-keys
- Make sure there are no extra spaces
- Restart dev server

### Issue: "Error: 429 Rate Limited"
**Fix:** You've used up your API quota
- Wait a minute and try again
- Check your usage at https://platform.openai.com/usage

### Issue: "Error: 400 Bad Request"
**Fix:** Model might not be available
- Try changing `gpt-4-turbo-preview` to `gpt-4` in `aiDreamInterpreter.ts`
- Or use `gpt-3.5-turbo` (faster, cheaper)

## How to Use It

### Via Voice:
1. Click "Start Recording a Dream"
2. Say your dream naturally
3. Click "Stop Recording"
4. Wait for AI interpretation
5. Choose viewing mode

### Via Text:
1. Type directly in text field
2. Press Enter
3. Wait for AI interpretation
4. Choose viewing mode

## The 4 Viewing Modes

After AI interprets your dream:

| Mode | Best For | Controls |
|------|----------|----------|
| 🎨 **Dream Art** | Seeing illustration | Just view |
| 🎬 **Dream Video** | Cinematic experience | Auto-play |
| 🗺️ **Explore** | Walking through dream | WASD + Mouse |
| ✨ **Abstract 3D** | Surreal visualization | Mouse rotate |

## Example Dreams to Try

**Start with simple ones:**
- "I was flying over a blue ocean"
- "A giant turtle was following me"  
- "I was in a castle made of gold"

**Then get creative:**
- "Superman was teaching me to teleport in a library"
- "A red octopus was dancing in a volcano"
- "I was shrinking while running through a forest"

The more detail, the better the AI results!

## Cost Estimate

Trying out the app:
- Free tier: $5 = ~50-100 dreams
- That's plenty to test it out!

After that:
- Cheap option: ~$0.02 per dream
- Expensive: Depends on dream length
- You can stop anytime

## Pro Tips

1. **Be descriptive** - "A friendly whale" not just "Whale"
2. **Use real references** - "Like Thanos from Marvel"
3. **Include feelings** - "I felt terrified" or "I was excited"
4. **Add colors** - "Golden light" or "Purple sky"
5. **Name locations** - "In New York" or "On Mars"

## What Happens with Your Data?

- Your dream text goes to OpenAI's servers
- They process it and return structured data
- OpenAI keeps usage logs (per their policy)
- Your data is NOT stored permanently
- You can check their privacy policy: https://openai.com/privacy/

## I'm Ready!

Here's your 3-step checklist:

- [ ] Got OpenAI API key
- [ ] Added it to `.env` file
- [ ] Restarted dev server
- [ ] Recorded first dream
- [ ] Saw AI interpret it
- [ ] Tried all 4 modes
- [ ] Shared a dream with someone

## Questions?

1. **How do I get an API key?**
   - https://platform.openai.com/account/api-keys

2. **Is it safe to put my key in `.env`?**
   - Yes! As long as you don't commit `.env` to git
   - `.env` is in `.gitignore` by default

3. **Can I use a different AI service?**
   - Yes! Modify `src/services/aiDreamInterpreter.ts`
   - Could use Anthropic, Google, local models, etc.

4. **What if I run out of API credits?**
   - Add a payment method
   - Or use a cheaper model (gpt-3.5-turbo)

---

**You're all set! Go make some amazing dreams! 🌙✨**

Questions? Check the browser console (F12) - it shows exactly what's happening!
