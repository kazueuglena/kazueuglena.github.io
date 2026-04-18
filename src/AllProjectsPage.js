import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import BotanicalSynapse from './BotanicalSynapse';
import AnimatedText from './AnimatedText';

const AllProjectsPage = ({ content, setPage, setSelectedDetail, lang, setLang, setScrollToSectionId, ui }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleBack = () => {
        setScrollToSectionId('projects');
        setPage('home');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-black min-h-[100dvh] text-gray-200 relative overflow-hidden"
        >
            <BotanicalSynapse />
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-none z-0"></div>
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-32 relative z-10">
                <div className="flex justify-between items-end mb-20 border-b border-white/10 pb-8">
                    <h1 className="text-xl md:text-3xl font-normal tracking-wider font-['Syne',sans-serif] text-gray-100">
                        <AnimatedText text={content.all_projects_page.title} />
                    </h1>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleBack}
                            data-hoverable="true"
                            className="text-xs text-gray-500 hover:text-white transition-colors tracking-widest uppercase"
                        >
                            <AnimatedText text={ui.back} />
                        </button>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                    {content.projects.items.map((item, index) => (
                        <motion.div
                            key={`project-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onClick={() => setSelectedDetail(item)}
                            data-hoverable="true"
                            className="group cursor-pointer"
                        >
                            <div className="aspect-video overflow-hidden relative mb-6">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x450/171717/525252?text=Image+Not+Found'; }} />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-mono mb-2 tracking-widest"><AnimatedText text={item.period} /></p>
                                <h3 className="text-lg font-normal text-gray-200 group-hover:text-white transition-colors mb-3"><AnimatedText text={item.title} /></h3>
                                <p className="text-xs text-gray-500 leading-relaxed tracking-wide"><AnimatedText text={item.description} /></p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AllProjectsPage;
