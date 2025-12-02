'use client';

import { useState, useEffect } from 'react';
import { StaticContent } from '@/types';
import { Save, Plus, X, FileText } from 'lucide-react';

export default function AdminContentPage() {
  const [content, setContent] = useState<StaticContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [newValueTitle, setNewValueTitle] = useState('');
  const [newValueDescription, setNewValueDescription] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) throw new Error('Failed to save content');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const addValue = () => {
    if (newValueTitle.trim() && newValueDescription.trim() && content) {
      setContent({
        ...content,
        whatWeStandFor: {
          ...content.whatWeStandFor,
          values: [
            ...content.whatWeStandFor.values,
            {
              title: newValueTitle.trim(),
              description: newValueDescription.trim(),
            },
          ],
        },
      });
      setNewValueTitle('');
      setNewValueDescription('');
    }
  };

  const removeValue = (index: number) => {
    if (content) {
      setContent({
        ...content,
        whatWeStandFor: {
          ...content.whatWeStandFor,
          values: content.whatWeStandFor.values.filter((_, i) => i !== index),
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return <div className="p-8 text-red-600">Failed to load content</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Static Content Management</h1>
          <p className="text-gray-600">Manage static content displayed on the About Us page</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">{error}</div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
            Content saved successfully!
          </div>
        )}

        <div className="space-y-6">
          {/* About Us */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
              <FileText className="h-5 w-5" />
              About Us Section
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={content.aboutUs.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      aboutUs: { ...content.aboutUs, title: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={content.aboutUs.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      aboutUs: { ...content.aboutUs, description: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
              <FileText className="h-5 w-5" />
              Our Story Section
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={content.ourStory.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      ourStory: { ...content.ourStory, title: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={content.ourStory.content}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      ourStory: { ...content.ourStory, content: e.target.value },
                    })
                  }
                  rows={10}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter the story content (supports multiple paragraphs)"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Use line breaks to separate paragraphs
                </p>
              </div>
            </div>
          </div>

          {/* What We Stand For */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
              <FileText className="h-5 w-5" />
              What We Stand For Section
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Section Title</label>
                <input
                  type="text"
                  value={content.whatWeStandFor.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whatWeStandFor: {
                        ...content.whatWeStandFor,
                        title: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-4 block text-sm font-medium text-gray-700">Values</label>
                <div className="space-y-4">
                  {content.whatWeStandFor.values.map((value, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Value {index + 1}</span>
                        <button
                          onClick={() => removeValue(index)}
                          className="rounded-lg p-1 text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={value.title}
                          onChange={(e) => {
                            const updated = [...content.whatWeStandFor.values];
                            updated[index] = { ...updated[index], title: e.target.value };
                            setContent({
                              ...content,
                              whatWeStandFor: {
                                ...content.whatWeStandFor,
                                values: updated,
                              },
                            });
                          }}
                          placeholder="Value title"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <textarea
                          value={value.description}
                          onChange={(e) => {
                            const updated = [...content.whatWeStandFor.values];
                            updated[index] = { ...updated[index], description: e.target.value };
                            setContent({
                              ...content,
                              whatWeStandFor: {
                                ...content.whatWeStandFor,
                                values: updated,
                              },
                            });
                          }}
                          placeholder="Value description"
                          rows={2}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add New Value */}
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
                    <h3 className="mb-3 text-sm font-medium text-gray-700">Add New Value</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newValueTitle}
                        onChange={(e) => setNewValueTitle(e.target.value)}
                        placeholder="Value title"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <textarea
                        value={newValueDescription}
                        onChange={(e) => setNewValueDescription(e.target.value)}
                        placeholder="Value description"
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <button
                        onClick={addValue}
                        className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                      >
                        <Plus className="h-4 w-4" />
                        Add Value
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

