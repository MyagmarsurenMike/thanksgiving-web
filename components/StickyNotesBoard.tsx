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

  // Rotate messages every 10s
  useEffect(() => {
    if (messages.length === 0) return;
    if (messages.length === 1) return; // only one message, nothing to rotate

    const interval = setInterval(() => {
      setNoteData(prev => {
        const usedIds = new Set<string>();
        const nextData = prev.map(note => {
          let nextIndex = note.messageIndex;
          // find next message that is not already used
          for (let i = 1; i <= messages.length; i++) {
            nextIndex = (note.messageIndex + i) % messages.length;
            if (!usedIds.has(messages[nextIndex]._id)) break;
          }
          usedIds.add(messages[nextIndex]._id);
          return {
            messageIndex: nextIndex,
            lastChange: Date.now()
          };
        });
        return nextData;
      });
    }, 10000); // 10 seconds

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
