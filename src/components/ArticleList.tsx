import React, { useState, useMemo } from 'react';
import type { CollectionEntry } from 'astro:content';
import { Search, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    articles: CollectionEntry<'articles'>[];
}

const ITEMS_PER_PAGE = 20;

export default function ArticleList({ articles }: Props) {
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Extract all tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        articles.forEach(article => {
            article.data.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [articles]);

    // Extract archive (Year-Month)
    const archives = useMemo(() => {
        const archiveMap = new Map<string, number>();
        articles.forEach(article => {
            const date = new Date(article.data.pubDate);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            archiveMap.set(key, (archiveMap.get(key) || 0) + 1);
        });
        return Array.from(archiveMap.entries())
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([key, count]) => {
                const [year, month] = key.split('-');
                const date = new Date(parseInt(year), parseInt(month) - 1);
                return {
                    label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                    key,
                    count
                };
            });
    }, [articles]);

    // Filter articles based on search and tags
    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesSearch = article.data.title.toLowerCase().includes(search.toLowerCase()) ||
                article.data.description.toLowerCase().includes(search.toLowerCase());
            const matchesTag = selectedTag ? article.data.tags.includes(selectedTag) : true;
            return matchesSearch && matchesTag;
        });
    }, [articles, search, selectedTag]);

    // Pagination logic
    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="grid lg:grid-cols-12 gap-12">
            {/* Left Column: Article List (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
                <div className="space-y-6">
                    {paginatedArticles.map(article => (
                        <a key={article.slug} href={`/articles/${article.slug}`} className="group block bg-surface rounded-2xl p-8 border border-black/5 hover:border-black/20 transition-all duration-300 hover:-translate-x-2">
                            <div className="flex flex-col gap-3">
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors font-heading">
                                    {article.data.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(article.data.pubDate).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        {article.data.tags.map(tag => (
                                            <span key={tag} className="text-secondary text-xs uppercase tracking-wider">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 line-clamp-2 leading-relaxed">
                                    {article.data.description}
                                </p>
                            </div>
                        </a>
                    ))}

                    {paginatedArticles.length === 0 && (
                        <div className="text-center py-20 bg-surface rounded-3xl border border-black/5">
                            <p className="text-xl text-gray-500">No articles found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-4 mt-12">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-surface border border-black/10 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="flex items-center px-4 font-mono text-gray-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-surface border border-black/10 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Right Column: Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-12">
                {/* Search Box */}
                <div className="bg-surface rounded-3xl p-6 border border-black/5">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 font-heading flex items-center gap-2">
                        <Search className="w-5 h-5 text-primary" /> Search
                    </h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full pl-4 pr-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none text-gray-900 placeholder-gray-500 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tags Cloud */}
                <div className="bg-surface rounded-3xl p-6 border border-black/5">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 font-heading">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedTag(null)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${!selectedTag ? 'bg-primary text-white' : 'bg-black/5 border border-black/10 text-gray-600 hover:text-gray-900 hover:border-black/30'}`}
                        >
                            All
                        </button>
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${selectedTag === tag ? 'bg-primary text-white' : 'bg-black/5 border border-black/10 text-gray-600 hover:text-gray-900 hover:border-black/30'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Archive */}
                <div className="bg-surface rounded-3xl p-6 border border-black/5">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 font-heading">Archive</h3>
                    <div className="space-y-2">
                        {archives.map(archive => (
                            <div key={archive.key} className="flex justify-between items-center text-sm group cursor-default">
                                <span className="text-gray-500 group-hover:text-gray-900 transition-colors">{archive.label}</span>
                                <span className="text-gray-600 font-mono bg-black/5 px-2 py-0.5 rounded text-xs group-hover:text-primary transition-colors">{archive.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}