/* Creator-only help: never reads or changes the portfolio document. */
(() => {
  'use strict';
  const config = window.CRAFTCAREER_CONFIG?.tutorial;
  const trigger = document.getElementById('video-tutorial');
  if (!trigger || !config || config.enabled === false || !config.src) return;
  trigger.hidden = false;
  const dialog = document.createElement('dialog');
  dialog.id = 'tutorial-dialog';
  dialog.setAttribute('aria-labelledby', 'tutorial-title');
  dialog.setAttribute('aria-describedby', 'tutorial-description');
  const heading = document.createElement('div');
  heading.className = 'tutorial-heading';
  const title = document.createElement('h2');
  title.id = 'tutorial-title';
  title.textContent = config.title || 'Learn CraftCareer';
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = '×';
  close.setAttribute('aria-label', 'Close tutorial');
  heading.append(title, close);
  const content = document.createElement('div');
  content.className = 'tutorial-content';
  const description = document.createElement('p');
  description.id = 'tutorial-description';
  description.textContent = 'A 2-minute 36-second guide with voice, captions, and highlighted controls. Your work stays open behind this player.';
  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.preload = 'none';
  video.setAttribute('aria-label', 'CraftCareer video tutorial');
  video.textContent = 'Your browser does not support this video. Use the video link below.';
  const status = document.createElement('p');
  status.className = 'tutorial-error';
  status.setAttribute('role', 'status');
  status.hidden = true;
  const chapters = document.createElement('nav');
  chapters.className = 'tutorial-chapters';
  chapters.setAttribute('aria-label', 'Tutorial chapters');
  let pendingTime = null;
  function seekPending() {
    if (pendingTime === null || video.readyState < 1) return;
    const time = pendingTime;
    pendingTime = null;
    video.currentTime = Number.isFinite(video.duration) ? Math.min(time, video.duration) : time;
  }
  video.addEventListener('loadedmetadata', seekPending);
  video.addEventListener('error', () => {
    status.hidden = false;
    status.textContent = 'The video could not load. Keep the tutorial folder with the creator files, or try opening the video below.';
  });
  for (const chapter of config.chapters || []) {
    const time = Number(chapter.time);
    if (!Number.isFinite(time) || time < 0 || !chapter.title) continue;
    const button = document.createElement('button');
    button.type = 'button';
    const stamp = Math.floor(time / 60) + ':' + String(Math.floor(time % 60)).padStart(2, '0');
    button.textContent = stamp + ' · ' + chapter.title;
    button.addEventListener('click', () => {
      pendingTime = time;
      seekPending();
      // A user click starts playback; a browser restriction leaves native Play available.
      video.play().catch(() => {});
    });
    chapters.append(button);
  }
  const link = document.createElement('a');
  link.href = config.src;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Open video in a new tab ↗';
  link.className = 'tutorial-open-video';
  content.append(description, video, status, chapters, link);
  dialog.append(heading, content);
  document.body.append(dialog);
  trigger.addEventListener('click', () => {
    if (!video.hasAttribute('src')) {
      if (config.poster) video.poster = config.poster;
      video.src = config.src;
    }
    dialog.showModal();
    close.focus({ preventScroll: true });
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    dialog.close();
  });
  dialog.addEventListener('close', () => {
    video.pause();
    pendingTime = null;
    trigger.focus({ preventScroll: true });
  });
  // Keep player keyboard shortcuts from triggering editor undo/redo or other actions.
  dialog.addEventListener('keydown', event => event.stopPropagation());
})();
