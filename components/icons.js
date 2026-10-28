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
    briefcaseBusiness: '<rect width="18" height="14" x="3" y="6" rx="2"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 11h18M10 11v2h4v-2"/>',
    gitBranch: '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 9v3a6 6 0 0 0 6 6h3M18 15V9a6 6 0 0 0-6-6H9"/>',
    settings: '<path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.2a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.2a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.2a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.2a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="3"/>',
    panelLeftClose: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18M16 15l-3-3 3-3"/>',
    panelLeftOpen: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18M14 9l3 3-3 3"/>',
    bell: '<path d="M10.3 21a2 2 0 0 0 3.4 0"/><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>',
    user: '<path d="M19 21a7 7 0 0 0-14 0"/><circle cx="12" cy="7" r="4"/>',
    logOut: '<path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    eye: '<path d="M2.1 12a10.8 10.8 0 0 1 19.8 0 10.8 10.8 0 0 1-19.8 0Z"/><circle cx="12" cy="12" r="3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.8-1.6l9-11a.5.5 0 0 1 .9.4l-1.7 6.5A1 1 0 0 0 12.4 9H20a1 1 0 0 1 .8 1.6l-9 11a.5.5 0 0 1-.9-.4l1.7-6.5a1 1 0 0 0-1-.7Z"/>',
    moreHorizontal: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrowLeft: '<path d="m15 18-6-6 6-6"/><path d="M9 12h12"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    paperclip: '<path d="m21.4 11.6-8.5 8.5a6 6 0 0 1-8.5-8.5l9-9a4 4 0 0 1 5.7 5.7l-9 9a2 2 0 0 1-2.9-2.9l8.4-8.4"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    uploadCloud: '<path d="M12 13v8M8 17l4-4 4 4"/><path d="M20.4 17.5A5 5 0 0 0 18 8.2 7 7 0 0 0 4.3 10.6 4.5 4.5 0 0 0 5.5 19H7"/>',
    filePenLine: '<path d="M12 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l6 6v4"/><path d="M14 2v6h6M10 13H8M16.5 15.5l2 2L14 22H12v-2Z"/>',
    usersRound: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5Z"/>',
    lock: '<rect width="16" height="12" x="4" y="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>',
    star: '<path d="m12 2.5 3 6.1 6.7 1-4.8 4.7 1.1 6.7-6-3.2-6 3.2 1.1-6.7-4.8-4.7 6.7-1Z"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
    grid2X2: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"/>',
    bot: '<rect width="18" height="14" x="3" y="7" rx="2"/><path d="M12 3v4M8 12h.01M16 12h.01M7 16h10"/>',
    clock3: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    handshake: '<path d="m11 17 2 2a2 2 0 0 0 3-3"/><path d="m14 14 2.5 2.5a2 2 0 0 0 3-3L15 9l-3 3a2 2 0 0 1-3-3l3.5-3.5a4 4 0 0 1 5.7 0L21 8"/><path d="m3 7 5 5M8 5 5 2 2 5l4 4M21 7l-2-2"/>',
    clipboardUpload: '<path d="M9 5h6M9 3h6v4H9z"/><path d="M9 19H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3M15 4h3a2 2 0 0 1 2 2v6"/><path d="M16 22v-7M13 18l3-3 3 3"/>',
    messageSquare: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 9h8M8 13h5"/>',
    trash2: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5"/>',
    fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    presentation: '<path d="M2 3h20M4 3v12h16V3M8 21l4-6 4 6"/>',
    circleAlert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 17h.01"/>',
    circleCheck: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    rotateCcw: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    pin: '<path d="M12 17v5M5 3h14M7 3l1 7-3 3h14l-3-3 1-7"/>'
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
