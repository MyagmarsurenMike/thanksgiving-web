import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface Message {
  _id: string;
  fromName: string;
  toName: string;
  message: string;
  emoji?: string;
  createdAt: string;
}

interface Props {
  messages: Message[];
}

const smallNote = {
  wrapper: "col-span-1 row-span-1",
  padding: "p-3",
  text: "text-sm",
  minHeight: 120,
};

const bigNote = {
  wrapper: "col-span-2 row-span-2",
  padding: "p-4",
  text: "text-base",
  minHeight: 220,
};

const colors = [
  "bg-yellow-200",
  "bg-pink-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-purple-200",
  "bg-orange-200",
];

export default function StickyNotesBoard({ messages }: Props) {
  const NOTES_COUNT = 12;

  // unique message index for each position
  const [positions, setPositions] = useState<number[]>([]);

  // animation control
  const [anim, setAnim] = useState<Set<number>>(new Set());

  // UNIQUE SELECTION
  const pickUnique = () => {
    const arr = [...messages.keys()];
    const chosen: number[] = [];

    for (let i = 0; i < NOTES_COUNT; i++) {
      if (arr.length === 0) break;
      const r = Math.floor(Math.random() * arr.length);
      chosen.push(arr[r]);
      arr.splice(r, 1);
    }

    return chosen;
  };

  useEffect(() => {
    if (messages.length === 0) return;

    setPositions(pickUnique());

    const timers: number[] = [];

    positions.forEach((_, pos) => {
      const msg = messages[positions[pos]];
      if (!msg) return;

      const isLong = msg.message.length > 120;
      const duration = isLong
        ? 20000 // 20 sec
        : 10000 + Math.random() * 7000; // 10–17 sec

      const timer = window.setTimeout(() => {
        setAnim((prev) => new Set(prev).add(pos));

        setTimeout(() => {
          setPositions((prev) => {
            const next = [...prev];

            // pick 1 new unique message
            const available = messages
              .map((_, i) => i)
              .filter((i) => !next.includes(i));

            if (available.length > 0) {
              const newIndex =
                available[Math.floor(Math.random() * available.length)];
              next[pos] = newIndex;
            }

            return next;
          });

          setTimeout(() => {
            setAnim((prev) => {
              const s = new Set(prev);
              s.delete(pos);
              return s;
            });
          }, 400);
        }, 400);
      }, duration);

      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [messages, positions]);

  if (messages.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {positions.map((msgIndex, i) => {
          const m = messages[msgIndex];
          if (!m) return null;

          const isLong = m.message.length > 120;
          const size = isLong ? bigNote : smallNote;

          return (
            <div
              key={i}
              className={`${size.wrapper} flex items-center justify-center`}
              style={{ minHeight: size.minHeight }}
            >
              <div
                className={`
                  ${colors[msgIndex % colors.length]} 
                  ${size.padding}
                  rounded-xl shadow-xl w-full h-full 
                  transition-all duration-500 
                  ${
                    anim.has(i)
                      ? "opacity-0 scale-90"
                      : "opacity-100 scale-100"
                  }
                `}
              >
                <div className="space-y-2 flex flex-col h-full">
                  <div className="flex gap-2 flex-1">
                    <Heart
                      className="w-4 h-4 text-red-500 mt-1"
                      fill="currentColor"
                    />
                    <p className={`${size.text} text-gray-800 leading-snug`}>
                      {m.emoji ?? ""} {m.message}
                    </p>
                  </div>

                  <div className="text-right text-xs text-gray-600">
                    — {m.fromName} → {m.toName}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
