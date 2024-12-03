import { render, screen } from '@testing-library/react';
import { DashboardCard } from '../DashboardCard';
import { describe, it, expect } from 'vitest';

describe('DashboardCard', () => {
  it('renders card with title and value', () => {
    render(
      <DashboardCard
        title="Test Card"
        value={10}
        target={20}
        icon={<span>🎯</span>}
      />
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('calculates progress correctly', () => {
    render(
      <DashboardCard
        title="Progress Test"
        value={5}
        target={10}
        icon={<span>📊</span>}
      />
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });
});