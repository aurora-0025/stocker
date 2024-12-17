import { NextRequest } from "next/server"
import yahooFinance from "yahoo-finance2"
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') ?? null;
    if (!query) return Response.json([]);
    try {
        const data = await yahooFinance.search(query, {
            "newsCount": 0,
            "enableNavLinks": false,
            "enableEnhancedTrivialQuery": false,
        });

        const filtered = data.quotes
        .filter((p) => "symbol" in p && p.symbol.endsWith("NS"))
        .map((p) => {if("symbol" in p) return {symbol: p.symbol, shortName: p.shortname}});
        return Response.json(filtered);
    } catch (error) {
        console.error(error);
        return new Response("Invalid", {status: 400});
    }
}