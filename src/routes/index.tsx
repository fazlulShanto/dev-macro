import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Search, ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: ToolsShowcase,
})

import { TOOL_LIST, type Tool } from '@/data/tool_list'


function ToolsShowcase() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Get all unique categories
  const allCategories = useMemo(() => {
    const categories = new Set<string>()
    TOOL_LIST.forEach(tool => tool.categories.forEach(cat => categories.add(cat)))
    return Array.from(categories).sort()
  }, [])

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    return TOOL_LIST.filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || tool.categories.includes(selectedCategory)
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dev Macro</h1>
          <p className="text-gray-400">A collection of tools</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-900 text-white placeholder-gray-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                }`}
            >
              All
            </button>
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No tools found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-gray-900 rounded-lg border border-gray-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
    >
      <div className="p-6">
        {/* Icon */}
        <div className="text-5xl mb-4">{tool.icon}</div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          {tool.title}
          <ExternalLink className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>

        {/* Description */}
        <p className="text-gray-400 mb-4 line-clamp-2">{tool.description}</p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {tool.categories.map(category => (
            <span
              key={category}
              className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}
