(function () {
  const paths = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2h-4v-8H9v8H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
    sparkles: '<path d="m12 3-1.9 4.8a2 2 0 0 1-1.1 1.1L4 11l5 2.1a2 2 0 0 1 1.1 1.1L12 19l1.9-4.8a2 2 0 0 1 1.1-1.1L20 11l-5-2.1a2 2 0 0 1-1.1-1.1Z"/><path d="M5 3v4"/><path d="M3 5h4"/><path d="M19 17v4"/><path d="M17 19h4"/>',
    library: '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/><path d="M2 20h20"/>',
    network: '<rect width="6" height="6" x="9" y="2" rx="1"/><rect width="6" height="6" x="3" y="16" rx="1"/><rect width="6" height="6" x="15" y="16" rx="1"/><path d="M12 8v4M6 16v-2h12v2"/>',
    building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>',
    fileCog: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6"/><path d="M14 2v6h6M9 13h3"/><path d="M18 16.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/><path d="M18 14v2.5M18 21.5V24M15.8 15.3l1.3 1.8M18.9 21l1.3 1.8M14 18.9l1.8-.4M20.2 22.4l1.8-.4M14.4 22l1.7-1.2M19.9 17.2l1.7-1.2"/>',
    clipboardCheck: '<rect width="14" height="18" x="5" y="4" rx="2"/><path d="M9 4V2h6v2M9 13l2 2 4-4"/>',
    tags: '<path d="M12.6 2.7a2 2 0 0 0-1.4-.6H5a3 3 0 0 0-3 3v6.2a2 2 0 0 0 .6 1.4l8.7 8.7a2 2 0 0 0 2.8 0l7.3-7.3a2 2 0 0 0 0-2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    settings: '<path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.2a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.2a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.2a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.2a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="3"/>',
    panelLeftClose: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18M16 15l-3-3 3-3"/>',
    panelLeftOpen: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18M14 9l3 3-3 3"/>',
    bell: '<path d="M10.3 21a2 2 0 0 0 3.4 0"/><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>',
    user: '<path d="M19 21a7 7 0 0 0-14 0"/><circle cx="12" cy="7" r="4"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    eye: '<path d="M2.1 12a10.8 10.8 0 0 1 19.8 0 10.8 10.8 0 0 1-19.8 0Z"/><circle cx="12" cy="12" r="3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.8-1.6l9-11a.5.5 0 0 1 .9.4l-1.7 6.5A1 1 0 0 0 12.4 9H20a1 1 0 0 1 .8 1.6l-9 11a.5.5 0 0 1-.9-.4l1.7-6.5a1 1 0 0 0-1-.7Z"/>',
    moreHorizontal: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'
  };

  function escapeAttribute(value) {
    return String(value).replace(/[&"<>]/g, (character) => ({
      "&": "&amp;",
      '"': "&quot;",
      "<": "&lt;",
      ">": "&gt;"
    })[character]);
  }

  window.BompIcons = {
    create(name, options = {}) {
      const size = Number(options.size) || 20;
      const label = options.label ? ` role="img" aria-label="${escapeAttribute(options.label)}"` : ' aria-hidden="true"';
      return `<svg${label} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${options.strokeWidth || 1.8}" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.moreHorizontal}</svg>`;
    }
  };
})();
