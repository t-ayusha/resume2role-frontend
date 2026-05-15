# TODO - WebRTC AI Interviewer (HTTP REST Signaling)

## Plan (confirmed)
- Add REST signaling endpoints to the Express backend for WebRTC (offer/answer + ICE).
- Update `InterviewLivePage.tsx` to:
  - create `RTCPeerConnection`
  - send offer to backend
  - exchange ICE candidates
  - render AI interviewer remote stream in the UI.

## Steps
1. Inspect `src/server/index.ts` and determine where to add new routes.
2. Add backend endpoints (DEMO stub):
   - `POST /api/webrtc/offer` -> returns `{ iceServers: [...] }` and `answer: null` with a clear message.
   - `POST /api/webrtc/ice-candidate` -> accepts candidate and returns `{ received: true }`.
   ✅ Done
3. Update `src/pages/InterviewLivePage.tsx`:
   - add remote `<video>` element (AI avatar)
   - wire WebRTC `ontrack` to remote video
   - implement offer creation + REST calls
   - implement ICE candidate sending
   - ensure mic/camera toggles affect outgoing tracks.
   - show UI fallback: “AI interviewer not connected (demo mode)”.
✅ Done (demo stub; remote stream will appear once real AI backend is wired)
5. (Optional) Once you have a real AI WebRTC backend/provider:
   - replace `src/server/index.ts` stubs to forward the offer and return answer SDP.
   - if provider returns remote ICE servers, use `iceServers` from response in the frontend.

4. Run `npm run dev` and verify:
   - camera/mic permission
   - offer/ICE REST calls happen (check console)
   - AI remote video shows fallback in demo mode.




