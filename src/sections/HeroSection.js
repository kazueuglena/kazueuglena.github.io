import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedText, GradientText } from '../ui';
import { ArrowRight, ChevronDown } from 'lucide-react';

const HeroSection = ({ content }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
            <motion.div style={{ y: y1, opacity }} className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mb-6 inline-block"
                >
                    <div className="px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-900/10 backdrop-blur-sm">
                        <span className="text-emerald-400 text-xs tracking-widest uppercase">{content.name_label}</span>
                    </div>
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-['Syne'] font-bold mb-6 leading-tight tracking-tight">
                    <span className="block mb-2 text-white/90">{content.title.split(' ')[0]}</span>
                    <GradientText>{content.title.split(' ').slice(1).join(' ')}</GradientText>
                </h1>

                <p className="text-gray-400 text-lg md:text-xl font-light tracking-wide mb-10 max-w-2xl mx-auto">
                    {content.subtitle}
                </p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-[1px] h-20 bg-gradient-to-b from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />
                    <span className="text-emerald-500/50 text-xs tracking-[0.3em] uppercase">Scroll</span>
                </motion.div>
            </motion.div>

            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020408] to-transparent z-10" />
        </section>
    );
};

export default HeroSection;
