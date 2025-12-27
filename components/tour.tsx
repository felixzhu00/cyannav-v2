'use client'

import React, { useEffect, useState } from 'react'
import Joyride, { CallBackProps, STATUS, EVENTS, Step } from 'react-joyride'
import { HelpCircle } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { dashboardSteps, userSettingsSteps } from '@/lib/const'

export const stepsDictionary: Record<string, Step[]> = {
  '/dashboard': dashboardSteps,
  '/user': userSettingsSteps,
}

export const DashboardTour = () => {
  const [run, setRun] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const { theme } = useTheme()

  const isDark = theme === 'dark'

  // Display different help base on path
  const pathname = usePathname()

  const steps = stepsDictionary[pathname] || []
  const stepWithoutBeacon = steps.map((step) => ({
    ...step,
    disableBeacon: true,
  }))

  useEffect(() => setMounted(true), [])

  const handleCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data

    // End tour on finish, skip, or close
    if (
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ||
      action === 'close' ||
      type === EVENTS.TOUR_END
    ) {
      setRun(false)
      setStepIndex(0)
      return
    }

    // Advance step if needed
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + 1)
    }
  }

  if (!mounted) return null

  return (
    <>
      <Joyride
        steps={stepWithoutBeacon}
        run={run}
        stepIndex={stepIndex}
        callback={handleCallback}
        showSkipButton
        showProgress
        scrollToFirstStep
        continuous
        spotlightPadding={12}
        disableScrolling
        scrollOffset={50}
        disableOverlayClose // prevent closing by clicking outside
        disableCloseOnEsc // prevent closing with ESC
        disableOverlay={false}
        hideBackButton={false}
        styles={{
          options: {
            zIndex: 9999,
            primaryColor: isDark ? '#3b82f6' : '#2563eb',
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            textColor: isDark ? '#f9fafb' : '#1f2937',
            overlayColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',
          },
          spotlight: {
            borderRadius: 12,
            boxShadow: isDark
              ? '0 0 0 4px rgba(59, 130, 246, 0.4)'
              : '0 0 0 4px rgba(37, 99, 235, 0.5)',
          },
          buttonNext: {
            backgroundColor: isDark ? '#3b82f6' : '#2563eb',
            color: '#fff',
          },
          buttonBack: {
            color: isDark ? '#9ca3af' : '#6b7280',
          },
          buttonSkip: {
            color: isDark ? '#f87171' : '#ef4444',
          },
          tooltipContainer: {
            borderRadius: '0.5rem',
            padding: '1rem',
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
          },
          tooltipContent: {
            fontSize: '0.95rem',
            color: isDark ? '#f9fafb' : '#1f2937',
          },
        }}
      />

      <HelpCircle
        className="h-7 w-7 cursor-pointer"
        onClick={() => {
          setStepIndex(0)
          setRun(true)
        }}
        id="navbar-help-icon"
      />
    </>
  )
}
