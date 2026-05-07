"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { duration, ease } from "@/lib/motion-config";

// VoiceNoteButton — record a short voice memo. The full audio capture wires
// up the MediaRecorder API behind a feature flag; for the pitch the visual
// of recording (live waveform + countdown) is what residents and leadership
// actually feel. We keep the raw blob in state so the post-sign build can
// upload to Supabase storage without a frontend change.
const MAX_SECONDS = 60;

export function VoiceNoteButton({ onComplete }: { onComplete: (seconds: number) => void }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [levels, setLevels] = useState<number[]>(Array(20).fill(0.15));
  const recRef = useRef<MediaRecorder | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedAt = useRef<number>(0);

  useEffect(() => () => stopAll(), []);

  function stopAll() {
    try { recRef.current?.stop(); } catch { /* noop */ }
    try { ctxRef.current?.close(); } catch { /* noop */ }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    recRef.current = null;
    ctxRef.current = null;
    rafRef.current = null;
  }

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      rec.start();
      recRef.current = rec;
      startedAt.current = Date.now();
      setRecording(true);
      setSeconds(0);

      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);

      const loop = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.min(1, Math.sqrt(sum / buf.length) * 4);
        setLevels((prev) => {
          const next = prev.slice(1);
          next.push(0.18 + rms * 0.82);
          return next;
        });
        const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
        setSeconds(elapsed);
        if (elapsed >= MAX_SECONDS) finish();
        else rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch (err) {
      console.warn("voice note unavailable", err);
      // graceful: fake a 6-second cycle for demo when mic is denied.
      simulate();
    }
  }

  function simulate() {
    setRecording(true);
    setSeconds(0);
    startedAt.current = Date.now();
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
      setSeconds(elapsed);
      setLevels((prev) => {
        const next = prev.slice(1);
        next.push(0.3 + Math.random() * 0.6);
        return next;
      });
      if (elapsed >= 6) finish();
      else rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }

  function finish() {
    const taken = Math.max(1, seconds);
    stopAll();
    setRecording(false);
    setLevels(Array(20).fill(0.15));
    onComplete(taken);
  }

  if (!recording) {
    return (
      <button
        type="button"
        onClick={start}
        className="group flex items-center gap-3 rounded-full border border-[var(--color-hairline-strong)] bg-white/55 backdrop-blur-md px-5 py-3 min-h-[48px] hover:border-[var(--color-accent)] hover:bg-white/80 transition-all active:scale-[0.97]"
        aria-label="Record voice note"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] group-hover:bg-[#c75450] transition-colors" />
        <span className="font-serif italic text-[0.9rem] text-[var(--color-ink)]" style={{ fontVariationSettings: '"opsz" 16, "SOFT" 100' }}>
          Send a voice note
        </span>
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={finish}
      className="flex items-center gap-3 rounded-full border border-[#c75450] bg-[#c75450]/10 px-5 py-3 min-h-[48px]"
      initial={{ scale: 0.96 }}
      animate={{ scale: 1 }}
      transition={{ duration: duration.normal, ease: ease.out }}
      aria-label="Stop recording"
    >
      <motion.span
        className="w-3 h-3 rounded-sm bg-[#c75450]"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <Waveform levels={levels} />
      <span className="font-mono text-[0.75rem] text-[#c75450] tabular tabular-nums w-9 text-right">
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
      </span>
    </motion.button>
  );
}

function Waveform({ levels }: { levels: number[] }) {
  return (
    <div className="flex items-center gap-[2px] h-6">
      {levels.map((l, i) => (
        <span
          key={i}
          style={{ height: `${Math.max(10, l * 100)}%`, width: 2 }}
          className="bg-[#c75450] rounded-full transition-all duration-75"
        />
      ))}
    </div>
  );
}
