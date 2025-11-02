import { GoogleGenAI, Type } from "@google/genai";
import { Teacher, Subject } from '../types';

interface GenerationParams {
    year: string;
    semester: string;
    subjects: Subject[];
    teachers: Teacher[];
    startTime: string;
    endTime: string;
    lectureDuration: number;
    startDate: string;
    endDate: string;
    includeBreak: boolean;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateTimetableAI = async (params: GenerationParams) => {
    const {
        year, semester, subjects, teachers,
        startTime, endTime, lectureDuration,
        startDate, endDate, includeBreak
    } = params;

    const teacherList = teachers.map(t => t.name).join(', ');
    const subjectList = subjects.map(s => s.name).join(', ');
    
    const breakInstruction = includeBreak 
        ? '8. Include a 60-minute lunch break each day. This break should ideally be after the 4th lecture of the day. Do not schedule any lectures during this break time. Represent the break in the schedule with the subject "Lunch Break" and teacher as "N/A".' 
        : '';
    const finalConstraintNumber = includeBreak ? 8 : 7;

    const prompt = `
        You are an expert university timetable scheduler. Your task is to generate a schedule for the ${year}, ${semester}.
        The schedule should cover all weekdays (Monday to Friday) from the start date ${startDate} to the end date ${endDate}.
        
        Constraints:
        1. Lectures must be scheduled between ${startTime} and ${endTime} on weekdays (Monday to Friday).
        2. Each lecture duration is ${lectureDuration} minutes.
        3. The subjects to be scheduled are: ${subjectList}.
        4. The available teachers are: ${teacherList}.
        5. A teacher cannot teach two different classes at the same time.
        6. A single year/semester group cannot have two different lectures at the same time.
        7. Distribute the lectures as evenly as possible throughout the week.
        ${breakInstruction}
        
        Generate a JSON output that adheres to the provided schema. The output should be a single JSON object with no extra text or markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        schedule: {
                            type: Type.ARRAY,
                            description: "An array of daily schedules.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING, description: "Day of the week (e.g., Monday)." },
                                    lectures: {
                                        type: Type.ARRAY,
                                        description: "List of lectures for the day.",
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                time: { type: Type.STRING, description: "Time slot (e.g., 09:00 - 10:00)." },
                                                subject: { type: Type.STRING, description: "Subject name." },
                                                teacher: { type: Type.STRING, description: "Teacher's name." },
                                            },
                                            required: ["time", "subject", "teacher"],
                                        },
                                    },
                                },
                                required: ["day", "lectures"],
                            },
                        },
                    },
                    required: ["schedule"],
                },
            },
        });

        const jsonStr = response.text.trim();
        const generatedData = JSON.parse(jsonStr);
        return generatedData;
    } catch (error) {
        console.error("Error generating timetable with Gemini:", error);
        throw new Error("Failed to generate timetable. Please check your inputs and try again.");
    }
};