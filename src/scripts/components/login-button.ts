import { THRESHOLD_WIDTH } from '../utils/constants';
import { getTranslation } from '../i18n';

const icons = {
  email: '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64.000000 48.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"> <path d="M44 468 c-38 -18 -44 -51 -44 -228 0 -180 6 -210 47 -229 33 -15 513 -15 546 0 41 19 47 49 47 229 0 180 -6 210 -47 229 -31 14 -519 14 -549 -1z m516 -33 c0 -7 -232 -205 -240 -205 -8 0 -240 198 -240 205 0 3 108 5 240 5 132 0 240 -2 240 -5z m-406 -118 l59 -53 -87 -97 -86 -97 0 170 0 171 28 -20 c15 -11 54 -44 86 -74z m446 -77 l0 -170 -85 95 c-47 53 -85 98 -85 99 0 5 162 146 167 146 1 0 3 -77 3 -170z m-319 -31 l39 -31 40 32 39 31 33 -37 c18 -21 57 -65 87 -99 l53 -60 -126 -3 c-69 -1 -183 -1 -252 0 l-126 3 84 97 c46 53 85 97 87 97 2 1 21 -13 42 -30z"/>  </g> </svg>',
  google: '',
  linkedin: '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="32" height="32" viewBox="1.786 1.783 76.226652 76.248" version="1.1" id="svg72" sodipodi:docname="linkedin.svg" inkscape:version="0.92.4 (5da689c313, 2019-01-14)"> <metadata id="metadata78"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <defs id="defs76" /> <sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="1916" inkscape:window-height="1036" id="namedview74" showgrid="false" inkscape:zoom="0.79365665" inkscape:cx="428.70379" inkscape:cy="325.16058" inkscape:window-x="0" inkscape:window-y="20" inkscape:window-maximized="0" inkscape:current-layer="svg72" inkscape:pagecheckerboard="false" /> <path d="m 2.10821,7.2952417 c 0,-3.015 2.508,-5.462 5.6,-5.462 h 64.568 c 3.093,0 5.6,2.447 5.6,5.462 V 72.620242 c 0,3.016 -2.507,5.461 -5.6,5.461 h -64.568 c -3.092,0 -5.6,-2.445 -5.6,-5.46 V 7.2942417 Z" id="path64" inkscape:connector-curvature="0" style="fill:#0b78b7;fill-opacity:1" /> <path d="m 25.07621,65.660242 v -34.43 h -11.444 v 34.43 h 11.445 z m -5.72,-39.13 c 3.99,0 6.474,-2.644 6.474,-5.948 -0.075,-3.379 -2.484,-5.949 -6.398,-5.949 -3.917,0 -6.475,2.57 -6.475,5.949 0,3.304 2.483,5.948 6.324,5.948 h 0.074 z m 12.054,39.13 h 11.443 v -19.225 c 0,-1.028 0.075,-2.058 0.377,-2.792 0.827,-2.057 2.71,-4.186 5.872,-4.186 4.14,0 5.797,3.157 5.797,7.786 v 18.417 h 11.443 v -19.741 c 0,-10.575 -5.645,-15.496 -13.174,-15.496 -6.173,0 -8.884,3.45 -10.39,5.8 h 0.076 v -4.992 h -11.443 c 0.149,3.23 -0.001,34.43 -0.001,34.43 z" id="path70" inkscape:connector-curvature="0" style="fill:#ffffff" /> </svg>',
  microsoft: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 21 21"><title>MS-SymbolLockup</title><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>',
}

const applyComponentStyle = (component: HTMLElement) => {
  component.style.alignItems = 'center';
  component.style.background = '#fff';
  component.style.border = 'thin solid #888';
  component.style.borderRadius = '5px';
  component.style.boxShadow = '1px 1px 1px grey';
  component.style.boxSizing = 'content - box';
  component.style.color = '#444';
  component.style.display = 'grid';
  component.style.gridTemplateColumns = '12 % 1fr 4fr';
  component.style.height = '42px';
  component.style.justifyContent = 'center';
  component.style.marginTop = '16px';
  component.style.padding = '0 12px';
  component.style.whiteSpace = 'nowrap';
  component.style.width = '276px';
}

const applyLabelStyle = (label: HTMLElement) => {
  label.style.display = 'inline-block';
  label.style.fontSize = '14px';
  label.style.fontWeight = '500';
  label.style.gridColumnStart = '3';
  label.style.marginRight = '34px';
  label.style.paddingLeft = '20px';
}

export const loginButton = (type: string, fn: any, height: number = 40): HTMLElement => {
  const loweredCasedType = type.toLowerCase();
  const result = document.createElement('login-button');
  applyComponentStyle(result);
  result.tabIndex = 0;
  result.setAttribute('data-cy', `${loweredCasedType}-button`);

  const icon = document.createElement('login-icon');
  icon.style.gridColumnStart = '2';

  icon.style.width = '40px';
  icon.style.height = height + 'px';
  icon.className = 'ico';

  // @ts-ignore
  icon.innerHTML = icons[loweredCasedType];
  const label = document.createElement('login-label');
  label.textContent = window.innerWidth <= THRESHOLD_WIDTH ? type : getTranslation(`${loweredCasedType}-label`);
  applyLabelStyle(label);

  result.append(icon, label);
  
  result.addEventListener('click', fn);
  result.addEventListener('mouseenter', () => {
    result.style.cursor = 'pointer';
    result.style.boxShadow = '0 0 6px #808080';
  });
  result.addEventListener('mouseleave', () => {
    result.style.cursor = 'auto';
    result.style.boxShadow = 'none';
  });

  return result;
}
