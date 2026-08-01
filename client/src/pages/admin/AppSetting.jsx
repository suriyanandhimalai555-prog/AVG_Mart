import React, { useState, useEffect, useCallback } from 'react';
import { Smartphone, RefreshCw, User, Store } from 'lucide-react';
import toast from 'react-hot-toast';

const AppSetting = () => {
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'seller'
  
  const [formData, setFormData] = useState({
    androidCurrent: '2.0.0',
    androidMinimum: '2.0.0',
    iosCurrent: '1.0.0',
    iosMinimum: '1.0.0',
    releaseNotes: '',
    forceUpdate: true,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch settings based on active tab ('user' | 'seller')
  const fetchSettings = useCallback(async (appType) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/settings?appType=${appType}`);
      const result = await response.json();
      if (result.success && result.data) {
        setFormData({
          androidCurrent: result.data.androidCurrent || '',
          androidMinimum: result.data.androidMinimum || '',
          iosCurrent: result.data.iosCurrent || '',
          iosMinimum: result.data.iosMinimum || '',
          releaseNotes: result.data.releaseNotes || '',
          forceUpdate: result.data.forceUpdate ?? true,
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load initial settings');
    }
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings(activeTab);
  }, [activeTab, fetchSettings]);

  const handleTabSwitch = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, forceUpdate: !prev.forceUpdate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, appType: activeTab }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`${activeTab.toUpperCase()} App settings saved successfully!`);
      } else {
        toast.error(result.message || 'Failed to save settings');
      }
    } catch (error) {
      toast.error('Error connecting to backend server');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl font-black tracking-wider text-white uppercase flex items-center gap-2">
          App <span className="text-[#a3e635]">Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage minimum required app versions and force update flags for native clients.
        </p>
      </div>

      {/* App Type Switcher Toggle */}
      <div className="flex bg-[#071326] p-1.5 rounded-xl border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => handleTabSwitch('user')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
            activeTab === 'user'
              ? 'bg-[#a3e635] text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          User App
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch('seller')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
            activeTab === 'seller'
              ? 'bg-[#a3e635] text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Store className="w-4 h-4" />
          Seller App
        </button>
      </div>

      {/* Main Glass Card */}
      <div className="bg-[#0b1d3a]/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl space-y-8 relative">
        {loading && (
          <div className="absolute inset-0 bg-[#0b1d3a]/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10 text-[#a3e635] font-medium">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Loading {activeTab} app settings...
          </div>
        )}

        {/* Sub Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#a3e635]/10 rounded-xl text-[#a3e635] border border-[#a3e635]/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white capitalize">
              {activeTab} App Version Settings
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Controls which Android/iOS builds are accepted for the {activeTab} app.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Version Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Android Current */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#a3e635] uppercase mb-2">
                Android Current
              </label>
              <input
                type="text"
                name="androidCurrent"
                value={formData.androidCurrent}
                onChange={handleChange}
                placeholder="e.g. 2.0.0"
                className="w-full px-4 py-3 bg-[#071326] border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-[#a3e635] focus:ring-1 focus:ring-[#a3e635] transition-all placeholder-slate-600"
              />
            </div>

            {/* Android Minimum */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#a3e635] uppercase mb-2">
                Android Minimum
              </label>
              <input
                type="text"
                name="androidMinimum"
                value={formData.androidMinimum}
                onChange={handleChange}
                placeholder="e.g. 2.0.0"
                className="w-full px-4 py-3 bg-[#071326] border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-[#a3e635] focus:ring-1 focus:ring-[#a3e635] transition-all placeholder-slate-600"
              />
            </div>

            {/* iOS Current */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#a3e635] uppercase mb-2">
                iOS Current
              </label>
              <input
                type="text"
                name="iosCurrent"
                value={formData.iosCurrent}
                onChange={handleChange}
                placeholder="e.g. 1.0.0"
                className="w-full px-4 py-3 bg-[#071326] border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-[#a3e635] focus:ring-1 focus:ring-[#a3e635] transition-all placeholder-slate-600"
              />
            </div>

            {/* iOS Minimum */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#a3e635] uppercase mb-2">
                iOS Minimum
              </label>
              <input
                type="text"
                name="iosMinimum"
                value={formData.iosMinimum}
                onChange={handleChange}
                placeholder="e.g. 1.0.0"
                className="w-full px-4 py-3 bg-[#071326] border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-[#a3e635] focus:ring-1 focus:ring-[#a3e635] transition-all placeholder-slate-600"
              />
            </div>
          </div>

          {/* Release Notes */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#a3e635] uppercase mb-2">
              Release Notes (Optional)
            </label>
            <textarea
              name="releaseNotes"
              rows={4}
              value={formData.releaseNotes}
              onChange={handleChange}
              placeholder="What changed in this version..."
              className="w-full px-4 py-3 bg-[#071326] border border-slate-700/80 rounded-xl text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-[#a3e635] focus:ring-1 focus:ring-[#a3e635] transition-all resize-y"
            />
          </div>

          {/* Bottom Actions Row */}
          <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-800/80">
            
            {/* Toggle Switch */}
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleToggle}>
              <button
                type="button"
                role="switch"
                aria-checked={formData.forceUpdate}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.forceUpdate ? 'bg-[#a3e635]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-slate-950 shadow-md ring-0 transition duration-200 ease-in-out ${
                    formData.forceUpdate ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <div>
                <span className="block text-sm font-bold text-white">Force update</span>
                <span className="text-xs text-slate-400 font-normal">
                  {formData.forceUpdate ? 'ON — outdated builds are blocked at launch.' : 'OFF — users can skip updating.'}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-[#a3e635] hover:bg-[#8ec600] text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving...' : `Save ${activeTab.toUpperCase()} Settings`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppSetting;