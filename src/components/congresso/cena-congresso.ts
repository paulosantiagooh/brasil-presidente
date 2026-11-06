import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type Visao = "predio" | "camara" | "senado";

export type BancadaNaCena = {
  sigla: string;
  deputados: number;
  senadores: number;
  posicao: "base" | "independente" | "oposicao";
};

type Opcoes = {
  partidos: BancadaNaCena[];
  aoTrocarVisao: (visao: Visao) => void;
  aoInformar: (texto: string) => void;
};

const COR_POSICAO = { base: "#0fa896", independente: "#9db7b6", oposicao: "#cf7d23" };
const NOME_POSICAO = { base: "base do governo", independente: "independentes", oposicao: "oposição" };
const ORDEM_POSICAO = { base: 0, independente: 1, oposicao: 2 };
const COR_DESTAQUE = new THREE.Color("#ffffff");

const CAMERA: Record<Visao, { posicao: [number, number, number]; alvo: [number, number, number] }> = {
  predio: { posicao: [20, 17, 44], alvo: [0, 6, 0] },
  camara: { posicao: [0, 21, 25], alvo: [0, 1, -3] },
  senado: { posicao: [0, 15, 17], alvo: [0, 1, -2] },
};

function montarPredio() {
  const grupo = new THREE.Group();
  const concreto = new THREE.MeshStandardMaterial({ color: "#dfe9e7", roughness: 0.65 });
  const linhas = new THREE.LineBasicMaterial({ color: "#2dd4bf", transparent: true, opacity: 0.55 });

  function adicionar(geometria: THREE.BufferGeometry, x: number, y: number, z: number, nome = "") {
    const malha = new THREE.Mesh(geometria, concreto);
    malha.position.set(x, y, z);
    malha.name = nome;
    grupo.add(malha);
    return malha;
  }

  function contorno(malha: THREE.Mesh) {
    const borda = new THREE.LineSegments(new THREE.EdgesGeometry(malha.geometry, 30), linhas);
    malha.add(borda);
  }

  const agua = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 34),
    new THREE.MeshStandardMaterial({ color: "#0b3d3d", roughness: 0.15, metalness: 0.5 }),
  );
  agua.rotation.x = -Math.PI / 2;
  agua.position.z = 3;
  grupo.add(agua);

  contorno(adicionar(new THREE.BoxGeometry(46, 1.8, 13), 0, 0.9, 0));
  contorno(adicionar(new THREE.BoxGeometry(2.3, 19, 3.2), -1.5, 11.3, 0));
  contorno(adicionar(new THREE.BoxGeometry(2.3, 19, 3.2), 1.5, 11.3, 0));
  adicionar(new THREE.BoxGeometry(0.8, 1.1, 3.2), 0, 11.6, 0);

  const rampa = adicionar(new THREE.BoxGeometry(4, 0.35, 17), 0, 0.95, 13.5);
  rampa.rotation.x = 0.1;

  const cupula = adicionar(new THREE.SphereGeometry(4.6, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2), -11, 1.8, 0, "senado");
  cupula.scale.y = 0.72;

  adicionar(new THREE.CylinderGeometry(1.4, 2.2, 1.5, 32), 11, 2.5, 0);
  const cuia = adicionar(new THREE.SphereGeometry(6.4, 48, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), 11, 6.7, 0, "camara");
  cuia.scale.y = 0.6;
  (cuia.material as THREE.MeshStandardMaterial) = concreto.clone();
  (cuia.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;

  return grupo;
}

type Cadeira = { x: number; y: number; z: number; angulo: number };

function posicoesDasCadeiras(total: number, raioInicial: number, fileiras: number, passo: number) {
  const raios = Array.from({ length: fileiras }, (_, i) => raioInicial + i * passo);
  const soma = raios.reduce((a, b) => a + b, 0);
  const abertura = Math.PI * 1.2;
  const lugares: Cadeira[] = [];
  let restantes = total;
  raios.forEach((raio, fileira) => {
    const quantidade = fileira === fileiras - 1 ? restantes : Math.round((raio / soma) * total);
    restantes -= quantidade;
    for (let i = 0; i < quantidade; i++) {
      const angulo = -abertura / 2 + (i / Math.max(1, quantidade - 1)) * abertura;
      lugares.push({
        x: Math.sin(angulo) * raio,
        y: 0.35 + fileira * 0.42,
        z: -Math.cos(angulo) * raio + 4,
        angulo,
      });
    }
  });
  return lugares.sort((a, b) => a.angulo - b.angulo);
}

function montarPlenario(casa: "deputados" | "senadores", partidos: BancadaNaCena[]) {
  const grupo = new THREE.Group();
  const lista = partidos
    .filter((p) => p[casa] > 0)
    .sort((a, b) => ORDEM_POSICAO[a.posicao] - ORDEM_POSICAO[b.posicao] || b[casa] - a[casa]);
  const total = lista.reduce((soma, p) => soma + p[casa], 0);
  const camara = casa === "deputados";
  const lugares = posicoesDasCadeiras(total, camara ? 7 : 5.5, camara ? 11 : 5, camara ? 1.05 : 1.25);

  const piso = new THREE.Mesh(
    new THREE.CircleGeometry(camara ? 22 : 15, 64),
    new THREE.MeshStandardMaterial({ color: "#0f2024", roughness: 0.9 }),
  );
  piso.rotation.x = -Math.PI / 2;
  piso.position.z = 3;
  grupo.add(piso);

  const mesa = new THREE.Mesh(
    new THREE.BoxGeometry(camara ? 7 : 5, 1, 1.4),
    new THREE.MeshStandardMaterial({ color: "#dfe9e7", roughness: 0.6 }),
  );
  mesa.position.set(0, 0.5, 3.5);
  grupo.add(mesa);

  const tamanho = camara ? 0.62 : 0.85;
  const assentos = new THREE.InstancedMesh(
    new THREE.BoxGeometry(tamanho, 0.5, tamanho),
    new THREE.MeshStandardMaterial({ roughness: 0.55 }),
    lugares.length,
  );
  const partidoDaCadeira: BancadaNaCena[] = [];
  const matriz = new THREE.Matrix4();
  const cor = new THREE.Color();
  let indice = 0;
  for (const partido of lista) {
    for (let i = 0; i < partido[casa]; i++) {
      const lugar = lugares[indice];
      matriz.makeRotationY(-lugar.angulo);
      matriz.setPosition(lugar.x, lugar.y, lugar.z);
      assentos.setMatrixAt(indice, matriz);
      assentos.setColorAt(indice, cor.set(COR_POSICAO[partido.posicao]));
      partidoDaCadeira[indice] = partido;
      indice += 1;
    }
  }
  grupo.add(assentos);

  function destacar(sigla: string | null) {
    partidoDaCadeira.forEach((partido, i) => {
      cor.set(COR_POSICAO[partido.posicao]);
      if (partido.sigla === sigla) cor.lerp(COR_DESTAQUE, 0.65);
      assentos.setColorAt(i, cor);
    });
    if (assentos.instanceColor) assentos.instanceColor.needsUpdate = true;
  }

  return { grupo, assentos, partidoDaCadeira, destacar, casa };
}

export function montarCena(area: HTMLElement, opcoes: Opcoes) {
  const renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderizador.setSize(area.clientWidth, area.clientHeight);
  area.appendChild(renderizador.domElement);

  const cena = new THREE.Scene();
  cena.add(new THREE.AmbientLight("#ffffff", 1.3));
  const sol = new THREE.DirectionalLight("#ffffff", 2.2);
  sol.position.set(18, 30, 20);
  cena.add(sol);

  const camera = new THREE.PerspectiveCamera(42, area.clientWidth / area.clientHeight, 0.1, 300);
  const controles = new OrbitControls(camera, renderizador.domElement);
  controles.enableDamping = true;
  controles.enablePan = false;
  controles.minDistance = 10;
  controles.maxDistance = 110;
  controles.maxPolarAngle = Math.PI / 2.05;

  const semMovimento =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.dataset.movimento === "reduzido";

  const predio = montarPredio();
  const camara = montarPlenario("deputados", opcoes.partidos);
  const senado = montarPlenario("senadores", opcoes.partidos);
  cena.add(predio, camara.grupo, senado.grupo);

  let visao: Visao = "predio";
  const plenarios = { camara, senado };

  function irPara(nova: Visao) {
    visao = nova;
    predio.visible = nova === "predio";
    camara.grupo.visible = nova === "camara";
    senado.grupo.visible = nova === "senado";
    controles.target.set(...CAMERA[nova].alvo);
    // Em tela estreita, a câmera recua para o prédio inteiro caber.
    const recuo = camera.aspect < 1.2 ? 1 + (1.2 - camera.aspect) * 1.1 : 1;
    camera.position
      .set(...CAMERA[nova].posicao)
      .sub(controles.target)
      .multiplyScalar(recuo)
      .add(controles.target);
    controles.autoRotate = nova === "predio" && !semMovimento;
    controles.autoRotateSpeed = 0.6;
    controles.update();
    camara.destacar(null);
    senado.destacar(null);
    opcoes.aoTrocarVisao(nova);
    opcoes.aoInformar(
      nova === "predio"
        ? "Toque na cúpula para entrar no Senado, ou na cuia para entrar na Câmara."
        : "Toque em uma cadeira para ver o partido.",
    );
  }

  const raio = new THREE.Raycaster();
  const ponteiro = new THREE.Vector2();
  let inicio: { x: number; y: number } | null = null;

  function apontar(evento: PointerEvent) {
    const caixa = renderizador.domElement.getBoundingClientRect();
    ponteiro.set(
      ((evento.clientX - caixa.left) / caixa.width) * 2 - 1,
      -((evento.clientY - caixa.top) / caixa.height) * 2 + 1,
    );
    // A câmera pode ter mudado depois do último quadro desenhado.
    camera.updateMatrixWorld();
    cena.updateMatrixWorld();
    raio.setFromCamera(ponteiro, camera);
  }

  function aoPressionar(evento: PointerEvent) {
    inicio = { x: evento.clientX, y: evento.clientY };
    controles.autoRotate = false;
  }

  function aoSoltar(evento: PointerEvent) {
    const parado = inicio && Math.hypot(evento.clientX - inicio.x, evento.clientY - inicio.y) < 6;
    inicio = null;
    if (!parado) return;
    apontar(evento);
    if (visao === "predio") {
      const alvo = raio.intersectObjects(predio.children, false).find((i) => i.object.name)?.object.name;
      if (alvo === "camara" || alvo === "senado") irPara(alvo);
      return;
    }
    const plenario = plenarios[visao];
    const achado = raio.intersectObject(plenario.assentos, false)[0];
    if (achado?.instanceId === undefined) return;
    const partido = plenario.partidoDaCadeira[achado.instanceId];
    plenario.destacar(partido.sigla);
    const quantidade = partido[plenario.casa];
    const nome = plenario.casa === "deputados" ? "deputados" : "senadores";
    opcoes.aoInformar(`${partido.sigla}: ${quantidade} ${quantidade === 1 ? nome.slice(0, -1) : nome}, ${NOME_POSICAO[partido.posicao]}.`);
  }

  const tela = renderizador.domElement;
  tela.addEventListener("pointerdown", aoPressionar);
  tela.addEventListener("pointerup", aoSoltar);

  const observador = new ResizeObserver(() => {
    if (area.clientWidth === 0 || area.clientHeight === 0) return;
    camera.aspect = area.clientWidth / area.clientHeight;
    camera.updateProjectionMatrix();
    renderizador.setSize(area.clientWidth, area.clientHeight);
  });
  observador.observe(area);

  let quadro = 0;
  function desenhar() {
    quadro = requestAnimationFrame(desenhar);
    if (document.hidden) return;
    controles.update();
    renderizador.render(cena, camera);
  }

  irPara("predio");
  desenhar();

  return {
    irPara,
    destruir() {
      cancelAnimationFrame(quadro);
      observador.disconnect();
      tela.removeEventListener("pointerdown", aoPressionar);
      tela.removeEventListener("pointerup", aoSoltar);
      controles.dispose();
      cena.traverse((objeto) => {
        const malha = objeto as THREE.Mesh;
        malha.geometry?.dispose();
        const material = malha.material as THREE.Material | undefined;
        material?.dispose?.();
      });
      renderizador.dispose();
      tela.remove();
    },
  };
}
