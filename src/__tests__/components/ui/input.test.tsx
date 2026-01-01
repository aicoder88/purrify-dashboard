import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input, SearchInput, PasswordInput } from '@/components/ui/input';

describe('Input Component', () => {
  describe('Basic Rendering', () => {
    it('renders an input element', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders with default type of text', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders with custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('applies base input styles', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('input', 'w-full', 'h-12');
    });
  });

  describe('Label', () => {
    it('renders label when provided', () => {
      render(<Input label="Email Address" />);
      const label = screen.getByText('Email Address');
      expect(label).toBeInTheDocument();
    });

    it('associates label with input via htmlFor', () => {
      render(<Input label="Username" />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', input.id);
    });

    it('shows required indicator when required prop is true', () => {
      render(<Input label="Email" required />);
      const asterisk = screen.getByText('*');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveClass('text-danger-400');
    });

    it('does not show required indicator when required is false', () => {
      render(<Input label="Email" />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('Placeholder', () => {
    it('renders with placeholder text', () => {
      render(<Input placeholder="Enter your email" />);
      const input = screen.getByPlaceholderText('Enter your email');
      expect(input).toBeInTheDocument();
    });

    it('applies placeholder styling', () => {
      render(<Input placeholder="Test placeholder" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('placeholder:text-white/40');
    });
  });

  describe('Value Changes', () => {
    it('accepts and displays typed value', async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'Hello World');
      expect(input).toHaveValue('Hello World');
    });

    it('calls onChange handler when value changes', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('works with controlled value', () => {
      const { rerender } = render(<Input value="initial" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial');

      rerender(<Input value="updated" onChange={() => {}} />);
      expect(input).toHaveValue('updated');
    });

    it('supports defaultValue', () => {
      render(<Input defaultValue="default text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('default text');
    });
  });

  describe('Disabled State', () => {
    it('can be disabled', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('does not accept input when disabled', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<Input disabled onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test');
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Error State', () => {
    it('displays error message when error prop is provided', () => {
      render(<Input error="This field is required" />);
      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
    });

    it('applies error styling to input', () => {
      render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-danger-400/60');
    });

    it('displays error icon', () => {
      render(<Input error="Error" />);
      const errorIcon = document.querySelector('svg.text-danger-400');
      expect(errorIcon).toBeInTheDocument();
    });

    it('applies error styling to label', () => {
      render(<Input label="Email" error="Invalid email" />);
      const label = screen.getByText('Email');
      expect(label).toHaveClass('text-danger-400');
    });

    it('hides helper text when error is present', () => {
      render(<Input helperText="Enter your email" error="Invalid email" />);
      expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('displays helper text when provided', () => {
      render(<Input helperText="We will never share your email" />);
      const helperText = screen.getByText('We will never share your email');
      expect(helperText).toBeInTheDocument();
    });

    it('applies helper text styling', () => {
      render(<Input helperText="Helper text" />);
      const helperText = screen.getByText('Helper text');
      expect(helperText).toHaveClass('text-sm', 'text-white/60');
    });

    it('does not display helper text when error is present', () => {
      render(<Input helperText="Helper" error="Error" />);
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });
  });

  describe('Input Types', () => {
    it('renders as email type', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders as number type', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders as tel type', () => {
      render(<Input type="tel" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('renders as url type', () => {
      render(<Input type="url" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'url');
    });

    it('renders as search type', () => {
      render(<Input type="search" />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'search');
    });
  });

  describe('Icons', () => {
    it('renders left icon when provided', () => {
      const leftIcon = <span data-testid="left-icon">Icon</span>;
      render(<Input leftIcon={leftIcon} />);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders right icon when provided', () => {
      const rightIcon = <span data-testid="right-icon">Icon</span>;
      render(<Input rightIcon={rightIcon} />);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('applies padding for left icon', () => {
      const leftIcon = <span>Icon</span>;
      render(<Input leftIcon={leftIcon} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-12');
    });

    it('applies padding for right icon', () => {
      const rightIcon = <span>Icon</span>;
      render(<Input rightIcon={rightIcon} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-12');
    });

    it('renders both icons when provided', () => {
      const leftIcon = <span data-testid="left-icon">Left</span>;
      const rightIcon = <span data-testid="right-icon">Right</span>;
      render(<Input leftIcon={leftIcon} rightIcon={rightIcon} />);

      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('Focus and Blur', () => {
    it('calls onFocus when input is focused', async () => {
      const handleFocus = jest.fn();
      const user = userEvent.setup();
      render(<Input onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      expect(handleFocus).toHaveBeenCalled();
    });

    it('calls onBlur when input loses focus', async () => {
      const handleBlur = jest.fn();
      const user = userEvent.setup();
      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalled();
    });

    it('applies focus styling to label when focused', async () => {
      const user = userEvent.setup();
      render(<Input label="Email" />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Email');

      await user.click(input);
      expect(label).toHaveClass('text-gradient');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('can focus input via ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);

      ref.current?.focus();
      expect(document.activeElement).toBe(ref.current);
    });
  });

  describe('Accessibility', () => {
    it('has accessible name via label', () => {
      render(<Input label="Email Address" />);
      const input = screen.getByRole('textbox', { name: /email address/i });
      expect(input).toBeInTheDocument();
    });

    it('can be accessed via aria-label', () => {
      render(<Input aria-label="Search input" />);
      const input = screen.getByRole('textbox', { name: /search input/i });
      expect(input).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(<Input aria-describedby="description" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'description');
    });

    it('supports aria-invalid for error state', () => {
      render(<Input aria-invalid={true} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Other HTML Attributes', () => {
    it('supports name attribute', () => {
      render(<Input name="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'email');
    });

    it('supports id attribute override', () => {
      render(<Input id="custom-id" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    it('supports maxLength attribute', () => {
      render(<Input maxLength={50} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '50');
    });

    it('supports minLength attribute', () => {
      render(<Input minLength={5} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('minLength', '5');
    });

    it('supports pattern attribute', () => {
      render(<Input pattern="[A-Za-z]+" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('pattern', '[A-Za-z]+');
    });

    it('supports autoComplete attribute', () => {
      render(<Input autoComplete="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autocomplete', 'email');
    });

    it('supports readOnly attribute', () => {
      render(<Input readOnly />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });
  });
});

describe('SearchInput Component', () => {
  it('renders with search icon', () => {
    render(<SearchInput />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has default placeholder of "Search..."', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
  });

  it('applies search-specific styling', () => {
    render(<SearchInput />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('bg-glass-subtle');
  });

  it('accepts custom placeholder', () => {
    render(<SearchInput placeholder="Find products..." />);
    const input = screen.getByPlaceholderText('Find products...');
    expect(input).toBeInTheDocument();
  });

  it('accepts typed values', async () => {
    const user = userEvent.setup();
    render(<SearchInput />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'search term');
    expect(input).toHaveValue('search term');
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('applies custom className', () => {
    render(<SearchInput className="custom-search" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-search');
  });

  it('applies left padding for the search icon', () => {
    render(<SearchInput />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('pl-12');
  });
});

describe('PasswordInput Component', () => {
  it('renders as password type by default', () => {
    render(<PasswordInput />);
    const input = document.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('has toggle button for password visibility', () => {
    render(<PasswordInput />);
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('toggles password visibility when button is clicked', async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);
    const input = document.querySelector('input');
    const toggleButton = screen.getByRole('button');

    expect(input).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('accepts and masks typed value', async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);
    const input = document.querySelector('input') as HTMLInputElement;

    await user.type(input, 'secretpassword');
    expect(input).toHaveValue('secretpassword');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('shows password when toggled', async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);
    const input = document.querySelector('input') as HTMLInputElement;
    const toggleButton = screen.getByRole('button');

    await user.type(input, 'mypassword');
    await user.click(toggleButton);

    expect(input).toHaveValue('mypassword');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('supports label prop', () => {
    render(<PasswordInput label="Password" />);
    const label = screen.getByText('Password');
    expect(label).toBeInTheDocument();
  });

  it('supports error prop', () => {
    render(<PasswordInput error="Password is too weak" />);
    const errorMessage = screen.getByText('Password is too weak');
    expect(errorMessage).toBeInTheDocument();
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<PasswordInput ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('applies custom className', () => {
    render(<PasswordInput className="custom-password" />);
    const input = document.querySelector('input');
    expect(input).toHaveClass('custom-password');
  });

  it('toggle button does not submit forms', () => {
    render(<PasswordInput />);
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveAttribute('type', 'button');
  });

  it('applies right padding for the toggle icon', () => {
    render(<PasswordInput />);
    const input = document.querySelector('input');
    expect(input).toHaveClass('pr-12');
  });
});

describe('Input Display Names', () => {
  it('Input has correct displayName', () => {
    expect(Input.displayName).toBe('Input');
  });

  it('SearchInput has correct displayName', () => {
    expect(SearchInput.displayName).toBe('SearchInput');
  });

  it('PasswordInput has correct displayName', () => {
    expect(PasswordInput.displayName).toBe('PasswordInput');
  });
});
