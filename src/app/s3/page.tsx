'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import '@/styles/global.css';
import CommonLayout from '../commonLayout';
import { useSession } from '@/hooks/sessionHook';


// Dynamically import react-json-view to avoid SSR issues
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

function App() {
    const [files, setFiles] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [jsonContent, setJsonContent] = useState({});
    const [loading, setLoading] = useState(false);
    const { sessionId } = useSession();

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('/api/s3list', {
                    headers: {
                        'X-Session-Id': sessionId || ''
                    }
                });
                const data = await response.json();
                setFiles(data.files || []);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };
        fetchFiles();
    }, []);

    const handleFileClick = async (file: any) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/s3view?key=${encodeURIComponent(file.key)}`, {
                headers: {
                    'X-Session-Id': sessionId || ''
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch file');
            }

            const ndJsonData = await response.text();
            const jsonData = ndJsonData
                .split('\n')
                .filter((line) => line.trim())
                .map((line) => JSON.parse(line));
            setJsonContent(jsonData);
            setShowOverlay(true);
        } catch (error) {
            console.error('Error fetching JSON:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CommonLayout 
            title="Monocle Traces"
            navLink={{ text: "Back to Chat", href: "/" }}
        >
            <div className="bg-white rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="w-[60%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    File Name
                                </th>
                                <th scope="col" className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Modified
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {files.map((file: any, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td
                                        className="px-6 py-4 text-sm font-medium text-gray-900"
                                        onClick={() => handleFileClick(file)}
                                    >
                                        {file.key}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(file.lastModified).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        {' '}
                                        {new Date(file.lastModified).toLocaleTimeString(undefined, {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* JSON Viewer Overlay */}
            {showOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-7xl mx-auto overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">NDJSON Viewer</h2>
                            <button
                                onClick={() => setShowOverlay(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <span className="text-xl">✕</span>
                            </button>
                        </div>
                        <div className="p-6 h-[calc(100%-4rem)] overflow-auto">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                </div>
                            ) : (
                                <ReactJson
                                    src={jsonContent}
                                    style={{ backgroundColor: 'transparent' }}
                                    enableClipboard={false}
                                    displayDataTypes={false}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </CommonLayout>
    );
}

export default App;