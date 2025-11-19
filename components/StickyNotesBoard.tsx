import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

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

const stickyColors = [
  'bg-yellow-200', 'bg-pink-200', 'bg-blue-200',
  'bg-green-200', 'bg-purple-200', 'bg-orange-200'
];

const rotations = [
  'rotate-1', '-rotate-2', 'rotate-2', '-rotate-1',
  'rotate-3', '-rotate-3', 'rotate-6', '-rotate-6'
];

const noteSizes = [
  { wrapper: 'col-span-1 row-span-1', padding: 'p-2', text: 'text-xs', minHeight: 100 },
  { wrapper: 'col-span-1 row-span-1', padding: 'p-3', text: 'text-sm', minHeight: 120 },
  { wrapper: 'col-span-1 row-span-2', padding: 'p-4', text: 'text-sm', minHeight: 140 },
];

export default function StickyNotesBoard({ messages }: Props) {
  const getNotesCount = () => {
    if (typeof window === 'undefined') return 12;
    const w = window.innerWidth;
    if (w < 640) return 9;
    if (w < 1024) return 12;
    return 15;
  };

  const [NOTES_COUNT, setNOTES_COUNT] = useState(getNotesCount());
  const [noteData, setNoteData] = useState(
    () => Array.from({ length: NOTES_COUNT }).map((_, i) => ({
      messageIndex: i % messages.length,
      lastChange: Date.now()
    }))
  );

  const [animating, setAnimating] = useState<Set<number>>(new Set());

  // Resize handler
  useEffect(() => {
    const resize = () => {
      const count = getNotesCount();
      setNOTES_COUNT(count);
      setNoteData(
        Array.from({ length: count }).map((_, i) => ({
          messageIndex: i % messages.length,
          lastChange: Date.now()
        }))
      );
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [messages.length]);

  // Main loop with unique messages
  useEffect(() => {
    if (messages.length === 0) return;

    const interval = setInterval(() => {
      setNoteData(prev => {
        const now = Date.now();

        // track currently shown messages
        const currentlyShown = new Set(prev.map(n => messages[n.messageIndex]?._id));

        // prepare next indices to avoid duplicates
        const nextIndices: number[] = [];
        const usedIds = new Set<string>(currentlyShown);

        prev.forEach((note, position) => {
          const msg = messages[note.messageIndex];
          if (!msg) {
            nextIndices.push(note.messageIndex);
            return;
          }

          const timeVisible = now - note.lastChange;
          const minTime = 15000;
          const extraTime = Math.min(msg.message.length * 50, 20000);
          const requiredVisibleTime = minTime + extraTime;

          if (timeVisible < requiredVisibleTime) {
            nextIndices.push(note.messageIndex);
            return;
          }

          // find next unique message
          let nextIndex = note.messageIndex;
          for (let i = 0; i < messages.length; i++) {
            nextIndex = (nextIndex + 1) % messages.length;
            if (!usedIds.has(messages[nextIndex]._id)) break;
          }
          usedIds.add(messages[nextIndex]._id);

          // start animation
          setAnimating(a => new Set(a).add(position));
          setTimeout(() => {
            setAnimating(a => {
              const t = new Set(a);
              t.delete(position);
              return t;
            });
          }, 600);

          nextIndices.push(nextIndex);
        });

        return prev.map((note, i) => ({
          messageIndex: nextIndices[i],
          lastChange: note.messageIndex === nextIndices[i] ? note.lastChange : now
        }));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [messages]);

  if (messages.length === 0)
    return (
      <div className="flex items-center justify-center min-h-60 px-4">
        <p className="text-gray-600 text-lg">Одоогоор мэндчилгээ байхгүй байна.</p>
      </div>
    );

  return (
    <div className="h-auto px-2 sm:px-4 py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 auto-rows-min">
        {noteData.map((note, position) => {
          const message = messages[note.messageIndex];
          const color = stickyColors[note.messageIndex % stickyColors.length];
          const rotate = rotations[note.messageIndex % rotations.length];
          const size = noteSizes[position % noteSizes.length];

          return (
            <div key={position} className={`flex items-center justify-center ${size.wrapper}`}>
              <div
                className={`
                  ${color} ${rotate} ${size.padding} rounded-lg shadow-lg 
                  transition-all duration-700 w-full h-full transform
                  ${animating.has(position) ? "opacity-0 scale-95" : "opacity-100"}
                `}
                style={{ minHeight: size.minHeight }}
              >
                <div className="space-y-3 flex flex-col h-full">
                  <div className="flex items-start gap-2 flex-1">
                    <Heart className="w-4 h-4 text-red-500 mt-1" fill="currentColor" />
                    <p className={`${size.text} text-gray-800 leading-snug line-clamp-6`}>
                      {message.emoji ? `${message.emoji} ` : ""}
                      {message.message}
                    </p>
                  </div>
                  <div className="text-xs text-gray-600">
                    To: <span className="text-orange-600">{message.toName}</span>
                  </div>
                  <p className="text-xs text-right italic text-gray-700">
                    — {message.fromName}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
