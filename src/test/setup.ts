import '@testing-library/jest-dom';

// Prevent happy-dom from issuing real network requests for <img> src URLs.
// Without this, in-flight fetches are aborted on environment teardown and
// produce DOMException [AbortError] noise in the test output.
vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response()));
