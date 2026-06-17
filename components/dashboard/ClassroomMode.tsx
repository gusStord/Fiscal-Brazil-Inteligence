'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, X } from 'lucide-react';

const CLASSROOM_CLASS = 'classroom-mode';
const STORAGE_KEY = 'brazil-fiscal-classroom-mode';

export function useClassroomMode() {
  const [isActive, setIsActive] = useState(false);

  // Read from sessionStorage after hydration to avoid mismatch
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate: reading sessionStorage after hydration
        setIsActive(true);
        document.documentElement.classList.add(CLASSROOM_CLASS);
      }
    } catch {
      // sessionStorage may not be available
    }
  }, []);

  const toggle = useCallback(() => {
    setIsActive((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignore storage errors
      }
      if (next) {
        document.documentElement.classList.add(CLASSROOM_CLASS);
      } else {
        document.documentElement.classList.remove(CLASSROOM_CLASS);
      }
      return next;
    });
  }, []);

  return { isActive, toggle };
}

export default function ClassroomMode({
  isActive,
  onToggle,
}: {
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onClick={onToggle}
      className={
        isActive
          ? 'gap-1.5 text-xs font-semibold shadow-md'
          : 'gap-1.5 text-xs font-semibold'
      }
      style={
        isActive
          ? { backgroundColor: '#1a1a2e', color: 'white', borderColor: '#1a1a2e' }
          : { borderColor: '#1a1a2e', color: '#1a1a2e' }
      }
      aria-label={isActive ? 'Desativar Modo Sala de Aula' : 'Ativar Modo Sala de Aula'}
      title={isActive ? 'Desativar Modo Sala de Aula' : 'Ativar Modo Sala de Aula'}
    >
      {isActive ? (
        <>
          <X className="size-3.5" />
          <span className="hidden sm:inline">Sair Sala de Aula</span>
        </>
      ) : (
        <>
          <GraduationCap className="size-3.5" />
          <span className="hidden sm:inline">Modo Sala de Aula</span>
        </>
      )}
    </Button>
  );
}
