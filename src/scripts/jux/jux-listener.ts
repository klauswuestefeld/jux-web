import { apiRequest } from '../api-client';
import { JuxEvent } from './jux-event';

document.addEventListener('jux-event', (juxEvent) => {
  const event = juxEvent as JuxEvent;
  if (event.requestType === 'upload') {
    event.preventDefault();
    apiRequest(
      event.endpoint,
      {
        file: event.extras.file,
        onProgress: (pct: number) => event.extras?.onProgress?.(pct)
      },
      (text: string) => event.onResult?.(text),
      (err: any) => event.onError?.(err),
      undefined,            // no redirect handler
      'upload',             // requestType
      undefined,
      undefined,
      undefined,
      event.extras
    );
  }
});
