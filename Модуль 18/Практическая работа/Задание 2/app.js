const bar   = document.getElementById("progress-bar");
const timer = document.getElementById("timer");

let activeRAF = null;
let activeInterval = null;

function progress(timeSeconds) {
  const duration = Math.max(2, Number(timeSeconds) || 0);
  if (activeRAF) cancelAnimationFrame(activeRAF);
  if (activeInterval) clearInterval(activeInterval);
  bar.style.transform = "scaleX(0)";
  timer.textContent = "0 c";

  const start = performance.now();

  let secondsShown = 0;
  activeInterval = setInterval(() => {
    secondsShown += 1;
    if (secondsShown <= duration) {
      timer.textContent = `${secondsShown} c`;
    }
    if (secondsShown >= duration) {
      clearInterval(activeInterval);
      activeInterval = null;
    }
  }, 1000);

  return new Promise((resolve) => {
    const tick = (now) => {
      const elapsed = (now - start) / 1000;
      const p = Math.min(elapsed / duration, 1);
      bar.style.transform = `scaleX(${p})`;

      if (p < 1) {
        activeRAF = requestAnimationFrame(tick);
      } else {
        bar.style.transform = "scaleX(1)";
        if (activeInterval) {
          clearInterval(activeInterval);
          activeInterval = null;
        }
        timer.textContent = `${duration} c`;
        activeRAF = null;
        resolve();
      }
    };
    activeRAF = requestAnimationFrame(tick);
  });
}

document.getElementById("run2").addEventListener("click", () => progress(2));
document.getElementById("run5").addEventListener("click", () => progress(5));
