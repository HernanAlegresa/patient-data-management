import { renderHook, waitFor, act } from '@testing-library/react';
import { usePatients } from './usePatients';
import { patientsService } from '../services/patientsService';
import type { Patient } from '../types/patient';

vi.mock('../services/patientsService', () => ({
  patientsService: { getAll: vi.fn() },
}));

const alice: Patient = { id: '1', createdAt: '2024-01-01T00:00:00Z', name: 'Alice', avatar: '', website: '', description: '' };
const bob: Patient = { id: '2', createdAt: '2024-01-02T00:00:00Z', name: 'Bob', avatar: '', website: '', description: '' };

describe('usePatients', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('starts in loading state then exposes patients once the service resolves', async () => {
    vi.mocked(patientsService.getAll).mockResolvedValue([alice, bob]);
    const { result } = renderHook(() => usePatients());

    expect(result.current.loading).toBe(true);
    expect(result.current.patients).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.patients).toEqual([alice, bob]);
    expect(result.current.error).toBeNull();
  });

  it('exposes the error message and stops loading when the service rejects', async () => {
    vi.mocked(patientsService.getAll).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => usePatients());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Network error');
    expect(result.current.patients).toEqual([]);
  });

  it('does not update state after the component unmounts (cancelled flag prevents late setState)', async () => {
    let resolve!: (patients: Patient[]) => void;
    const deferred = new Promise<Patient[]>((res) => { resolve = res; });
    vi.mocked(patientsService.getAll).mockReturnValue(deferred);

    let renderCount = 0;
    const { result, unmount } = renderHook(() => {
      renderCount++;
      return usePatients();
    });

    const renderCountAtUnmount = renderCount;

    unmount();
    resolve([alice, bob]);
    // Drain the microtask queue so the resolved promise can settle
    await new Promise<void>((res) => setTimeout(res, 0));

    // Cancelled flag short-circuited setState — no new render, no patient data
    expect(renderCount).toBe(renderCountAtUnmount);
    expect(result.current.patients).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('prepends a new patient when addPatient is called', async () => {
    vi.mocked(patientsService.getAll).mockResolvedValue([alice]);
    const { result } = renderHook(() => usePatients());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.addPatient({ name: 'Charlie', avatar: '', website: '', description: '' });
    });

    expect(result.current.patients[0].name).toBe('Charlie');
    expect(result.current.patients).toHaveLength(2);
  });

  it('updates only the targeted patient when editPatient is called, leaving others unchanged', async () => {
    vi.mocked(patientsService.getAll).mockResolvedValue([alice, bob]);
    const { result } = renderHook(() => usePatients());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.editPatient('1', { name: 'Alice Updated', avatar: '', website: '', description: 'new detail' });
    });

    const updatedAlice = result.current.patients.find((p) => p.id === '1');
    const unchangedBob = result.current.patients.find((p) => p.id === '2');
    expect(updatedAlice?.name).toBe('Alice Updated');
    expect(updatedAlice?.description).toBe('new detail');
    expect(unchangedBob?.name).toBe('Bob');
  });
});
