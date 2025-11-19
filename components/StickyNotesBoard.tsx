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

const NOTES_COUNT = 12;

interface NoteState {
  msgIndex: number;
  remaining: number; // ms remaining to show
}

export default function StickyNotesBoard({ messages }: Props) {
  const [notes, setNotes] = useState<NoteState[]>([]);

  // initialize notes with unique messages
  useEffect(() => {
    if (messages.length === 0) return;

    const arr = [...messages.keys()];
    const initialNotes: NoteState[] = [];

    for (let i = 0; i < NOTES_COUNT; i++) {
      if (arr.length === 0) break;
      const r = Math.floor(Math.random() * arr.length);
      const msgIndex = arr[r];
      arr.splice(r, 1);

      const isLong = messages[msgIndex].message.length > 120;
      const duration = isLong ? 20000 : 12000 + Math.random() * 5000;

      initialNotes.push({ msgIndex, remaining: duration });
    }

    setNotes(initialNotes);
  }, [messages]);

  // interval to reduce remaining time
  useEffect(() => {
    const interval = setInterval(() => {
      setNotes((prev) =>
        prev.map((n) => {
          const newRemaining = n.remaining - 1000; // 1 sec
          if (newRemaining <= 0) {
            // pick new unique message
            const used = prev.map((x) => x.msgIndex);
            const available = messages
              .map((_, i) => i)
              .filter((i) => !used.includes(i));

            const newIndex =
              available.length > 0
                ? available[Math.floor(Math.random() * available.length)]
                : n.msgIndex;

            const isLong = messages[newIndex].message.length > 120;
            const duration = isLong ? 20000 : 12000 + Math.random() * 5000;

            return { msgIndex: newIndex, remaining: duration };
          }
          return { ...n, remaining: newRemaining };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {notes.map((note, i) => {
          const m = messages[note.msgIndex];
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
                  ${colors[note.msgIndex % colors.length]} 
                  ${size.padding}
                  rounded-xl shadow-xl w-full h-full 
                  transition-all duration-700 
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
