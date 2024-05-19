import express from 'express';
import dotenv from 'dotenv';
import { VocodeClient } from '@vocode/vocode-api';

const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

const vocode = new VocodeClient({
  token: process.env.VOCODE_API_KEY || 'YOUR_API_KEY',
});

const PROMPT = process.env.PROMPT || 'You are a helpful realtime assistant operating with voice and ASR over the phone. You can perform the following actions: transfer call or end call.';
const INITIAL_MESSAGE = process.env.INIT_MESSAGE || `Hello?`;

async function initializeAgent() {
  try {
    const prompt = await vocode.prompts.createPrompt({
      content: PROMPT,
    });

    const numberPage = await vocode.numbers.listNumbers();
    if (numberPage.items.length > 0) {
      const firstNumber = numberPage.items[0].number;
      console.log('First available number:', firstNumber);

      await vocode.numbers.updateNumber({
        phoneNumber: firstNumber,
        inboundAgent: {
          prompt: prompt.id,
          actions: [
            {
              type: "action_transfer_call",
              config: {
                phoneNumber: process.env.MY_PHONE_NUMBER || 'MY_PHONE_NUMBER',
              },
            },
            {
              type: "action_end_conversation",
            }
          ],
        },
      });

      console.log(`Number ${firstNumber} updated to transfer calls to ${process.env.MY_PHONE_NUMBER || 'MY_PHONE_NUMBER'}`);
    } else {
      console.log('No numbers available.');
    }
  } catch (error) {
    console.error('Error initializing agent:', error);
  }
}

initializeAgent();

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Server running on port ${port}`));

