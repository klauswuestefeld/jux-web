import { backendRequest, getBackendUrl } from '../api-client';
import { JuxEvent } from './jux-event';

const getApiUrl = (): string => getBackendUrl() + 'api/';

document.addEventListener('jux-event', (juxEvent) => {
  const event = juxEvent as JuxEvent;
  if (event.requestType === 'upload' && event.file) {
    event.preventDefault();
    backendRequest(
      getApiUrl() + event.endpoint,
      {
        file: event.file,
        method: 'POST',
        onProgress: (pct: number) => event.onProgress?.(pct)
      },
      (text: string) => event.onResult?.(text),
      (err: any) => event.onError?.(err),
      undefined,            // no redirect handler
      'upload'              // requestType
    );
  }
});
