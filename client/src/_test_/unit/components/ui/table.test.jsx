import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Table, { TablePagination } from '@/components/ui/table';

describe('Table', () => {
  const mockColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
  ];

  const mockData = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
  ];

  it('should render table with data', () => {
    render(<Table columns={mockColumns} data={mockData} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<Table columns={mockColumns} data={[]} isLoading={true} />);
    expect(screen.queryByText('Name')).not.toBeInTheDocument();
    // Check for skeleton loaders
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should show empty message when no data', () => {
    render(<Table columns={mockColumns} data={[]} emptyMessage="No users found" />);
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('should use custom render function', () => {
    const columnsWithRender = [
      { header: 'Name', accessor: 'name' },
      {
        header: 'Actions',
        render: (row) => <button>Edit {row.name}</button>,
      },
    ];
    render(<Table columns={columnsWithRender} data={mockData} />);
    expect(screen.getByText('Edit John Doe')).toBeInTheDocument();
  });

  it('should apply striped styling', () => {
    render(<Table columns={mockColumns} data={mockData} striped={true} />);
    const rows = screen.getAllByRole('row');
    // Striped class is applied when rowIndex % 2 === 1
    // In data.map, rowIndex 0 = first data row (no stripe), rowIndex 1 = second data row (has stripe)
    // rows[0] = header row
    // rows[1] = first data row (rowIndex 0, no stripe)
    // rows[2] = second data row (rowIndex 1, has stripe)
    const secondDataRow = rows[2]; // Second data row should have stripe
    // Check if className includes the striped class (accounting for whitespace)
    const className = secondDataRow.className.replace(/\s+/g, ' ');
    expect(className).toContain('bg-gray-50/50');
  });

  it('should apply hoverable styling', () => {
    render(<Table columns={mockColumns} data={mockData} hoverable={true} />);
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveClass('hover:bg-brand-light/40');
  });

  it('should apply custom className', () => {
    render(<Table columns={mockColumns} data={mockData} className="custom-table" />);
    const table = screen.getByText('Name').closest('.rounded-xl');
    expect(table).toHaveClass('custom-table');
  });

  it('should use column width when provided', () => {
    const columnsWithWidth = [
      { header: 'Name', accessor: 'name', width: '200px' },
      { header: 'Email', accessor: 'email' },
    ];
    render(<Table columns={columnsWithWidth} data={mockData} />);
    const nameHeader = screen.getByText('Name');
    expect(nameHeader.closest('th')).toHaveStyle({ width: '200px' });
  });

  it('should apply header and cell className', () => {
    const columnsWithClasses = [
      {
        header: 'Name',
        accessor: 'name',
        headerClassName: 'custom-header',
        cellClassName: 'custom-cell',
      },
    ];
    render(<Table columns={columnsWithClasses} data={mockData} />);
    expect(screen.getByText('Name')).toHaveClass('custom-header');
    expect(screen.getByText('John Doe')).toHaveClass('custom-cell');
  });
});

describe('TablePagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: jest.fn(),
    pageSize: 10,
    totalItems: 50,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render pagination info', () => {
    render(<TablePagination {...defaultProps} />);
    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
    // Use getAllByText for "1" since it appears multiple times
    const ones = screen.getAllByText('1');
    expect(ones.length).toBeGreaterThan(0);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('should call onPageChange when next button is clicked', async () => {
    const onPageChange = jest.fn();
    render(<TablePagination {...defaultProps} onPageChange={onPageChange} />);
    
    const nextButton = screen.getByLabelText('Next page');
    await userEvent.click(nextButton);
    
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when previous button is clicked', async () => {
    const onPageChange = jest.fn();
    render(<TablePagination {...defaultProps} currentPage={2} onPageChange={onPageChange} />);
    
    const prevButton = screen.getByLabelText('Previous page');
    await userEvent.click(prevButton);
    
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should disable previous button on first page', () => {
    render(<TablePagination {...defaultProps} currentPage={1} />);
    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(<TablePagination {...defaultProps} currentPage={5} totalPages={5} />);
    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('should show page numbers', () => {
    render(<TablePagination {...defaultProps} currentPage={3} totalPages={5} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should call onPageChange when page number is clicked', async () => {
    const onPageChange = jest.fn();
    render(<TablePagination {...defaultProps} currentPage={2} onPageChange={onPageChange} />);
    
    const pageButton = screen.getByText('3');
    await userEvent.click(pageButton);
    
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('should highlight current page', () => {
    render(<TablePagination {...defaultProps} currentPage={2} />);
    const currentPageButton = screen.getByText('2');
    expect(currentPageButton).toHaveClass('bg-gradient-to-r');
  });

  it('should show ellipsis for large page counts', () => {
    render(<TablePagination {...defaultProps} currentPage={5} totalPages={10} />);
    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThan(0);
  });
});

