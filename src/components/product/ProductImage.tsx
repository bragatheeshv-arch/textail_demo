import { useId, useState, type ReactElement } from 'react';

function motifPaths(motif: string, c1: string): ReactElement {
  switch (motif) {
    case 'floral':
      return (<g fill={c1} {...{ opacity: 0.5 } as object}>
        {[[30,30],[90,50],[150,30],[60,100],[120,120],[180,100],[40,170],[110,180],[170,170]].map(([x,y],i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${i*40})`}>
            <ellipse cx="0" cy="-7" rx="5" ry="9" /><ellipse cx="7" cy="3" rx="5" ry="9" transform="rotate(72 7 3)" />
            <ellipse cx="-7" cy="3" rx="5" ry="9" transform="rotate(-72 -7 3)" /><circle r="3.5" fill="#fff" opacity="0.8" />
          </g>
        ))}
      </g>);
    case 'leaf':
      return (<g fill="none" stroke={c1} strokeWidth="2" opacity="0.6">
        {Array.from({length:9}).map((_,i) => (<path key={i} d={`M ${10+i*22} 190 Q ${20+i*22} 100 ${30+i*22} 20 M ${20+i*22} 120 q 14 -4 20 -18 M ${22+i*22} 90 q -14 -4 -20 -18`} />))}
      </g>);
    case 'geo': return (<g fill="none" stroke={c1} strokeWidth="2" opacity="0.55">{Array.from({length:6}).map((_,r) => Array.from({length:6}).map((_,c) => (<g key={`${r}${c}`}><rect x={10+c*32} y={10+r*32} width="20" height="20" transform={`rotate(45 ${20+c*32} ${20+r*32})`} /><circle cx={20+c*32} cy={20+r*32} r="3" fill={c1} stroke="none" /></g>)))}</g>);
    case 'chevron': return (<g fill="none" stroke={c1} strokeWidth="5" opacity="0.5">{Array.from({length:7}).map((_,i) => (<path key={i} d={`M -10 ${20+i*26} L 100 ${40+i*26} L 210 ${20+i*26}`} />))}</g>);
    case 'checks': return (<g opacity="0.4">{Array.from({length:8}).map((_,r) => Array.from({length:8}).map((_,c) => ((r+c)%2===0 ? <rect key={`${r}${c}`} x={c*25} y={r*25} width="25" height="25" fill={c1} /> : null)))}</g>);
    case 'dots': return (<g fill={c1} opacity="0.5">{Array.from({length:7}).map((_,r) => Array.from({length:9}).map((_,c) => (<circle key={`${r}${c}`} cx={12+c*22+(r%2?11:0)} cy={12+r*26} r="4" />)))}</g>);
    case 'ombre': return (<g opacity="0.55">{Array.from({length:12}).map((_,i) => (<rect key={i} x="0" y={i*17} width="200" height="17" fill={c1} opacity={0.12+i*0.06} />))}</g>);
    case 'marble': return (<g fill="none" stroke={c1} strokeWidth="2" opacity="0.5"><path d="M0 40 Q60 10 110 50 T200 40" /><path d="M0 90 Q70 60 120 100 T200 85" /><path d="M0 140 Q60 110 130 150 T200 135" /><path d="M0 180 Q80 150 140 185 T200 175" /></g>);
    case 'paisley': return (<g fill="none" stroke={c1} strokeWidth="2.5" opacity="0.6">{[[40,60],[120,50],[70,140],[150,130]].map(([x,y],i) => (<g key={i} transform={`translate(${x} ${y})`}><path d="M0 -28 C 20 -20 22 5 4 16 C -8 22 -22 14 -18 0 C -15 -10 -2 -12 0 -2" /><circle cx="2" cy="4" r="3" fill={c1} stroke="none" /></g>))}</g>);
    default: return (<g stroke={c1} strokeWidth="1.5" opacity="0.4">{Array.from({length:14}).map((_,i) => (<line key={i} x1="0" y1={i*15} x2="200" y2={i*15} />))}</g>);
  }
}

export function parseArt(token: string): { a: string; b: string; motif: string } {
  const inner = token.startsWith('art:') ? token.slice(4) : token;
  const [a = '#d8b8b0', b = '#f4eee2', motif = 'weave'] = inner.split('|');
  return { a, b, motif };
}

export default function ProductImage({ token, alt, className = '', eager = false }: { token: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  // Empty/whitespace tokens can never load — render the neutral art swatch
  // directly instead of an <img src=""> that shows as an empty box.
  const empty = !token || !token.trim();
  // Remote photos that fail to load fall back to a neutral art swatch —
  // NEVER parseArt() on a URL (it would yield an invalid gradient color
  // and render an empty box that looks like a disappearing product).
  if (empty || token.startsWith('art:') || failed) {
    const { a, b, motif } = token.startsWith('art:') ? parseArt(token) : { a: '#d8b8b0', b: '#f4eee2', motif: 'weave' };
    const gid = `g-${uid}-${a.replace('#', '')}-${b.replace('#', '')}`;
    return (
      <svg viewBox="0 0 200 200" role="img" aria-label={alt} className={className} preserveAspectRatio="xMidYMid slice" aria-hidden={alt === '' ? true : undefined}>
        <defs><linearGradient id={gid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={b} /><stop offset="1" stopColor={a} /></linearGradient></defs>
        <rect width="200" height="200" fill={`url(#${gid})`} />
        {motifPaths(motif, a)}
        <rect width="200" height="200" fill="none" stroke="#00000010" />
      </svg>
    );
  }
  return <img src={token} alt={alt} className={`block object-cover ${className}`} loading={eager ? 'eager' : 'lazy'} draggable={false} onError={() => setFailed(true)} />;
}
