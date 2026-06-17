'use client';

import { fiscalData, years, populationData, type YearlyData } from '@/lib/brazil-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerCapitaItem {
  key: string;
  label: string;
  dataKey: keyof YearlyData;
  color: string;
  isImpactante?: boolean;
}

const latestYear = fiscalData[years[years.length - 1]];
const population = populationData[latestYear.year];

const perCapitaItems: PerCapitaItem[] = [
  {
    key: 'remuneracao',
    label: 'Remuneração Servidores',
    dataKey: 'remuneracao_empregados',
    color: '#6b7280',
  },
  {
    key: 'seguridade',
    label: 'Previdência',
    dataKey: 'beneficios_seguridade',
    color: '#002776',
  },
  {
    key: 'juros',
    label: 'Juros da Dívida',
    dataKey: 'juros_despesa',
    color: '#dc2626',
    isImpactante: true,
  },
  {
    key: 'sociais',
    label: 'Saúde/Benefícios Sociais',
    dataKey: 'beneficios_sociais',
    color: '#D4A017',
  },
  {
    key: 'fbcf',
    label: 'Investimento (FBCF)',
    dataKey: 'fbcf',
    color: '#009C3B',
  },
];

// Use a deterministic number formatter to avoid hydration mismatch
function formatNumber(value: number): string {
  return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function PerCapitaCard() {
  // Calculate per-capita values (data is in R$ Milhões)
  const calculated = perCapitaItems.map((item) => {
    const valueInMillions = latestYear[item.dataKey] as number;
    const perCapita = (valueInMillions * 1_000_000) / population;
    return { ...item, perCapita };
  });

  // Sort descending by perCapita
  const sorted = [...calculated].sort((a, b) => b.perCapita - a.perCapita);
  const maxValue = sorted[0]?.perCapita ?? 1;

  const formatPerCapitaValue = (value: number): string => {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(3)} mil`;
    }
    return `R$ ${value.toFixed(0)}`;
  };

  // Simpler format for bar labels: R$ X.XXX/hab
  const formatBarValue = (value: number): string => {
    return `R$ ${formatNumber(value)}/hab`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Gasto por Habitante ({latestYear.year})
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          População: {formatNumber(population)} habitantes
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sorted.map((item) => {
            const barWidth = Math.max(4, (item.perCapita / maxValue) * 100);

            return (
              <div key={item.key} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {item.label}
                    </span>
                    {item.isImpactante && (
                      <Badge
                        variant="destructive"
                        className="text-[10px] px-1.5 py-0 h-5 shrink-0"
                      >
                        ⚠️ Impactante
                      </Badge>
                    )}
                  </div>
                  <span
                    className="text-sm font-bold tabular-nums shrink-0"
                    style={{ color: item.color }}
                  >
                    {formatBarValue(item.perCapita)}
                  </span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: item.color,
                      minWidth: '2rem',
                    }}
                  >
                    {barWidth > 15 && (
                      <span className="text-[10px] font-semibold text-white whitespace-nowrap drop-shadow-sm">
                        /ano
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-5 pt-4 border-t">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Valores calculados dividindo o gasto total de cada área pela população brasileira em{' '}
            {latestYear.year}. Os juros da dívida consomem quase o mesmo por habitante que a
            previdência — um dado que surpreende a maioria dos brasileiros.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
