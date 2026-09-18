const paths = {
  complete: { eyebrow: 'JORNADA RECOMENDADA', title: 'ENEM Completa', description: 'Uma preparação completa, alternando as áreas para manter o estudo equilibrado.', steps: [['Linguagens','Interpretação e leitura crítica.','linguagens'],['Matemática','Fundamentos e resolução de problemas.','matematica'],['Ciências Humanas','História, Geografia e sociedade.','humanas'],['Ciências da Natureza','Biologia, Física e Química.','natureza'],['Redação','Estrutura, repertório e argumentação.','redacao'],['Revisão estratégica','Retome os pontos que mais exigem atenção.','estudos.html'],['Simulado','Teste seu ritmo em condições de prova.','simulados.html'],['Ajuste de rota','Use seus resultados para planejar a próxima semana.','perfil.html']] },
  exatas: { eyebrow: 'JORNADA DE EXATAS', title: 'Exatas', description: 'Construa uma base sólida e evolua da teoria para a resolução de questões.', steps: [['Matemática','Funções, porcentagem e proporção.','matematica'],['Geometria','Medidas, áreas e volumes.','matematica'],['Probabilidade','Eventos, chances e análise combinatória.','matematica'],['Estatística','Leitura de tabelas e gráficos.','matematica'],['Física e Química','Conceitos e aplicações no ENEM.','natureza'],['Prática','Consolide com exercícios e revisão.','simulados.html']] },
  languages: { eyebrow: 'JORNADA DE LINGUAGENS', title: 'Linguagens e Redação', description: 'Aprenda a ler com estratégia, argumentar com clareza e escrever melhor.', steps: [['Interpretação de texto','Identifique tema, tese e informações.','linguagens'],['Gramática e gêneros','Use a língua com precisão.','linguagens'],['Literatura','Contexto, escolas e repertório.','linguagens'],['Redação ENEM','Planeje a estrutura do texto.','redacao'],['Prática de escrita','Produza, revise e fortaleça a argumentação.','redacao']] },
  humanas: { eyebrow: 'JORNADA DE HUMANAS', title: 'Ciências Humanas', description: 'Conecte conceitos e acontecimentos para interpretar questões com mais confiança.', steps: [['História do Brasil','Períodos, disputas e transformações.','humanas'],['História Geral','Revoluções, sociedades e cidadania.','humanas'],['Geografia','Território, economia e globalização.','humanas'],['Filosofia','Ideias, ética e política.','humanas'],['Sociologia','Cultura, trabalho e desigualdade.','humanas'],['Atualidades','Relacione o conteúdo ao mundo atual.','humanas']] }
};

const completedStorageKey = 'smartpath-trail-completed';
const activePathStorageKey = 'smartpath-active-trail';
let activePath = localStorage.getItem(activePathStorageKey);
if (!paths[activePath]) activePath = 'complete';

function getCompleted() {
  try { return JSON.parse(localStorage.getItem(completedStorageKey) || '[]'); }
  catch { return []; }
}
function setCompleted(items) { localStorage.setItem(completedStorageKey, JSON.stringify(items)); }
function getPathProgress(key = activePath) {
  const done = getCompleted().filter(id => id.startsWith(`${key}-`)).length;
  const total = paths[key].steps.length;
  return { done, total, remaining: total - done, percent: Math.round((done / total) * 100) };
}
function updateProgress() {
  const progress = getPathProgress();
  document.getElementById('progressLabel').textContent = `Progresso: ${paths[activePath].title}`;
  document.getElementById('progressValue').textContent = progress.percent;
  document.getElementById('progressBar').style.width = `${progress.percent}%`;
  document.getElementById('completedCount').textContent = `${progress.done} de ${progress.total} etapas`;
  document.getElementById('progressMessage').textContent = progress.remaining === 0
    ? 'Trilha concluída! Você pode iniciar uma nova jornada.'
    : progress.done === 0
      ? `Faltam ${progress.remaining} etapas para concluir esta trilha.`
      : `Faltam ${progress.remaining} ${progress.remaining === 1 ? 'etapa' : 'etapas'} para concluir.`;
  document.getElementById('remainingSteps').textContent = progress.remaining === 0
    ? 'Você concluiu todas as etapas desta matéria.'
    : `${progress.done}/${progress.total} concluídas · faltam ${progress.remaining} ${progress.remaining === 1 ? 'etapa' : 'etapas'}.`;
}
function openStep(destination) { window.location.href = destination.includes('.html') ? destination : `estudos.html?materia=${destination}`; }
function renderPath(key, shouldScroll = true) {
  activePath = key;
  localStorage.setItem(activePathStorageKey, key);
  const path = paths[key], completed = getCompleted();
  const journeyPanel = document.getElementById('journeyPanel');
  if (shouldScroll) journeyPanel.hidden = false;
  document.querySelectorAll('.path-card').forEach(card => {
    card.classList.toggle('is-selected', card.querySelector(`[data-path="${key}"]`) !== null);
  });
  document.getElementById('journeyEyebrow').textContent = path.eyebrow;
  document.getElementById('journeyTitle').textContent = path.title;
  document.getElementById('journeyDescription').textContent = path.description;
  document.getElementById('stepsList').innerHTML = path.steps.map((step, index) => {
    const id = `${key}-${index}`, done = completed.includes(id);
    return `<li class="step-item ${done ? 'is-done' : ''}"><input class="step-check" type="checkbox" data-step="${id}" ${done ? 'checked' : ''} aria-label="Marcar ${step[0]} como concluída"><span class="step-number">${done ? '✓' : index + 1}</span><h3>${step[0]}</h3><p>${step[1]}</p><button class="step-action" type="button" data-destination="${step[2]}">Estudar →</button></li>`;
  }).join('');
  updateProgress();
  if (shouldScroll) {
    journeyPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    journeyPanel.focus({ preventScroll: true });
  }
}
function toggleStep(id, isDone) {
  const completed = getCompleted();
  setCompleted(isDone ? [...new Set([...completed, id])] : completed.filter(item => item !== id));
  renderPath(activePath, false);
}
function resetActivePath() {
  const title = paths[activePath].title;
  if (!window.confirm(`Reiniciar o progresso da trilha ${title}?`)) return;
  setCompleted(getCompleted().filter(id => !id.startsWith(`${activePath}-`)));
  renderPath(activePath, false);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-route]').forEach(el => el.addEventListener('click', () => { window.location.href = el.dataset.route; }));
  document.querySelectorAll('.start-path').forEach(button => button.addEventListener('click', () => renderPath(button.dataset.path, true)));
  document.getElementById('stepsList').addEventListener('change', event => {
    if (event.target.matches('[data-step]')) toggleStep(event.target.dataset.step, event.target.checked);
  });
  document.getElementById('stepsList').addEventListener('click', event => {
    const button = event.target.closest('[data-destination]');
    if (button) openStep(button.dataset.destination);
  });
  document.getElementById('studyAll').addEventListener('click', () => openStep(paths[activePath].steps[0][2]));
  document.getElementById('resetPath').addEventListener('click', resetActivePath);
  renderPath(activePath, false);
});
