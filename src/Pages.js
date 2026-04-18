import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Calendar, ArrowRight } from 'lucide-react';
import { SectionHeader } from './ui';

export const DetailModal = ({ item, onClose, content }) => {
    if (!item) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-4xl max-h-[90dvh] overflow-y-auto bg-[#0a0f0d] border border-emerald-500/30 rounded-3xl relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-emerald-500 hover:text-black transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="grid md:grid-cols-2">
                        <div className="relative h-64 md:h-auto">
                            <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] to-transparent md:bg-gradient-to-r" />
                        </div>

                        <div className="p-8 md:p-12">
                            {item.year && <span className="text-emerald-400 text-xs font-mono mb-2 block">{item.year}</span>}
                            {item.period && <span className="text-emerald-400 text-xs font-mono mb-2 block">{item.period}</span>}

                            <h2 className="text-3xl font-bold mb-6">{item.title}</h2>
                            <p className="text-gray-300 leading-relaxed mb-8">
                                {item.details || item.description}
                            </p>

                            {item.link && (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
                                >
                                    <span>Visit Website</span>
                                    <ArrowRight size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export const AllNewsPage = ({ content, lang }) => {
    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 min-h-[100dvh]">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors">
                <ArrowLeft size={16} />
                <span>{content.all_news_page.back_button || "Back"}</span>
            </Link>

            <SectionHeader title={content.news.title} subtitle={content.all_news_page.title} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.news.items.map((item, index) => (
                    <Link to={`/news/${index}`} key={index} className="group block">
                        <div className="aspect-video rounded-xl overflow-hidden mb-4 border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-emerald-400 text-xs font-mono">{item.date}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{item.summary}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export const AllProjectsPage = ({ content, setSelectedDetail }) => {
    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 min-h-[100dvh]">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors">
                <ArrowLeft size={16} />
                <span>{content.all_projects_page.back_button || "Back"}</span>
            </Link>

            <SectionHeader title={content.projects.title} subtitle={content.all_projects_page.title} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.projects.items.map((item, index) => (
                    <div key={index} onClick={() => setSelectedDetail(item)} className="cursor-pointer group rounded-2xl bg-neutral-900/50 border border-white/5 overflow-hidden hover:border-emerald-500/30 transition-all">
                        <div className="h-64 overflow-hidden relative">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="p-8">
                            <span className="text-emerald-400 text-xs font-mono mb-2 block">{item.period}</span>
                            <h3 className="text-2xl font-bold mb-4 group-hover:text-emerald-300 transition-colors">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed mb-6">{item.description}</p>
                            <span className="text-sm text-emerald-500 flex items-center gap-2">
                                Read More <ArrowRight size={14} />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const NewsDetailPage = ({ content }) => {
    const { newsId } = useParams();
    const navigate = useNavigate();
    const newsItem = content.news.items[newsId];

    if (!newsItem) return <div className="pt-32 text-center text-white">News item not found</div>;

    return (
        <article className="pt-32 pb-20 max-w-4xl mx-auto px-6 min-h-[100dvh]">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={16} />
                <span>Back</span>
            </button>

            <header className="mb-12">
                <div className="flex items-center gap-4 text-emerald-400 mb-4 font-mono text-sm">
                    <Calendar size={16} />
                    <span>{newsItem.date}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-8">{newsItem.title}</h1>
                <div className="w-20 h-1 bg-emerald-500 rounded-full" />
            </header>

            <div className="project-body space-y-8 text-gray-300 leading-relaxed text-lg">
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-12 border border-white/10">
                    <img src={newsItem.images[0]} alt={newsItem.title} className="w-full h-full object-cover" />
                </div>

                {newsItem.fullContent ? (
                    <div className="whitespace-pre-wrap">{newsItem.fullContent}</div>
                ) : (
                    <p>{newsItem.summary}</p>
                )}

                {/* Additional images */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
                    {newsItem.images.slice(1).map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-white/5">
                            <img src={img} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
};
