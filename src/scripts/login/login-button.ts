import { THRESHOLD_WIDTH } from './utils/constants';
import { getTranslation } from '../jux/language';

const icons = {
  email: '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 64.000000 48.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)" fill="#080808" stroke="none"> <path d="M44 468 c-38 -18 -44 -51 -44 -228 0 -180 6 -210 47 -229 33 -15 513 -15 546 0 41 19 47 49 47 229 0 180 -6 210 -47 229 -31 14 -519 14 -549 -1z m516 -33 c0 -7 -232 -205 -240 -205 -8 0 -240 198 -240 205 0 3 108 5 240 5 132 0 240 -2 240 -5z m-406 -118 l59 -53 -87 -97 -86 -97 0 170 0 171 28 -20 c15 -11 54 -44 86 -74z m446 -77 l0 -170 -85 95 c-47 53 -85 98 -85 99 0 5 162 146 167 146 1 0 3 -77 3 -170z m-319 -31 l39 -31 40 32 39 31 33 -37 c18 -21 57 -65 87 -99 l53 -60 -126 -3 c-69 -1 -183 -1 -252 0 l-126 3 84 97 c46 53 85 97 87 97 2 1 21 -13 42 -30z"/>  </g> </svg>',
  google: '<svg viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>',
  linkedin: '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="100%" height="100%" viewBox="1.786 1.783 76.226652 76.248" version="1.1" id="svg72" sodipodi:docname="linkedin.svg" inkscape:version="0.92.4 (5da689c313, 2019-01-14)"> <metadata id="metadata78"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <defs id="defs76" /> <sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="1916" inkscape:window-height="1036" id="namedview74" showgrid="false" inkscape:zoom="0.79365665" inkscape:cx="428.70379" inkscape:cy="325.16058" inkscape:window-x="0" inkscape:window-y="20" inkscape:window-maximized="0" inkscape:current-layer="svg72" inkscape:pagecheckerboard="false" /> <path d="m 2.10821,7.2952417 c 0,-3.015 2.508,-5.462 5.6,-5.462 h 64.568 c 3.093,0 5.6,2.447 5.6,5.462 V 72.620242 c 0,3.016 -2.507,5.461 -5.6,5.461 h -64.568 c -3.092,0 -5.6,-2.445 -5.6,-5.46 V 7.2942417 Z" id="path64" inkscape:connector-curvature="0" style="fill:#0b78b7;fill-opacity:1" /> <path d="m 25.07621,65.660242 v -34.43 h -11.444 v 34.43 h 11.445 z m -5.72,-39.13 c 3.99,0 6.474,-2.644 6.474,-5.948 -0.075,-3.379 -2.484,-5.949 -6.398,-5.949 -3.917,0 -6.475,2.57 -6.475,5.949 0,3.304 2.483,5.948 6.324,5.948 h 0.074 z m 12.054,39.13 h 11.443 v -19.225 c 0,-1.028 0.075,-2.058 0.377,-2.792 0.827,-2.057 2.71,-4.186 5.872,-4.186 4.14,0 5.797,3.157 5.797,7.786 v 18.417 h 11.443 v -19.741 c 0,-10.575 -5.645,-15.496 -13.174,-15.496 -6.173,0 -8.884,3.45 -10.39,5.8 h 0.076 v -4.992 h -11.443 c 0.149,3.23 -0.001,34.43 -0.001,34.43 z" id="path70" inkscape:connector-curvature="0" style="fill:#ffffff" /> </svg>',
  microsoft: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 21 21"><title>MS-SymbolLockup</title><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>',
  sso: '<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.77 15.71"><path d="M3.69,10.39h-1.23c-1.13-.12-1.98-1.08-1.96-2.18.02-1.15.98-2.11,2.16-2.13l.04-1.08c-.03-.9.51-1.72,1.34-2.03.87-.33,1.83-.2,2.38.57C6.86,1.27,9.13.08,11.1.63c1.72.48,2.9,2.25,2.59,4.22,1.18.56,1.76,1.77,1.54,3.04-.19,1.11-1.07,2.04-2.25,2.43" style="fill: none; stroke: #080808; stroke-linecap: round; stroke-linejoin: round;"/> <circle cx="8.28" cy="7.58" r=".61" style="fill: #080808;"/><path d="M8.28,5.66c-.84,0-1.5.28-1.92.54-.31.18-.5.51-.5.87v2.13c0,.74,1.34,1.05,1.34,1.05v3.83s1.09,1.14,1.09,1.14c0,0,1.09-1.14,1.09-1.14v-3.83s1.34-.31,1.34-1.05v-2.13c0-.36-.19-.69-.5-.87-.43-.25-1.09-.54-1.92-.54Z" style="fill: none; stroke: #080808; stroke-linecap: round; stroke-linejoin: round;"/></svg>',
  'email-password': '<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.77 15.71">  <path d="M4.74,8.2c.05.02.08.07.08.14s-.05.18-.14.33c-.09.16-.16.25-.22.29s-.11.04-.16,0l-1.25-.91.16,1.54c.01.06-.01.1-.08.13s-.18.05-.36.05-.3-.02-.36-.05-.09-.08-.08-.13l.16-1.54-1.24.91s-.1.04-.16,0-.13-.13-.22-.29c-.09-.15-.14-.26-.14-.33s.02-.11.08-.14l1.41-.63-1.41-.62c-.05-.03-.08-.08-.08-.14s.05-.18.14-.33.16-.25.22-.28.11-.04.16,0l1.24.9-.16-1.53c-.01-.06.01-.11.08-.14s.18-.05.36-.05.3.02.36.05.09.08.08.14l-.16,1.53,1.25-.9s.1-.04.16,0,.13.13.22.29c.09.15.14.26.14.33s-.02.12-.08.14l-1.41.62,1.41.63Z" style="fill: #080808;"/>  <path d="M9.85,8.2c.05.02.08.07.08.14s-.05.18-.14.33c-.09.16-.16.25-.22.29s-.11.04-.16,0l-1.25-.91.16,1.54c.01.06-.01.1-.08.13s-.18.05-.36.05-.3-.02-.36-.05-.09-.08-.08-.13l.16-1.54-1.24.91s-.1.04-.16,0-.13-.13-.22-.29c-.09-.15-.14-.26-.14-.33s.02-.11.08-.14l1.41-.63-1.41-.62c-.05-.03-.08-.08-.08-.14s.05-.18.14-.33.16-.25.22-.28.11-.04.16,0l1.24.9-.16-1.53c-.01-.06.01-.11.08-.14s.18-.05.36-.05.3.02.36.05.09.08.08.14l-.16,1.53,1.25-.9s.1-.04.16,0,.13.13.22.29c.09.15.14.26.14.33s-.02.12-.08.14l-1.41.62,1.41.63Z" style="fill: #080808;"/>  <path d="M14.95,8.2c.05.02.08.07.08.14s-.05.18-.14.33c-.09.16-.16.25-.22.29s-.11.04-.16,0l-1.25-.91.16,1.54c.01.06-.01.1-.08.13s-.18.05-.36.05-.3-.02-.36-.05-.09-.08-.08-.13l.16-1.54-1.24.91s-.1.04-.16,0-.13-.13-.22-.29c-.09-.15-.14-.26-.14-.33s.02-.11.08-.14l1.41-.63-1.41-.62c-.05-.03-.08-.08-.08-.14s.05-.18.14-.33.16-.25.22-.28.11-.04.16,0l1.24.9-.16-1.53c-.01-.06.01-.11.08-.14s.18-.05.36-.05.3.02.36.05.09.08.08.14l-.16,1.53,1.25-.9s.1-.04.16,0,.13.13.22.29c.09.15.14.26.14.33s-.02.12-.08.14l-1.41.62,1.41.63Z" style="fill: #080808;"/></svg>',
  'guest': '<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 15.77 15.71">  <defs>    <clipPath id="clippath">      <ellipse cx="7.89" cy="7.86" rx="7.89" ry="7.87" style="fill: none;"/>    </clipPath>  </defs>  <g style="clip-path: url(#clippath);">    <rect width="15.83" height="15.83" style="fill: #cfd0e3;"/>    <ellipse cx="7.89" cy="6.45" rx="3.16" ry="3.13" style="fill: #646573;"/>    <path d="M12.74,16.29c.33,0,.58-.3.54-.63-.31-2.67-2.61-4.75-5.39-4.75s-5.08,2.08-5.39,4.75c-.04.33.21.63.54.63" style="fill: #646573;"/>  </g></svg>',
}

const applyComponentStyle = (component: HTMLElement, isSeparete?: boolean, isSentralized?: boolean) => {
  component.style.alignItems = 'center';
  component.style.background = '#fff';
  component.style.border = 'thin solid #888';
  component.style.borderRadius = '5px';
  component.style.boxShadow = '1px 1px 1px grey';
  component.style.boxSizing = 'content - box';
  component.style.color = '#444';
  component.style.display = 'flex';
  component.style.justifyContent = isSentralized ? 'center' :'flex-start';
  component.style.gap = '14px';
  component.style.position = 'relative';
  component.style.height = '52px';
  component.style.marginTop = isSeparete ? '32px' : '16px';
  component.style.padding = '0 14px';
  component.style.whiteSpace = 'nowrap';
  component.style.width = '326px';
  component.style.boxSizing = 'content-box';
}

const applyLabelStyle = (label: HTMLElement) => {
  label.style.display = 'inline-block';
  label.style.fontSize = '21px';
  label.style.fontWeight = '500';
  label.style.gridColumnStart = '3';
  label.style.textAlign = 'center';
}

export const loginButton = (type: string, fn: any, isSeparete?: boolean, isSentralized?: boolean): HTMLElement => {
  const loweredCasedType = type.toLowerCase();
  const result = document.createElement('login-button');
  applyComponentStyle(result, isSeparete, isSentralized);
  result.tabIndex = 0;
  result.setAttribute('data-cy', `${loweredCasedType}-button`);
  
  // @ts-ignore
  const iconHTML = icons[loweredCasedType];
  
  if (iconHTML) {
    const icon = document.createElement('login-icon');
    icon.style.gridColumnStart = '2';
  
    icon.style.width = '32px';
    icon.style.padding = '6px 0';
    icon.style.margin = '0';
    icon.style.boxSizing = 'content-box';
    icon.className = 'ico';

    icon.innerHTML = iconHTML;
    result.appendChild(icon);
  }

  const label = document.createElement('login-label');
  
  label.textContent = window.innerWidth <= THRESHOLD_WIDTH ? type : getTranslation(`${loweredCasedType}-label`);
  applyLabelStyle(label);
  result.appendChild(label);
  
  result.addEventListener('click', fn);
  result.addEventListener('mouseenter', (_ev) => {
    result.style.cursor = 'pointer';
    result.style.boxShadow = '3px 3px 6px #80808086';
  });
  result.addEventListener('mouseleave', (_ev) => {
    result.style.cursor = 'auto';
    result.style.boxShadow = '1px 1px 1px grey';
  });

  return result;
}
