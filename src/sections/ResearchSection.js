import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionHeader } from '../ui';
import { Trophy, FileText, Download } from 'lucide-react';

const ResearchSection = ({ content }) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

    return (
        <section ref={targetRef} id="research" className="relative h-[300dvh] bg-neutral-900/50">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <div className="absolute top-12 left-6 md:left-20 z-20">
                    <SectionHeader title={content.title} subtitle="Awards & Achievements" />
                </div>

                <motion.div style={{ x }} className="flex gap-8 px-20">
                    {/* Intro Card */}
                    <div className="flex-shrink-0 w-[400px] md:w-[600px] h-[60dvh] flex flex-col justify-center p-10 bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/20 backdrop-blur-md rounded-2xl">
                        <Trophy size={48} className="text-emerald-400 mb-6" />
                        <h3 className="text-3xl font-bold mb-6">{content.description}</h3>
                        <p className="text-gray-400 leading-relaxed mb-8">
                            {content.description}
                        </p>
                        <button className="self-start flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-full transition-colors text-emerald-400">
                            <Download size={18} />
                            <span>{content.download_button || "Download CV"}</span>
                        </button>
                    </div>

                    {/* Awards List */}
                    {content.awards.map((award, index) => (
                        <div key={index} className="flex-shrink-0 w-[350px] md:w-[450px] h-[60dvh] p-8 bg-neutral-900/80 border border-white/5 rounded-2xl flex flex-col hover:border-emerald-500/30 transition-colors duration-300">
                            <div className="text-6xl font-bold text-white/5 mb-8">{award.year}</div>
                            <div className="flex-1">
                                <div className="text-emerald-400 text-sm font-mono mb-2">{award.prize}</div>
                                <h4 className="text-xl font-bold mb-4">{award.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{award.details}</p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                                <Trophy size={20} className="text-emerald-500/50" />
                            </div>
                        </div>
                    ))}

                    {/* Publications if available */}
                    {content.publications && content.publications.map((pub, index) => (
                        <div key={`pub-${index}`} className="flex-shrink-0 w-[350px] md:w-[450px] h-[60dvh] p-8 bg-neutral-900/80 border border-white/5 rounded-2xl flex flex-col hover:border-emerald-500/30 transition-colors duration-300">
                            <div className="text-6xl font-bold text-white/5 mb-8">{pub.year}</div>
                            <div className="flex-1">
                                <div className="text-cyan-400 text-sm font-mono mb-2">{pub.journal}</div>
                                <h4 className="text-xl font-bold mb-4">{pub.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{pub.details}</p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                                <FileText size={20} className="text-cyan-500/50" />
                            </div>
                        </div>
                    ))}

                </motion.div>
            </div>
        </section>
    );
};

export default ResearchSection;
