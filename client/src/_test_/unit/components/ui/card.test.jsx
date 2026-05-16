import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card with children', () => {
      render(
        <Card>
          <div>Card Content</div>
        </Card>
      );
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should apply glass variant', () => {
      render(<Card glass>Glass Card</Card>);
      const card = screen.getByText('Glass Card').closest('div');
      expect(card).toHaveClass('backdrop-blur-xl');
    });

    it('should apply custom className', () => {
      render(<Card className="custom-class">Custom</Card>);
      expect(screen.getByText('Custom').closest('div')).toHaveClass('custom-class');
    });

    it('should forward ref', () => {
      const ref = { current: null };
      render(<Card ref={ref}>Ref Card</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardHeader', () => {
    it('should render card header', () => {
      render(
        <Card>
          <CardHeader>Header Content</CardHeader>
        </Card>
      );
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Card>
          <CardHeader className="custom-header">Header</CardHeader>
        </Card>
      );
      expect(screen.getByText('Header')).toHaveClass('custom-header');
    });
  });

  describe('CardTitle', () => {
    it('should render card title', () => {
      render(
        <Card>
          <CardTitle>Card Title</CardTitle>
        </Card>
      );
      const title = screen.getByText('Card Title');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H3');
    });

    it('should apply custom className', () => {
      render(
        <Card>
          <CardTitle className="custom-title">Title</CardTitle>
        </Card>
      );
      expect(screen.getByText('Title')).toHaveClass('custom-title');
    });
  });

  describe('CardDescription', () => {
    it('should render card description', () => {
      render(
        <Card>
          <CardDescription>Description Text</CardDescription>
        </Card>
      );
      const desc = screen.getByText('Description Text');
      expect(desc).toBeInTheDocument();
      expect(desc.tagName).toBe('P');
    });
  });

  describe('CardContent', () => {
    it('should render card content', () => {
      render(
        <Card>
          <CardContent>Content Text</CardContent>
        </Card>
      );
      expect(screen.getByText('Content Text')).toBeInTheDocument();
    });
  });

  describe('CardFooter', () => {
    it('should render card footer', () => {
      render(
        <Card>
          <CardFooter>Footer Content</CardFooter>
        </Card>
      );
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });
  });

  describe('Complete Card Structure', () => {
    it('should render complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByText('Test Footer')).toBeInTheDocument();
    });
  });
});

