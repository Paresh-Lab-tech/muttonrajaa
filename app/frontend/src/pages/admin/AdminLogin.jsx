"import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/admin/login', { password: pw });
      localStorage.setItem('mr_admin_token', data.token);
      toast.success('Welcome back, chef.');
      navigate('/admin');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=\"min-h-[80vh] flex items-center justify-center px-6 py-16\" data-testid=\"page-admin-login\">
      <div className=\"w-full max-w-md\">
        <div className=\"text-center mb-10\">
          <div className=\"w-12 h-12 rounded-full bg-mr-charcoal text-mr-bg flex items-center justify-center mx-auto\">
            <Lock size={18} />
          </div>
          <div className=\"overline text-mr-terracotta mt-6\">Staff Access</div>
          <h1 className=\"font-serif text-5xl mt-4 tracking-tight\">Admin Panel</h1>
        </div>
        <form onSubmit={submit} className=\"bg-mr-surface border border-mr-border rounded-sm p-8 space-y-5\" data-testid=\"admin-login-form\">
          <label className=\"block\">
            <span className=\"overline text-mr-text2 block mb-1.5\">Password</span>
            <input type=\"password\" value={pw} onChange={e => setPw(e.target.value)} required autoFocus
              data-testid=\"admin-pw-input\"
              className=\"w-full bg-mr-bg border border-mr-border focus:border-mr-charcoal outline-none px-4 py-3 rounded-sm text-sm font-light\" />
          </label>
          <button type=\"submit\" disabled={loading} className=\"btn-primary w-full justify-center\" data-testid=\"admin-login-btn\">
            {loading ? 'Authenticating…' : 'Sign In'}
          </button>
        </form>
        <p className=\"text-xs text-mr-text2 text-center mt-6 font-light\">For staff use only.</p>
      </div>
    </div>
  );
}
"