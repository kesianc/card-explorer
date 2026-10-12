import "./MagicDust.css";

const PARTICLE_COUNT = 26;
const BRIGHT_PARTICLE_INDICES = new Set([2, 7, 11, 16, 21, 24]);

/** Valor determinístico em [0, 1) para evitar mismatch de hidratação. */
function unit(index: number, channel: number): number {
  const x = Math.sin(index * 12.9898 + channel * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Formata números com precisão fixa para HTML do servidor e cliente coincidirem. */
function pct(value: number): string {
  return `${value.toFixed(4)}%`;
}

function px(value: number): string {
  return `${value.toFixed(2)}px`;
}

function sec(value: number): string {
  return `${value.toFixed(4)}s`;
}

function cssNum(value: number): string {
  return value.toFixed(6);
}

type ParticleStyle = {
  left: string;
  top: string;
  width: string;
  height: string;
  animationDuration: string;
  animationDelay: string;
  ["--dust-opacity-min"]: string;
  ["--dust-opacity-mid"]: string;
  ["--dust-opacity-peak"]: string;
  ["--dust-dx"]: string;
  ["--dust-dy"]: string;
  ["--dust-dx-end"]: string;
  ["--dust-dy-end"]: string;
};

const particles: ParticleStyle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const bright = BRIGHT_PARTICLE_INDICES.has(i);
  const size = bright ? 2.5 + unit(i, 1) * 2.5 : 1.5 + unit(i, 1) * 2.25;
  const opacityBase = bright ? 0.4 + unit(i, 2) * 0.32 : 0.18 + unit(i, 2) * 0.3;

  const opacityMin = opacityBase * (bright ? 0.55 : 0.45);
  const opacityMid = opacityBase * (bright ? 1.05 : 0.85);
  const opacityPeak = Math.min(opacityBase * (bright ? 1.5 : 1.25), bright ? 0.95 : 0.72);

  return {
    left: pct(18 + unit(i, 3) * 62),
    top: pct(14 + unit(i, 4) * 58),
    width: px(size),
    height: px(size),
    animationDuration: sec(16 + unit(i, 5) * 16),
    animationDelay: sec(-unit(i, 6) * 22),
    "--dust-opacity-min": cssNum(opacityMin),
    "--dust-opacity-mid": cssNum(opacityMid),
    "--dust-opacity-peak": cssNum(opacityPeak),
    "--dust-dx": px((unit(i, 7) - 0.5) * 14),
    "--dust-dy": px(-14 - unit(i, 8) * 20),
    "--dust-dx-end": px((unit(i, 9) - 0.5) * 10),
    "--dust-dy-end": px(-32 - unit(i, 10) * 24),
  };
});

type MagicDustProps = {
  className?: string;
};

export function MagicDust({ className = "inset-0" }: MagicDustProps) {
  return (
    <div aria-hidden className={`magic-dust ${className}`}>
      {particles.map((style, index) => (
        <span
          key={index}
          className={
            BRIGHT_PARTICLE_INDICES.has(index)
              ? "magic-dust__particle magic-dust__particle--bright"
              : "magic-dust__particle"
          }
          style={style}
        />
      ))}
    </div>
  );
}
