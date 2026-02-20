const applyContainerStyles = (container: HTMLElement) => {
  container.style.backgroundColor = '#ffffffdd';
  container.style.borderRadius = '16px';
  container.style.inset = '50% 50% 50% 0';
  container.style.position = 'relative';
  container.style.transform = 'translateY(-50%)';
  container.style.width = '620px';
  container.style.alignItems = 'center';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.fontSize = '16px';
  container.style.height = '100%';
  container.style.justifyContent = 'center';
  container.style.margin = '0 auto';
  container.style.paddingTop = '0';
}

const applyBtnsContainerStyles = (container: HTMLElement) => {
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
}

const applyPageStyles = (page: HTMLElement, backgroundImg: string) => {
  page.style.backgroundImage = `url(${backgroundImg})`;
  page.style.backgroundPosition = '50%';
  page.style.backgroundSize = 'cover';
  page.style.display = 'block';
  page.style.height = '100%';
}

export const basePage = (pageName: string, backgroundImg: string, content: HTMLElement[]): HTMLElement => {
  const result = document.createElement(pageName);
  result.className = 'base-login-page';
  applyPageStyles(result, backgroundImg);

  const section = document.createElement('section');
  applyContainerStyles(section);

  const btnsContainer = document.createElement('btns-container');
  applyBtnsContainerStyles(btnsContainer);

  content.forEach(element => section.appendChild(element));
  section.appendChild(btnsContainer);

  result.appendChild(section);

  return result;
}
