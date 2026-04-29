"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";

export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.18,
  priority = false,
  objectPosition = "center",
}: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  priority?: boolean;
  objectPosition?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0 scale-[1.22]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          style={{ objectPosition }}
          priority={priority}
          sizes="100vw"
        />
      </motion.div>
    </div>
  );
}
