import { NextResponse } from 'next/server';
import { fiscalData, years, calculateIndices, quizQuestions, curiosities, benchmarkData } from '@/lib/brazil-data';

export async function GET() {
  const indicesByYear = years.reduce((acc, year) => {
    acc[year] = calculateIndices(fiscalData[year]);
    return acc;
  }, {} as Record<number, ReturnType<typeof calculateIndices>>);

  return NextResponse.json({
    fiscalData,
    years,
    indices: indicesByYear,
    quizQuestions,
    curiosities,
    benchmarkData,
  });
}
