'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiStar, FiTrash2, FiEdit2, FiLogOut, FiSearch, FiX, FiMenu, FiChevronDown, FiExternalLink } from 'react-icons/fi'
import { FiBookmark, FiUser } from 'react-icons/fi'
import toast, { Toaster } from 'react-hot-toast'
import { format, parseISO } from 'date-fns'
import API_BASE_URL from '../../lib/api'

interface Bookmark {
  _id: string
  url: string
  title: string
  tags: string[]
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export default function BookmarksPage() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchingTitle, setIsFetchingTitle] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    tags: '',
    isFavorite: false
  })

  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchBookmarks()
    }
  }, [user, searchTerm, selectedTags, showFavoritesOnly])

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBookmarks = async () => {
    try {
      let url = `${API_BASE_URL}/bookmarks?`
      const params = new URLSearchParams()
      
      if (searchTerm) params.append('q', searchTerm)
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','))
      if (showFavoritesOnly) params.append('favorites', 'true')

      const response = await fetch(url + params.toString(), {
        credentials: 'include',
      })

      const data = await response.json()
      if (data.success) {
        setBookmarks(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error)
      toast.error('Failed to load bookmarks')
    }
  }

  const fetchTitleFromUrl = async (url: string) => {
    setIsFetchingTitle(true)
    try {
      // In a real app, this would be handled by your backend
      toast('Auto-fetch will be handled by server when saving', { icon: 'ℹ️' })
      setFormData(prev => ({ ...prev, title: 'Title will be fetched from URL' }))
    } catch (error) {
      console.error('Failed to fetch title:', error)
      toast.error('Failed to fetch title')
    } finally {
      setIsFetchingTitle(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      
      const response = await fetch(
        editingBookmark ? `${API_BASE_URL}/bookmarks/${editingBookmark._id}` : `${API_BASE_URL}/bookmarks`,
        {
          method: editingBookmark ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            url: formData.url,
            title: formData.title,
            tags: tagsArray,
            isFavorite: formData.isFavorite
          }),
        }
      )

      const data = await response.json()
      if (data.success) {
        toast.success(editingBookmark ? 'Bookmark updated successfully' : 'Bookmark created successfully')
        resetForm()
        fetchBookmarks()
      } else {
        toast.error(data.message || 'Failed to save bookmark')
      }
    } catch (error) {
      console.error('Failed to save bookmark:', error)
      toast.error('Failed to save bookmark')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (bookmarkId: string) => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/bookmarks/${bookmarkId}`, {
          method: 'DELETE',
          credentials: 'include',
        })

        const data = await response.json()
        if (data.success) {
          toast.success('Bookmark deleted successfully')
          fetchBookmarks()
        } else {
          toast.error(data.message || 'Failed to delete bookmark')
        }
      } catch (error) {
        console.error('Failed to delete bookmark:', error)
        toast.error('Failed to delete bookmark')
      }
    }
  }

  const toggleFavorite = async (bookmarkId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookmarks/${bookmarkId}/favorite`, {
        method: 'PATCH',
        credentials: 'include',
      })

      const data = await response.json()
      if (data.success) {
        const message = data.data.isFavorite ? 'Added to favorites' : 'Removed from favorites'
        toast.success(message)
        fetchBookmarks()
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      toast.error('Failed to update favorite status')
    }
  }

  const resetForm = () => {
    setFormData({ url: '', title: '', tags: '', isFavorite: false })
    setEditingBookmark(null)
    setShowCreateModal(false)
  }

  const startEditing = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setFormData({
      url: bookmark.url,
      title: bookmark.title,
      tags: bookmark.tags.join(', '),
      isFavorite: bookmark.isFavorite
    })
    setShowCreateModal(true)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Logged out successfully')
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed')
    }
  }

  const getAllTags = () => {
    const allTags = bookmarks.flatMap(bookmark => bookmark.tags)
    return Array.from(new Set(allTags)).sort()
  }

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/notes" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  MindNotes
                </span>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1">
                <Link 
                  href="/notes" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  Notes
                </Link>
                <Link 
                  href="/bookmarks" 
                  className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700"
                >
                  Bookmarks
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-600 flex items-center">
                  <FiUser className="mr-1" /> {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100 flex items-center"
                >
                  <FiLogOut className="mr-1" /> Logout
                </button>
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 pt-2 pb-4 space-y-1 border-t border-gray-200">
                <Link 
                  href="/notes" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  Notes
                </Link>
                <Link 
                  href="/bookmarks" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-50 text-indigo-700"
                >
                  Bookmarks
                </Link>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                    <FiUser className="mr-2" /> {user?.name || user?.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 flex items-center"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Bookmarks</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
            >
              <FiPlus /> Add Bookmark
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                    className="sr-only text-black peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-700">Favorites</span>
                </label>
                
                {getAllTags().length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setTagsDropdownOpen(!tagsDropdownOpen)}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      Tags <FiChevronDown className={`transition-transform ${tagsDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {tagsDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 p-2"
                        >
                          <div className="max-h-60 overflow-y-auto">
                            {getAllTags().map(tag => (
                              <div key={tag} className="flex items-center p-2 hover:bg-gray-50 rounded">
                                <input
                                  id={`tag-${tag}`}
                                  type="checkbox"
                                  checked={selectedTags.includes(tag)}
                                  onChange={() => toggleTagFilter(tag)}
                                  className="h-4 w-4 rounded border-gray-300 text-black text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor={`tag-${tag}`} className="ml-2 text-sm text-gray-700">
                                  #{tag}
                                </label>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
            
            {/* Selected tags */}
            {selectedTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    #{tag}
                    <button
                      onClick={() => toggleTagFilter(tag)}
                      className="ml-1.5 inline-flex text-indigo-600 hover:text-indigo-900"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-indigo-600 hover:text-indigo-800 ml-1"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bookmarks Grid */}
        {bookmarks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="text-6xl mb-4">🔖</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No bookmarks found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedTags.length > 0 || showFavoritesOnly 
                ? "Try adjusting your search or filter criteria"
                : "Save your first bookmark to get started"}
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedTags([])
                setShowFavoritesOnly(false)
                setShowCreateModal(true)
              }}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-colors duration-200"
            >
              <FiPlus /> Add Bookmark
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {bookmarks.map(bookmark => (
                <motion.div 
                  key={bookmark._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg truncate">
                        {bookmark.title || 'Untitled Bookmark'}
                      </h3>
                      <button
                        onClick={() => toggleFavorite(bookmark._id)}
                        className={`ml-2 transition-colors ${bookmark.isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}
                      >
                        <FiStar size={18} />
                      </button>
                    </div>
                    
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm mb-4 block truncate flex items-center"
                    >
                      {bookmark.url} <FiExternalLink className="ml-1" size={14} />
                    </a>
                    
                    {bookmark.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {bookmark.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{format(parseISO(bookmark.createdAt), 'MMM d, yyyy')}</span>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => startEditing(bookmark)}
                          className="text-indigo-600 hover:text-indigo-800 flex items-center"
                        >
                          <FiEdit2 size={14} className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(bookmark._id)}
                          className="text-red-600 hover:text-red-800 flex items-center"
                        >
                          <FiTrash2 size={14} className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.url}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      className="block w-full px-3 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://example.com"
                    />
                    {formData.url && !isValidUrl(formData.url) && (
                      <p className="text-red-500 text-xs mt-1">Please enter a valid URL</p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      {!editingBookmark && (
                        <button
                          type="button"
                          onClick={() => fetchTitleFromUrl(formData.url)}
                          disabled={!formData.url || !isValidUrl(formData.url) || isFetchingTitle}
                          className="text-xs text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
                        >
                          {isFetchingTitle ? 'Fetching...' : 'Auto-fetch title'}
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="block w-full px-3 py-2 text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Leave empty to auto-fetch from URL"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      If left empty, title will be automatically fetched from the webpage
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="block w-full px-3 py-2 text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. work, personal, ideas"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="favorite"
                      checked={formData.isFavorite}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="favorite" className="ml-2 block text-sm text-gray-700">
                      Mark as favorite
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
                      disabled={isSubmitting || (formData.url && !isValidUrl(formData.url))}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingBookmark ? 'Updating...' : 'Creating...'}
                        </span>
                      ) : (
                        editingBookmark ? 'Update Bookmark' : 'Add Bookmark'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}