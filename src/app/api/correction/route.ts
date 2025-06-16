/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { copy, corrige } = body;

    if (!copy || !corrige) {
        return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const prompt = `
Tu es un correcteur expérimenté. Voici une copie d’élève et le corrigé type. Corrige la copie et donne une note sur 20, puis fournis une explication.

Corrigé type :
${corrige}

Copie de l’élève :
${copy}
`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    return NextResponse.json({ result: completion.choices[0].message.content });
}
