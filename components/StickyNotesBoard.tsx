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
  'bg-yellow-200',
  'bg-pink-200',
  'bg-blue-200',
  'bg-green-200',
  'bg-purple-200',
  'bg-orange-200',
];

const rotations = [
  'rotate-1',
  '-rotate-2',
  'rotate-2',
  '-rotate-1',
  'rotate-3',
  '-rotate-3',
  'rotate-6',
  '-rotate-6',
  'rotate-12',
  '-rotate-12',
];

// smaller notes for web
const noteSizes = [
  { wrapper: 'col-span-1 row-span-1', padding: 'p-2', text: 'text-xs', minHeight: 100 },
  { wrapper: 'col-span-1 row-span-1', padding: 'p-3', text: 'text-sm', minHeight: 120 },
  { wrapper: 'col-span-1 row-span-2', padding: 'p-4', text: 'text-sm', minHeight: 140 },
];

export default function StickyNotesBoard({ messages }: Props) {
  const getNotesCount = () => {
    if (typeof window === 'undefined') return 12;
    const w = window.innerWidth;
    if (w < 640) return 9; // mobile
    if (w < 1024) return 12; // tablet
    return 15; // desktop
  };

  const [NOTES_COUNT, setNOTES_COUNT] = useState<number>(getNotesCount());
  const [noteIndices, setNoteIndices] = useState<number[]>(
    () => Array.from({ length: NOTES_COUNT }, (_, i) => i % Math.max(1, messages.length))
  );
  const [animatingNotes, setAnimatingNotes] = useState<Set<number>>(new Set());

  useEffect(() => {
    setNoteIndices(Array.from({ length: NOTES_COUNT }, (_, i) => i % Math.max(1, messages.length)));
  }, [messages.length, NOTES_COUNT]);

  useEffect(() => {
    const handleResize = () => {
      const next = getNotesCount();
      setNOTES_COUNT(next);
      setNoteIndices(Array.from({ length: next }, (_, i) => i % Math.max(1, messages.length)));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;

    const intervals: number[] = [];

    for (let position = 0; position < NOTES_COUNT; position++) {
      const randomDelay = Math.random() * 7000 + 8000;
      const id = window.setInterval(() => {
        setAnimatingNotes((prev) => new Set(prev).add(position));

        setTimeout(() => {
          setNoteIndices((prev) => {
            const newIndices = [...prev];
            newIndices[position] = (newIndices[position] + 1) % messages.length;
            return newIndices;
          });

          setTimeout(() => {
            setAnimatingNotes((prev) => {
              const next = new Set(prev);
              next.delete(position);
              return next;
            });
          }, 600);
        }, 250);
      }, randomDelay);

      intervals.push(id);
    }

    return () => intervals.forEach((i) => clearInterval(i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, NOTES_COUNT]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-60 px-4">
        <div className="text-center">
          <p className="text-xl text-gray-600">Одоогоор мэндчилгээ байхгүй байна.</p>
          <p className="text-gray-500 mt-2">Та эхнийх нь болж мэндчилгээ хуваалцаарай 🍁</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto px-2 sm:px-4 py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 auto-rows-min gap-3 sm:gap-4`}
        >
          {noteIndices.map((messageIndex, position) => {
            const message = messages[messageIndex % messages.length];
            if (!message) return null;

            const colorClass = stickyColors[messageIndex % stickyColors.length];
            const rotationClass = rotations[messageIndex % rotations.length];
            const sizeConfig = noteSizes[position % noteSizes.length];

            return (
              <div
                key={position}
                className={`flex items-center justify-center ${sizeConfig.wrapper}`}
                style={{ minHeight: sizeConfig.minHeight }}
              >
                <div
                  className={`${colorClass} ${rotationClass} rounded-lg shadow-xl ${sizeConfig.padding} transform transition-all duration-700 relative w-full h-full hover:scale-105 hover:shadow-2xl hover:rotate-0 ${
                    animatingNotes.has(position) ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                >
                  <div
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-5 bg-white/60 rounded-sm"
                    style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}
                  />

                  <div className="space-y-3 flex flex-col h-full">
                    <div className="flex items-start gap-2 flex-1">
                      <Heart className="w-4 h-4 text-red-500 shrink-0 mt-1" fill="currentColor" />
                      <p className={`${sizeConfig.text} text-gray-800 leading-snug line-clamp-6`}>
                        {message.emoji ? `${message.emoji} ` : ''}
                        {message.message}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">
                        To: <span className="text-orange-600">{message.toName}</span>
                      </p>
                      <p className="text-xs text-gray-700 italic text-right">
                        — {message.fromName}
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-0 right-0 w-0 h-0 border-l-20 border-l-transparent border-b-20 border-b-gray-400/20 rounded-bl-lg" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .line-clamp-6 { display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden; }
        }
      `}</style>
    </div>
  );
}
