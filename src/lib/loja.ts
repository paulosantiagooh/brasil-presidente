// Guarda um valor no navegador e avisa a interface quando ele muda.
// Se o armazenamento estiver bloqueado, o valor continua valendo na memória até fechar a página.
export function criarLoja<T>(chave: string, vazio: T, validar: (bruto: unknown) => T) {
  const ouvintes = new Set<() => void>();
  let textoEmCache: string | null | undefined;
  let valorEmCache = vazio;
  let soNaMemoria = false;

  function ler(): T {
    if (soNaMemoria) return valorEmCache;
    let texto: string | null = null;
    try {
      texto = window.localStorage.getItem(chave);
    } catch {
      return valorEmCache;
    }
    if (texto !== textoEmCache) {
      textoEmCache = texto;
      try {
        valorEmCache = texto ? validar(JSON.parse(texto)) : vazio;
      } catch {
        valorEmCache = vazio;
      }
    }
    return valorEmCache;
  }

  function gravar(valor: T) {
    const texto = JSON.stringify(valor);
    valorEmCache = valor;
    textoEmCache = texto;
    try {
      window.localStorage.setItem(chave, texto);
      soNaMemoria = false;
    } catch {
      soNaMemoria = true;
    }
    ouvintes.forEach((avisar) => avisar());
  }

  function assinar(avisar: () => void) {
    ouvintes.add(avisar);
    const aoMudarEmOutraAba = (evento: StorageEvent) => {
      if (evento.key === chave || evento.key === null) avisar();
    };
    window.addEventListener("storage", aoMudarEmOutraAba);
    return () => {
      ouvintes.delete(avisar);
      window.removeEventListener("storage", aoMudarEmOutraAba);
    };
  }

  return { ler, gravar, assinar, vazio };
}
