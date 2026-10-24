// The creator's appearance only. Exported portfolio colors are configured separately.
window.CRAFTCAREER_CONFIG = {
  accent: '#ef6477',
  defaultTheme: 'dark',
  publishing: { enabled: true, apiBase: '/api/github', pollSeconds: 8 },
  // Creator help only; not included in portfolios exported by your users.
  tutorial: {
    enabled: true,
    title: 'Learn CraftCareer',
    src: 'tutorial/CraftCareer-Guided-Tutorial.mp4',
    poster: 'tutorial/cover.jpg',
    chapters: [
      { title: 'Workspace', time: 0 },
      { title: 'Sections', time: 8.166667 },
      { title: 'Split the space', time: 22.458333 },
      { title: 'Components', time: 39.083333 },
      { title: 'Inspector', time: 51.791667 },
      { title: 'Projects', time: 101.333333 },
      { title: 'Assets', time: 109.166667 },
      { title: 'Preview & export', time: 124.25 }
    ]
  }
};
