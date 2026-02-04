import React, { useState, useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight, Calendar, Github, Linkedin, Search, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Article {
    slug: string;
    data: {
        title: string;
        pubDate: Date;
        description: string;
        tags: string[];
    };
    body: string;
}

interface Props {
    articles: Article[];
    showProfile?: boolean;
    showHeader?: boolean;
    title?: string;
    isDirectLink?: boolean;
    showFilters?: boolean;
}

const ArticleRow = ({ article, isOpen, onClick, index, isDirectLink }: { article: Article; isOpen: boolean; onClick: () => void; index: number; isDirectLink?: boolean }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (isOpen) {
            gsap.to(contentRef.current, {
                height: 'auto',
                opacity: 1,
                duration: 0.6,
                ease: 'power3.out'
            });
            gsap.to(titleRef.current, {
                x: 20,
                color: 'var(--color-primary, #3b82f6)',
                duration: 0.4
            });
        } else {
            gsap.to(contentRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.4,
                ease: 'power3.in'
            });
            gsap.to(titleRef.current, {
                x: 0,
                color: 'inherit',
                duration: 0.4
            });
        }
    }, [isOpen]);

    const handleMouseEnter = () => {
        if (!isOpen) {
            gsap.to(titleRef.current, { x: 10, duration: 0.3, ease: 'power2.out' });
        }
    };

    const handleMouseLeave = () => {
        if (!isOpen) {
            gsap.to(titleRef.current, { x: 0, duration: 0.3, ease: 'power2.out' });
        }
    };

    const Wrapper = isDirectLink ? 'a' : 'div';
    const wrapperProps = isDirectLink ? { href: `/articles/${article.slug}` } : { onClick };

    return (
        <div
            ref={rowRef}
            className="border-b border-black/10 last:border-0 relative group"
        >
            <Wrapper
                {...wrapperProps}
                className="block px-4 md:px-0 py-8 md:py-16 cursor-pointer relative z-10"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex items-baseline justify-between">
                    <h3
                        ref={titleRef}
                        className="text-2xl md:text-4xl font-heading font-bold leading-tight text-gray-900 transition-colors"
                    >
                        {article.data.title}
                    </h3>
                    <span className="hidden md:block text-xs font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        0{index + 1}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-gray-500 font-mono opacity-100 md:opacity-60 md:group-hover:opacity-100 transition-opacity duration-500">
                    <span className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.data.pubDate).toLocaleDateString()}
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {article.data.tags.map(tag => (
                            <span key={tag}>#{tag}</span>
                        ))}
                    </div>
                </div>
            </Wrapper>

            {/* Liquid Background Hover Effect (Simulated with absolute div for now) */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10 blur-xl" />

            {!isDirectLink && (
                <div
                    ref={contentRef}
                    className="overflow-hidden h-0 opacity-0 px-4 md:px-0"
                >
                    <div className="py-8 pl-4 md:pl-12 border-l-2 border-primary/20 ml-2 md:ml-4">
                        <p className="text-xl md:text-2xl text-gray-700 font-light mb-8 max-w-3xl leading-relaxed">
                            {article.data.description}
                        </p>

                        <div className="prose prose-lg max-w-none prose-headings:font-heading prose-a:text-primary">
                            <ReactMarkdown components={{ img: () => null }}>
                                {article.body.substring(0, 500) + "..."}
                            </ReactMarkdown>
                        </div>

                        <div className="mt-8 pt-8 flex items-center gap-4">
                            <a
                                href={`/articles/${article.slug}`}
                                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-primary transition-colors duration-300"
                            >
                                Read Article <ArrowUpRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SocialLink = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center justify-center p-8 border border-black/5 hover:bg-black/5 transition-colors duration-500 rounded-3xl"
    >
        <Icon className="w-8 h-8 mb-4 text-gray-400 group-hover:text-gray-900 transition-colors duration-300" />
        <span className="font-mono text-sm tracking-widest uppercase">{label}</span>
    </a>
)

const ProfileCard = () => (
    <div className="mb-32 px-4 md:px-0 flex flex-col md:flex-row items-end justify-between border-b border-black text-black pb-12 gap-8">
        <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-black/10">
                <img
                    src="/images/avatar.png"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cyberpunk%20developer%20portrait%20bw%20sketch&image_size=portrait_4_3";
                    }}
                    alt="Profile"
                    className="w-full h-full object-cover transition-all duration-500"
                />
            </div>
            <div>
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900">Leland</h2>
                <p className="text-gray-600 text-lg max-w-sm mt-3 leading-relaxed">
                    Building applications to empower the world.
                    Based in Tokyo.
                </p>
                <a href="/about" className="inline-flex items-center gap-2 mt-4 text-base font-bold text-gray-900 hover:text-primary transition-colors border-b-2 border-gray-900 hover:border-primary pb-0.5">
                    More About Me <ArrowUpRight className="w-4 h-4" />
                </a>
            </div>
        </div>
        <div className="flex flex-col items-end text-right">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">Current Status</span>
            <span className="inline-flex items-center gap-2 text-sm font-medium">
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                Not Open to Work, Connection Welcome 🤗
            </span>
        </div>
    </div>
)

const WavyFooter = () => {
    const path1Ref = useRef<SVGPathElement>(null);
    const path2Ref = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (path1Ref.current && path2Ref.current) {
            gsap.to(path1Ref.current, {
                attr: { d: "M0,200 C400,100 800,400 1440,250" },
                duration: 5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            gsap.to(path2Ref.current, {
                attr: { d: "M0,150 C300,400 700,0 1440,200" },
                duration: 7,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }, []);

    return (
        <div className="mt-32 w-screen ml-[calc(50%-50vw)] h-48 relative overflow-hidden opacity-80 pointer-events-none">
            <svg viewBox="0 0 1440 320" className="w-full h-full text-gray-300" preserveAspectRatio="none">
                <path
                    ref={path1Ref}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M0,160 C320,300 640,-10 1440,100"
                    className="opacity-60"
                ></path>
                <path
                    ref={path2Ref}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M0,200 C400,100 800,400 1440,150"
                    className="opacity-40"
                ></path>
            </svg>
        </div>
    );
};

export default function ImmersiveArticleFeed({ articles, showProfile = true, showHeader = true, title = "Latest Publications", isDirectLink = false, showFilters = true }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter Logic
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        articles.forEach(article => {
            article.data.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [articles]);

    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesSearch = article.data.title.toLowerCase().includes(search.toLowerCase()) ||
                article.data.description.toLowerCase().includes(search.toLowerCase());
            const matchesTag = selectedTag ? article.data.tags.includes(selectedTag) : true;
            return matchesSearch && matchesTag;
        });
    }, [articles, search, selectedTag]);

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

    return (
        <div ref={containerRef} className="w-full max-w-6xl mx-auto px-0 md:px-4 perspective-1000">
            {/* Header / Intro to list */}
            {showProfile && <ProfileCard />}

            {showHeader && (
                <div className="mb-12 px-4 md:px-0 space-y-8">
                    <div className="flex items-end justify-between">
                        <h2 className="text-sm font-mono uppercase tracking-widest text-gray-400">
                            {title}
                        </h2>
                        <span className="text-sm font-mono text-gray-400">
                            {filteredArticles.length} / {articles.length} Items
                        </span>
                    </div>

                    {/* Filter Section */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-black/5">
                            {/* Search & Tags */}
                            <div className="md:col-span-8 space-y-6">
                                <div className="relative max-w-md">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search articles..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-black/5 rounded-xl border-none focus:ring-1 focus:ring-black/20 outline-none text-sm font-mono transition-all placeholder-gray-500"
                                    />
                                    {search && (
                                        <button
                                            onClick={() => setSearch('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
                                        >
                                            <X className="w-3 h-3 text-gray-500" />
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedTag(null)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${!selectedTag ? 'bg-black text-white' : 'bg-black/5 text-gray-500 hover:text-black hover:bg-black/10'}`}
                                    >
                                        All
                                    </button>
                                    {allTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${selectedTag === tag ? 'bg-black text-white' : 'bg-black/5 text-gray-500 hover:text-black hover:bg-black/10'}`}
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Archive Minimal List */}
                            <div className="md:col-span-4 border-l border-black/5 pl-8 hidden md:block">
                                <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">Archive</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {archives.map(archive => (
                                        <div key={archive.key} className="flex justify-between items-center text-xs group cursor-default">
                                            <span className="text-gray-500 group-hover:text-black transition-colors">{archive.label}</span>
                                            <span className="text-gray-300 font-mono group-hover:text-gray-900 transition-colors">{archive.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-2 min-h-[400px]">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article, idx) => (
                        <ArticleRow
                            key={article.slug}
                            article={article}
                            index={idx}
                            isOpen={openIndex === idx}
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            isDirectLink={isDirectLink}
                        />
                    ))
                ) : (
                    <div className="py-20 px-4 md:px-0 text-center text-gray-400 font-mono">
                        No articles found matching your criteria.
                    </div>
                )}
            </div>

            {/* Footer */}
            {!showProfile ? <WavyFooter /> : (
                <div className="mt-48 pt-24 px-4 md:px-0 border-t border-black/10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2 md:col-span-2 py-8 pr-8">
                            <h3 className="text-3xl font-heading font-black mb-4">Let's Connect</h3>
                            <p className="text-gray-500 max-w-md">
                                Exploring the intersection of design, code, and narrative.
                                Always open for interesting collaborations.
                            </p>
                        </div>
                        <SocialLink href="https://github.com" icon={Github} label="Github" />
                        <SocialLink href="https://linkedin.com" icon={Linkedin} label="LinkedIn" />
                    </div>
                </div>
            )}
        </div>
    );
}
