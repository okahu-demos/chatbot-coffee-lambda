'use client';
import React from 'react';
import '@/styles/global.css';
import Image from 'next/image';

interface CommonLayoutProps {
    children: React.ReactNode;
    title: string;
    navLink: {
        text: string;
        href: string;
    };
    mainClassName?: string;
}

function CommonLayout({ children, title, navLink, mainClassName = "" }: CommonLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 px-6 py-4 fixed left-0 right-0 top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <span className="text-xl font-semibold text-gray-800">{title}</span>
                    <div className="flex items-center gap-4">
                        <a 
                            href="https://github.com/okahu-demos/chatbot-coffee-lambda"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                        >
                            <span className="text-sm font-medium group-hover:underline">Source Code</span>
                            <Image 
                                src="/github-mark.svg"
                                alt="GitHub Logo"
                                width={20}
                                height={20}
                                className="h-5 w-5 group-hover:opacity-80 transition-opacity"
                            />
                        </a>
                        <a 
                            href="https://github.com/monocle2ai/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
                        >
                            <span className="text-sm font-medium group-hover:underline">Powered by</span>
                            <Image 
                                src="/monocle-black.svg"
                                alt="Monocle Logo"
                                width={100}
                                height={35}
                                className="h-8 w-auto group-hover:opacity-80 transition-opacity"
                            />
                        </a>
                        <a href={navLink.href} 
                           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            {navLink.text}
                        </a>
                    </div>
                </div>
            </nav>

            <main className={`max-w-7xl mx-auto pt-20 px-4 pb-6 ${mainClassName}`}>
                {children}
            </main>
            
            <div className="fixed bottom-4 right-4 text-xs text-gray-500 mt-8">
                By continuing, you agree to Okahu's{' '}
                <a 
                    href="https://www.okahu.ai/agreements/evaluation-agreement"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    terms of service
                </a>
                .
            </div>
        </div>
    );
}

export default CommonLayout;
