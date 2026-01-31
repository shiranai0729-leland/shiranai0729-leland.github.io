import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';

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
}

export default function HomeArticleFeed({ articles }: Props) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleArticle = (slug: string) => {
        setExpandedId(expandedId === slug ? null : slug);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold mb-8 flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                Latest Insights
            </h2>

            <div className="space-y-4">
                {articles.map((article) => (
                    <div
                        key={article.slug}
                        className={`bg-surface border transition-all duration-300 rounded-2xl overflow-hidden ${expandedId === article.slug
                            ? 'border-primary shadow-lg shadow-primary/10'
                            : 'border-black/5 hover:border-black/20'
                            }`}
                    >
                        <button
                            onClick={() => toggleArticle(article.slug)}
                            className="w-full text-left p-6 flex items-start justify-between group"
                        >
                            <div className="flex-grow pr-4">
                                <h3 className={`text-xl font-bold mb-2 transition-colors ${expandedId === article.slug ? 'text-primary' : 'text-gray-900 group-hover:text-primary'
                                    }`}>
                                    {article.data.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(article.data.pubDate).toLocaleDateString()}
                                    </span>
                                    {article.data.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs uppercase tracking-wider text-secondary">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                {!expandedId && (
                                    <p className="text-gray-400 text-sm line-clamp-2">{article.data.description}</p>
                                )}
                            </div>
                            <div className={`p-2 rounded-full bg-black/5 transition-transform duration-300 ${expandedId === article.slug ? 'rotate-180 bg-primary/20 text-primary' : 'text-gray-400'
                                }`}>
                                <ChevronDown className="w-5 h-5" />
                            </div>
                        </button>

                        <div
                            className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedId === article.slug ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="p-6 pt-0 border-t border-black/5">
                                <div className="prose prose-sm max-w-none prose-p:text-gray-600 prose-headings:text-gray-900 prose-a:text-primary prose-code:text-secondary">
                                    <ReactMarkdown
                                        components={{
                                            img: () => null // Explicitly disable images
                                        }}
                                    >
                                        {article.body}
                                    </ReactMarkdown>
                                </div>
                                <div className="mt-6 pt-4 border-t border-black/5 flex justify-end">
                                    <a
                                        href={`/articles/${article.slug}`}
                                        className="text-sm font-medium text-gray-900 hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        Read full page &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}