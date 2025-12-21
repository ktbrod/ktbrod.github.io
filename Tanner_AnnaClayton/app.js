let secondsOnPage = 0;
let choiceCount = 0;

let firstAction = null;  
let followType = null;   
let typedIntent = '';    

function startTimer() {
  const timerEl = document.getElementById('timer');
  if (!timerEl) return;
  setInterval(() => {
    secondsOnPage++;
    timerEl.textContent = `Time on page: ${secondsOnPage}s`;
  }, 1000);
}

function updateScore() {
  const scoreEl = document.getElementById('score');
  if (!scoreEl) return;
  choiceCount++;
  scoreEl.textContent = `Choices made: ${choiceCount}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const pages = Array.from(document.querySelectorAll('.page'));
  const bySlug = Object.fromEntries(pages.map(p => [p.dataset.page, p]));
  const breadcrumbs = document.getElementById('breadcrumbs');
  const backBtn = document.getElementById('backBtn');
  const restartBtn = document.getElementById('restartBtn');
  const bar = document.getElementById('progressBar');

  const freeIntentInput = document.getElementById('free-intent');
  const saveIntentBtn = document.getElementById('saveIntent');
  const writeinConfirm = document.getElementById('writein-confirm');

  const linearOrder = ['start', 'open', 'messages|play|search|scroll', 'suggest', 'yes|no', 'end'];

  let stack = ['start'];
  
  if (saveIntentBtn) {
    saveIntentBtn.addEventListener('click', () => {
      if (!freeIntentInput) return;
      const val = freeIntentInput.value.trim();
      if (!val) return;

      typedIntent = val;
      updateScore();

      if (writeinConfirm) {
        writeinConfirm.textContent = 'Saved.';
      }

      show('suggest');
    });
  }

  function renderSummary() {
    if (!firstAction && !followType && !typedIntent) return;

    const summaryText = document.getElementById('summary-text');
    const pathEl = document.getElementById('summary-path');
    const agencyEl = document.getElementById('summary-agency');
    const timeEl = document.getElementById('summary-time');
    const intentEl = document.getElementById('summary-intent');

    if (!pathEl || !agencyEl || !timeEl || !intentEl) return;

    const actionMap = {
      messages: 'checked your messages first',
      play: 'started your day with music',
      search: 'started by searching for something specific',
      scroll: 'started by scrolling without a clear plan'
    };

    let pathText;
    if (firstAction && actionMap[firstAction]) {
      pathText = `You ${actionMap[firstAction]}.`;
    } else {
      pathText = 'You opened your laptop and moved through your routine.';
    }

    let agencyText;
    if (followType === 'auto') {
      agencyText = 'You let the device steer you on auto-pilot.';
    } else if (followType === 'intent') {
      agencyText = 'You pushed back against the suggestion and chose your own path.';
    } else {
      agencyText = 'You moved through the routine without a strong nudge either way.';
    }

    const timeText = `You took about ${secondsOnPage}s to complete this routine.`;

    if (summaryText) {
      summaryText.textContent = 'Here is how your human–machine routine unfolded today:';
    }
    pathEl.textContent = pathText;
    agencyEl.textContent = agencyText;
    timeEl.textContent = timeText;

    if (typedIntent) {
      intentEl.textContent = `You were trying to: “${typedIntent}.”`;
    } else {
      intentEl.textContent = '';
    }
  }

  function renderCrumbs() {
    if (!breadcrumbs) return;
    breadcrumbs.innerHTML = '';
    stack.forEach((slug, idx) => {
      const span = document.createElement('span');
      span.className = 'crumb' + (idx === stack.length - 1 ? ' active' : '');
      span.textContent = bySlug[slug]?.dataset.label || slug;
      span.title = slug;

      span.addEventListener('click', () => gotoIndex(idx));

      breadcrumbs.appendChild(span);
    });
  }

  function gotoIndex(i) {
    stack = stack.slice(0, i + 1);
    const slug = stack[stack.length - 1];
    show(slug, false);
  }

  function renderProgress(current) {
    if (!bar) return;
    const groups = linearOrder.map(g => g.split('|'));
    const index = groups.findIndex(g => g.includes(current));
    const pct = Math.max(0, ((index + 1) / groups.length) * 100);
    bar.style.width = pct + '%';
  }

  function show(slug, push = true) {
    if (!bySlug[slug]) slug = 'start';

    pages.forEach(p => p.classList.remove('active'));
    bySlug[slug].classList.add('active');

    if (push && stack[stack.length - 1] !== slug) {
      stack.push(slug);
    }

    if (backBtn) backBtn.disabled = stack.length <= 1;

    renderCrumbs();
    renderProgress(slug);

    if (slug === 'end') {
      renderSummary();
    }
  }

  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-go]');
    if (!btn) return;

    const to = String(btn.dataset.go);

    if (btn.dataset.first === 'true') {
      firstAction = to;        
    }

    if (btn.dataset.choice) {
      followType = btn.dataset.choice; 
    }

    updateScore();

    if (to === 'start') {
      stack = ['start'];
    }

    show(to);
  });

  backBtn?.addEventListener('click', () => {
    if (stack.length > 1) {
      stack.pop();
      const prev = stack[stack.length - 1];
      show(prev, false);
    }
  });

  restartBtn?.addEventListener('click', () => {
    stack = ['start'];
    show('start', false);
  });

  show('start', false);
  startTimer();
});
