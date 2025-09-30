import { GoogleGenAI, Type } from "@google/genai";
import { YouTubeSearchResult } from '../types.ts';

if (!process.env.API_KEY) {
    console.warn("La variable de entorno API_KEY no está configurada. La búsqueda de canciones no funcionará.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const searchSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        videoId: {
          type: Type.STRING,
          description: "El ID de video de YouTube de 11 caracteres.",
        },
        title: {
          type: Type.STRING,
          description: "El título del video de YouTube.",
        },
        channel: {
          type: Type.STRING,
          description: "El nombre del canal de YouTube que subió el video.",
        },
      },
      required: ["videoId", "title", "channel"],
    },
};

export const searchYouTubeVideos = async (query: string): Promise<YouTubeSearchResult[]> => {
    if (!process.env.API_KEY) {
        throw new Error("La clave de API de Gemini no está configurada.");
    }

    try {
        const prompt = `Actúas como una API de búsqueda de YouTube Music. Encuentra los 4 videos musicales más relevantes para la siguiente consulta: "${query}". Proporciona solo el ID del video, el título y el nombre del canal para cada resultado. No incluyas ningún otro comentario o texto.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: searchSchema,
            },
        });

        // The response.text from a JSON response is a string that needs to be parsed.
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse as YouTubeSearchResult[];
    } catch (error) {
        console.error("Error buscando videos de YouTube con Gemini:", error);
        throw new Error("No se pudieron obtener los resultados de la canción. Por favor, verifica tu clave de API e inténtalo de nuevo.");
    }
};