import { JuxEvent } from './jux-event';

document.addEventListener('jux-event', (juxEvent) => {
  const event = juxEvent as JuxEvent;

  if (event.requestType === 'upload' && event.file) {
    juxEvent.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open('POST', event.endpoint);

    xhr.upload.onprogress = (progressEvent) => {
      if (event.onProgress && progressEvent.lengthComputable) {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        event.onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        event.onResult?.(xhr.responseText);
      } else {
        event.onError?.(xhr.responseText);
      }
    };

    xhr.onerror = () => {
      event.onError?.('Error sending file. Please try again.');
    };

    xhr.send(event.file);
  }
});
