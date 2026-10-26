# Security Specification: Md Mosarof Hossain Video Platform

## 1. Data Invariants
1. **Public Site Settings & Branding**: Global settings (`/settings/site`) are publicly readable so that unauthenticated visitors can view creator bio, channel title, and footer links. Only authorized administrators (matching verified email or `/admins/{uid}`) can modify site settings.
2. **Video Library Integrity**: Public videos (`/videos/{videoId}`) are publicly readable so visitors can stream and explore videos. Creating, updating, or deleting videos is strictly restricted to verified administrators. Video IDs must match valid YouTube ID patterns.
3. **User Data Isolation & Anti-Privilege Escalation**: User documents (`/users/{userId}`) can only be read by the owner or administrator. Normal users cannot assign themselves the 'admin' role. The `uid` in document data must strictly match `request.auth.uid`.
4. **Admin Role Gate**: Admin privileges are verified via secure database check `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` or the bootstrapped runtime admin email `techmosarof5@gmail.com`.
5. **No Blind Writes or Injections**: All incoming strings must have explicit length bounds (`.size() <= MAX`) to prevent payload bloat or denial-of-wallet resource attacks.

## 2. The Dirty Dozen Payloads (Expected to be REJECTED)
1. **Ghost Field Site Settings Update**: Attempting to inject `{ maliciousScript: "<script>alert(1)</script>" }` into `/settings/site`. -> REJECTED
2. **Unauthenticated Video Mutation**: Anonymous request calling `setDoc` on `/videos/test_vid`. -> REJECTED
3. **User Self-Promoting to Admin**: Normal user updating their `/users/{uid}` with `role: "admin"`. -> REJECTED
4. **User Spoofing Another User ID**: User with UID `user_A` writing to `/users/user_B`. -> REJECTED
5. **Oversized String Bomb**: Writing a 2MB video description or title. -> REJECTED
6. **Path Traversal / Malformed Video ID**: Video ID containing `../../escape` or non-alphanumeric characters. -> REJECTED
7. **Tampering with Video Creation Timestamps**: Non-admin attempting to clear or alter video timestamps. -> REJECTED
8. **Direct Write to /admins/ Collection**: Non-admin user writing their own UID into `/admins/{uid}`. -> REJECTED
9. **Private User Data Snooping**: Unauthenticated user or standard user querying all users in `/users`. -> REJECTED
10. **Site Settings Deletion**: Attempting to delete the master site configuration. -> REJECTED
11. **Negative View Count Attack**: Writing a negative number for video views. -> REJECTED
12. **Unauthenticated Admin Settings Override**: Unauthenticated PUT request attempting to hijack `youtubeChannelId`. -> REJECTED
