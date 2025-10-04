import { NextResponse } from 'next/server';


export async function POST(request) {
    try {
        const { prompt } = await request.json();
        if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 });


        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });


        // Example: OpenAI Images API (adjust to match your chosen provider)
        // This example requests base64-encoded images so we can safely return them.


        const payload = {
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        };


        const res = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
        });


        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json({ error: `Image API error: ${text}` }, { status: res.status });
        }


        const data = await res.json();
        // data.data is expected to be an array with { b64_json }
        const images = (data?.data || []).map((item) => ({ b64: item.b64_json }));


        return NextResponse.json({ images });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}