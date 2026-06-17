'use client'

import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const fatos = [
  'Hoje, o governo gastará aproximadamente R$ 13,4 bi (R$ 4,9 tri ÷ 365 dias)',
  'A cada hora, o governo paga R$ 101,6 mi em juros da dívida (R$ 890 bi ÷ 8.760 horas)',
  'Para cada R$ 1 investido em infraestrutura, R$ 8,30 vão para custeio da máquina pública',
  'A receita municipal cresceu mais que a federal: 80% vs 39% entre 2018 e 2023',
  'Em 2020, o governo gastou R$ 2,5 mil a mais por habitante do que arrecadou',
  'Os juros da dívida custam R$ 2,4 bi por dia — mais que o orçamento anual de muitos municípios',
  'O investimento público per capita é de R$ 991/ano — menos que uma passagem de avião ida e volta SP-RJ',
]

const diasDaSemana = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo',
]

export default function FatoDoDia() {
  // Calculate day of year client-side only to avoid hydration mismatch
  const [diaDoAno, setDiaDoAno] = useState<number | null>(null)

  useEffect(() => {
    const day = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    )
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate: computing client-only value after hydration
    setDiaDoAno(day)
  }, [])

  // Don't render dynamic content until client-side calculation is ready
  if (diaDoAno === null) {
    return (
      <Card
        className="w-full border-l-4 py-4 gap-3"
        style={{ borderLeftColor: '#009C3B', backgroundColor: '#f0fdf4' }}
      >
        <CardHeader className="pb-0 pt-0 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-lg p-2 shrink-0"
              style={{ backgroundColor: '#009C3B' }}
            >
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base font-bold tracking-tight" style={{ color: '#009C3B' }}>
              Fato do Dia
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-0 pt-0">
          <p className="text-sm text-muted-foreground">Carregando fato do dia…</p>
        </CardContent>
      </Card>
    )
  }

  const fatoHoje = fatos[diaDoAno % fatos.length]
  const indiceDia = diaDoAno % fatos.length
  const nomeDia = diasDaSemana[indiceDia]

  return (
    <Card
      className="
        w-full
        border-l-4
        transition-all
        duration-300
        ease-in-out
        hover:shadow-lg
        hover:scale-[1.01]
        cursor-default
        py-4
        gap-3
      "
      style={{
        borderLeftColor: '#009C3B',
        backgroundColor: '#f0fdf4',
      }}
    >
      <CardHeader className="pb-0 pt-0 px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center rounded-lg p-2 shrink-0"
            style={{ backgroundColor: '#009C3B' }}
          >
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
            <CardTitle
              className="text-base font-bold tracking-tight"
              style={{ color: '#009C3B' }}
            >
              Fato do Dia
            </CardTitle>
            <span
              className="
                inline-flex
                items-center
                gap-1
                rounded-full
                px-2.5
                py-0.5
                text-xs
                font-medium
                w-fit
                whitespace-nowrap
              "
              style={{
                backgroundColor: '#FFDF00',
                color: '#002776',
              }}
            >
              📅 Dia {diaDoAno} do ano
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-0 pt-0">
        <div className="flex items-start gap-2">
          <span
            className="text-xs font-semibold mt-0.5 shrink-0"
            style={{ color: '#002776' }}
          >
            {nomeDia}:
          </span>
          <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
            {fatoHoje}
          </p>
        </div>
      </CardContent>

      <div
        className="mx-4 sm:mx-6 mt-1 rounded-sm h-0.5 w-16"
        style={{ backgroundColor: '#FFDF00' }}
      />
    </Card>
  )
}
