import React, { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Search, Zap, BarChart3, Github, ExternalLink, Eye, TrendingUp } from 'lucide-react'

interface Product {
  id: number
  site: string
  product_name: string
  price?: number
  currency: string
  product_url?: string
  image_url?: string
  extracted_at: string
  extraction_confidence?: number
}

interface SearchResponse {
  search_id: number
  query: string
  status: string
  results: Product[]
  total_found: number
  search_time_ms?: number
  sites_searched: string[]
  cached_results: number
  fresh_results: number
  error_message?: string
}

function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'dashboard'>('search')
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [query, setQuery] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      setIsSearching(true)
      setSearchResults(null)
      
      toast.loading('Gemini AI is analyzing websites...', { id: 'search' })
      
      const response = await fetch('/api/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          max_results_per_site: 3,
          use_cache: true
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: SearchResponse = await response.json()
      setSearchResults(data)
      
      if (data.status === 'completed') {
        toast.success(
          `Found ${data.total_found} products in ${data.search_time_ms}ms`, 
          { id: 'search' }
        )
      } else if (data.status === 'failed') {
        toast.error(data.error_message || 'Search failed', { id: 'search' })
      }
      
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search products. Check if backend is running.', { id: 'search' })
    } finally {
      setIsSearching(false)
    }
  }

  const formatPrice = (price?: number, currency: string = 'USD') => {
    if (price === undefined || price === null) return 'Price not available'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    AI Price Aggregator
                  </h1>
                  <p className="text-xs text-gray-500">Emma Robot Technology Demo</p>
                </div>
              </div>
            </div>

            <nav className="flex items-center gap-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('search')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'search' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </button>
              </div>

              <a
                href="https://github.com/your-repo/price-aggregator"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">View Code</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' ? (
          <div className="space-y-8">
            {/* Search Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI-Powered Product Search</h2>
                    <p className="text-gray-600">Enter any product name and watch Gemini AI extract prices across multiple sites</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSearch} className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Sony WH-1000XM5 Headphones, iPhone 15 Pro, MacBook Air..."
                    className="w-full pl-10 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSearching}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!query.trim() || isSearching}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    !query.trim() || isSearching
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isSearching ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                      <span>Gemini AI is analyzing websites...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Search className="w-5 h-5" />
                      <span>Search with Gemini AI Vision</span>
                    </div>
                  )}
                </button>
              </form>

              {/* Technology Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 rounded">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Emma Robot Technology</h4>
                    <p className="text-sm text-blue-700">
                      This system uses Gemini AI Vision to visually parse product listings from screenshots, 
                      then processes the data with Gemini Pro for standardization. No APIs or fragile scrapers required!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Results */}
            {searchResults && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Search Results for "{searchResults.query}"
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Search ID: #{searchResults.search_id}</span>
                      <span>•</span>
                      <span>Status: {searchResults.status}</span>
                      {searchResults.search_time_ms && (
                        <>
                          <span>•</span>
                          <span>Time: {searchResults.search_time_ms}ms</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.results.map((product, index) => (
                    <div key={`${product.site}-${product.id}-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium text-gray-700">{product.site}</span>
                        </div>
                        {product.extraction_confidence && (
                          <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {Math.round(product.extraction_confidence * 100)}% confidence
                          </div>
                        )}
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                        {product.product_name}
                      </h3>

                      <div className="mb-4">
                        {product.price ? (
                          <span className="text-2xl font-bold text-blue-600">
                            {formatPrice(product.price, product.currency)}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">Price not extracted</span>
                          </div>
                        )}
                      </div>

                      {product.product_url && (
                        <a
                          href={product.product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View on {product.site}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technology Showcase */}
            {!searchResults && !isSearching && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Gemini Vision Extraction
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Uses Gemini AI Vision to visually parse product listings from screenshots, 
                    eliminating the need for fragile web scrapers.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Gemini Pro Processing
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Standardizes extracted data using Gemini Pro, converting varied price 
                    formats into consistent, structured information.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Interface Independent
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Works with any e-commerce site layout without pre-configuration, 
                    adapting to UI changes automatically.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Coming Soon</h2>
            <p className="text-gray-600">Real-time analytics and performance metrics will be available here.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Emma Robot Technology Demo</p>
                <p className="text-sm text-gray-600">
                  AI-Powered Price Comparison Aggregator
                </p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-1">
                Demonstrating interface-independent automation
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Gemini Vision</span>
                <span>•</span>
                <span>Gemini Pro</span>
                <span>•</span>
                <span>Real-time Analytics</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-6 pt-6 text-center">
            <p className="text-xs text-gray-500">
              Built with Vite + React, FastAPI, PostgreSQL, Redis, and Gemini AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
