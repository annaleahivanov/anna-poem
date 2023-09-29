import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import getAirtableData from 'src/app/api/getAirtableData.js';

const fetchAirtableData = async () => {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
    const records = await base('One').select({}).all();
    const processedData = records.map((record) => {
      return {
        id: record.id,
        question: record.fields.question,
        options: [record.fields.One, record.fields.Two],
      };
    });
    console.log('Processed Data:', processedData);
    return processedData;
}

export async function GET(request) {
    try {
        const airtableData = await fetchAirtableData();  // Simplified call
        return NextResponse.json({ result: airtableData });
    } catch (error) {
        console.error('Error fetching Airtable data:', error);
        return NextResponse.error(new Error('Failed to fetch Airtable data'));
    }
}

export async function POST(request) {
  try {
    const { responses } = await request.json(); // Extract user responses

    const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE_ID);
    for (const response of responses) {
      // Modify this logic based on how you want to save data in Airtable
      await base('One').update([
        {
          id: response.questionId,
          fields: {
            UserResponse: response.option,
          },
        },
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending data to Airtable:', error);
    return NextResponse.error(new Error('Failed to send data to Airtable'));
  }
}