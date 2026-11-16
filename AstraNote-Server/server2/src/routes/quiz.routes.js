const { GoogleGenAI, Type } = require('@google/genai');
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// Inizializza l'SDK di Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const QuizSchema = {
    type: Type.OBJECT,
    properties: {
        quiz_title: { type: Type.STRING, description: "Un titolo appropriato per il quiz." },
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question_text: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Esattamente 4 opzioni." },
                    correct_answer: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                },
                required: ["question_text", "options", "correct_answer", "explanation"]
            }
        }
    },
    required: ["quiz_title", "questions"]
};

// 1. GET: Recupera i quiz esistenti per un determinato appunto (e le info dell'appunto)
router.get('/api/appunti/:appuntoId/quiz', async (req, res) =>
{
    const { appuntoId } = req.params;
    try
    {
        // Recupera l'appunto (es. da Supabase) per avere il titolo e l'url_file/pdfUrl
        const { data: appunto, error: errAppunto } = await supabase
            .from('appunti')
            .select('*')
            .eq('id', appuntoId)
            .single();

        if (errAppunto || !appunto)
        {
            return res.status(404).json({ errore: "Appunto non trovato" });
        }

        // Recupera i quiz salvati nel database per questo appunto
        const { data: quizList, error: errQuiz } = await supabase
            .from('quiz')
            .select('*')
            .eq('appunto_id', appuntoId);

        if (errQuiz) throw errQuiz;

        res.status(200).json({
            appunto: appunto,
            quiz: quizList || []
        });
    } catch (error)
    {
        console.error("Errore nel recupero quiz:", error);
        res.status(500).json({ errore: error.message });
    }
});

// 2. POST: Genera un nuovo quiz tramite Gemini leggendo il PDF dell'appunto
router.post('/api/appunti/:appuntoId/quiz', async (req, res) =>
{
    const { appuntoId } = req.params;
    const { numero = 10 } = req.body; // Numero di domande richieste

    try
    {
        // 1. Recupera l'appunto per ottenere l'URL del PDF
        const { data: appunto, error: errAppunto } = await supabase
            .from('appunti')
            .select('*')
            .eq('id', appuntoId)
            .single();

        if (errAppunto || !appunto || !appunto.url_file)
        {
            return res.status(404).json({ errore: "Appunto o file PDF non trovato." });
        }

        console.log(`Generazione quiz con Gemini per appunto ID: ${appuntoId}...`);

        // 2. Scarica il PDF e convertilo in Base64
        const pdfBase64 = await fetchPdfAsBase64(appunto.url_file);

        // 3. Richiesta a Gemini, con retry e fallback se un modello è saturo (503)
        const response = await generateQuizContent(pdfBase64, numero);
        const quizGenerato = JSON.parse(response.text);


        console.log("Quiz generato da Gemini con successo, salvataggio su Supabase...");
        // 4. Salva il quiz generato nel database Supabase
        const payload = {
            appunto_id: appuntoId,
            titolo: quizGenerato.quiz_title,
            domande: quizGenerato.questions,
            totale: quizGenerato.questions.length,
            risposte: 0,
            corrette: 0,
            creato_il: new Date()
        };
        if (req.session?.user?.id) payload.user_id = req.session.user.id;

        let { data: nuovoQuiz, error: errSave } = await supabase
            .from('quiz')
            .insert([payload])
            .select()
            .single();

        if (errSave && payload.user_id)
        {
            delete payload.user_id;
            const retry = await supabase.from('quiz').insert([payload]).select().single();
            nuovoQuiz = retry.data;
            errSave = retry.error;
        }
        if (errSave) throw errSave;

        // Restituisce l'ID del nuovo quiz creato al frontend
        res.status(201).json(nuovoQuiz);

    } catch (error)
    {
        console.error("Errore generazione quiz IA:", error);
        const overcrowded = isOverloadError(error);
        res.status(overcrowded ? 503 : 500).json({
            errore: overcrowded
                ? "Gemini è momentaneamente saturo. Riprova tra qualche secondo."
                : "Impossibile generare il quiz con l'intelligenza artificiale."
        });
    }
});

// 3. GET: Appunti per cui l'utente ha almeno un quiz
router.get('/api/quiz/miei', async (req, res) =>
{
    try
    {
        const userId = req.session?.user?.id;
        if (!userId) return res.status(401).json({ errore: "Non autenticato" });

        let { data: quizRows, error } = await supabase
            .from('quiz')
            .select('id, appunto_id, user_id')
            .eq('user_id', userId);

        if (error)
        {
            const fallback = await supabase.from('quiz').select('id, appunto_id');
            quizRows = fallback.data;
            error = fallback.error;
        }

        if (error) throw error;

        const conteggio = {};
        for (const q of quizRows || [])
        {
            if (!q.appunto_id) continue;
            conteggio[q.appunto_id] = (conteggio[q.appunto_id] || 0) + 1;
        }

        const ids = Object.keys(conteggio);
        if (ids.length === 0) return res.status(200).json([]);

        const { data: appunti, error: errAppunti } = await supabase
            .from('appunti')
            .select('*, corso(*, facolta(*))')
            .in('id', ids);

        if (errAppunti) throw errAppunti;

        const risultato = (appunti || []).map(appunto => ({
            appunto,
            numeroQuiz: conteggio[appunto.id] || 0
        }));

        res.status(200).json(risultato);
    } catch (error)
    {
        console.error("Errore quiz utente:", error);
        res.status(500).json({ errore: error.message });
    }
});

// 4. GET: Recupera un quiz specifico con le domande
router.get('/api/quiz/:id', async (req, res) =>
{
    const { id } = req.params;
    try
    {
        const { data, error } = await supabase
            .from('quiz')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data)
        {
            return res.status(404).json({ errore: "Quiz non trovato" });
        }

        res.status(200).json(data);
    } catch (error)
    {
        res.status(500).json({ errore: error.message });
    }
});

// 4. PATCH: Aggiorna il punteggio del quiz
router.patch('/api/quiz/:id', async (req, res) =>
{
    const { id } = req.params;
    const { risposte, corrette } = req.body;
    try
    {
        const { data, error } = await supabase
            .from('quiz')
            .update({ risposte, corrette })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error)
    {
        res.status(500).json({ errore: error.message });
    }
});

// 5. DELETE: Elimina un quiz specifico
router.delete('/api/quiz/:id', async (req, res) =>
{
    const { id } = req.params;
    try
    {
        const { error } = await supabase.from('quiz').delete().eq('id', id);
        if (error) throw error;
        res.status(200).json({ success: true });
    } catch (error)
    {
        res.status(500).json({ errore: error.message });
    }
});

const GEMINI_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.8-flash"
];

function isOverloadError(error)
{
    const status = error?.status ?? error?.code;
    const message = String(error?.message ?? "");
    return status === 503 || status === 429 || /high demand|UNAVAILABLE|RESOURCE_EXHAUSTED/i.test(message);
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateQuizContent(pdfBase64, numero)
{
    const request = {
        contents: [
            {
                inlineData: {
                    mimeType: "application/pdf",
                    data: pdfBase64
                }
            },
            `Analizza questo documento PDF e crea un quiz di esattamente ${numero} domande a scelta multipla per verificare l'apprendimento.`
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: QuizSchema,
            temperature: 0.3,
        },
    };

    let lastError;
    for (const model of GEMINI_MODELS)
    {
        for (let attempt = 1; attempt <= 3; attempt++)
        {
            try
            {
                console.log(`Tentativo Gemini ${model} (${attempt}/3)...`);
                return await ai.models.generateContent({ model, ...request });
            } catch (error)
            {
                lastError = error;
                if (!isOverloadError(error)) throw error;
                await sleep(1000 * attempt);
            }
        }
    }
    throw lastError;
}

async function fetchPdfAsBase64(url)
{
    const response = await fetch(url);
    if (!response.ok) throw new Error("Impossibile scaricare il file PDF sorgente.");
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString('base64');
}

module.exports = router;