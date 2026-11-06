import { Suspense } from "react";
import { TelaPartida } from "@/components/TelaPartida";

export default function Partida() {
  return (
    <main className="tela">
      <Suspense>
        <TelaPartida />
      </Suspense>
    </main>
  );
}
