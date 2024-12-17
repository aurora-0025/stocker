import { NextRequest } from "next/server"
import yahooFinance from "yahoo-finance2"
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol') ?? null;
    if (!symbol) return new Response("Symbol not provided", {status: 400});
    try {
        const data = await yahooFinance.quoteSummary(symbol);
        return Response.json(data);
    } catch (error) {
        console.error(error);
        return Response.json({error: "Invalid"}, {status: 400});
    }
}