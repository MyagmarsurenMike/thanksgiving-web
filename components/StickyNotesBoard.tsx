import { useEffect, useMemo, useState } from 'react';
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
];

const ROTATE_DURATION = 30000;

function createNoteIndices(noteCount: number, messageCount: number) {
  let messageIndices = Array.from({length: messageCount}).map((_, i) => i);
  for (let i = 0; i < messageIndices.length; i++) {
    let n = Math.round(Math.random() * messageIndices.length) % messageIndices.length;
    let tmp = messageIndices[i];
    messageIndices[i] = messageIndices[n];
    messageIndices[n] = tmp;
  }
  return Array.from({length: noteCount}).map((_, i) => messageIndices[i % messageIndices.length]);
}
export default function StickyNotesBoard({ messages }: Props) {
  const getNotesCount = () => {
    if (typeof window === 'undefined') return 12;
    const w = window.innerWidth;
    if (w < 640) return 9;
    if (w < 1024) return 12;
    return 15;
  };

  const [NOTES_COUNT, setNOTES_COUNT] = useState(getNotesCount());
  const [noteData, setNoteData] = useState(() => createNoteIndices(NOTES_COUNT, messages.length));

  // Resize handler
  useEffect(() => {
    const resize = () => {
      const count = getNotesCount();
      setNOTES_COUNT(count);
      setNoteData(createNoteIndices(count, messages.length));
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [messages]);

  // Rotate messages every 10s
  useEffect(() => {
    if (messages.length === 0) return;
    if (messages.length === 1) return; // only one message, nothing to rotate

    const interval = setInterval(() => {
      setNoteData(createNoteIndices(NOTES_COUNT, messages.length));
    }, ROTATE_DURATION); // 10 seconds

    return () => clearInterval(interval);
  }, [messages, NOTES_COUNT]);

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
          const message = messages[note];
          const color = stickyColors[note % stickyColors.length];
          const rotate = rotations[note % rotations.length];
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
                    <p className={`${size.text} text-gray-800 leading-snug line-clamp-10`}>
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
