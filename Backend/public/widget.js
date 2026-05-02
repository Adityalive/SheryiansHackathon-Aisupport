(function() {
  const scriptTag = document.currentScript;
  const businessId = scriptTag.getAttribute('data-business-id');
  
  if (!businessId) {
    console.error('SupportAI: Missing data-business-id attribute on script tag.');
    return;
  }

  // Create the toggle button (chat bubble icon)
  const toggleBtn = document.createElement('div');
  toggleBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
    </svg>
  `;
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.bottom = '20px';
  toggleBtn.style.right = '20px';
  toggleBtn.style.width = '60px';
  toggleBtn.style.height = '60px';
  toggleBtn.style.borderRadius = '50%';
  toggleBtn.style.backgroundColor = '#4338ca';
  toggleBtn.style.color = '#ffffff';
  toggleBtn.style.display = 'flex';
  toggleBtn.style.alignItems = 'center';
  toggleBtn.style.justifyContent = 'center';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.boxShadow = '0 10px 20px rgba(67, 56, 202, 0.3)';
  toggleBtn.style.zIndex = '999999';
  toggleBtn.style.transition = 'transform 0.2s';

  toggleBtn.onmouseenter = () => toggleBtn.style.transform = 'scale(1.05)';
  toggleBtn.onmouseleave = () => toggleBtn.style.transform = 'scale(1)';

  // Create the iframe wrapper
  const iframeContainer = document.createElement('div');
  iframeContainer.style.position = 'fixed';
  iframeContainer.style.bottom = '90px';
  iframeContainer.style.right = '20px';
  iframeContainer.style.width = '380px';
  iframeContainer.style.height = '600px';
  iframeContainer.style.maxHeight = 'calc(100vh - 120px)';
  iframeContainer.style.backgroundColor = 'transparent';
  iframeContainer.style.borderRadius = '16px';
  iframeContainer.style.boxShadow = '0 10px 40px rgba(0,0,0,0.15)';
  iframeContainer.style.zIndex = '999999';
  iframeContainer.style.overflow = 'hidden';
  iframeContainer.style.display = 'none'; // hidden by default
  iframeContainer.style.transition = 'opacity 0.2s, transform 0.2s';
  iframeContainer.style.opacity = '0';
  iframeContainer.style.transform = 'translateY(20px)';

  const iframe = document.createElement('iframe');
  // Change to deployed URL in production
  iframe.src = `http://localhost:5173/embed/${businessId}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.allow = "microphone";

  iframeContainer.appendChild(iframe);
  document.body.appendChild(toggleBtn);
  document.body.appendChild(iframeContainer);

  let isOpen = false;

  toggleBtn.onclick = () => {
    isOpen = !isOpen;
    if (isOpen) {
      iframeContainer.style.display = 'block';
      setTimeout(() => {
        iframeContainer.style.opacity = '1';
        iframeContainer.style.transform = 'translateY(0)';
      }, 10);
      toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
        </svg>
      `;
    } else {
      iframeContainer.style.opacity = '0';
      iframeContainer.style.transform = 'translateY(20px)';
      setTimeout(() => {
        iframeContainer.style.display = 'none';
      }, 200);
      toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
        </svg>
      `;
    }
  };
})();
