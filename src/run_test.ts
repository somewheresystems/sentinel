import { vocode } from '../src/cli'; // Adjust the import path as necessary

async function testListNumbers() {
  try {
    const numberPage = await vocode.numbers.listNumbers();
    console.log('listNumbers response:', numberPage);
  } catch (error) {
    console.error('Error testing listNumbers:', error);
  }
}

testListNumbers();