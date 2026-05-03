"# Test Credentials — Mutton Rajaa

## Admin
- URL: `/admin/login`
- Password: `rajaa@2025`
- Token returned on login is used as `Authorization: Bearer <token>` for admin endpoints.
- Hardcoded admin token (server-side fallback): `mr-admin-secret-token-2025`

## Notes
- Single admin password (no usernames). Frontend stores the returned token in localStorage under key `mr_admin_token`.
- All admin API routes are prefixed `/api/admin/*` and require `Authorization: Bearer <token>`.
"