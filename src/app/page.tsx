/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import * as pdfjsLib from 'pdfjs-dist';

export default function Home() {
    const [copyText, setCopyText] = useState("");
    const [corrigeText, setCorrigeText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const extractTextFromPdf = async (file: File): Promise<string> => {
        const pdf = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: pdf });
        const pdfDoc = await loadingTask.promise;
        let fullText = "";

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const content = await page.getTextContent();
            const strings = content.items.map((item: any) => item.str);
            fullText += strings.join(" ") + "\n";
        }

        return fullText;
    };

    const handleSubmit = async () => {
        if (!copyText || !corrigeText) return;
        setLoading(true);

        const res = await fetch("/api/correction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ copy: copyText, corrige: corrigeText }),
        });

        const data = await res.json();
        setResult(data.result);
        setLoading(false);
    };

    return (
        <main className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold">Correction IA de Copies</h1>
            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <label>1. Dépose une copie PDF OCRisée</label>
                    <Input
                        type="file"
                        accept="application/pdf"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) setCopyText(await extractTextFromPdf(file));
                        }}
                    />

                    <label>2. Dépose le corrigé type (PDF)</label>
                    <Input
                        type="file"
                        accept="application/pdf"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) setCorrigeText(await extractTextFromPdf(file));
                        }}
                    />

                    <Button onClick={handleSubmit} disabled={loading || !copyText || !corrigeText}>
                        {loading ? "Correction en cours..." : <><Upload className="mr-2 h-4 w-4" />Lancer la correction</>}
                    </Button>
                </CardContent>
            </Card>

            {result && (
                <Card>
                    <CardContent className="p-4">
                        <h2 className="text-xl font-bold mb-2">Résultat de la correction</h2>
                        <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded-md border border-gray-300">
                            {result}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}
