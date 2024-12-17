import { NextRequest } from "next/server"
import yahooFinance from "yahoo-finance2"
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol') ?? null;
    const period1 = searchParams.get('period1') ?? null;
    const period2 = searchParams.get('period2') ?? null;
    const interval = searchParams.get('interval') as ("1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "90m" | "1h" | "1d" | "1mo" | "5d" | "1wk" | "3mo" | null);
    
    if (!symbol) return new Response("Symbol not provided", {status: 400});
    if (!period1) return new Response("period1 not provided", {status: 400});
    if (!period2) return new Response("period2 not provided", {status: 400});
    if (!interval) return new Response("interval not provided", {status: 400});

    try {
        const data = await yahooFinance.chart(symbol, { interval, period1 });
        return Response.json(data);
    } catch (error) {
        console.error(error);
        return new Response("Invalid", {status: 400});
    }
}