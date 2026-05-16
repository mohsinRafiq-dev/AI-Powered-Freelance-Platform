import * as contractsApi from '@/api/contractsApi';
import axiosInstance from '@/api/axiosInstance';

jest.mock('@/api/axiosInstance');

describe('Contracts API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMyContracts', () => {
    it('should fetch contracts with params', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [{ id: 1, status: 'active' }],
        },
      };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await contractsApi.getMyContracts({ status: 'active' });

      expect(axiosInstance.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: { status: 'active' },
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should filter out empty params', async () => {
      const mockResponse = { data: { success: true, data: [] } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      await contractsApi.getMyContracts({
        status: 'active',
        empty: '',
        undefined: undefined,
        null: null,
      });

      expect(axiosInstance.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: { status: 'active' },
        })
      );
    });
  });

  describe('getContractById', () => {
    it('should fetch contract by id', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { contract: { id: 1, status: 'active' } },
        },
      };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await contractsApi.getContractById(1);

      expect(axiosInstance.get).toHaveBeenCalledWith(expect.any(String));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createContractFromProposal', () => {
    it('should create contract from proposal', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { contract: { id: 1 } },
        },
      };
      axiosInstance.post.mockResolvedValue(mockResponse);

      const contractData = {
        proposalId: 1,
        terms: 'Test terms',
      };

      const result = await contractsApi.createContractFromProposal(contractData);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        expect.any(String),
        contractData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});

