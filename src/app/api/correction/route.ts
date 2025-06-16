import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import pdfParse from "pdf-parse";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const corrige = formData.get("corrige") as File;

    const [copyBuffer, corrigeBuffer] = await Promise.all([
        file.arrayBuffer(),
        corrige.arrayBuffer(),
    ]);

    const [copyText, corrigeText] = await Promise.all([
        pdfParse(Buffer.from(copyBuffer)),
        pdfParse(Buffer.from(corrigeBuffer)),
    ]);

    const prompt = `
Corrige la copie d'élève ci-dessous à l'aide du corrigé fourni.
Corrigé :
""" 
${corrigeText.text}
"""

Copie de l'élève :
"""
${copyText.text}
"""

Corrige la copie de façon détaillée et pédagogique.
`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const completion: any = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices?.[0]?.message?.content || "Erreur : aucune réponse générée.";

    return NextResponse.json({ result });
}
