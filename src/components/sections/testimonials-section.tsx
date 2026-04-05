"use client";

import { motion } from "framer-motion";
import {
  KineticTestimonials,
  type Testimonial,
} from "@/components/ui/kinetic-testimonials";

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ahmed Al-Rashid",
    role: "CEO",
    company: "Mashawi House",
    content:
      "We were losing leads every day without knowing it. Siyadah found the gap in 60 seconds and built an alert system that now catches every single inquiry. Our response time dropped from 4 hours to 2 minutes.",
  },
  {
    name: "Sarah Al-Dosari",
    role: "Operations Manager",
    company: "Seha Clinics",
    content:
      "The no-show rate at our clinic was killing us. Siyadah set up automatic appointment reminders and follow-ups. We reduced no-shows by 40% in the first month alone.",
  },
  {
    name: "Khalid Bin Nasser",
    role: "Founder",
    company: "Souq Digital",
    content:
      "I was skeptical about AI tools, but Siyadah speaks my language — literally. It understood my e-commerce business from the URL alone and suggested automations I didn't know I needed.",
  },
  {
    name: "Fatima Al-Harbi",
    role: "Marketing Director",
    company: "Bloom Beauty",
    content:
      "The competitor radar feature is a game-changer. We now know when competitors change prices or launch campaigns before our team even notices. It's like having a full-time analyst.",
  },
  {
    name: "Omar Al-Qahtani",
    role: "Managing Partner",
    company: "Al-Qahtani Law",
    content:
      "Court date reminders, client updates, case tracking — all automated. My team saves 15 hours per week on administrative tasks. Siyadah pays for itself ten times over.",
  },
  {
    name: "Noura Al-Salem",
    role: "Owner",
    company: "Café Nura",
    content:
      "I have no tech background at all. Siyadah didn't ask me to learn anything technical. I just told it my problems in Arabic and it fixed them. That simple.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Businesses Across Saudi Arabia
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            See how companies like yours are saving time, catching leads, and
            growing with Siyadah.
          </p>
        </motion.div>

        <KineticTestimonials testimonials={TESTIMONIALS} className="mt-16" />
      </div>
    </section>
  );
}
