'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  DollarSign,
  CreditCard,
  TrendingUp,
  BookOpen,
  MapPin,
  Calculator,
  Wallet,
  Menu,
  X,
  ChevronRight,
  Play,
} from 'lucide-react';
import PresentationMode from '@/components/dashboard/PresentationMode';
import ClassroomMode, { useClassroomMode } from '@/components/dashboard/ClassroomMode';
import ProfessorMode, { useProfessorMode } from '@/components/dashboard/ProfessorMode';

// Brazil flag SVG icon component
function BrazilFlagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 45"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="45" fill="#009C3B" />
      <polygon points="32,3 61,22.5 32,42 3,22.5" fill="#FFDF00" />
      <circle cx="32" cy="22.5" r="12" fill="#002776" />
      <path
        d="M20 22.5 Q32 18 44 22.5 Q32 19 20 22.5"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      />
    </svg>
  );
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="size-4" />, description: 'Visão geral' },
  { href: '/receitas', label: 'Receitas', icon: <DollarSign className="size-4" />, description: 'Arrecadação e carga tributária' },
  { href: '/despesas', label: 'Despesas', icon: <CreditCard className="size-4" />, description: 'Consumo e benefícios sociais' },
  { href: '/investimentos', label: 'Investimentos', icon: <TrendingUp className="size-4" />, description: 'FBCF e capital fixo' },
  { href: '/municipios', label: 'Municípios', icon: <MapPin className="size-4" />, description: 'Dados municipais' },
  { href: '/simulador', label: 'Simulador', icon: <Calculator className="size-4" />, description: 'Simulador de política fiscal' },
  { href: '/calculadora', label: 'Calculadora', icon: <Wallet className="size-4" />, description: 'Quanto você paga de imposto' },
  { href: '/glossario', label: 'Glossário', icon: <BookOpen className="size-4" />, description: 'Termos e metodologia' },
];

export default function DashboardHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [presentationKey, setPresentationKey] = useState(0);
  const { isActive: classroomActive, toggle: toggleClassroom } = useClassroomMode();
  const { isActive: professorActive, toggle: toggleProfessor } = useProfessorMode();

  const openPresentation = () => {
    setPresentationKey((k) => k + 1);
    setPresentationOpen(true);
  };

  const closePresentation = () => {
    setPresentationOpen(false);
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-white shadow-md">
        {/* Brazilian flag gradient accent stripe */}
        <div className="w-full h-1.5 flex">
          <div className="flex-1" style={{ backgroundColor: '#009C3B' }} />
          <div className="flex-1" style={{ backgroundColor: '#FFDF00' }} />
          <div className="flex-1" style={{ backgroundColor: '#002776' }} />
        </div>

        {/* Header content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title row */}
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-3 group min-w-0">
              <BrazilFlagIcon className="w-10 h-7 sm:w-12 sm:h-8 flex-shrink-0 drop-shadow-sm transition-transform group-hover:scale-105" />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 truncate group-hover:text-[#002776] transition-colors">
                  Brazil Fiscal Intelligence
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
                  Análise de Dados Fiscais do Governo Geral | 2018-2025
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Presentation Mode Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => openPresentation()}
                className="gap-1.5 text-xs font-semibold hidden sm:flex"
                style={{ borderColor: '#002776', color: '#002776' }}
                aria-label="Modo Apresentação"
                title="Modo Apresentação"
              >
                <Play className="size-3.5" />
                <span>Apresentação</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => openPresentation()}
                className="sm:hidden"
                style={{ borderColor: '#002776', color: '#002776' }}
                aria-label="Modo Apresentação"
                title="Modo Apresentação"
              >
                <Play className="size-4" />
              </Button>

              {/* Classroom Mode Button */}
              <ClassroomMode isActive={classroomActive} onToggle={toggleClassroom} />

              {/* Professor Mode Button */}
              <ProfessorMode isActive={professorActive} onToggle={toggleProfessor} />

              <Badge
                className="hidden sm:inline-flex text-xs font-semibold px-3 py-1 shadow-sm"
                style={{
                  backgroundColor: '#009C3B',
                  color: 'white',
                  borderColor: '#009C3B',
                }}
              >
                2018-2025
              </Badge>
              <Badge
                className="sm:hidden text-xs font-semibold px-2 py-0.5 shadow-sm"
                style={{
                  backgroundColor: '#009C3B',
                  color: 'white',
                  borderColor: '#009C3B',
                }}
              >
                7 anos
              </Badge>
              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:block border-t border-gray-100" aria-label="Navegação principal">
            <div className="flex gap-1 py-2 overflow-x-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 whitespace-nowrap
                    ${
                      isActive(item.href)
                        ? 'text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  style={
                    isActive(item.href)
                      ? { backgroundColor: '#002776' }
                      : undefined
                  }
                >
                  {item.icon}
                  {item.label}
                  {isActive(item.href) && <ChevronRight className="size-3 ml-0.5" />}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile navigation menu */}
          {mobileMenuOpen && (
            <nav
              className="lg:hidden border-t border-gray-100 pb-3 animate-in slide-in-from-top-2 duration-200"
              aria-label="Navegação mobile"
            >
              <div className="grid grid-cols-1 gap-1 pt-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${
                        isActive(item.href)
                          ? 'text-white shadow-md'
                          : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                      }
                    `}
                    style={
                      isActive(item.href)
                        ? { backgroundColor: '#002776' }
                        : undefined
                    }
                  >
                    <span className={isActive(item.href) ? 'text-white' : 'text-gray-400'}>
                      {item.icon}
                    </span>
                    <div className="text-left">
                      <div>{item.label}</div>
                      <div className={`text-[10px] ${isActive(item.href) ? 'text-blue-200' : 'text-gray-400'}`}>
                        {item.description}
                      </div>
                    </div>
                    {isActive(item.href) && <ChevronRight className="size-4 ml-auto" />}
                  </Link>
                ))}
              </div>
              {/* Mobile mode buttons */}
              <div className="flex gap-2 pt-3 px-4 border-t border-gray-100 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openPresentation();
                  }}
                  className="flex-1 gap-1.5 text-xs"
                  style={{ borderColor: '#002776', color: '#002776' }}
                >
                  <Play className="size-3.5" />
                  Apresentação
                </Button>
                <Button
                  variant={classroomActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    toggleClassroom();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 gap-1.5 text-xs"
                  style={
                    classroomActive
                      ? { backgroundColor: '#1a1a2e', color: 'white', borderColor: '#1a1a2e' }
                      : { borderColor: '#1a1a2e', color: '#1a1a2e' }
                  }
                >
                  Sala de Aula
                </Button>
                <Button
                  variant={professorActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    toggleProfessor();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 gap-1.5 text-xs"
                  style={
                    professorActive
                      ? { backgroundColor: '#15803d', color: 'white', borderColor: '#15803d' }
                      : { borderColor: '#15803d', color: '#15803d' }
                  }
                >
                  🎓 Roteiro
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Presentation Mode Overlay */}
      <PresentationMode
        key={presentationKey}
        isOpen={presentationOpen}
        onClose={closePresentation}
      />
    </>
  );
}
