import { contractKeys } from '@/hooks/api/useContracts';

describe('contractKeys helpers', () => {
  test('keys structure', () => {
    expect(contractKeys.all).toEqual(['contracts']);
    expect(contractKeys.list()).toEqual(['contracts', 'list']);
    expect(contractKeys.list({ status: 'active' })).toEqual(['contracts', 'list', { status: 'active' }]);
    expect(contractKeys.detail(5)).toEqual(['contracts', 'detail', 5]);
  });
});