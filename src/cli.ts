import dotenv from 'dotenv';
import { VocodeClient as ImportedVocodeClient } from '@vocode/vocode-api';
import axios from 'axios';
import { Command } from 'commander';

dotenv.config();

const program = new Command();
export const vocode = new ImportedVocodeClient({
    token: process.env.VOCODE_API_KEY || 'YOUR_API_KEY',
});

program
  .command('list-numbers')
  .description('List all numbers')
  .action(async () => {
    

    try {
      const numbers = await vocode.numbers.listNumbers();
      console.log('My numbers:', numbers);
    } catch (error) {
      console.error('Error listing numbers:', error);
    }
  });

program
  .command('test-list-numbers')
  .description('Test listNumbers method')
  .action(async () => {


    try {
      const numberPage = await vocode.numbers.listNumbers();
      console.log('listNumbers response:', numberPage);
    } catch (error) {
      console.error('Error testing listNumbers:', error);
    }
  });

program
  .command('transfer-call <phoneNumber>')
  .description('Transfer call to a specified phone number')
  .action(async (phoneNumber) => {
    

    // Simple phone number validation
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      console.error('Invalid phone number. Please provide a valid phone number.');
      process.exit(1);
    }

    try {
      const action = await vocode.actions.createAction({
        type: 'action_transfer_call',
        config: {
          phoneNumber: phoneNumber,
        },
      });
      console.log('Call transfer action created:', action);
    } catch (error) {
      console.error('Error creating transfer call action:', error);
    }
  });

interface PhoneNumber {
  agent_id: string;
  // Add other properties if needed
}

program
  .command('make-call')
  .description('Make an outbound call')
  .requiredOption('-t, --to <number>', 'To phone number')
  .action(async (options) => {
    const { to } = options;
    
    try {
      const numberPage = await vocode.numbers.listNumbers();
      const numbers = numberPage.items; // Adjust based on the actual structure of the response
      if (numbers.length === 0) {
        console.error('No numbers available.');
        process.exit(1);
      }
      const from = numbers[0].number; // Use the first number as the "from" number
      console.log('Using from number:', from);

      const agentId = numbers[0].id; // Adjust based on the actual structure of the response

      const agentResponse = await fetch('https://api.vocode.dev/v1/agents', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.VOCODE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      const agentData = await agentResponse.json();
      console.log('Agent data:', agentData);

      const response = await axios.post('https://api.vocode.dev/v1/calls/create', {
        from_number: from,
        to_number: to,
        agent: agentId,
        on_no_human_answer: 'continue',
        run_do_not_call_detection: true,
        hipaa_compliant: true,
        context: {},
        telephony_params: {}
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.VOCODE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Call created successfully:', response.data);
    } catch (error: any) {
      console.error('Error creating call:', error.response ? error.response.data : error.message);
    }
  });

program.parse(process.argv);


