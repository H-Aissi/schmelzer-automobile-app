const ICONS: Record<string, string> = {
  menu: 'M3 6h18M3 12h18M3 18h18',
  x: 'M6 6l12 12M18 6L6 18',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  filter: 'M3 5h18M6 12h12M10 19h4',
  chevDown: 'M6 9l6 6 6-6',
  chevRight: 'M9 6l6 6-6 6',
  chevLeft: 'M15 6l-6 6 6 6',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z',
  mail: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3.5 6.5l8.5 6 8.5-6',
  pin: 'M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  gauge: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 13l4-4M12 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  fuel: 'M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h13M14 9h2.5a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-2.5-2.5M7 8h4',
  cog: 'M12.22 2h-.44a2 2 0 0 0-2 1.78L9.5 5.03a7.5 7.5 0 0 0-1.06.44L6.5 4.59a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .47 2.65l1.15.85a7.6 7.6 0 0 0 0 1.56l-1.15.85a2 2 0 0 0-.47 2.65l.22.38a2 2 0 0 0 2.73.73l1.94-.88c.34.16.7.3 1.06.44l.28 2.25a2 2 0 0 0 2 1.78h.44a2 2 0 0 0 2-1.78l.28-2.25a7.5 7.5 0 0 0 1.06-.44l1.94.88a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.47-2.65l-1.15-.85a7.6 7.6 0 0 0 0-1.56l1.15-.85a2 2 0 0 0 .47-2.65l-.22-.38a2 2 0 0 0-2.73-.73l-1.94.88a7.5 7.5 0 0 0-1.06-.44L14.22 3.78A2 2 0 0 0 12.22 2zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  calendar: 'M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3 9h18M8 3v4M16 3v4',
  check: 'M5 12l4.5 4.5L19 7',
  checkCircle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 12l2.5 2.5 4.5-5',
  plus: 'M12 5v14M5 12h14',
  pencil: 'M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3zM13.5 6.5l3 3',
  trash: 'M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  image: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM3.5 17l5-5 4 4 3-3 5 5',
  car: 'M5 16l1.2-5.2A2 2 0 0 1 8.1 9h7.8a2 2 0 0 1 1.9 1.4L19 16M4 16h16v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3zM7 13h10M7.5 16.5h.01M16.5 16.5h.01',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  dashboard: 'M4 4h7v6H4zM13 4h7v10h-7zM4 12h7v8H4zM13 16h7v4h-7z',
  tag: 'M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9zM7.5 8.5h.01',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  inbox: 'M3 13h5l2 3h4l2-3h5M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  euro: 'M16 6a6 6 0 1 0 0 12M4 10h9M4 14h9',
  trend: 'M3 17l6-6 4 4 8-8M21 7v5h-5',
  shield: 'M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18',
  sort: 'M7 4v16M7 20l-3-3M7 4l3 3M17 4v16M17 4l-3 3M17 20l3-3',
  bolt: 'M13 3L4 14h7l-1 7 9-11h-7l1-7z',
};

type IconProps = {
  name: string;
  size?: number;
  stroke?: number;
  style?: React.CSSProperties;
  className?: string;
};

export function Icon({ name, size = 20, stroke = 1.7, style, className }: IconProps) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
