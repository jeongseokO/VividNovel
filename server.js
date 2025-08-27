import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from "node-fetch";

const app = express();
app.use(express.json({ limit: '1mb' }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname));

app.post('/tts', async (req, res) => {
  const { script, voices } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: script }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: Object.entries(voices).map(([speaker, voice]) => ({
                  speaker,
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } }
                }))
              }
            }
          }
        })
      }
    );
    const data = await resp.json();
    const audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    res.json({ audio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
