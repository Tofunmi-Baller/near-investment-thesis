import { Joyride, STATUS, type Step, type EventData, type TooltipRenderProps } from 'react-joyride'
import { useTheme } from '../ThemeContext'

interface TourProps {
  run: boolean
  onFinish: () => void
}

function CustomTooltip({ index, isLastStep, step, size, backProps, primaryProps, skipProps, tooltipProps }: TooltipRenderProps) {
  const { theme } = useTheme()
  const accentBg = theme === 'light' ? '#0052D4' : '#5B9DF5'
  const accentHover = theme === 'light' ? '#0046B8' : '#7AB3F7'

  return (
    <div
      {...tooltipProps}
      style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-card-border)',
        borderRadius: 14,
        padding: '22px 24px 18px',
        maxWidth: 340,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: 'var(--color-ink)',
        boxShadow: theme === 'light'
          ? '0 12px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'
          : '0 12px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      {/* Step counter */}
      <div style={{
        fontSize: 10,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        color: 'var(--color-ink-muted)',
        letterSpacing: '0.1em',
        marginBottom: 8,
      }}>
        {index + 1} / {size}
      </div>

      {/* Title */}
      {step.title && (
        <div style={{
          fontSize: 15,
          fontWeight: 600,
          marginBottom: 6,
          color: 'var(--color-ink)',
          lineHeight: 1.3,
        }}>
          {step.title}
        </div>
      )}

      {/* Content */}
      <div style={{
        fontSize: 13,
        lineHeight: 1.6,
        color: 'var(--color-ink-soft)',
        marginBottom: 18,
      }}>
        {step.content}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <button
          {...skipProps}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 11,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            color: 'var(--color-ink-muted)',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          Skip
        </button>

        <div style={{ display: 'flex', gap: 6 }}>
          {index > 0 && (
            <button
              {...backProps}
              style={{
                background: 'var(--color-paper-alt)',
                border: '1px solid var(--color-card-border)',
                borderRadius: 8,
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--color-ink-soft)',
                cursor: 'pointer',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              Back
            </button>
          )}

          <button
            {...primaryProps}
            style={{
              background: accentBg,
              border: 'none',
              borderRadius: 8,
              padding: '7px 16px',
              fontSize: 12,
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: "'Inter', system-ui, sans-serif",
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.background = accentHover }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.background = accentBg }}
          >
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

const steps: Step[] = [
  {
    target: '#tour-nav',
    content: 'Navigate between thesis chapters. Each section is a different dimension of the analysis — all backed by real data.',
    placement: 'right',
    title: 'Chapter Navigation',
    skipBeacon: true,
  },
  {
    target: '#tour-theme',
    content: 'Switch between light and dark mode.',
    placement: 'right',
    title: 'Theme Toggle',
    skipBeacon: true,
  },
  {
    target: '#tour-metrics',
    content: 'Five headline metrics computed from 30-day averages. Green = improved, red = declined. All numbers are honest.',
    placement: 'bottom',
    title: 'Key Metrics',
    skipBeacon: true,
  },
  {
    target: '#tour-chart-example',
    content: 'Every chart shows its data source via "VIEW SQL". All data comes from the public NEARBlocks API — no auth needed to verify.',
    placement: 'top',
    title: 'Verifiable Data',
    skipBeacon: true,
  },
  {
    target: '#section-verdict',
    content: 'The thesis includes what we tested and what failed — and what specific evidence would change the conclusion.',
    placement: 'top',
    title: 'The Verdict',
    skipBeacon: true,
  },
  {
    target: '#tour-help',
    content: 'Restart this tour any time from here.',
    placement: 'right',
    title: "That's it!",
    skipBeacon: true,
  },
]

export function Tour({ run, onFinish }: TourProps) {
  const handleEvent = (data: EventData) => {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      onFinish()
    }
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={handleEvent}
      tooltipComponent={CustomTooltip}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip',
      }}
    />
  )
}
