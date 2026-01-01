import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MetricCard, StatCard, KPICard } from '@/components/ui/metric-card';

describe('MetricCard Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    it('should render metric card with title and value', () => {
      render(<MetricCard title="Total Sales" value={1234} />);

      expect(screen.getByText('Total Sales')).toBeInTheDocument();
      expect(screen.getByText('1.2K')).toBeInTheDocument();
    });

    it('should render with string value', () => {
      render(<MetricCard title="Status" value="Active" />);

      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should render with ReactNode value', () => {
      render(
        <MetricCard
          title="Custom Value"
          value={<span data-testid="custom-value">$1,234.56</span>}
        />
      );

      expect(screen.getByText('Custom Value')).toBeInTheDocument();
      expect(screen.getByTestId('custom-value')).toBeInTheDocument();
    });

    it('should format large numbers correctly', () => {
      const { rerender } = render(<MetricCard title="Sales" value={1500} />);
      expect(screen.getByText('1.5K')).toBeInTheDocument();

      rerender(<MetricCard title="Sales" value={2500000} />);
      expect(screen.getByText('2.5M')).toBeInTheDocument();

      rerender(<MetricCard title="Sales" value={3500000000} />);
      expect(screen.getByText('3.5B')).toBeInTheDocument();
    });

    it('should display small numbers without formatting', () => {
      render(<MetricCard title="Items" value={42} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  // Icon Tests
  describe('Icon Rendering', () => {
    it('should render with icon', () => {
      const TestIcon = () => <svg data-testid="test-icon" />;
      render(<MetricCard title="Sales" value={100} icon={<TestIcon />} />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render without icon when not provided', () => {
      render(<MetricCard title="Sales" value={100} />);

      // The icon container should not be present
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });
  });

  // Change/Trend Indicator Tests
  describe('Change Indicator', () => {
    it('should render increase change indicator', () => {
      render(
        <MetricCard
          title="Revenue"
          value={5000}
          change={{ value: 12.5, type: 'increase', period: 'vs last month' }}
        />
      );

      expect(screen.getByText('12.5%')).toBeInTheDocument();
      expect(screen.getByText('vs last month')).toBeInTheDocument();
    });

    it('should render decrease change indicator', () => {
      render(
        <MetricCard
          title="Expenses"
          value={3000}
          change={{ value: -8.3, type: 'decrease', period: 'vs last week' }}
        />
      );

      // formatPercentage uses Math.abs, so it displays as positive
      expect(screen.getByText('8.3%')).toBeInTheDocument();
      expect(screen.getByText('vs last week')).toBeInTheDocument();
    });

    it('should not render change indicator when not provided', () => {
      render(<MetricCard title="Static Metric" value={100} />);

      expect(screen.queryByText('%')).not.toBeInTheDocument();
    });

    it('should apply correct styling for increase', () => {
      render(
        <MetricCard
          title="Growth"
          value={1000}
          change={{ value: 15, type: 'increase', period: 'today' }}
        />
      );

      const changeIndicator = screen.getByText('15%').closest('span');
      expect(changeIndicator).toHaveClass('bg-success-500/20');
    });

    it('should apply correct styling for decrease', () => {
      render(
        <MetricCard
          title="Decline"
          value={800}
          change={{ value: -10, type: 'decrease', period: 'today' }}
        />
      );

      const changeIndicator = screen.getByText('10%').closest('span');
      expect(changeIndicator).toHaveClass('bg-danger-500/20');
    });
  });

  // Loading State Tests
  describe('Loading State', () => {
    it('should render skeleton loader when loading', () => {
      const { container } = render(
        <MetricCard title="Loading Metric" value={0} loading />
      );

      // Should have skeleton elements
      const skeletons = container.querySelectorAll('.skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should apply animate-pulse class when loading', () => {
      const { container } = render(
        <MetricCard title="Loading Metric" value={0} loading />
      );

      // Find the card element with animate-pulse class
      const cardElement = container.querySelector('.animate-pulse');
      expect(cardElement).toBeInTheDocument();
    });

    it('should render icon skeleton when loading with icon', () => {
      const TestIcon = () => <svg data-testid="test-icon" />;
      const { container } = render(
        <MetricCard title="Loading" value={0} loading icon={<TestIcon />} />
      );

      // Should have an icon skeleton placeholder
      const iconSkeleton = container.querySelector('.skeleton.h-12.w-12');
      expect(iconSkeleton).toBeInTheDocument();
    });

    it('should not show actual content when loading', () => {
      render(<MetricCard title="Test Title" value="Test Value" loading />);

      // The actual title and value should not be visible in loading state
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Value')).not.toBeInTheDocument();
    });
  });

  // Variant Tests
  describe('Variants', () => {
    it('should apply default variant styles', () => {
      const { container } = render(
        <MetricCard title="Default" value={100} variant="default" />
      );

      // Default variant should not have specific color classes
      const card = container.firstChild;
      expect(card).not.toHaveClass('border-primary-500/30');
    });

    it('should apply primary variant styles', () => {
      const { container } = render(
        <MetricCard title="Primary" value={100} variant="primary" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('border-primary-500/30');
    });

    it('should apply secondary variant styles', () => {
      const { container } = render(
        <MetricCard title="Secondary" value={100} variant="secondary" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('border-secondary-500/30');
    });

    it('should apply success variant styles', () => {
      const { container } = render(
        <MetricCard title="Success" value={100} variant="success" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('border-success-500/30');
    });

    it('should apply warning variant styles', () => {
      const { container } = render(
        <MetricCard title="Warning" value={100} variant="warning" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('border-warning-500/30');
    });

    it('should apply danger variant styles', () => {
      const { container } = render(
        <MetricCard title="Danger" value={100} variant="danger" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('border-danger-500/30');
    });
  });

  // Custom className Tests
  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <MetricCard title="Custom" value={100} className="custom-class" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(
        <MetricCard title="Merged" value={100} className="my-custom-class" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('my-custom-class');
      expect(card).toHaveClass('group');
      expect(card).toHaveClass('cursor-pointer');
    });
  });

  // Interaction Tests
  describe('Interactions', () => {
    it('should render as interactive when used in wrapper', () => {
      const handleClick = jest.fn();
      render(
        <div onClick={handleClick}>
          <MetricCard title="Clickable" value={100} />
        </div>
      );

      const card = screen.getByText('Clickable').closest('div');
      if (card) {
        fireEvent.click(card);
        expect(handleClick).toHaveBeenCalledTimes(1);
      }
    });

    it('should have cursor-pointer class for interactivity', () => {
      const { container } = render(<MetricCard title="Interactive" value={100} />);

      const card = container.firstChild;
      expect(card).toHaveClass('cursor-pointer');
    });
  });

  // Ref Forwarding Tests
  describe('Ref Forwarding', () => {
    it('should forward ref to the card element', () => {
      const ref = { current: null };
      render(<MetricCard ref={ref} title="Ref Test" value={100} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('should have proper text hierarchy', () => {
      render(
        <MetricCard
          title="Accessible Card"
          value={1500}
          change={{ value: 5, type: 'increase', period: 'today' }}
        />
      );

      // Title should be present and readable
      expect(screen.getByText('Accessible Card')).toBeInTheDocument();
      // Value should be present
      expect(screen.getByText('1.5K')).toBeInTheDocument();
      // Change should be present
      expect(screen.getByText('5%')).toBeInTheDocument();
    });
  });
});

describe('StatCard Component', () => {
  it('should render StatCard with up trend', () => {
    const { container } = render(
      <StatCard title="Trending Up" value={500} trend="up" />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('border-success-500/20');
  });

  it('should render StatCard with down trend', () => {
    const { container } = render(
      <StatCard title="Trending Down" value={300} trend="down" />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('border-danger-500/20');
  });

  it('should render StatCard with stable trend', () => {
    const { container } = render(
      <StatCard title="Stable" value={400} trend="stable" />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('border-accent-500/20');
  });

  it('should render StatCard without trend', () => {
    render(<StatCard title="No Trend" value={200} />);

    expect(screen.getByText('No Trend')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('should forward ref to StatCard', () => {
    const ref = { current: null };
    render(<StatCard ref={ref} title="Ref Test" value={100} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should apply custom className to StatCard', () => {
    const { container } = render(
      <StatCard title="Custom" value={100} className="stat-custom" />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('stat-custom');
  });
});

describe('KPICard Component', () => {
  it('should render KPICard with progress bar', () => {
    const { container } = render(
      <KPICard title="Sales Target" value={7500} target={10000} progress={7500} />
    );

    expect(screen.getByText('Sales Target')).toBeInTheDocument();
    expect(screen.getByText('7.5K')).toBeInTheDocument();

    // Check for progress bar
    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should calculate progress percentage correctly', () => {
    const { container } = render(
      <KPICard title="Progress" value={5000} target={10000} progress={5000} />
    );

    // 5000/10000 = 50%
    const progressBar = container.querySelector('[style*="width: 50%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should cap progress at 100%', () => {
    const { container } = render(
      <KPICard title="Exceeded" value={12000} target={10000} progress={12000} />
    );

    // Should cap at 100% even if progress exceeds target
    const progressBar = container.querySelector('[style*="width: 100%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should not render progress bar without target and progress', () => {
    const { container } = render(
      <KPICard title="No Progress" value={1000} />
    );

    // Should not have progress bar
    const progressBar = container.querySelector('.h-1.bg-white\\/10');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('should forward ref to KPICard', () => {
    const ref = { current: null };
    render(
      <KPICard ref={ref} title="Ref Test" value={100} target={200} progress={100} />
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should apply custom className to KPICard', () => {
    const { container } = render(
      <KPICard
        title="Custom"
        value={100}
        target={200}
        progress={100}
        className="kpi-custom"
      />
    );

    // The className should be on the MetricCard inside
    expect(container.querySelector('.kpi-custom')).toBeInTheDocument();
  });
});

describe('MetricCard Edge Cases', () => {
  it('should handle zero value', () => {
    render(<MetricCard title="Zero" value={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should handle negative values', () => {
    render(<MetricCard title="Negative" value={-500} />);
    expect(screen.getByText('-500')).toBeInTheDocument();
  });

  it('should handle very large numbers', () => {
    render(<MetricCard title="Large" value={9999999999} />);
    expect(screen.getByText('10.0B')).toBeInTheDocument();
  });

  it('should handle decimal values', () => {
    render(<MetricCard title="Decimal" value={99.9} />);
    expect(screen.getByText('99.9')).toBeInTheDocument();
  });

  it('should handle empty string value', () => {
    render(<MetricCard title="Empty" value="" />);
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('should handle special characters in title', () => {
    render(<MetricCard title="Sales & Revenue %" value={100} />);
    expect(screen.getByText('Sales & Revenue %')).toBeInTheDocument();
  });

  it('should handle change value of zero', () => {
    render(
      <MetricCard
        title="No Change"
        value={100}
        change={{ value: 0, type: 'increase', period: 'today' }}
      />
    );
    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('should handle long period text', () => {
    render(
      <MetricCard
        title="Long Period"
        value={100}
        change={{
          value: 5,
          type: 'increase',
          period: 'compared to the same period last year'
        }}
      />
    );
    expect(screen.getByText('compared to the same period last year')).toBeInTheDocument();
  });
});
