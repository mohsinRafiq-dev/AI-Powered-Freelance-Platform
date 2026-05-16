import {
  debounce,
  throttle,
  deepClone,
  isEmptyObject,
  getUniqueValues,
  sortByKey,
  groupBy,
  generateId,
  sleep,
  copyToClipboard,
  isInViewport,
  scrollToElement,
  parseQueryString,
  buildQueryString,
  isValidJSON,
  getFileExtension,
  isFileTypeAllowed,
  calculateReadingTime,
  getContrastColor,
  removeDuplicatesByKey,
} from '@/utils/helpers';

describe('helpers', () => {
  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce function calls', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 300);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should use default wait time of 300ms', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func);

      debouncedFunc();
      jest.advanceTimersByTime(300);

      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should throttle function calls', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 300);

      throttledFunc();
      throttledFunc();
      throttledFunc();

      expect(func).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(300);
      throttledFunc();

      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('deepClone', () => {
    it('should deep clone objects', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);

      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('should handle null and non-objects', () => {
      expect(deepClone(null)).toBe(null);
      expect(deepClone(42)).toBe(42);
      expect(deepClone('string')).toBe('string');
    });
  });

  describe('isEmptyObject', () => {
    it('should return true for empty objects', () => {
      expect(isEmptyObject({})).toBe(true);
    });

    it('should return false for non-empty objects', () => {
      expect(isEmptyObject({ a: 1 })).toBe(false);
    });

    it('should return false for non-objects', () => {
      expect(isEmptyObject(null)).toBe(false);
      expect(isEmptyObject(undefined)).toBe(false);
      expect(isEmptyObject([])).toBe(false);
      expect(isEmptyObject('string')).toBe(false);
      expect(isEmptyObject(123)).toBe(false);
    });
  });

  describe('getUniqueValues', () => {
    it('should return unique values from array', () => {
      expect(getUniqueValues([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(getUniqueValues(['a', 'b', 'a'])).toEqual(['a', 'b']);
    });
  });

  describe('sortByKey', () => {
    it('should sort array by key in ascending order', () => {
      const arr = [{ id: 3 }, { id: 1 }, { id: 2 }];
      const sorted = sortByKey(arr, 'id', 'asc');
      expect(sorted).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });

    it('should sort array by key in descending order', () => {
      const arr = [{ id: 3 }, { id: 1 }, { id: 2 }];
      const sorted = sortByKey(arr, 'id', 'desc');
      expect(sorted).toEqual([{ id: 3 }, { id: 2 }, { id: 1 }]);
    });
  });

  describe('groupBy', () => {
    it('should group array by key', () => {
      const arr = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];
      const grouped = groupBy(arr, 'type');
      expect(grouped).toEqual({
        a: [{ type: 'a', value: 1 }, { type: 'a', value: 3 }],
        b: [{ type: 'b', value: 2 }],
      });
    });
  });

  describe('generateId', () => {
    it('should generate random ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('should generate ID with custom length', () => {
      const id = generateId(10);
      expect(id.length).toBe(10);
    });
  });

  describe('sleep', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should wait for specified time', async () => {
      const promise = sleep(1000);
      jest.advanceTimersByTime(1000);
      await promise;
      expect(true).toBe(true);
    });
  });

  describe('copyToClipboard', () => {
    it('should copy text to clipboard using modern API', async () => {
      const mockWriteText = jest.fn().mockResolvedValue();
      global.navigator.clipboard = {
        writeText: mockWriteText,
      };
      window.isSecureContext = true;

      const result = await copyToClipboard('test text');
      expect(result).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('test text');
    });

    it('should fallback to execCommand for older browsers', async () => {
      global.navigator.clipboard = undefined;
      document.execCommand = jest.fn().mockReturnValue(true);

      const result = await copyToClipboard('test text');
      expect(result).toBe(true);
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
  });

  describe('isInViewport', () => {
    it('should check if element is in viewport', () => {
      const element = {
        getBoundingClientRect: jest.fn().mockReturnValue({
          top: 100,
          left: 100,
          bottom: 200,
          right: 200,
        }),
      };
      window.innerHeight = 1000;
      window.innerWidth = 1000;

      expect(isInViewport(element)).toBe(true);
    });

    it('should return false if element is outside viewport', () => {
      const element = {
        getBoundingClientRect: jest.fn().mockReturnValue({
          top: -100,
          left: 100,
          bottom: 0,
          right: 200,
        }),
      };
      window.innerHeight = 1000;
      window.innerWidth = 1000;

      expect(isInViewport(element)).toBe(false);
    });
  });

  describe('scrollToElement', () => {
    beforeEach(() => {
      window.scrollTo = jest.fn();
      document.getElementById = jest.fn();
    });

    it('should scroll to element', () => {
      const element = {
        getBoundingClientRect: jest.fn().mockReturnValue({
          top: 100,
        }),
      };
      document.getElementById.mockReturnValue(element);
      window.pageYOffset = 0;

      scrollToElement('test-id', 50);
      expect(window.scrollTo).toHaveBeenCalled();
    });

    it('should not scroll if element not found', () => {
      document.getElementById.mockReturnValue(null);
      scrollToElement('non-existent');
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('parseQueryString', () => {
    it('should parse query string to object', () => {
      const result = parseQueryString('?a=1&b=2');
      expect(result).toEqual({ a: '1', b: '2' });
    });
  });

  describe('buildQueryString', () => {
    it('should build query string from object', () => {
      const result = buildQueryString({ a: 1, b: 'test' });
      expect(result).toBe('a=1&b=test');
    });

    it('should skip null and undefined values', () => {
      const result = buildQueryString({ a: 1, b: null, c: undefined, d: '' });
      expect(result).toBe('a=1');
    });
  });

  describe('isValidJSON', () => {
    it('should validate JSON strings', () => {
      expect(isValidJSON('{"a":1}')).toBe(true);
      expect(isValidJSON('invalid')).toBe(false);
      expect(isValidJSON('')).toBe(false);
    });
  });

  describe('getFileExtension', () => {
    it('should get file extension', () => {
      expect(getFileExtension('test.txt')).toBe('txt');
      expect(getFileExtension('file.name.js')).toBe('js');
    });
  });

  describe('isFileTypeAllowed', () => {
    it('should check if file type is allowed', () => {
      expect(isFileTypeAllowed('image/jpeg', ['image/jpeg', 'image/png'])).toBe(true);
      expect(isFileTypeAllowed('image/gif', ['image/jpeg', 'image/png'])).toBe(false);
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time', () => {
      const text = 'word '.repeat(200);
      expect(calculateReadingTime(text)).toBe(1);
      expect(calculateReadingTime(text, 100)).toBe(2);
    });
  });

  describe('getContrastColor', () => {
    it('should return black for light colors', () => {
      expect(getContrastColor('#FFFFFF')).toBe('black');
      expect(getContrastColor('#FF0000')).toBe('black');
    });

    it('should return white for dark colors', () => {
      expect(getContrastColor('#000000')).toBe('white');
      expect(getContrastColor('#000080')).toBe('white');
    });
  });

  describe('removeDuplicatesByKey', () => {
    it('should remove duplicates by key', () => {
      const arr = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 1, name: 'c' },
      ];
      const result = removeDuplicatesByKey(arr, 'id');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
  });
});


