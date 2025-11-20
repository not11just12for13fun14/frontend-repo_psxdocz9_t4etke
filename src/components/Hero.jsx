import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative py-24">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-bold text-white tracking-tight"
        >
          Multi-tenant AI SaaS Starter
        </motion.h1>
        <p className="mt-5 text-blue-200/90 text-lg">
          Auth, subscriptions, CMS page builder, AI services with token metering, and invoicing — ready to extend.
        </p>
      </div>
    </section>
  );
}
