'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function Home() {
    const [copyFile, setCopyFile] = useState<File | null>(null);
    const [corrigeFile, setCorrigeFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const handleSubmit = async () => {
        if (!copyFile || !corrigeFile) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", copyFile);
        formData.append("corrige", corrigeFile);

        const res = await fetch("/api/correction", {
            method: "POST",
            body: formData,
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
                    <label className="font-semibold">1. Dépose une copie PDF OCRisée</label>
                    <Input type="file" accept="application/pdf" onChange={(e) => setCopyFile(e.target.files?.[0] || null)} />

                    <label className="font-semibold">2. Dépose le corrigé type (PDF)</label>
                    <Input type="file" accept="application/pdf" onChange={(e) => setCorrigeFile(e.target.files?.[0] || null)} />

                    <Button onClick={handleSubmit} disabled={loading || !copyFile || !corrigeFile}>
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
