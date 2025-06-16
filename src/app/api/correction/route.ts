import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const file = formData.get('file') as File;
        const corrige = formData.get('corrige') as File;

        if (!file || !corrige) {
            return NextResponse.json({ error: 'Fichiers manquants.' }, { status: 400 });
        }

        const [textCopy, textCorrige] = await Promise.all([
            file.text(),
            corrige.text(),
        ]);

        const prompt = `Tu es un correcteur expérimenté. Corrige la copie suivante selon le corrigé type.
Corrigé type :
${textCorrige}

Copie d'élève :
${textCopy}

Rends un commentaire structuré, objectif, et clair.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });

        const result = completion.choices[0].message.content;

        return NextResponse.json({ result });
    } catch (error: any) {
        console.error('Erreur API /correction :', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue.' },
            { status: 500 }
        );
    }
}
