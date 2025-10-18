import { render, screen } from '@testing-library/react'
import { ChartComponent } from '../chart'
import { GeneralRoomData, Indicator, Unit } from '@/app/type'

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="chart">Chart Component</div>
}))

jest.mock('chart.js/auto', () => ({
  Chart: {
    register: jest.fn(),
  },
  Colors: {},
}))

const mockReadings = {
  '2024-01-01': [
    { hour: '09:00', value: 25.5 },
    { hour: '10:00', value: 26.2 },
  ],
  '2024-01-02': [
    { hour: '09:00', value: 24.8 },
    { hour: '10:00', value: 25.1 },
  ]
}

const mockGeneralRoomData: GeneralRoomData = {
  indicators_pollutants: ['CO2', 'TEMP'] as Indicator[],
  headquarter: { id: 1, name: 'Test HQ' },
  name: 'Test Room',
  room_id: 1
}

describe('ChartComponent', () => {
  const defaultProps = {
    readings: mockReadings,
    generalRoomData: mockGeneralRoomData,
    indicator: 'CO2' as Indicator,
    unit: 'PPM' as Unit,
    start: '2024-01-01',
    end: '2024-01-02'
  }

  it('renders without crashing', () => {
    render(<ChartComponent {...defaultProps} />)
    expect(screen.getByText('Gráfica de datos')).toBeInTheDocument()
  })

  it('shows no results message when readings are empty', () => {
    render(<ChartComponent {...defaultProps} readings={{}} />)
    expect(screen.getByText('No se encontraron resultados')).toBeInTheDocument()
  })

  it('handles undefined hour values gracefully', () => {
    const readingsWithUndefined = {
      '2024-01-01': [
        { hour: undefined, value: 25.5 },
        { hour: '10:00', value: 26.2 },
      ]
    }
    
    expect(() => {
      render(<ChartComponent {...defaultProps} readings={readingsWithUndefined} />)
    }).not.toThrow()
  })

  it('renders chart when readings have data', () => {
    render(<ChartComponent {...defaultProps} />)
    expect(screen.getByTestId('chart')).toBeInTheDocument()
  })

  it('displays threshold information', () => {
    render(<ChartComponent {...defaultProps} />)
    expect(screen.getByText('Umbrales:')).toBeInTheDocument()
  })
})