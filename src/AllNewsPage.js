import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BotanicalSynapse from './BotanicalSynapse';
import AnimatedText from './AnimatedText';

const AllNewsPage = ({ content, setPage, setSelectedNews, lang, setLang, setScrollToSectionId, ui }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const parseDate = (dateStr) => {
        if (!dateStr) return new Date(0);
        const parts = dateStr.split('.');
        if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2]);
        return new Date(dateStr);
    };

    const sortedItems = [...content.news.items].sort((a, b) => parseDate(b.date) - parseDate(a.date));

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]); // Scroll to top on page change

    const handleBack = () => {
        setScrollToSectionId('news');
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
                        <AnimatedText text={content.news.title} />
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentItems.map((item, index) => {
                        const thumbnail = item.images && item.images.length > 0 ? item.images[0] : null;
                        return (
                            <motion.div
                                key={`news-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                onClick={() => setSelectedNews(item)}
                                data-hoverable="true"
                                className="group bg-neutral-900/40 border border-white/10 relative overflow-hidden cursor-pointer hover:bg-neutral-800/60 transition-colors aspect-[4/3] flex flex-col justify-end p-6"
                            >
                                {thumbnail && (
                                    <>
                                        <img src={thumbnail} alt="News" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 grayscale hover:grayscale-0" loading="lazy" decoding="async" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                                    </>
                                )}
                                <div className="relative z-10">
                                    <p className="text-xs text-gray-500 font-mono mb-2 tracking-widest"><AnimatedText text={item.date} /></p>
                                    <h3 className="text-lg font-normal text-gray-300 group-hover:text-white transition-colors mb-2 leading-tight line-clamp-2"><AnimatedText text={item.title} /></h3>
                                    <div className="mt-4 text-xs text-gray-600 group-hover:text-gray-400 transition-colors tracking-widest uppercase">
                                        {ui.read_more}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-16">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`w-8 h-8 rounded-full text-xs font-mono transition-colors ${currentPage === i + 1
                                    ? 'bg-white text-black'
                                    : 'bg-neutral-900 text-gray-500 hover:text-white hover:bg-neutral-800'
                                    }`}
                                data-hoverable="true"
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AllNewsPage;
