import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should merge tailwind classes and resolve conflicts', () => {
      const result = cn('px-2 py-1 bg-red-500', 'p-3 bg-[#B91C1C]');
      expect(result).toBe('p-3 bg-[#B91C1C]');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const isHovered = false;
      const result = cn('base-class', isActive && 'active-class', isHovered && 'hover-class');
      expect(result).toBe('base-class active-class');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['class-a', 'class-b'], 'class-c');
      expect(result).toBe('class-a class-b class-c');
    });
  });
});
