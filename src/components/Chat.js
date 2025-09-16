"use client";

export default function Chat({ answer, resources = [], contexts = [] }) {
  // Validate and sanitize props
  const safeAnswer = answer || "No answer available";
  const safeResources = Array.isArray(resources) ? resources : [];
  const safeContexts = Array.isArray(contexts) ? contexts : [];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
      {/* Answer Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-100">Answer</h2>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600/30">
          <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">
            {safeAnswer}
          </p>
        </div>
      </div>

      {/* Contexts Section */}
      {safeContexts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-100">Context from PDFs</h3>
          </div>
          <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-600/30">
            <ul className="space-y-3">
              {safeContexts.map((context, index) => {
                const safeContext = typeof context === 'string' ? context : String(context || '');
                return (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-300 text-sm leading-relaxed">
                      {safeContext || `Context ${index + 1} (empty)`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Resources Section */}
      {safeResources.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-100">Resources</h3>
          </div>
          <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-600/30">
            <ul className="space-y-3">
              {safeResources.map((resource, index) => {
                const safeResource = resource && typeof resource === 'object' ? resource : {};
                const title = safeResource.title || `Resource ${index + 1}`;
                const link = safeResource.link || '#';
                const isValidLink = link && link !== '#' && (link.startsWith('http') || link.startsWith('/'));

                return (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {isValidLink ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline decoration-dotted underline-offset-2 hover:decoration-solid"
                      >
                        {title}
                      </a>
                    ) : (
                      <span className="text-gray-400">
                        {title} (no link available)
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
