export interface NormalizedError {
  message: string;
  fieldErrors?: Record<string, string>;
  statusCode?: number;
}

export function extractErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;

  if (error && typeof error === 'object') {
    // Axios / Standard API error response
    const response = (error as { response?: { data?: { message?: string; errors?: Array<{ field: string; message: string }> } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }

    if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
      return (error as { message: string }).message;
    }
  }

  return 'An unexpected error occurred. Please try again.';
}
